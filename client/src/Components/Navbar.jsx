import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Menu, Search, X, User, Calendar } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { isSignedIn, user } = useUser()
  const navigate = useNavigate()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-3 sm:px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 py-2.5 sm:py-3 md:py-4 bg-black/40 backdrop-blur">

      {/* Logo */}
      <Link
        to="/"
        onClick={scrollToTop}
        className="flex-shrink-0 z-60 flex items-center gap-2"
      >
        <img 
          src="/favicon.svg" 
          alt="Quick Show Logo" 
          className="w-8 h-8 sm:w-10 sm:h-10" 
        />
        <span className="text-white text-xl sm:text-2xl font-bold">Quick Show</span>
      </Link>

      {/* Desktop Menu Links */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-8 px-6 xl:px-8 py-3 rounded-full backdrop-blur bg-white/10 border border-gray-300/20">
        <Link onClick={scrollToTop} to="/" className="text-white hover:text-gray-300 transition-colors font-medium">Home</Link>
        <Link onClick={scrollToTop} to="/movies" className="text-white hover:text-gray-300 transition-colors font-medium">Movies</Link>
        <Link onClick={scrollToTop} to="/theaters" className="text-white hover:text-gray-300 transition-colors font-medium">Theaters</Link>
        <Link onClick={scrollToTop} to="/releases" className="text-white hover:text-gray-300 transition-colors font-medium">Releases</Link>
        <Link onClick={scrollToTop} to="/favourite" className="text-white hover:text-gray-300 transition-colors font-medium">Favourites</Link>
      </div>

      {/* Mobile/Tablet Menu Overlay */}
      <div
        className={`
          ${open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          lg:hidden fixed top-0 right-0 h-screen w-full sm:w-80 md:w-96
          flex flex-col items-center justify-center gap-6 sm:gap-8
          backdrop-blur-md bg-black/90 sm:bg-black/80
          transition-all duration-300 ease-in-out z-50
        `}
      >
        <X
          onClick={() => setOpen(false)}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 w-6 h-6 sm:w-7 sm:h-7 cursor-pointer text-white hover:text-gray-300 transition-colors"
        />

        <div className="flex flex-col items-center gap-6 sm:gap-8 text-center">
          <Link onClick={() => { setOpen(false); scrollToTop() }} to="/" className="text-white text-lg sm:text-xl font-medium hover:text-gray-300 transition-colors">Home</Link>
          <Link onClick={() => { setOpen(false); scrollToTop() }} to="/movies" className="text-white text-lg sm:text-xl font-medium hover:text-gray-300 transition-colors">Movies</Link>
          <Link onClick={() => { setOpen(false); scrollToTop() }} to="/theaters" className="text-white text-lg sm:text-xl font-medium hover:text-gray-300 transition-colors">Theaters</Link>
          <Link onClick={() => { setOpen(false); scrollToTop() }} to="/releases" className="text-white text-lg sm:text-xl font-medium hover:text-gray-300 transition-colors">Releases</Link>
          <Link onClick={() => { setOpen(false); scrollToTop() }} to="/favourite" className="text-white text-lg sm:text-xl font-medium hover:text-gray-300 transition-colors">Favourites</Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        <Search className="hidden md:block w-5 h-5 lg:w-6 lg:h-6 cursor-pointer text-white hover:text-gray-300 transition-colors" />

        {/* Authentication Section */}
        {isSignedIn ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:block text-white text-xs sm:text-sm lg:text-base">
              Hi, {user?.firstName || 'User'}
            </span>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9"
                }
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Action 
                  label="My Bookings"
                  labelIcon={<Calendar size={16} />}
                  onClick={() => navigate('/my-bookings')}
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <SignInButton 
              mode="modal"
              appearance={{
                elements: {
                  modalContent: "bg-white",
                  headerTitle: "Welcome back",
                  headerSubtitle: "Sign in with email, phone, or social accounts"
                }
              }}
            >
              <button className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm lg:text-base bg-primary hover:bg-primary-dull transition rounded-full font-medium">
                Login
              </button>
            </SignInButton>
            <SignUpButton 
              mode="modal"
              appearance={{
                elements: {
                  modalContent: "bg-white",
                  headerTitle: "Create your account",
                  headerSubtitle: "Sign up with email, phone (+91), or social accounts"
                }
              }}
            >
              <button className="hidden sm:block px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm lg:text-base border border-white/30 hover:bg-white/10 transition rounded-full font-medium text-white">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        )}

        <Menu
          onClick={() => setOpen(true)}
          className="lg:hidden w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 cursor-pointer text-white hover:text-gray-300 transition-colors"
        />
      </div>
    </div>
  )
}

export default Navbar
