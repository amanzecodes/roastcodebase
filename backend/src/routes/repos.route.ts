import { Router } from 'express';
import * as repoController from "../controllers/repo.controller.js";
import { requireAuth } from '../middleware/auth.js';


const router = Router();

router.get('/', requireAuth, repoController.ListRepos);

export default router;