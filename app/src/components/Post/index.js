import React from 'react';

// Sanity image url builder
import { urlFor } from '../../client';

const Post = ({ post: { postedBy, image, _id, destination } }) => {
  return (
    <div>
      <img
        src={urlFor(image).width(250).url()}
        alt='user-post'
        className='rounded-lg w-full'
      />
    </div>
  );
};

export default Post;
