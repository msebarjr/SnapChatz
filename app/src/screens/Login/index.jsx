import React from 'react'
import GoogleLogin from 'react-google-login'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'

import SnapChatzVideo from '../../assets/videos/background.mp4'
import logo_light from '../../assets/images/logo_light.png'
import logo_dark from '../../assets/images/logo_dark.png'
import logo_1 from '../../assets/images/logo_1.png'
import logo_2 from '../../assets/images/logo_2.png'
import logo_small_1 from '../../assets/images/logo_small_1.png'

const Login = () => {
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
          <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
            <div className='p-5'>
              <img src={logo_small_1} width='250px' alt="logo" />
            </div>            
          </div>
        </div>
    </div>
  )
}

export default Login