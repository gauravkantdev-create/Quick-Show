import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const TheaterDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [theater, setTheater] = useState(null)
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)

  // Auto-select first available date when shows load
  useEffect(() => {
    console.log('Shows loaded:', shows.length)
    if (shows.length > 0 && !selectedDate) {
      const firstDate = new Date(shows[0].showDateTime).toISOString().split('T')[0]
      console.log('Auto-selecting date:', firstDate)
      setSelectedDate(firstDate)
    }
  }, [shows, selectedDate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const theaterRes = await fetch(`${API_URL}/theaters/${id}`)
        const theaterData = await theaterRes.json()
        setTheater(theaterData.data)

        const showRes = await fetch(`${API_URL}/shows/theater/${id}`)
        const showData = await showRes.json()
        console.log('Shows API response:', showData)
        console.log('Shows data array:', showData.data)
        console.log('Shows data length:', showData.data?.length)
        setShows(showData.data || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  /* Group Shows by Movie */
  const groupedShows = useMemo(() => {
    console.log('Computing groupedShows from', shows.length, 'shows')
    const grouped = Object.values(
      shows.reduce((acc, show) => {
        if (!show.movie) {
          console.log('Show missing movie, skipping:', show._id)
          return acc
        }
        const movieId = show.movie.id || show.movie._id
        if (!movieId) {
          console.log('Show missing movie ID, skipping:', show._id)
          return acc
        }

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
    console.log('Computed grouped shows:', grouped.length)
    return grouped
  }, [shows])

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
          src={theater?.image || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 md:left-16">
          <h1 className="text-3xl md:text-4xl font-bold">{theater?.name}</h1>
          <div className="flex gap-6 mt-2 text-gray-300">
            <p>📍 {theater?.location}</p>
            <p>🎬 {theater?.screens} Screens</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-6 md:px-16 pt-6 sm:pt-10">
        <h2 className="text-2xl font-semibold mb-6">Shows 🎬</h2>

        <div className="space-y-6 min-h-[200px] border border-dashed border-gray-700 rounded-lg p-4">
          <p className="text-gray-500 text-sm mb-4">Debug: Found {groupedShows.length} movies</p>
          {groupedShows.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl">
              <p className="text-gray-400 text-lg">No shows available for this theater</p>
              <p className="text-gray-500 text-sm mt-2">Check back later or try another theater</p>
            </div>
          ) : (
            groupedShows.map(group => (
              <div
                key={group.movie.id || group.movie._id}
                className="relative rounded-xl overflow-hidden border-2 border-white bg-gray-800"
              >
                {/* Background - removed to test visibility */}
                {/* Content container */}
                <div className="p-4 sm:p-6 bg-gray-800/90">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center bg-gray-800/50 p-4 rounded-lg">
                    {/* Poster */}
                    <img
                      src={group.movie.poster}
                      alt=""
                      className="w-20 h-28 sm:w-24 sm:h-36 rounded-lg object-cover shadow-lg shrink-0"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='150'%3E%3Crect fill='%23333' width='100' height='150'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' text-anchor='middle'%3ENo Poster%3C/text%3E%3C/svg%3E"
                      }}
                    />

                    {/* Movie Info */}
                    <div className="flex-1 w-full">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">
                        {group.movie.title}
                      </h3>

                      <div className="flex gap-2 text-xs sm:text-sm text-gray-400 mb-3">
                        <span>2D</span>
                        <span>Dolby</span>
                        <span>Hindi</span>
                      </div>

                      {/* DATE SELECT */}
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {[...new Set(group.shows.map(show =>
                          new Date(show.showDateTime).toISOString().split('T')[0]
                        ))].map(date => (
                          <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition ${
                              selectedDate === date ? "bg-primary" : "bg-gray-800"
                            }`}
                          >
                            {new Date(date).toLocaleDateString()}
                          </button>
                        ))}
                      </div>

                      {/* TIME SELECT */}
                      {selectedDate && (
                        <div className="flex gap-2 flex-wrap">
                          {group.shows
                            .filter(show =>
                              new Date(show.showDateTime).toISOString().split('T')[0] === selectedDate
                            )
                            .map(show => {
                              const time = new Date(show.showDateTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                              return (
                                <button
                                  key={show._id}
                                  onClick={() => navigate(`/seat/${show._id}`)}
                                  className="px-3 py-2 rounded-lg text-xs sm:text-sm transition bg-gray-800 hover:bg-primary"
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TheaterDetails
