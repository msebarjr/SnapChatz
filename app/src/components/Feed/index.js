import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { myConfiguredSanityClient } from '../../sanity/sanityClient';

// Data
import { feedQuery, searchQuery } from '../../utils/sanityData';

// Custom Components
import Spinner from '../Spinner';
import MasonryLayout from '../MasonryLayout';

const Feed = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setIsLoading(true);

    // If there is a specific search the categoryId will be present otherwise produces all images on the feed
    if (categoryId) {
      const query = searchQuery(categoryId);

      myConfiguredSanityClient.fetch(query).then((data) => {
        setPosts(data);
        setIsLoading(false);
      });
    } else {
      myConfiguredSanityClient.fetch(feedQuery).then((data) => {
        setPosts(data);
        setIsLoading(false);
      });
    }
  }, [categoryId]);

  if (isLoading)
    return <Spinner message='We are finding new images for you!' />;

  if (!posts?.length)
    return (
      <div className='flex justify-center items-center w-full h-[calc(100vh-200px)]'>
        <h2>No Posts Available!</h2>
      </div>
    );

  return <div>{posts && <MasonryLayout posts={posts} />}</div>;
};

export default Feed;
