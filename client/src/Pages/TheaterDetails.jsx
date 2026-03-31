import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const TheaterDetails = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [theater, setTheater] = useState(null)
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedDate, setSelectedDate] = useState(null)

  // Auto-select first available date when shows load
  useEffect(() => {
    if (shows.length > 0 && !selectedDate) {
      const firstDate = new Date(shows[0].showDateTime).toISOString().split('T')[0]
      setSelectedDate(firstDate)
    }
  }, [shows])

  useEffect(() => {

    const fetchData = async () => {

      try {

        const theaterRes = await fetch(`http://localhost:3000/api/theaters/${id}`)
        const theaterData = await theaterRes.json()
        setTheater(theaterData.data)

        const showRes = await fetch(`http://localhost:3000/api/shows/theater/${id}`)
        const showData = await showRes.json()
        setShows(showData.data || [])

      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }

    }

    fetchData()

  }, [id])


  /* Group Shows */

  const groupedShows = Object.values(
    shows.reduce((acc, show) => {

      const movieId = show.movie.id

      if (!acc[movieId]) {
        acc[movieId] = {
          movie: show.movie,
          shows: []
        }
      }

      acc[movieId].shows.push(show)

      return acc

    }, {})
  )


  if (loading) {
    return (
      <div className="text-white pt-32 text-center">
        Loading...
      </div>
    )
  }


  return (

    <div className="pt-24 sm:pt-28 text-white min-h-screen bg-[#020617]">

      {/* HERO BANNER */}

      <div className="relative h-[260px] md:h-[320px] w-full overflow-hidden">

        <img
          src={
            theater?.image ||
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
          }
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="absolute bottom-6 left-6 md:left-16">

          <h1 className="text-3xl md:text-4xl font-bold">
            {theater?.name}
          </h1>

          <div className="flex gap-6 mt-2 text-gray-300">

            <p>📍 {theater?.location}</p>

            <p>🎬 {theater?.screens} Screens</p>

          </div>

        </div>

      </div>


      {/* CONTENT */}

      <div className="px-4 sm:px-6 md:px-16 pt-6 sm:pt-10">

        <h2 className="text-2xl font-semibold mb-6">
          Shows 🎬
        </h2>


        <div className="space-y-6">

          {groupedShows.map(group => (

            <div
              key={group.movie.id}
              className="relative rounded-xl overflow-hidden border border-gray-800 hover:border-primary transition"
            >

              {/* Background */}

              <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{
                  backgroundImage: `url(${group.movie.poster})`
                }}
              />

              <div className="relative bg-gradient-to-r from-black/90 to-black/40 p-6">

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">

                  {/* Poster */}

                  <img
                    src={group.movie.poster}
                    alt=""
                    className="w-24 h-36 sm:w-28 sm:h-40 rounded-lg object-cover shadow-lg shrink-0"
                  />


                  {/* Movie Info */}

                  <div className="flex-1">

                    <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                      {group.movie.title}
                    </h3>

                    <div className="flex gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 mb-4">
                      <span>2D</span>
                      <span>Dolby</span>
                      <span>Hindi</span>
                    </div>


                    {/* DATE SELECT */}

                    <div className="flex gap-2 sm:gap-3 mb-4 flex-wrap">

                      {[...new Set(group.shows.map(show =>
                        new Date(show.showDateTime)
                          .toISOString().split('T')[0]
                      ))].map(date => (

                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}

                          className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition

                          ${
                            selectedDate === date
                              ? "bg-primary"
                              : "bg-gray-800"
                          }`}
                        >

                          {new Date(date).toLocaleDateString()}

                        </button>

                      ))}

                    </div>


                    {/* TIME SELECT */}

                    {selectedDate && (

                      <div className="flex gap-2 sm:gap-3 mb-4 flex-wrap">

                        {group.shows
                          .filter(show =>
                            new Date(show.showDateTime)
                              .toISOString().split('T')[0] === selectedDate
                          )
                          .map(show => {

                            const time = new Date(show.showDateTime)
                              .toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })

                            const date = new Date(show.showDateTime)
                              .toISOString().split('T')[0]

                            return (

                              <button
                                key={show._id}

                                onClick={() =>
                                  navigate(`/seat/${show._id}`)
                                }

                                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition
                                bg-gray-800 hover:bg-primary"
                              >

                                {time}

                              </button>

                            )

                          })}

                      </div>

                    )}

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )
}

export default TheaterDetails