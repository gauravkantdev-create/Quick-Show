import { ArrowRight } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import Loading from './Loading'
import MovieCard from './MovieCard'
import { api } from '../Lib/api'

const FeaturedSection = () => {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.getShows();
        if (response.success) {
          const showsArray = Array.isArray(response.data) ? response.data : 
                             Array.isArray(response.shows) ? response.shows : [];
                             
          const uniqueMoviesMap = new Map();
          for (const show of showsArray) {
            const movie = show?.movie;
            if (!movie) continue;
            // Only include shows with valid theater assignments
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
        }
      } catch (err) {
        console.error('Error fetching featured movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className='px-3 sm:px-4 md:px-6 lg:px-8 xl:px-16 2xl:px-24 overflow-hidden'>

      <div className='relative flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 sm:pt-10 md:pt-12 lg:pt-16 pb-4 sm:pb-6 md:pb-8 gap-3 sm:gap-0'>
        <BlurCircle top='0' right='-80px' />

        <p className='text-gray-300 font-medium text-sm sm:text-base md:text-lg'>
          Now Showing
        </p>

        <button
          onClick={() => navigate('/movies')}
          className='group flex items-center gap-2 text-xs sm:text-sm text-gray-300 cursor-pointer hover:text-white transition-colors'
        >
          View All
          <ArrowRight className='group-hover:translate-x-0.5 transition w-3 h-3 sm:w-4 sm:h-4' />
        </button>
      </div>
 
      {loading ? (
        <div className="flex justify-center mt-8">
          <Loading />
        </div>
      ) : movies.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-4 sm:mt-6 md:mt-8'>
          {movies.slice(0, 4).map((show) => (
            <MovieCard key={show.id} movie={show} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-8">No shows available.</div>
      )}

      <div className='flex justify-center mt-8 sm:mt-10 md:mt-12 lg:mt-16'>
        <button
          onClick={() => {
            navigate('/movies')
            window.scrollTo(0, 0)
          }}
          className='px-6 sm:px-8 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer w-full sm:w-auto max-w-xs'
        >
          Show More
        </button>
      </div>

    </div>
  )
}

export default FeaturedSection
