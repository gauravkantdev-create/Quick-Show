import React from 'react'
import { useEffect, useState } from 'react'
import { useUser, SignInButton } from '@clerk/clerk-react'
import useFavourites from '../Lib/useFavourites'
import MovieCard from '../Components/MovieCard'
import { api } from '../Lib/api'
import Loading from '../Components/Loading'

const Favourite = () => {
  const { isSignedIn, user } = useUser()
  const { favourites, isFav } = useFavourites()
  const [allMovies, setAllMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.getShows()
        const showsArray = Array.isArray(response.data) ? response.data : []

        const uniqueMoviesMap = new Map()
        for (const show of showsArray) {
          const movie = show?.movie
          if (!movie) continue
          const movieId = movie.id || movie._id || movie.imdbID
          if (!movieId) continue
          if (!uniqueMoviesMap.has(movieId)) {
            uniqueMoviesMap.set(movieId, { 
              ...movie, 
              id: movieId,
              showPrice: show.showPrice
            })
          }
        }
        setAllMovies(Array.from(uniqueMoviesMap.values()))
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const favMovies = allMovies.filter((m) => isFav(m))

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-md w-full">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-white">Please sign in to view your favourites</h2>
          <SignInButton mode="modal">
            <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary hover:bg-primary-dull text-white rounded-lg transition font-medium w-full text-sm sm:text-base">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    )
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen pt-28 sm:pt-32 md:pt-36 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32 pb-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">My Favourites</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-300">Welcome <span className="font-semibold text-primary">{user?.firstName}</span>! Your favourite movies will appear here.</p>

        {favMovies.length === 0 ? (
          <p className="mt-6 text-sm text-gray-400">You don't have any favourites yet. Browse movies and mark them with the heart icon to save them here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {favMovies.map(movie => (
              <MovieCard key={movie._id || movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favourite