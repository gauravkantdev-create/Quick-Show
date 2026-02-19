import React from 'react'
import HeroSection from '../Components/HeroSection'
import FeaturedSection from '../Components/FeaturedSection'
import TrailerSection from '../Components/TrailerSection'

const Home = () => {
  return (
    <>
      <HeroSection/>
      <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16">
        <FeaturedSection/>
        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16">
          <TrailerSection/>
        </div>
      </div>
    </>
  )
}

export default Home