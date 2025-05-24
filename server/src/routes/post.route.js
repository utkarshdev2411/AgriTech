import express from 'express';
import { 
  addComment,
  createPost, 
  getComments, 
  getPostById, 
  getPosts, 
  toggleLike 
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
  .get('/:postId/comments', getComments);

export default routerPost;