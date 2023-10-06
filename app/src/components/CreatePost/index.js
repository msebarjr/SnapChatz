import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

import { myConfiguredSanityClient } from '../../sanity/sanityClient';

// Data
import { categories } from '../../utils/categoryData';

// Custom Components
import Spinner from '../Spinner';

const IMG_TYPES = ['image/png', 'image/svg', 'image/jpeg', 'image/gif'];

const CreatePost = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInputFieldErrors, setIsInputFieldsErrors] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    const { type, name } = selectedFile;

    if (IMG_TYPES.includes(type)) {
      setWrongImageType(false);
      setIsLoading(true);

      myConfiguredSanityClient.assets
        .upload('image', selectedFile, {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log('Image upload error ', error);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const handleSavePost = () => {
    if (title && about && imageAsset?._id && category) {
      const doc = {
        _type: 'post',
        title,
        about,
        destination: 'https://www.michaelsebarjr.com',
        image: {
          _type: 'image',
          asset: {
            _type: 'ref',
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      };

      myConfiguredSanityClient.create(doc).then(() => navigate('/'));
    } else {
      setIsInputFieldsErrors(true);
      setTimeout(() => setIsInputFieldsErrors(false), 5000);
    }
  };

  const handleDeleteImg = () => setImageAsset(null);
  const handleTitleInput = (e) => setTitle(e.target.value);
  const handleAboutInput = (e) => setAbout(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {isInputFieldErrors && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
          Please fill in all the fields
        </p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {isLoading && <Spinner />}
            {!imageAsset ? (
              <label>
                <div className='flex flex-col items-center justify-center h-full cursor-pointer'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold opacity-65 text-2xl'>
                      <AiOutlineCloudUpload fontSize={56} />
                    </p>
                    <p className='text-lg'>Click to upload</p>
                  </div>
                  <p className='mt-32 text-gray-400'>
                    Use high-quality JPG, SVG, PNG, or GIF less than 20 MB
                  </p>
                </div>
                <input
                  type='file'
                  name='Upload Image'
                  onChange={handleImageUpload}
                  className='w-0 h-0'
                />
              </label>
            ) : (
              <div className='relative h-full'>
                <img
                  src={imageAsset?.url}
                  alt='uploaded-img'
                  className='h-full w-full'
                />
                <button
                  type='button'
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-red-500 opacity-80 hover:opacity-100 text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={handleDeleteImg}
                >
                  <MdDelete />
                </button>
              </div>
            )}
            {wrongImageType && (
              <p className='text-red-500 font-bold'>Wrong Image Type!</p>
            )}
          </div>
        </div>

        {/* Form */}
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input
            type='text'
            value={title}
            onChange={handleTitleInput}
            placeholder='Add your title'
            className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
          />
          {user && (
            <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
              <img
                src={user.image}
                alt='user-profile'
                className='w-10 h-10 rounded-full'
              />
              <p className='font-bold'>{user.userName}</p>
            </div>
          )}
          <input
            type='text'
            value={about}
            onChange={handleAboutInput}
            placeholder='What is your post about?'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
          />
          <div className='flex flex-col'>
            <div className='mt-2'>
              <p className='mb-2 font-semibold text-lg sm:text-xl'>
                Choose Post Category
              </p>
              <select
                onChange={handleCategoryChange}
                className='outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
              >
                <option value='other' className='bg-white'>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option
                    value={category.name}
                    className='text-base border-0 outline-none capitalize bg-white text-black'
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex justify-end items-end mt-7'>
              <button
                type='button'
                onClick={handleSavePost}
                className='bg-[#E1B890] text-black font-semibold p-2 rounded-full w-28 outline-none hover:opacity-80'
              >
                Save Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
