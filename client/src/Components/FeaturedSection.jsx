import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'

const FeaturedSection = () => {
  const navigate = useNavigate()

  const dummyShowsData = [
    {
      id: 1,
      title: "Avengers: Endgame",
      backdrop_path: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      genre: [{name: "Action"}, {name: "Adventure"}],
      release_date: "2024-01-15",
      runtime: 120,
      vote_average: 8.5
    },
    {
      id: 2,
      title: "The Dark Knight",
      backdrop_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      genre: [{name: "Drama"}, {name: "Action"}],
      release_date: "2024-02-20",
      runtime: 105,
      vote_average: 7.8
    },
    {
      id: 3,
      title: "Spider-Man",
      backdrop_path: "https://image.tmdb.org/t/p/w500/gh4cZbhZxyTbgxQPxD0dOudNPTn.jpg",
      genre: [{name: "Action"}, {name: "Adventure"}],
      release_date: "2024-03-10",
      runtime: 95,
      vote_average: 6.9
    },
    {
      id: 4,
      title: "Inception",
      backdrop_path: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      genre: [{name: "Thriller"}, {name: "Sci-Fi"}],
      release_date: "2024-04-05",
      runtime: 110,
      vote_average: 8.2
    }
  ]

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
 
  {/* mounting the dummy movies data  */}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-4 sm:mt-6 md:mt-8'>
        {dummyShowsData.slice(0, 4).map((show) => (
          <MovieCard key={show.id} movie={show} />
        ))}
      </div>

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
