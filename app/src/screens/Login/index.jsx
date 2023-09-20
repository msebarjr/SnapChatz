import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";


// Assets
import SnapChatzVideo from '../../assets/videos/background.mp4'
import Logo from '../../assets/images/logo.png'

const Login = () => {
  const responseGoogle = (response) => {
    console.log(response)
    const user = jwt_decode(response.credential)   
    console.log(user)     
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
          </div>
        </div>
    </div>
  )
}

export default Login