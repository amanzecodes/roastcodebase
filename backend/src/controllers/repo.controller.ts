import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import getAppOctokit from '../util/getAppOctokit.js';
import { Octokit } from '@octokit/rest';
import { AppError } from '../types/errors.js';

export const ListRepos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: { installationId: true, username: true },
    });

    if (!user?.installationId) {
      next(new AppError(403, 'NOT_INSTALLED', 'GitHub App not installed'));
      return;
    }

    const appOctokit = getAppOctokit();

    const { token } = await appOctokit.auth({
      type: 'installation',
      installationId: parseInt(user.installationId),
    }) as { token: string };

    const octokit = new Octokit({ auth: token });

    const { data } = await octokit.apps.listReposAccessibleToInstallation({
      per_page: 100,
    });

    const repos = data.repositories.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
      language: repo.language,
      starCount: repo.stargazers_count,
      updatedAt: repo.updated_at,
      defaultBranch: repo.default_branch,
    }));

    res.json({ repos });
  } catch (err) {
    next(new AppError(500, 'FETCH_REPOS_FAILED', 'Failed to fetch repositories'));
  }
};
