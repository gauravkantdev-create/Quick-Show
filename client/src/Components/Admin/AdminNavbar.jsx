import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import { UserButton } from '@clerk/clerk-react'

const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30'>
      <Link to='/'>
        <img src={logo} alt="logo" className='w-36 h-auto cursor-pointer hover:opacity-80 transition-opacity'/>
      </Link>
      <div className='flex items-center gap-4'>
        <span className='text-sm text-gray-600'>Admin Panel</span>
        <UserButton afterSignOutUrl='/' />
      </div>
    </div>
  )
}

export default AdminNavbar