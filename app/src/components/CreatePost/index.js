import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

import { myConfiguredSanityClient } from '../../sanity/sanityClient';

// Data
import categories from '../../utils/categoryData';

// Custom Components
import Spinner from '../Spinner';

const IMG_TYPES = ['image/png', 'image/svg', 'image/jpeg', 'image/gif'];

const CreatePost = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState(false);
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

  const handleDeleteImg = () => setImageAsset(null);

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
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
      </div>
    </div>
  );
};

export default CreatePost;
