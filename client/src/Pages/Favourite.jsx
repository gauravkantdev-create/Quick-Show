import React from 'react'
import { useUser, SignInButton } from '@clerk/clerk-react'
import useFavourites from '../Lib/useFavourites'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../Components/MovieCard'

const Favourite = () => {
  const { isSignedIn, user } = useUser()
  const { favourites, isFav } = useFavourites()
  const favMovies = dummyShowsData.filter(m => isFav(m))

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

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32 pb-12">
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