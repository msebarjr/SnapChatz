import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Custom Components
import CreatePost from '../../components/CreatePost';
import Feed from '../../components/Feed';
import Navbar from '../../components/Navbar';
import PostDetail from '../../components/PostDetail';
import Search from '../../components/Search';

const Posts = ({ user }) => {
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <Navbar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          user={user}
        />
      </div>
      <div className='h-full'>
        <Routes>
          <Route path='/' element={<Feed />} />
          <Route path='/category/:categoryId' element={<Feed />} />
          <Route
            path='/post-detail/:postId'
            element={<PostDetail user={user} />}
          />
          <Route path='/create-post' element={<CreatePost user={user} />} />
          <Route
            path='/search'
            element={
              <Search
                searchInput={searchInput}
                setSearchInput={setSearchInput}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Posts;
