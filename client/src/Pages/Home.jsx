import React from 'react'
import HeroSection from '../Components/HeroSection'
import FeaturedSection from '../Components/FeaturedSection'

const Home = () => {
  return (
    <div className="bg-black text-white">
      <HeroSection />
      <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 pb-10">
        <FeaturedSection />
      </div>
    </div>
  )
}

export default Home