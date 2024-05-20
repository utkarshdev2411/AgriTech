import express from 'express'
import { createPost, getPosts } from '../controllers/post.controller.js';
import { jwtVerify } from '../middlewares/user.middleware.js';


const router=express.Router();


const routerPost= router
.get('/',jwtVerify,getPosts)
.post('/create',createPost)


export default routerPost