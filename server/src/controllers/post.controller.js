import { postModel } from "../models/post.model.js";
import { User } from "../models/user.model.js";
// import jwt from 'jsonwebtoken'

export const createPost = async (req, res) => {

    const { _id, content } = req.body
    console.log({ _id, content })

    const post = await postModel.create({
        user: _id,
        content

    })
    console.log(post)
    const user = await User.findById({ _id })
    user.posts.push(post._id)
    await user.save();
    console.log(user)

}

export const getPosts = async (req, res) => {

    // console.log(req.user)
    
    const user=await User.findOne({email:req.user.email}).populate("posts")
    
    console.log(user)
    res.json(user)

}
