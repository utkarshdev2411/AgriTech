import express from 'express';
import { 
  addComment,
  createPost, 
  getComments, 
  getPostById, 
  getPosts, 
  toggleLike,
  deletePost,
  incrementView
} from '../controllers/post.controller.js';
import { jwtVerify } from '../middlewares/user.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

const routerPost = router
  .get('/', getPosts)
  .post('/create', upload.single('image'), createPost)
  .get('/:postId', getPostById)
  .post('/:postId/like', jwtVerify, toggleLike)
  .post('/:postId/comments', jwtVerify, addComment)
  .get('/:postId/comments', getComments)
  .delete('/:postId', jwtVerify, deletePost)
  .post('/:postId/view', incrementView);

export default routerPost;