import React, { useState, useEffect } from 'react';

// Custom Components
import MasonryLayout from '../MasonryLayout';
import Spinner from '../Spinner';

// Sanity Data
import { myConfiguredSanityClient } from '../../sanity/sanityClient';
import { feedQuery, searchQuery } from '../../utils/sanityData';

const Search = ({ searchInput, setSearchInput }) => {
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (searchInput) {
      setIsLoading(true);
      const query = searchQuery(searchInput.toLowerCase());

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
  }, [searchInput]);

  return (
    <div>
      {isLoading && <Spinner message='Searching for posts...' />}
      {posts?.length !== 0 && <MasonryLayout posts={posts} />}
      {posts?.length === 0 && searchInput !== '' && !isLoading && (
        <div className='mt-10 text-center text-xl'>No Posts Found!</div>
      )}
    </div>
  );
};

export default Search;
