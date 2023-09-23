import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

const Navbar = ({ searchInput, setSearchInput, user }) => {
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleInputFocus = () => {
    navigate('/search');
  };

  // If there is not a user, then do not show the Navbar
  if (!user) return null;

  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus:shadow-sm'>
        <IoMdSearch fontSize={21} className='ml-1' />
        <input
          type='text'
          onChange={handleInputChange}
          placeholder='Search'
          value={searchInput}
          onFocus={handleInputFocus}
          className='p-2 w-full bg-white outline-none'
        />
      </div>
      <div className='flex gap-3'>
        <Link to={`user-profile/${user?._id}`} className='hidden md:block'>
          <img src={user.image} alt='User' className='w-14 rounded-full' />
        </Link>
        <Link
          to='/create-pin'
          className='bg-[#E1B890] text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center'
        >
          <IoMdAdd />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
