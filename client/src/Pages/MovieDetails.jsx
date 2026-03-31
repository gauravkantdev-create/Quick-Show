import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from '../Components/Loading'
import { api } from '../Lib/api'

// Normalize image URL (same as MovieCard)
const getImageUrl = (path) => {
  if (!path) return null;
  if (String(path).trim().toUpperCase() === 'N/A') return null;
  
  if (path.startsWith('http')) {
    if (path.includes('media-amazon.com')) {
      return path.replace(/_V1_.*\.jpg$/i, '_V1_SX300.jpg');
    }
    return path;
  }
  
  if (path.includes('_V1_') || path.startsWith('MV5')) {
    return `https://m.media-amazon.com/images/M/${path}`;
  }
  
  return `https://image.tmdb.org/t/p/w500${path}`;
};

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%231a1a2e'/%3E%3Cstop offset='100%25' stop-color='%2316213e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='300' height='450'/%3E%3Ctext fill='%23555' font-family='Arial' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [shows, setShows] = useState([])
  const [allTheaters, setAllTheaters] = useState([])
  const [loading, setLoading] = useState(true)
  const [movieInfo, setMovieInfo] = useState(null)

  const [selectedTheater, setSelectedTheater] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const [showsRes, theatersRes] = await Promise.all([
          api.getShows(),
          api.getTheaters(),
        ])

        const showsArray = showsRes?.data || showsRes?.shows || []
        const theatersArray = theatersRes?.data || theatersRes?.theaters || []

        console.log('All shows:', showsArray)
        console.log('All theaters:', theatersArray)
        console.log('Looking for movie id:', id)

        // Filter shows for this movie
        const movieShows = showsArray.filter((show) => {
          return String(show?.movie?.id) === String(id)
        })

        console.log('Filtered shows for movie:', movieShows)
        console.log('Sample show theater:', movieShows[0]?.theater)

        setShows(movieShows)
        setAllTheaters(theatersArray)

        // Extract movie info from first show
        if (movieShows.length > 0 && movieShows[0].movie) {
          setMovieInfo(movieShows[0].movie)
        }
      } catch (error) {
        console.error('Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [id])

  // Compute theaters from shows - handle both populated objects and ObjectId references
  const theaters = useMemo(() => {
    const theaterMap = new Map();
    
    console.log('Computing theaters from', shows.length, 'shows')
    console.log('allTheaters available:', allTheaters.length)
    
    shows.forEach((show, index) => {
      console.log(`Show ${index}:`, show._id, 'theater:', show.theater, 'type:', typeof show.theater)
      
      if (!show?.theater) {
        console.log('  -> Show missing theater - skipping')
        return
      }
      
      // If theater is already populated as object with _id
      if (typeof show.theater === "object" && show.theater?._id) {
        console.log('  -> Adding populated theater:', show.theater._id, show.theater.name)
        theaterMap.set(show.theater._id, show.theater)
      } 
      // If theater is an ObjectId string, look it up in allTheaters
      else if (typeof show.theater === "string") {
        console.log('  -> Looking up theater string:', show.theater)
        const theater = allTheaters.find(t => t._id === show.theater)
        if (theater) {
          console.log('  -> Found theater:', theater.name)
          theaterMap.set(theater._id, theater)
        } else {
          console.log('  -> Could not find theater for id:', show.theater)
        }
      } else {
        console.log('  -> Unknown theater type:', typeof show.theater)
      }
    })
    
    const result = Array.from(theaterMap.values())
    console.log('Theaters computed:', result)
    return result
  }, [shows, allTheaters])

  // Auto-select first theater when theaters load
  useEffect(() => {
    if (theaters.length > 0 && !selectedTheater) {
      console.log('Auto-selecting first theater:', theaters[0])
      setSelectedTheater(theaters[0])
    }
  }, [theaters, selectedTheater])

  // Filter shows by selected theater
  const filteredShows = useMemo(() => {
    if (!selectedTheater) return [];
    
    return shows.filter(show => {
      const showTheaterId = typeof show?.theater === "object" 
        ? show.theater?._id 
        : show?.theater
      
      return showTheaterId === selectedTheater._id
    })
  }, [shows, selectedTheater])

  console.log('Filtered shows for selected theater:', filteredShows)

  // Compute unique dates from filtered shows - MUST be before any early returns
  const dates = useMemo(() => {
    const dateSet = new Set(
      filteredShows.map(show => {
        const date = new Date(show.showDateTime)
        return date.toISOString().split("T")[0]
      })
    )
    return Array.from(dateSet)
  }, [filteredShows])

  console.log('Dates computed:', dates)

  if (loading) return <Loading />

  if (!shows.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No Shows Available</h2>
          <p className="text-gray-400">Shows not available for this movie</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 px-4 text-white pb-20">
      {/* MOVIE INFO HEADER */}
      {movieInfo && (
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
          <img
            src={getImageUrl(movieInfo.poster) || PLACEHOLDER_IMG}
            alt={movieInfo.title}
            className="w-48 h-72 object-cover rounded-lg shadow-lg"
            onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{movieInfo.title}</h1>
            <p className="text-gray-400">Select a theater, date and time to book your tickets</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Select Theater</h1>

      {/* THEATERS */}
      {theaters.length === 0 ? (
        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 mb-8">
          <p className="text-yellow-200 font-medium mb-2">No theaters available for this movie.</p>
          <p className="text-yellow-400/80 text-sm mb-3">
            Found {shows.length} shows, but they don't have theater assignments.
          </p>
          <p className="text-gray-400 text-sm">
            Go to <strong>/admin/list-shows</strong> to delete these shows, then recreate them at <strong>/admin/add-shows</strong> with a theater selected.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 mb-8">
          {theaters.map(theater => (
            <button
              key={theater._id}
              onClick={() => {
                setSelectedTheater(theater)
                setSelectedDate(null)
              }}
              className={`px-5 py-3 rounded-lg ${
                selectedTheater?._id === theater._id
                  ? "bg-primary"
                  : "bg-gray-800"
              }`}
            >
              {theater.name}
            </button>
          ))}
        </div>
      )}

      {/* DATES */}
      {selectedTheater && (
        <div>
          <h2 className="text-xl mb-4">Select Date</h2>
          {dates.length === 0 ? (
            <p className="text-gray-400 mb-8">No dates available for this theater.</p>
          ) : (
            <div className="flex flex-wrap gap-3 mb-8">
              {dates.map(date => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-4 py-2 rounded-full ${
                    selectedDate === date ? "bg-primary" : "bg-gray-800"
                  }`}
                >
                  {new Date(date).toLocaleDateString()}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TIMES */}
      {selectedDate && (
        <div>
          <h2 className="text-xl mb-4">Select Time</h2>
          <div className="flex flex-wrap gap-4">
            {filteredShows.filter(show =>
              new Date(show.showDateTime).toISOString().split("T")[0] === selectedDate
            ).length === 0 ? (
              <p className="text-gray-400">No show times available for this date.</p>
            ) : (
              filteredShows
                .filter(show =>
                  new Date(show.showDateTime).toISOString().split("T")[0] === selectedDate
                )
                .map(show => {
                  const time = new Date(show.showDateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                  return (
                    <button
                      key={show._id}
                      onClick={() => navigate(`/seat/${show._id}`)}
                      className="px-5 py-3 bg-gray-800 rounded-xl hover:bg-primary"
                    >
                      {time}
                    </button>
                  )
                })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetails
