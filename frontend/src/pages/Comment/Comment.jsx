
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createPost, getPosts } from '../../store/services/postAction';

const Comment = () => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const [createPosts, setCreatePosts] = useState(false)
  const posts = useSelector(state => state.post.posts)
  console.log(posts)
  const user = useSelector(state => state.user.userInfo)

  const onSubmit = async (data) => {
    try {
      dispatch(createPost({
        content: data.content,
        _id: user._id
      }))
      toast.success("post created successfully")
      setCreatePosts(prev => !prev);
      reset();


    } catch (error) {
      console.log(error)
    }
    reset();
  };
  useEffect(() => {
    dispatch(getPosts());
  }, [onSubmit])




  return (
    <>

      <div className=' flex flex-col justify-center relative items-center px-10 py-10'>

        <button onClick={() => (setCreatePosts(prev => !prev))} className='mb-3 px-4 py-2 bg-slate-800 font-semibold text-md absolute top-0 right-[20%] text-white rounded-md'>{createPosts ? "X" : "+"}</button>

        {posts && posts.map((post) => (
          <div key={post._id} className='mb-8 border-2 border-slate-300 max-w-lg px-10 pt-6 pb-3'>
            <div className='flex justify-start items-center gap-4 mb-4'>
              <div className='w-9  h-9 overflow-hidden object-center' ><img src={post.user && post.user.avatar} alt="profile" /></div>
              <div>
                <h1 className='text-lg text-slate-700 font-bold tracking-wide'>{post.user && post.user.username}</h1>
                <h3 className='text-md text-blue-600 '>{post.user ? post.user.email : "email@email.com"}</h3>
              </div>
            </div>
            <p className='trucate text-sm font-medium text-slate-500'>{post.content}</p>
            <div className='text-md text-slate-700 font-semibold tracking-wide my-4 cursor-pointer'>
              <span className=''>replies</span>
              <span onClick={() => (setCreatePosts(prev => !prev))} className='px-4 py-2 ml-5 cursor-pointer font-semibold text-md  text-slate-700 rounded-md'>add comment</span></div>

          </div>
        ))}
        {
          createPosts ?
            <div className="  w-64 absolute top-0 left-[50%]  bg-white shadow-lg rounded-lg p-6 mt-10">
              <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Content</label>
                  <textarea
                    id="content"
                    name="content"
                    {...register('content', { required: true })}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Post
                </button>
              </form>

            </div> : ""}



      </div>
    </>
  );
};

export default Comment