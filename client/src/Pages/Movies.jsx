import React from 'react';
import { dummyShowsData } from '../assets/assets';
import MovieCard from '../Components/MovieCard';
import BlurCircle from '../Components/BlurCircle';

const Movies = () => {
  return dummyShowsData.length > 0 ? (
    <div className="min-h-screen bg-gray-900 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12 px-3 sm:px-4 md:px-6 lg:px-8 relative overflow-hidden">
   
      
      <div className="max-w-7xl mx-auto relative z-10">

      <BlurCircle  top='150px' left='0px'  />
      <BlurCircle   bottom='50px' right='50px' />


        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">Now Playing</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {dummyShowsData.slice(0, 8).map((movie) => (
            <div key={movie._id} className="h-full">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <h1 className="text-base sm:text-lg md:text-xl text-gray-400 text-center">No Movies Found</h1>
    </div>
  );
}

export default Movies