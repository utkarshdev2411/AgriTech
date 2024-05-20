import mongoose from 'mongoose'


const postSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    content:{
        type:String,
        required:true
    }
},{timestamps:true})


export const postModel=mongoose.model('Post',postSchema)

