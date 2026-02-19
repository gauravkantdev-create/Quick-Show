import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import { Heart, PlayCircle, Star } from 'lucide-react'
import BlurCircle from '../Components/BlurCircle'
import DateSelect from '../Components/DateSelect'
import MovieCard from '../Components/MovieCard'
import Loading from '../Components/Loading'
import useFavourites from '../Lib/useFavourites' 

const timeFormatter = (minutes) => {
  if (!minutes) return 'N/A'
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hrs}h ${mins}m`
}

const MovieDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [show, setShow] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isFav, toggle } = useFavourites()

  useEffect(() => {
    if (!id) return

    setLoading(true)

    const movie = dummyShowsData.find(item => item._id === id)

    if (movie) {
      setShow({
        movie,
        dateTime: dummyDateTimeData,
      })
    } else {
      setShow(null) // 👈 keep loader visible
    }

    setLoading(false)
  }, [id])

  /* -------------------- STATES -------------------- */

  if (loading || !show) {
    return <Loading />   // ✅ ALWAYS show loader
  }

  const { movie, dateTime } = show

  /* -------------------- UI -------------------- */

  return (
    <div className="px-3 sm:px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 pt-24 pb-12">

      {/* Movie Header */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="rounded-xl h-[400px] w-[270px] object-cover shadow-lg"
          />
        </div>

        <div className="relative flex flex-col gap-4 flex-1">
          <BlurCircle top="-100px" left="-100px" />

          <p className="text-primary text-sm font-medium tracking-widest">
            ENGLISH
          </p>

          <h1 className="text-3xl lg:text-4xl font-semibold">
            {movie.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-300">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span>
              {movie.vote_average?.toFixed(1) || 'N/A'} / 10 IMDb
            </span>
          </div>

          <p className="text-gray-300 leading-relaxed">
            {movie.overview}
          </p>

          <p className="text-sm text-gray-400">
            {timeFormatter(movie.runtime)} ·{' '}
            {movie.genres?.map(g => g.name).join(', ') || 'N/A'} ·{' '}
            {movie.release_date?.split('-')[0] || 'N/A'}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-md">
              <PlayCircle className="w-5 h-5" />
              Watch Trailer
            </button>

            <a
              href="#dateSelect"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-md text-center"
            >
              Buy Ticket
            </a>

            <button
              onClick={() => toggle(movie)}
              className={`p-3 rounded-md transition ${isFav(movie) ? 'bg-primary text-black' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cast */}
      <div className="mt-16 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Your Favourite Cast
        </h2>

        {movie.casts?.length ? (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {movie.casts.slice(0, 12).map((cast, index) => (
              <div key={index} className="text-center flex-shrink-0">
                <img
                  src={cast.profile_path || 'https://via.placeholder.com/96'}
                  alt={cast.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-2 border-gray-700"
                />
                <p className="text-sm text-gray-300 truncate max-w-[80px]">
                  {cast.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No cast information available</p>
        )}
      </div>

      {/* Date Selection */}
      <DateSelect dateTime={dateTime} id={id} />

      {/* Recommendations */}
      <p className="text-lg font-medium mt-20 mb-8">
        You May Also Like
      </p>

      <div className="flex flex-wrap gap-8 justify-center sm:justify-start">
        {dummyShowsData.slice(0, 4).map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate('/movies')
            window.scrollTo(0, 0)
          }}
          className="px-10 py-3 bg-primary hover:bg-primary-dull rounded-md font-medium"
        >
          Show More
        </button>
      </div>
    </div>
  )
}

export default MovieDetails
