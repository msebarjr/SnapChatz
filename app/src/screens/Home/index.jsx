import React, { useState, useRef, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'

import { myConfiguredSanityClient } from '../../sanity/sanityClient'

// Custom Components
import Posts from '../Posts'
import Sidebar from '../../components/Sidebar'
import UserProfile from '../../components/UserProfile'

// Data
import { userQuery } from '../../utils/sanityData'
import { getUserInfo } from '../../utils/getUser'

// Assets
import Logo from '../../assets/images/logo_dark.png'


const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [user, setUser] = useState(null)
  const scrollRef = useRef(null)

  const userInfo = getUserInfo()

  useEffect(() => {
    // sub is the googleId of the user
    const query = userQuery(userInfo?.sub)

    myConfiguredSanityClient.fetch(query).then((data) => {
      setUser(data[0])
    })
  }, [userInfo.sub])

  useEffect(() => {  
    scrollRef.current.scrollTo(0, 0)
  }, [])
  
  
  // Opens and closes the sidebar
  const handleSidebarToggle = () => {
    setToggleSidebar(prevToggleState => !prevToggleState)
  }

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user && user}/>
      </div>
      <div className='flex md:hidden flex-row'>
        <div className='p-4 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className='cursor-pointer' onClick={handleSidebarToggle} />
          <Link to='/'>
            <img src={Logo} alt="Logo" className='w-28'/>
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="Logo" className='w-16 rounded-full'/>
          </Link>
        </div>
        {toggleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in animate-slide-out'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={handleSidebarToggle} />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile />} />
          <Route path='/*' element={<Posts user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home