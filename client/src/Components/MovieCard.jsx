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
    if (path.includes('media-amazon.com')) {
      return path.replace(/_V1_.*\.jpg$/i, '_V1_SX300.jpg');
    }
    return path;
  }
  
  if (path.includes('_V1_') || path.startsWith('MV5')) {
    return `https://m.media-amazon.com/images/M/${path}`;
  }
  
  return `https://image.tmdb.org/t/p/w500${path}`;
};

const PLACEHOLDER_IMG =
"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect fill='%23111' width='300' height='450'/%3E%3Ctext fill='%23666' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

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
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full">
      {/* Poster */}
      <div 
        className="relative aspect-[2/3] overflow-hidden cursor-pointer group"
        onClick={() => {
          navigate(`/movies/${movie.id}`);
          window.scrollTo(0, 0);
        }}
      >
        <img
          src={imgSrc}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMG;
          }}
        />
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-semibold text-sm sm:text-base text-white truncate mb-1">
          {movie.title}
        </h3>

        {/* Info */}
        <p className="text-xs text-gray-400 mb-2 truncate">
          {[releaseYear, genres, runtime].filter(Boolean).join(' • ')}
        </p>

        {/* Price */}
        {movie.showPrice && (
          <p className="text-xs sm:text-sm font-semibold text-primary mb-2">
            ₹{movie.showPrice}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-700">
          <button
            onClick={() => {
              navigate(`/movies/${movie.id}`);
              window.scrollTo(0, 0);
            }}
            className="p-1.5 sm:p-2 bg-primary rounded-full hover:scale-110 transition"
          >
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle(movie);
              }}
              className={`p-1.5 rounded-full transition ${
                isFav(movie)
                  ? 'bg-primary text-black'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            <span className="flex items-center gap-0.5 text-xs text-gray-400">
              <StarIcon className="w-3 h-3 text-primary fill-primary" />
              {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
