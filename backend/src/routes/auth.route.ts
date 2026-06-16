import { Router } from "express";
import { Strategy as GitHubStrategy } from "passport-github2";
import passport from "passport";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "https://roastcodebase-production.up.railway.app/auth/github/callback",
    },
    authController.githubStrategyCallback,
  ),
);

router.use(passport.initialize());

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
  }),
  authController.githubCallbackHandler,
);

router.get("/me", authController.getMe);

router.get("/github/install/init", authController.initiateGitHubAppInstall);
router.get("/github/install", authController.installGitHubApp);

router.post("/logout", authController.logout);

export default router;
