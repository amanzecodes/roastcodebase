import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { startRoast, getRoast, listRoasts } from '../controllers/roast.controller.js';

const router = Router();

router.post('/start', requireAuth, startRoast);
router.get('/:id', requireAuth, getRoast);
router.get('/', requireAuth, listRoasts);

export default router;
