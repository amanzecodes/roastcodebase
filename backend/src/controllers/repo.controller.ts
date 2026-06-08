import {type Request, type Response} from "express"
import { prisma } from '../lib/prisma.js';
import getAppOctokit from "../util/getAppOctokit.js";
import { Octokit } from "@octokit/rest";

export const ListRepos = async (req: Request, res: Response) => {
 try {

    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: { installationId: true, username: true },
    });

    if (!user?.installationId) {
      res.status(403).json({ error: 'GitHub App not installed', code: 'NOT_INSTALLED' });
      return;
    }

    const appOctokit = getAppOctokit();

    // Get an installation access token
    const { token } = await appOctokit.auth({
      type: 'installation',
      installationId: parseInt(user.installationId),
    }) as { token: string };

    // Use that token to list repos
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
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch repos' });
  }
}