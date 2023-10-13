import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

// Sanity Client
import { myConfiguredSanityClient } from '../../sanity/sanityClient';

// Assets
import SnapChatzVideo from '../../assets/videos/background.mp4'
import Logo from '../../assets/images/logo_light.png'

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {   
    // Decodes google signin info 
    const userGoogleInfo = jwt_decode(response.credential)     
    const { given_name: firstName, family_name: lastName, sub: googleId, picture: userPhoto} = userGoogleInfo

    localStorage.removeItem('user')
    localStorage.setItem('user', JSON.stringify(userGoogleInfo))
    
    // Sets fields for Sanity user schema - backend > schemas > user.js
    const doc = {
      _id: googleId,
      _type: 'user', // Tells Sanity which document we are creating
      userName: `${firstName} ${lastName}`,
      image: userPhoto
    }
    
    myConfiguredSanityClient.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true })
    })
  }

  const handleGuestLogin = () => {
    const guest = {given_name: 'Guest', family_name: '', sub: '1234567890', picture: 'https://i.ibb.co/VVkxPPn/guest-Avatar.jpg'}

    localStorage.removeItem('user')
    localStorage.setItem('user', JSON.stringify(guest))

    const doc = {
      _id: guest.sub, // Same as googleId
      _type: 'user', // Tells Sanity which document we are creating
      userName: `${guest.given_name} ${guest.family_name}`,
      image: guest.picture
    }

    myConfiguredSanityClient.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true })
    })    
  }
  
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
        <div className='relative w-full h-full'>
          <video 
            src={SnapChatzVideo}          
            type='video/mp4'
            loop
            controls={false}
            muted
            autoPlay
            className='w-full h-full object-cover'
          />
          <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-black bg-opacity-90'>
            <div className='p-5'>
              <img src={Logo} width='250px' alt="logo" />
            </div>
            <div className='shadow-2xl'>
              <GoogleLogin
                onSuccess={responseGoogle}
                onError={responseGoogle}
                useOneTap
              />
            </div>
            <div className='border-[2px] border-[#E1B890] w-[250px] rounded-sm mt-5'>
              <button type='button' className='w-full h-full py-2 text-[#E1B890] text-center hover:bg-[#E1B890] hover:text-black' onClick={handleGuestLogin}>Guest Login</button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Login