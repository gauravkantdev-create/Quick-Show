import React, { useState, useEffect } from 'react';
import { api } from '../Lib/api';
import MovieCard from '../Components/MovieCard';
import BlurCircle from '../Components/BlurCircle';
import Loading from '../Components/Loading';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await api.getShows();
        
        if (response.success) {
          const showsArray = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.shows)
              ? response.shows
              : [];

          const uniqueMoviesMap = new Map();
          for (const show of showsArray) {
            const movie = show?.movie;
            if (!movie) continue;
            if (!show?.theater) continue;
            const movieId = movie.id || movie._id || movie.imdbID;
            if (!movieId) continue;
            if (!uniqueMoviesMap.has(movieId)) {
              uniqueMoviesMap.set(movieId, { 
                ...movie, 
                id: movieId,
                showPrice: show.showPrice
              });
            }
          }

          setMovies(Array.from(uniqueMoviesMap.values()));
        } else {
          throw new Error(response.error || 'Failed to fetch movies');
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-white">Error Loading Movies</h2>
          <p className="mb-6 text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return movies.length > 0 ? (
    <div className="min-h-screen bg-gray-900 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        <BlurCircle top='150px' left='0px' />
        <BlurCircle bottom='50px' right='50px' />

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-white">
          MOVIES YOU MAY LIKE
        </h1>
        
        {/* Responsive Grid - works on all screen sizes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {movies.slice(0, 8).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <h1 className="text-base sm:text-lg md:text-xl text-gray-400 text-center">No Movies Found</h1>
    </div>
  );
};

export default Movies;
