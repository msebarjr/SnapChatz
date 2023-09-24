import React from 'react';
import Masonry from 'react-masonry-css';

// Custom Components
import Post from '../Post';

const breakpoints = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ posts }) => {
  return (
    <div>
      <Masonry className='flex animate-slide-fwd' breakpointCols={breakpoints}>
        {posts?.map((post) => (
          <Post key={post._id} post={post} className='w-max' />
        ))}
      </Masonry>
    </div>
  );
};

export default MasonryLayout;
