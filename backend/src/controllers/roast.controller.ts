import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { fetchRepoFiles, getInstallationOctokit } from '../services/github.js';
import { generateRoast } from '../services/roast.js';
import { AppError } from '../types/errors.js';
import { nanoid } from 'nanoid';

export const startRoast = async (req: Request, res: Response, next: NextFunction) => {
  const { repoOwner, repoName, defaultBranch } = req.body;

  if (!repoOwner || !repoName || !defaultBranch) {
    next(new AppError(400, 'MISSING_PARAMS', 'repoOwner, repoName and defaultBranch are required'));
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: { installationId: true, roastCountToday: true, roastCountDate: true },
    });

    if (!user?.installationId) {
      next(new AppError(403, 'NOT_INSTALLED', 'GitHub App not installed'));
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const roastCountDate = new Date(user.roastCountDate);
    roastCountDate.setHours(0, 0, 0, 0);

    const isNewDay = roastCountDate < today;

    if (!isNewDay && user.roastCountToday >= 3) {
      next(new AppError(429, 'RATE_LIMIT', 'Daily roast limit reached. Come back tomorrow.'));
      return;
    }

    const roast = await prisma.roast.create({
      data: {
        userId: req.userId!,
        repoOwner,
        repoName,
        repoUrl: `https://github.com/${repoOwner}/${repoName}`,
        defaultBranch,
        status: 'PENDING',
        shareSlug: nanoid(8),
        startedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: req.userId! },
      data: {
        roastCountToday: isNewDay ? 1 : user.roastCountToday + 1,
        ...(isNewDay && { roastCountDate: new Date() }),
      },
    });

    res.json({ roastId: roast.id });

    processRoast(roast.id, user.installationId, repoOwner, repoName, defaultBranch);
  } catch (err) {
    next(new AppError(500, 'START_ROAST_FAILED', 'Failed to start roast'));
  }
};

export const getRoast = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;

  try {
    const roast = await prisma.roast.findUnique({
      where: { shareSlug: id },
      include: { securityFindings: true },
    });

    if (!roast) {
      next(new AppError(404, 'NOT_FOUND', 'Roast not found'));
      return;
    }

    if (roast.userId !== req.userId && !roast.isPublic) {
      next(new AppError(403, 'FORBIDDEN', 'Forbidden'));
      return;
    }

    res.json(roast);
  } catch {
    next(new AppError(500, 'FETCH_ROAST_FAILED', 'Failed to fetch roast'));
  }
};

export const listRoasts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roasts = await prisma.roast.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        repoOwner: true,
        repoName: true,
        status: true,
        shareSlug: true,
        createdAt: true,
        completedAt: true,
        result: true,
      },
    });

    res.json({ roasts });
  } catch {
    next(new AppError(500, 'FETCH_ROAST_FAILED', 'Failed to fetch roasts'));
  }
};

async function processRoast(
  roastId: string,
  installationId: string,
  repoOwner: string,
  repoName: string,
  defaultBranch: string,
) {
  try {
    await prisma.roast.update({
      where: { id: roastId },
      data: { status: 'PROCESSING' },
    });

    const octokit = await getInstallationOctokit(installationId);
    const files = await fetchRepoFiles(octokit, repoOwner, repoName, defaultBranch);

    await prisma.roastFile.createMany({
      data: files.map(f => ({
        roastId,
        filePath: f.path,
        language: f.language,
        sizeBytes: f.sizeBytes,
        wasScanned: true,
      })),
    });

    await prisma.roast.update({
      where: { id: roastId },
      data: { fileCount: files.length },
    });

    const result = await generateRoast(repoOwner, repoName, files);

    if (result.securityFindings.length > 0) {
      await prisma.securityFinding.createMany({
        data: result.securityFindings.map(f => ({
          roastId,
          severity: f.severity,
          category: f.category,
          title: f.title,
          description: f.description,
          filePath: f.filePath,
          lineNumber: f.lineNumber,
        })),
      });
    }

    await prisma.roast.update({
      where: { id: roastId },
      data: {
        status: 'DONE',
        result: result as any,
        completedAt: new Date(),
      },
    });
  } catch (err) {
    console.error('Roast processing failed:', err);
    await prisma.roast.update({
      where: { id: roastId },
      data: {
        status: 'FAILED',
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
      },
    });
  }
}
