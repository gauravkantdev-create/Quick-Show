import { StarIcon, Heart, ArrowRight } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import timefFormat from '../Lib/TimefFormat';
import useFavourites from '../Lib/useFavourites';

// Normalize image URL
const getImageUrl = (path) => {
  if (!path) return null;
  if (String(path).trim().toUpperCase() === 'N/A') return null;
  if (path.startsWith('http')) {
    if (path.includes('media-amazon.com') && path.includes('_V1_')) {
      return path.replace(/_V1_.*\.jpg$/i, '_V1_.jpg');
    }
    return path;
  }
  return `https://image.tmdb.org/t/p/w500${path}`;
};

const PLACEHOLDER_IMG =
"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='280' viewBox='0 0 500 280'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%231a1a2e'/%3E%3Cstop offset='100%25' stop-color='%2316213e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='500' height='280'/%3E%3Ctext fill='%23555' font-family='Arial' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

const MovieCard = ({ movie = {} }) => {

  const navigate = useNavigate();
  const { isFav, toggle } = useFavourites();

  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : '';

  const genres = movie?.genres?.length > 0
    ? movie.genres
        .slice(0, 2)
        .map((genre) =>
          typeof genre === 'object'
            ? genre?.name || ''
            : String(genre || '')
        )
        .filter(Boolean)
        .join(' | ')
    : '';

  const runtime = movie.runtime
    ? timefFormat(movie.runtime) + ' min'
    : '';

  const imgSrc =
    getImageUrl(movie.poster) ||
    getImageUrl(movie.poster_path) ||
    getImageUrl(movie.backdrop_path) ||
    PLACEHOLDER_IMG;

  return (
    <>
      <div className='flex flex-col justify-between p-2 sm:p-3 md:p-4 bg-gray-800 rounded-xl sm:rounded-2xl hover:-translate-y-1 transition duration-300 w-full max-w-sm mx-auto'>

        {/* Poster */}
        <div className='relative w-full rounded-lg overflow-hidden group cursor-pointer'>
          <img
            onClick={() => {
              navigate(`/movies/${movie.id}`);
              window.scrollTo(0, 0);
            }}
            src={imgSrc}
            alt={movie.title}
            className='aspect-[16/10] md:aspect-[3/4] lg:aspect-[2/3] w-full object-cover object-top transition duration-300 group-hover:scale-105 rounded-lg'
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMG;
            }}
          />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between gap-2 mt-2 sm:mt-3">
          <p className='font-semibold truncate text-sm sm:text-base md:text-lg flex-1'>
            {movie.title}
          </p>
          {movie.showPrice && (
            <span className="shrink-0 px-2 py-1 bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-full border border-white/20">
              ₹{movie.showPrice}
            </span>
          )}
        </div>

        {/* Info */}
        <p className='text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 leading-relaxed'>
          {[releaseYear, genres, runtime]
            .filter(Boolean)
            .join(' • ')}
        </p>

        {/* Bottom Section */}
        <div className='flex items-center justify-between mt-3 sm:mt-4 pb-2 sm:pb-3'>

          {/* Arrow Button */}
          <button
            onClick={() => {
              navigate(`/movies/${movie.id}`);
              window.scrollTo(0, 0);
            }}
            className='p-2 sm:p-2.5 bg-primary rounded-full 
            hover:scale-110 hover:shadow-lg 
            transition duration-200 cursor-pointer'
          >
            <ArrowRight className='w-4 h-4 text-white' />
          </button>

          {/* Right Controls */}
          <div className='flex items-center gap-3'>

            {/* Favourite */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle(movie);
              }}
              className={`p-2 rounded-full transition ${
                isFav(movie)
                  ? 'bg-primary text-black'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              <Heart className='w-4 h-4' />
            </button>

            {/* Rating */}
            <p className='flex items-center gap-1 text-xs sm:text-sm text-gray-400 mt-1 pr-1'>
              <StarIcon className='w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary' />
              {movie.vote_average
                ? movie.vote_average.toFixed(1)
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

    </>
  );
};

export default MovieCard;