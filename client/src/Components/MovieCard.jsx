import { StarIcon, Heart } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import timefFormat from '../Lib/TimefFormat';
import useFavourites from '../Lib/useFavourites';

const MovieCard = ({ movie = {} }) => {
  const navigate = useNavigate();
  const { isFav, toggle } = useFavourites();
  
  // Safely get the release year
  const releaseYear = movie?.release_date ? new Date(movie.release_date).getFullYear() : '';
  
  // Safely handle genres with proper null checks
  const genres = movie?.genres?.length > 0
    ? movie.genres.slice(0, 2).map(genre => 
        typeof genre === 'object' ? (genre?.name || '') : String(genre || '')
      ).filter(Boolean).join(' | ')
    : '';
  
  // Format runtime if available
  const runtime = movie.runtime ? timefFormat(movie.runtime) + ' min' : '';

  return (
    <div className='flex flex-col justify-between p-2 sm:p-3 md:p-4 bg-gray-800 rounded-xl sm:rounded-2xl hover:-translate-y-1 transition duration-300 w-full max-w-sm mx-auto'>
      <img  
        onClick={() => { 
          navigate(`/movies/${movie.id}`); 
          window.scrollTo(0, 0);
        }}
        src={movie.backdrop_path || movie.poster_path} 
        alt={movie.title}  
        className='rounded-lg h-40 sm:h-48 md:h-52 lg:h-56 w-full object-cover object-center cursor-pointer'
      />
         
      <p className='font-semibold mt-2 sm:mt-3 truncate text-sm sm:text-base md:text-lg'>
        {movie.title}
      </p>
      
      <p className='text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 leading-relaxed'>
        {[releaseYear, genres, runtime].filter(Boolean).join(' • ')}
      </p>

      <div className='flex items-center justify-between mt-3 sm:mt-4 pb-2 sm:pb-3'>
        <button 
          onClick={() => {
            navigate(`/movies/${movie.id}`); 
            window.scrollTo(0, 0);
          }}
          className='px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'
        >
          Buy Tickets
        </button>

        <div className='flex items-center gap-3'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle(movie);
            }}
            aria-label={isFav(movie) ? 'Remove from favourites' : 'Add to favourites'}
            className={`p-2 rounded-full transition ${isFav(movie) ? 'bg-primary text-black' : 'bg-gray-800 text-gray-300'}`}
          >
            <Heart className='w-4 h-4' />
          </button>

          <p className='flex items-center gap-1 text-xs sm:text-sm text-gray-400 mt-1 pr-1'>
            <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;