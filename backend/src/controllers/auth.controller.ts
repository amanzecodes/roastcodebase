import { type Request, type Response, type NextFunction } from 'express';
import { type Profile } from 'passport-github2';
import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { timingSafeEqual } from 'crypto';
import { AppError } from '../types/errors.js';

export interface GitHubUser {
  id: string;
  username: string;
  email: string | null;
  avatarUrl: string | null;
}

export const githubStrategyCallback = async (
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  done: (error: any, user?: GitHubUser) => void,
) => {
  try {
    const avatar = profile.photos?.[0]?.value ?? null;
    const email = profile.emails?.[0]?.value ?? null;

    const updateData: Record<string, string> = {
      username: profile.username || profile.displayName,
    };

    if (profile.photos?.[0]?.value !== undefined) {
      updateData.avatarUrl = profile.photos[0].value;
    }

    const user = await prisma.user.upsert({
      where: { githubId: profile.id },
      update: updateData,
      create: {
        githubId: profile.id,
        username: profile.username || profile.displayName,
        email,
        avatarUrl: avatar,
      },
    });

    return done(null, user as unknown as GitHubUser);
  } catch (error) {
    return done(error);
  }
};

export const githubCallbackHandler = (req: Request, res: Response) => {
  const user = req.user as GitHubUser;

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' },
  );

  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('singe_authentication_token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(`${process.env.CLIENT_URL}/dashboard`);
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.singe_authentication_token;

  if (!token) {
    next(new AppError(401, 'NOT_AUTHENTICATED', 'Not authenticated'));
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      next(new AppError(404, 'USER_NOT_FOUND', 'User not found'));
      return;
    }

    res.json(user);
  } catch {
    next(new AppError(401, 'INVALID_TOKEN', 'Invalid token'));
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('singe_authentication_token');
  res.json({ success: true });
};

// Starts the GitHub App installation flow. Generates a state nonce, stores it
// in a short-lived cookie, then redirects to GitHub. The nonce is echoed back
// by GitHub in the callback, where it is verified before any DB write happens.
export const initiateGitHubAppInstall = (_req: Request, res: Response) => {
  const state = nanoid(32);

  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('singe_install_state', state, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000,
  });

  res.redirect(
    `https://github.com/apps/${process.env.GITHUB_APP_SLUG}/installations/new?state=${state}`,
  );
};

export const installGitHubApp = async (req: Request, res: Response) => {
  const { installation_id, state } = req.query;
  const token = req.cookies.singe_authentication_token;
  const cookieState: string | undefined = req.cookies.singe_install_state;

  // Always clear the state cookie so it can't be replayed
  res.clearCookie('singe_install_state');

  const installationIdStr = typeof installation_id === 'string' ? installation_id : '';
  const stateParam = typeof state === 'string' ? state : '';

  const stateValid =
    !!cookieState &&
    !!stateParam &&
    cookieState.length === stateParam.length &&
    timingSafeEqual(Buffer.from(cookieState), Buffer.from(stateParam));

  if (!token || !/^\d{1,20}$/.test(installationIdStr) || !stateValid) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=missing_params`);
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    await prisma.user.update({
      where: { id: payload.id },
      data: { installationId: installationIdStr },
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch {
    res.redirect(`${process.env.CLIENT_URL}/login?error=install_failed`);
  }
};
