import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Sanity data
import {
  userCreatedPostsQuery,
  userQuery,
  userLikedPostsQuery,
} from '../../utils/sanityData';
import { myConfiguredSanityClient } from '../../sanity/sanityClient';

// Custom Components
import MasonryLayout from '../MasonryLayout';
import Spinner from '../Spinner';

const activeBtnStyles =
  'bg-[#E1B890] font-bold py-2 px-4 rounded-full w-[100px] outline-none w-30';
const notActiveBtnStyles =
  'bg-primary font-bold p-2 rounded-full w-20 border-[#E1B890] border-2 w-[100px] opacity-60';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');

  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    myConfiguredSanityClient.fetch(query).then((data) => setUser(data[0]));
  }, [userId]);

  useEffect(() => {
    if (text === 'Created') {
      const createdPostsQuery = userCreatedPostsQuery(userId);

      myConfiguredSanityClient
        .fetch(createdPostsQuery)
        .then((data) => setPosts(data));
    } else {
      const likedPostsQuery = userLikedPostsQuery(userId);

      myConfiguredSanityClient
        .fetch(likedPostsQuery)
        .then((data) => setPosts(data));
    }
  }, [text, userId]);

  if (!user) return <Spinner message='Loading profile...' />;

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={user.image}
              alt='user-pic'
              className='rounded-full w-40 h-40 mt-10 shadow-xl object-cover'
            />
            <h1 className='font-bold text-3xl text-center mt-2'>
              {user.userName}
            </h1>
          </div>
          <div className='mb-7 mt-10 flex items-center justify-center gap-5'>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('created');
              }}
              className={`${
                activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('liked');
              }}
              className={`${
                activeBtn === 'liked' ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Liked
            </button>
          </div>

          {posts?.length ? (
            <div className='px-2'>
              <MasonryLayout posts={posts} />
            </div>
          ) : (
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
              No Posts Found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
