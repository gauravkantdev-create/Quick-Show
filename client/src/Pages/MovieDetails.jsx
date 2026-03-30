import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from '../Components/Loading'
import { api } from '../Lib/api'

const MovieDetails = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [shows, setShows] = useState([])
  const [allTheaters, setAllTheaters] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedTheater, setSelectedTheater] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {

    const fetchShows = async () => {

      try {

        const [showsRes, theatersRes] = await Promise.all([
          api.getShows(),
          api.getTheaters(),
        ])

        const showsArray = Array.isArray(showsRes?.data)
          ? showsRes.data
          : Array.isArray(showsRes?.shows)
            ? showsRes.shows
            : []

        const filteredShows = showsArray.filter((show) => {
          const movie = show?.movie
          const showMovieId = movie?.id || movie?._id || movie?.imdbID
          if (!showMovieId) return false
          return String(showMovieId) === String(id)
        })

        setShows(filteredShows)
        setAllTheaters(theatersRes.success ? theatersRes.data || [] : [])

      } catch (error) {

        console.error(error)

      } finally {

        setLoading(false)

      }

    }

    fetchShows()

  }, [id])


  /* Get theaters */

  const theaters = [
    ...new Map(
      shows.map((show) => {
        const theaterId =
          typeof show?.theater === "object"
            ? show.theater?._id
            : show?.theater;
        const theaterData =
          typeof show?.theater === "object"
            ? show.theater
            : allTheaters.find((theater) => theater._id === show?.theater);

        return [theaterId, theaterData];
      })
      .filter(([theaterId, theaterData]) => theaterId && theaterData)
    ).values()
  ]


  /* Filter shows by theater */

  const filteredShows = shows.filter((show) => {
    const theaterId =
      typeof show?.theater === "object"
        ? show.theater?._id
        : show?.theater;
    return theaterId === selectedTheater?._id;
  })

  useEffect(() => {
    if (loading) return
    if (!selectedTheater && theaters.length > 0) {
      setSelectedTheater(theaters[0])
    }
  }, [theaters, selectedTheater, loading])


  if (loading) return <Loading />


  /* Get Dates */

  const dates = [
    ...new Set(
      filteredShows.map(show =>
        new Date(show.showDateTime)
          .toISOString()
          .split("T")[0]
      )
    )
  ]


  return (

    <div className="min-h-screen pt-28 sm:pt-32 md:pt-36 px-4 sm:px-6 md:px-12 lg:px-16 text-white pb-20">

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
        Select Theater
      </h1>

      {/* Theater Selection */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10">


        {theaters.map(theater => (

          <button
            key={theater._id}

            onClick={() => {
              setSelectedTheater(theater)
              setSelectedDate(null)
            }}

            className={`px-5 py-3 rounded-lg transition

            ${
              selectedTheater?._id === theater._id
              ? "bg-primary"
              : "bg-gray-800"
            }
            
            `}

          >

            {theater.name}

          </button>

        ))}

      </div>


      {/* Date Selection */}
      {selectedTheater && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
            Select Date
          </h2>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-8 sm:mb-10">
            {dates.map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm transition-all duration-300 transform hover:scale-105
                ${
                  selectedDate === date
                  ? "bg-primary shadow-lg shadow-primary/20 scale-105"
                  : "bg-gray-800/80 hover:bg-gray-700 border border-white/5"
                }
                `}
              >
                {new Date(date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Time Selection */}
      {selectedDate && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
            Select Time
          </h2>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
            {filteredShows
              .filter(show =>
                new Date(show.showDateTime)
                  .toISOString()
                  .split("T")[0] === selectedDate
              )
              .map(show => {
                const time = new Date(show.showDateTime)
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })

                return (
                  <button
                    key={show._id}
                    onClick={() => navigate(`/seat/${show._id}`)}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-800/80 border border-white/5 rounded-xl hover:bg-primary transition-all duration-300 transform hover:translate-y--1 hover:shadow-lg hover:shadow-primary/20 text-sm sm:text-base font-medium"
                  >
                    {time}
                  </button>
                )
              })}
          </div>
        </div>
      )}


    </div>

  )

}

export default MovieDetails