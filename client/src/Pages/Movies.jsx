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
    <div className="min-h-screen bg-gray-900 pt-28 sm:pt-32 md:pt-36 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <BlurCircle top='150px' left='0px' />
        <BlurCircle bottom='50px' right='50px' />

        <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">MOVIES YOU MAY LIKE</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {movies.slice(0, 8).map((movie) => (
            <div key={movie.id} className="h-full">
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
};

export default Movies