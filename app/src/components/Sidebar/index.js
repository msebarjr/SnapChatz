import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';

// Sanity
import { myConfiguredSanityClient } from '../../sanity/sanityClient';

// Assets
import Logo from '../../assets/images/logo_dark.png';
import Avatar from '../../assets/images/blankAvatar.png';

// Data
import { categories } from '../../utils/categoryData';

// Custom Components
import Divider from '../Divider';

const isNotActiveStyles =
  'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyles =
  'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

const Sidebar = ({ user, closeToggle }) => {
  const navigate = useNavigate();

  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  const handleLogout = () => {
    const guestAccount = '1234567890';

    if (user._id === guestAccount)
      myConfiguredSanityClient.delete(guestAccount).then(() => {
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
      });

    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className='bg-neutra-500 flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
      <div className='flex flex-col'>
        <Link
          to='/'
          className='flex px-5 gap-2 my-5 pt-1 w-190 items-center'
          onClick={handleCloseSidebar}
        >
          <img src={Logo} alt='Logo' className='w-full' />
        </Link>
        <div className='flex flex-col gap-5'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <Divider />
          <h3 className='px-5 text-base 2xl:text-xl'>Categories</h3>

          {/* Slice is done to remove the 'Other' category from being mapped */}
          {categories.map((category) => (
            <NavLink
              key={category.name}
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyles : isNotActiveStyles
              }
              onClick={handleCloseSidebar}
            >
              <img
                src={category.image}
                alt='category'
                className='w-8 h-8 rounded-full shadow-sm'
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>

      {user && (
        <div className='mb-3'>
          <Divider styles='mt-5' />
          <Link
            to={`user-profile/${user._id}`}
            className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
            onClick={handleCloseSidebar}
          >
            <img
              src={user.image ? user.image : Avatar}
              alt='user-profile'
              className='w-10 h-10 rounded-full'
            />
            <p>{user.userName}</p>
          </Link>
          <div className=' text-center font-semibold p-2 items-center bg-[#E1B890] rounded-lg shadow-lg mx-3 cursor-pointer'>
            <button type='button' onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
