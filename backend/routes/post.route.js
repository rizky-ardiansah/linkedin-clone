import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getFeedposts, createPost, deletePost, getPostById, createComment } from '../controller/post.controller.js';

const router = express.Router();

router.get('/', protectRoute, getFeedposts);
router.post('/create', protectRoute, createPost);
router.delete('/delete/:id', protectRoute, deletePost);
router.get('/:id', protectRoute, getPostById);
router.post('/:id/comment', protectRoute, createComment);

export default router