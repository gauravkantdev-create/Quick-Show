import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { api } from '../../Lib/api'
import Loading from '../../Components/Loading'
import Title from '../../Components/Admin/Title'
import { Trash2, Calendar, DollarSign, Users } from 'lucide-react'
import { dateFormat } from '../../Lib/dateFormat'

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const { getToken } = useAuth()

  const getAllShows = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      const response = await api.getShows(token)
      if (response.success) {
        const rawShows = response.data || []
        const uniqueShows = Array.from(
          new Map(
            rawShows.map((show) => {
              const theaterId =
                typeof show.theater === 'object'
                  ? show.theater?._id
                  : show.theater
              const dateKey = new Date(show.showDateTime).toISOString()
              const movieId = show.movie?.id || show.movie?.imdbID || show.movie?.title
              return [`${movieId}|${theaterId}|${dateKey}`, show]
            })
          ).values()
        )
        setShows(uniqueShows)
      } else {
        console.error('Failed to fetch shows:', response.error)
        setShows([])
      }
    } catch (error) {
      console.error('Error fetching shows:', error)
      setShows([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteShow = async (showId) => {
    if (!confirm('Are you sure you want to delete this show?')) return
    
    try {
      setDeleting(showId)
      const token = await getToken()
      const response = await api.deleteShow(showId, token)
      if (response.success) {
        setShows(shows.filter(s => s._id !== showId))
        alert('Show deleted successfully!')
      } else {
        alert('Failed to delete show: ' + response.error)
      }
    } catch (error) {
      alert('Error deleting show: ' + error.message)
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => {
    getAllShows()
  }, [])

  return loading ? (
    <Loading />
  ) : (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Title text1="List" text2="Shows" />

      {shows.length === 0 ? (
        <div className="mt-10 p-8 text-center border border-primary/20 rounded-lg bg-primary/5">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-primary/60" />
          <p className="text-gray-400">No shows found. Create your first show!</p>
        </div>
      ) : (
        <div className='max-w-5xl mt-6 overflow-x-auto'>
          <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
            <thead>
              <tr className='bg-primary/20 text-left text-white'>
                <th className='p-3 font-medium pl-5'>Movie</th>
                <th className='p-3 font-medium'>Date & Time</th>
                <th className='p-3 font-medium'>Price</th>
                <th className='p-3 font-medium'>Bookings</th>
                <th className='p-3 font-medium'>Revenue</th>
                <th className='p-3 font-medium'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show) => (
                <tr key={show._id} className='border-b border-primary/10 hover:bg-primary/5'>
                  <td className='p-3 pl-5'>
                    <div className="flex items-center gap-3">
                      <img 
                        src={show.movie?.poster || show.movie?.poster_path || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='168' viewBox='0 0 120 168'%3E%3Crect fill='%23111' width='120' height='168'/%3E%3Ctext fill='%23666' font-family='Arial' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Poster%3C/text%3E%3C/svg%3E"} 
                        alt={show.movie?.title}
                        className="w-10 h-14 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='168' viewBox='0 0 120 168'%3E%3Crect fill='%23111' width='120' height='168'/%3E%3Ctext fill='%23666' font-family='Arial' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Poster%3C/text%3E%3C/svg%3E"
                        }}
                      />
                      <span className="font-medium">{show.movie?.title || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className='p-3'>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {dateFormat(show.showDateTime)}
                    </div>
                  </td>
                  <td className='p-3'>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      {currency}{show.showPrice}
                    </div>
                  </td>
                  <td className='p-3'>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      {Object.keys(show.occupiedSeats || {}).length}
                    </div>
                  </td>
                  <td className='p-3 font-medium'>
                    {currency}{(show.showPrice * Object.keys(show.occupiedSeats || {}).length)}
                  </td>
                  <td className='p-3'>
                    <button
                      onClick={() => handleDeleteShow(show._id)}
                      disabled={deleting === show._id}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded transition disabled:opacity-50"
                      title="Delete show"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ListShows