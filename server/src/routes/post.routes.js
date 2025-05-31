import express from 'express';
import { 
  createPost, 
  getPosts, 
  getPostById, 
  toggleLike, 
  addComment,
  getComments,
  deletePost,
  incrementView
} from '../controllers/post.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes (no auth required)
router.get('/', getPosts);
router.get('/:postId', getPostById);
router.post('/:postId/view', incrementView); // This should be public

// Protected routes (auth required)
router.use(verifyJWT); // Apply auth middleware to routes below
router.post('/create', createPost);
router.post('/:postId/like', toggleLike);
router.post('/:postId/comment', addComment);
router.get('/:postId/comments', getComments);
router.delete('/:postId', deletePost);

export default router;