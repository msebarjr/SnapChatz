import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Sanity
import { urlFor } from '../../client';
import { myConfiguredSanityClient } from '../../sanity/sanityClient';

// Data
import { getUserInfo } from '../../utils/getUser';

const Post = ({ post: { postedBy, image, _id, destination, like } }) => {
  const [isPostHovered, setIsPostHovered] = useState(false);

  const navigate = useNavigate();

  const user = getUserInfo();
  const googleId = user.sub;

  const alreadyLikedPost = !!like?.filter(
    (item) => item.postedBy._id === googleId
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
        className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
      >
        {/* <img
          src={urlFor(image).width(250).url()}
          alt='user-post'
          className='rounded-lg w-full'
        /> */}

        <LazyLoadImage
          src={urlFor(image).width(250).url()}
          alt='user-post'
          wrapperClassName='w-full'
          className='rounded-lg w-full'
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
                // <button
                //   type='button'
                //   className='px-1 py-1 text-red-500 opacity-100 hover:opacity-60'
                // >
                //   {like?.length}
                //   <AiFillHeart
                //     className='text-red-500 opacity-100 hover:opacity-60'
                //     size={28}
                //   />
                // </button>
                <button
                  type='button'
                  className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                  onClick={handleLikePost}
                >
                  {like?.length} Saved
                </button>
              ) : (
                // <button className='px-1 py-1' onClick={handleLikePost}>
                //   <AiOutlineHeart
                //     className='text-red-500 opacity-60 hover:opacity-100'
                //     size={28}
                //   />
                // </button>
                <button
                  type='button'
                  className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                  onClick={handleLikePost}
                >
                  Save
                </button>
              )}
            </div>
            <div className='flex justify-between items-center gap-2 w-full'>
              {destination && (
                <a
                  href={destination}
                  target='_blank'
                  rel='noreferrer'
                  className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                  title={destination}
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 15
                    ? `${destination.slice(0, 15)}...`
                    : destination}
                </a>
              )}
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
        to={`user-profile/${postedBy?._id}`}
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
