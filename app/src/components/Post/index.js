import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Sanity
import { urlFor } from '../../client';
import { myConfiguredSanityClient } from '../../sanity/sanityClient';

// Data
import { getUserInfo } from '../../utils/getUser';
import toast from 'react-hot-toast';

const Post = ({ post: { postedBy, image, _id, like } }) => {
  const [isPostHovered, setIsPostHovered] = useState(false);

  const navigate = useNavigate();

  const user = getUserInfo();
  const googleId = user?.sub;

  const alreadyLikedPost = !!like?.filter(
    (item) => item?.postedBy?._id === googleId
  )?.length;

  const likePost = (id) => {
    if (!alreadyLikedPost) {
      myConfiguredSanityClient
        .patch(id)
        .setIfMissing({ like: [] })
        .insert('after', 'like[-1]', [
          {
            _key: uuidv4(),
            userId: googleId,
            postedBy: {
              _type: 'postedBy',
              _ref: googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload(false);
        });
    } else {
      myConfiguredSanityClient
        .patch(id)
        .unset([`like[userId=="${googleId}"]`])
        .commit()
        .then(() => {
          window.location.reload(false);
        });
    }
  };

  const unlikePost = (id) => {
    myConfiguredSanityClient.delete(id).then(() => window.location.reload());
    toast.success('Post has been deleted!');
  };

  const handlePostHovered = () => {
    setIsPostHovered((prevHoveredState) => !prevHoveredState);
  };

  const handlePostClick = () => {
    navigate(`/post-detail/${_id}`);
  };

  const handlePostDownload = (e) => {
    // This prevents all other events happening in the parent divs that have onClick events
    e.stopPropagation();
  };

  const handleLikePost = (e) => {
    e.stopPropagation();
    likePost(_id);
  };

  const handleUnlikePost = (e) => {
    e.stopPropagation();
    unlikePost(_id);
  };

  return (
    <div className='m-2'>
      <div
        onMouseEnter={handlePostHovered}
        onMouseLeave={handlePostHovered}
        onClick={handlePostClick}
        className='relative cursor-zoom-in w-auto rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
      >
        <LazyLoadImage
          src={urlFor(image).width(250).url()}
          alt='user-post'
          wrapperClassName='w-full h-full'
          className='rounded-lg w-full h-full'
          effect='blur'
        />

        {isPostHovered && (
          <div
            className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
            style={{ height: '100%' }}
          >
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={handlePostDownload}
                  className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadyLikedPost ? (
                <button
                  type='button'
                  className='bg-red-500 opacity-100 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                  onClick={handleLikePost}
                >
                  Liked
                </button>
              ) : (
                <button
                  type='button'
                  className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                  onClick={handleLikePost}
                >
                  Like
                </button>
              )}
            </div>
            <div className='flex justify-between items-center pb-2 w-full'>
              {postedBy?._id === googleId && (
                <button
                  type='button'
                  className='bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outline-none'
                  onClick={handleUnlikePost}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className='flex gap-2 mt-2 items-center'
      >
        <img
          className='w-8 h-8 rounded-full object-cover'
          src={postedBy?.image}
          alt='user-profile'
        />
        <p className='font-semibold capitalize'>{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Post;
