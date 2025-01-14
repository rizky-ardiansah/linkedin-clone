import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { getPublicProfile, getSuggestedConnections } from '../controller/user.controller.js';

const router = express.Router();

router.get('/suggestions', protectRoute, getSuggestedConnections);
router.get('/:username', protectRoute, getPublicProfile);

router.put('/profile', protectRoute);

export default router;