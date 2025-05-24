import { postModel } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { StatusCodes } from "http-status-codes";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create post
export const createPost = async (req, res) => {
  try {
    const { _id, content } = req.body;
    const postData = { user: _id, content };
    
    // Handle image upload if present
    if (req.file) {
      const imageLocalPath = req.file.path;
      const image = await uploadOnCloudinary(imageLocalPath);
      if (image) {
        postData.image = image.url;
      }
    }
    
    const post = await postModel.create(postData);
    
    const user = await User.findById(_id);
    user.posts.push(post._id);
    await user.save();
    
    return res.status(StatusCodes.CREATED).json(
      new ApiResponse(StatusCodes.CREATED, post, "Post created successfully")
    );
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, {}, "Failed to create post")
    );
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await postModel.find({})
      .populate("user", "username fullname avatar email")
      .populate("likes", "username avatar")
      .sort({ createdAt: -1 });
    
    return res.status(StatusCodes.OK).json(posts);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, {}, "Failed to fetch posts")
    );
  }
};

// Get single post
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId)
      .populate("user", "username fullname avatar email")
      .populate("likes", "username avatar")
      .populate("comments.user", "username avatar");
    
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json(
        new ApiResponse(StatusCodes.NOT_FOUND, {}, "Post not found")
      );
    }
    
    // Increment view count
    post.viewCount += 1;
    await post.save();
    
    return res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, post, "Post fetched successfully")
    );
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, {}, "Failed to fetch post")
    );
  }
};

// Like/Unlike post
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json(
        new ApiResponse(StatusCodes.NOT_FOUND, {}, "Post not found")
      );
    }
    
    // Check if user already liked the post
    const likedIndex = post.likes.findIndex(
      (id) => id.toString() === userId.toString()
    );
    
    const liked = likedIndex === -1;
    
    if (liked) {
      // Like the post
      post.likes.push(userId);
    } else {
      // Unlike the post
      post.likes.splice(likedIndex, 1);
    }
    
    await post.save();
    
    // Return the updated post
    const updatedPost = await postModel.findById(postId)
      .populate("user", "username fullname avatar email")
      .populate("likes", "username avatar")
      .populate("comments.user", "username avatar");
    
    return res.status(StatusCodes.OK).json(
      new ApiResponse(
        StatusCodes.OK, 
        { liked, post: updatedPost, likesCount: post.likes.length }, 
        "Post like toggled"
      )
    );
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, {}, "Failed to toggle like")
    );
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json(
        new ApiResponse(StatusCodes.NOT_FOUND, {}, "Post not found")
      );
    }
    
    post.comments.push({ user: userId, content });
    await post.save();
    
    // Populate the newly added comment
    const populatedPost = await postModel.findById(postId)
      .populate("comments.user", "username avatar");
    
    const newComment = populatedPost.comments[populatedPost.comments.length - 1];
    
    return res.status(StatusCodes.CREATED).json(
      new ApiResponse(StatusCodes.CREATED, newComment, "Comment added successfully")
    );
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, {}, "Failed to add comment")
    );
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await postModel.findById(postId)
      .populate("comments.user", "username avatar");
    
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json(
        new ApiResponse(StatusCodes.NOT_FOUND, {}, "Post not found")
      );
    }
    
    return res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, post.comments, "Comments fetched successfully")
    );
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, {}, "Failed to fetch comments")
    );
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    
    // Find the post
    const post = await postModel.findById(postId);
    
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json(
        new ApiResponse(StatusCodes.NOT_FOUND, {}, "Post not found")
      );
    }
    
    // Check if the user is the creator of the post
    if (post.user.toString() !== userId.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json(
        new ApiResponse(StatusCodes.FORBIDDEN, {}, "You don't have permission to delete this post")
      );
    }
    
    // Remove the post
    await postModel.findByIdAndDelete(postId);
    
    // Also remove post reference from user's posts array
    await User.findByIdAndUpdate(userId, {
      $pull: { posts: postId }
    });
    
    return res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, {}, "Post deleted successfully")
    );
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, {}, "Failed to delete post")
    );
  }
};
