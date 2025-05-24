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
import { getGFS } from '../db/gridfs.js';
import mongoose from 'mongoose';

const router = express.Router();

// Add a route to serve images from GridFS
router.get('/image/:id', async (req, res) => {
  try {
    console.log("Received image request for ID:", req.params.id);
    const id = new mongoose.Types.ObjectId(req.params.id);
    const gfs = getGFS();
    
    // Check if file exists
    const files = await gfs.find({ _id: id }).toArray();
    console.log("Found files:", files);
    
    if (!files || files.length === 0) {
      console.log("No files found with ID:", id);
      return res.status(404).json({
        message: "Image not found"
      });
    }
    
    // Set the proper content type
    res.set('Content-Type', files[0].contentType);
    console.log("Serving file with content type:", files[0].contentType);
    
    // Create a read stream and pipe it to the response
    const readStream = gfs.openDownloadStream(id);
    readStream.pipe(res);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({
      message: "Error serving image"
    });
  }
});

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