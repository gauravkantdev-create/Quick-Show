import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import backgroundImageFallback from '../assets/backgroundImage.png';
import { api } from '../Lib/api';
import timefFormat from '../Lib/TimefFormat';

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const HeroSection = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showsCount, setShowsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch full movie details from OMDB
  const fetchMovieDetails = async (imdbId) => {
    if (!imdbId || !OMDB_API_KEY) return null;
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`
      );
      const data = await res.json();
      if (data.Response === 'True') {
        return data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching movie details:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchFirstMovie = async () => {
      try {
        const response = await api.getShows();
        if (response.success && response.data && response.data.length > 0) {
          setShowsCount(response.data.length);
          const firstShow = response.data[0];
          if (firstShow && firstShow.movie) {
            const basicMovie = firstShow.movie;
            
            // Fetch full details if we have an imdbID
            if (basicMovie.id && basicMovie.id.startsWith('tt')) {
              const fullDetails = await fetchMovieDetails(basicMovie.id);
              if (fullDetails) {
                // Merge OMDB data with stored data
                setMovie({
                  ...basicMovie,
                  title: fullDetails.Title || basicMovie.title,
                  poster: fullDetails.Poster !== 'N/A' ? fullDetails.Poster : basicMovie.poster,
                  backdrop_path: fullDetails.Poster !== 'N/A' ? fullDetails.Poster : basicMovie.poster,
                  poster_path: fullDetails.Poster !== 'N/A' ? fullDetails.Poster : basicMovie.poster,
                  release_date: fullDetails.Released !== 'N/A' ? new Date(fullDetails.Released).toISOString() : null,
                  runtime: fullDetails.Runtime !== 'N/A' ? parseInt(fullDetails.Runtime) : null,
                  genres: fullDetails.Genre !== 'N/A' ? fullDetails.Genre.split(', ') : [],
                  overview: fullDetails.Plot !== 'N/A' ? fullDetails.Plot : null,
                  description: fullDetails.Plot !== 'N/A' ? fullDetails.Plot : null,
                  year: fullDetails.Year !== 'N/A' ? fullDetails.Year : null,
                  imdbRating: fullDetails.imdbRating !== 'N/A' ? fullDetails.imdbRating : null,
                });
              } else {
                setMovie(basicMovie);
              }
            } else {
              setMovie(basicMovie);
            }
          }
        } else {
          setShowsCount(0);
        }
      } catch (err) {
        console.error("Error fetching hero movie", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFirstMovie();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) {
      // Transform OMDB/Amazon low-res posters to full resolution
      if (path.includes('media-amazon.com') && path.includes('_V1_')) {
        return path.replace(/_V1_.*\.jpg$/i, '_V1_.jpg');
      }
      return path;
    }
    return `https://image.tmdb.org/t/p/original${path}`;
  };

  const bgImage = movie
    ? (getImageUrl(movie.backdrop_path) || getImageUrl(movie.poster_path) || backgroundImageFallback)
    : backgroundImageFallback;

  const titleLines = movie?.title ? movie.title.split(' ') : ['Now', 'Showing'];
  const titleLine1 = titleLines.slice(0, Math.ceil(titleLines.length/2)).join(' ');
  const titleLine2 = titleLines.slice(Math.ceil(titleLines.length/2)).join(' ');
  
  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : '';
    
  const genres = movie?.genres
    ? movie.genres.map(g => typeof g === 'object' ? g.name : String(g)).filter(Boolean).slice(0, 3).join(' | ')
    : '';
    
  const duration = movie?.runtime
    ? timefFormat(movie.runtime) + ' min'
    : '';

  return (
    <div className='relative h-screen overflow-hidden bg-black'>
      {/* Full Background Image - No Crop, Show Complete Image */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <img 
          src={bgImage} 
          alt={movie?.title || 'Movie'} 
          className="w-full h-full object-contain"
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
          }}
        />
      </div>
      
      {/* Light Gradient Overlay - Only for text readability */}
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      
      {/* Subtle Bottom Fade for transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      
      {/* Content Container */}
      <div className='relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-24 xl:px-36'>
        <div className='max-w-4xl'>
          {/* Live Shows Badge */}
          <div className='flex items-center gap-3 mb-3 sm:mb-4 md:mb-6'>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <p className='text-red-400 font-semibold tracking-wider text-[10px] sm:text-xs uppercase'>Live Shows</p>
            </div>
            <span className='text-[10px] sm:text-xs bg-white/5 backdrop-blur-sm text-white/80 px-3 py-1.5 rounded-full border border-white/10'>
              {showsCount} Active
            </span>
          </div>
          
          {/* Movie Title with Glow Effect */}
          <div className="relative mb-4 sm:mb-5 md:mb-6">
            <h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.9] tracking-tight drop-shadow-2xl'>
              {titleLine1}
            </h1>
            <h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.9] tracking-tight drop-shadow-2xl mt-1 sm:mt-2'>
              {titleLine2}
            </h1>
          </div>
          
          {/* Movie Info Pills */}
          <div className='flex flex-wrap items-center gap-2 sm:gap-3 mb-5 sm:mb-6 md:mb-8'>
            {genres && (
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 text-[10px] sm:text-xs rounded-full border border-white/10">
                {genres}
              </span>
            )}
            {releaseYear && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 text-[10px] sm:text-xs rounded-full border border-white/10">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {releaseYear}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 text-[10px] sm:text-xs rounded-full border border-white/10">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {duration}
              </span>
            )}
          </div>
          
          {/* Description with Better Typography */}
          <p className='max-w-xl text-white/70 text-xs sm:text-sm md:text-base mb-6 sm:mb-7 md:mb-10 leading-relaxed line-clamp-3 font-light'>
            {movie?.overview || movie?.description || "Book tickets from active OMDB shows."}
          </p>
          
          {/* Enhanced Button */}
          <div className='flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4'>
            <button 
              onClick={() => {
                if (movie?.id) {
                  navigate(`/movies/${movie.id}`);
                } else {
                  navigate('/movies');
                }
              }}
              className='group relative bg-red-600 hover:bg-red-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl flex items-center justify-center sm:justify-start gap-3 transition-all duration-300 text-sm sm:text-base font-semibold w-full sm:w-auto shadow-lg shadow-red-600/25 hover:shadow-red-500/40 hover:-translate-y-0.5 overflow-hidden'
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span>Book Tickets</span>
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-300' />
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Fade Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default HeroSection;
