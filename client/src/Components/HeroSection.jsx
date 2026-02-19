import React from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { featuredMovie } from '../assets/assets';
import backgroundImage from '../assets/backgroundImage.png';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className='relative h-screen overflow-hidden'>
      {/* Background Image with Overlay */}
      <div 
        className='absolute inset-0 bg-cover bg-center z-0'
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5)'
        }}
      />
      
      {/* Content */}
      <div className='relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-24 xl:px-36'>
        <div className='max-w-4xl'>
          <img 
            src={featuredMovie.marvelLogo}
            alt="Marvel" 
            className='h-6 sm:h-7 md:h-10 lg:h-12 mb-2 sm:mb-3 md:mb-4 w-auto'
          />
          
          <h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight'>
            {featuredMovie.title.split(' ').slice(0, 1).join(' ')} <br /> {featuredMovie.title.split(' ').slice(1).join(' ')}
          </h1>
          
          <div className='flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-gray-300 mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm md:text-base'>
            <span className='truncate'>{featuredMovie.genres.join(' | ')}</span>
            <div className='flex items-center gap-1'>
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> {featuredMovie.year}
            </div>
            <div className='flex items-center gap-1'>
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> {featuredMovie.duration}
            </div>
          </div>
          
          <p className='max-w-2xl text-gray-200 text-sm sm:text-base md:text-lg mb-6 sm:mb-7 md:mb-8 leading-relaxed'>
            {featuredMovie.description}
          </p>
          
          <div className='flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4'>
            <button 
              onClick={() => navigate('/ticket-booking')} 
              className='bg-red-600 hover:bg-red-700 text-white px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 rounded-md flex items-center justify-center sm:justify-start gap-2 transition-colors duration-300 text-sm sm:text-base md:text-lg font-medium w-full sm:w-auto'
            >
              Book Tickets <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5' />
            </button>
            
            <button 
              onClick={() => navigate('/movies')}  
              className='bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 rounded-md flex items-center justify-center gap-2 transition-colors duration-300 text-sm sm:text-base md:text-lg w-full sm:w-auto'
            >
              Watch Trailer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
