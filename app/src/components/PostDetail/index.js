import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Sanity
import { myConfiguredSanityClient } from '../../sanity/sanityClient';
import { urlFor } from '../../client';
import {
  postDetailQuery,
  postDetailMorePostQuery,
} from '../../utils/sanityData';

// Custom Components
import MasonryLayout from '../MasonryLayout';
import Spinner from '../Spinner';
import Divider from '../Divider';

const PostDetail = ({ user }) => {
  const [posts, setPosts] = useState(null);
  const [postDetails, setPostDetails] = useState(null);
  const [comment, setComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const { postId } = useParams();

  const getPostDetails = () => {
    let query = postDetailQuery(postId);

    if (query) {
      myConfiguredSanityClient.fetch(query).then((data) => {
        setPostDetails(data[0]);

        if (data[0]) {
          query = postDetailMorePostQuery(data[0]);

          myConfiguredSanityClient.fetch(query).then((res) => setPosts(res));
        }
      });
    }
  };

  useEffect(() => {
    getPostDetails();
  }, [postId]);

  if (!postDetails) return <Spinner message='Loading Post...' />;

  const handlePostDownload = (e) => {
    // This prevents all other events happening in the parent divs that have onClick events
    e.stopPropagation();
  };

  const handleCommentInput = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (comment) {
      setIsAddingComment(true);

      myConfiguredSanityClient
        .patch(postId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: 'postedBy',
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          getPostDetails();
          setComment('');
          setIsAddingComment(false);
        });
    }
  };

  return (
    <>
      <div
        className='flex xl:flex-row flex-col m-auto'
        style={{ maxWidth: '1500px' }}
      >
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img
            src={postDetails?.image && urlFor(postDetails.image).url()}
            alt='user-post'
            className='rounded-lg'
            width={450}
          />
        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div>
            <div className='flex justify-start gap-5 items-center'>
              <h1 className='text-4xl font-bold break-words mt-3'>
                {postDetails.title}
              </h1>
              <a
                href={`${postDetails.image?.asset?.url}?dl=`}
                download
                onClick={handlePostDownload}
                className='bg-white mt-2 w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <p className='mt-3'>{postDetails.about}</p>
          </div>
          <Link
            to={`user-profile/${postDetails.postedBy?._id}`}
            className='flex gap-2 mt-5 items-center rounded-lg'
          >
            <img
              className='w-10 h-10 rounded-full object-cover'
              src={postDetails?.postedBy.image}
              alt='user-profile'
            />
            <p className='font-semibold capitalize'>
              {postDetails.postedBy?.userName}
            </p>
          </Link>
          <h2 className='mt-5 text-2xl'>Comments</h2>
          <div className='max-h-370 overflow-y-auto bg-gray-50 px-2 rounded-lg'>
            {postDetails?.comments?.map((comment, idx) => (
              <div
                className='flex gap-2 mt-5 items-center rounded-lg'
                key={idx}
              >
                <img
                  src={comment.postedBy?.image}
                  alt='user-profile'
                  className='w-10 h-10 rounded-full cursor-pointer'
                />
                <div className='flex flex-col'>
                  <p className='font-bold'>{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className='flex flex-wrap mt-6 gap-3'>
            <Link to={`user-profile/${postDetails.postedBy?._id}`}>
              <img
                className='w-10 h-10 rounded-full cursor-pointer'
                src={postDetails.postedBy?.image}
                alt='user-profile'
              />
            </Link>
            <input
              type='text'
              className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
              placeholder='Add a comment'
              value={comment}
              onChange={handleCommentInput}
            />
            <button
              type='button'
              className='bg-[#E1B890] font-bold rounded-full px-6 py-2 font-semibold text-base outline-none hover:opacity-80'
              onClick={handleCommentSubmit}
            >
              {isAddingComment ? 'Posting Comment...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
      <Divider styles='mt-8' />
      <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
        Similiar Posts
      </h2>
      {posts?.length > 0 ? (
        <MasonryLayout posts={posts} />
      ) : (
        <h5 className='text-center mt-[3rem]'>No similiar posts found!</h5>
      )}
    </>
  );
};

export default PostDetail;
