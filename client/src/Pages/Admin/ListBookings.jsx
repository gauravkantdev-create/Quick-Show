import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { api } from '../../Lib/api'
import Loading from '../../Components/Loading'
import Title from '../../Components/Admin/Title'
import { dateFormat } from '../../Lib/dateFormat'
import { Users, Film, Calendar, Armchair, DollarSign, RefreshCw } from 'lucide-react'

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { getToken } = useAuth()

  const getAllBookings = async () => {
    try {
      setIsLoading(true)
      const token = await getToken()
      const response = await api.getAllBookings(token)
      if (response.success) {
        setBookings(response.data || [])
      } else {
        console.error('Failed to fetch bookings:', response.error)
        setBookings([])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAllBookings()
  }, [])

  return isLoading ? (
    <Loading />
  ) : (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="flex items-center justify-between">
        <Title text1='List' text2='Bookings'/>
        <button
          onClick={getAllBookings}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-primary/20 hover:bg-primary/30 rounded transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {bookings.length === 0 ? (
        <div className="mt-10 p-8 text-center border border-primary/20 rounded-lg bg-primary/5">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary/60" />
          <p className="text-gray-400">No bookings found. They will appear here when customers book tickets.</p>
        </div>
      ) : (
        <div className='max-w-6xl mt-6 overflow-x-auto'>
          <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
            <thead>
              <tr className='bg-primary/20 text-left text-white'>
                <th className='p-3 font-medium pl-5'>User</th>
                <th className='p-3 font-medium'>Movie</th>
                <th className='p-3 font-medium'>Show Time</th>
                <th className='p-3 font-medium'>Seats</th>
                <th className='p-3 font-medium'>Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className='border-b border-primary/10 hover:bg-primary/5'>
                  <td className='p-3 pl-5'>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      {booking.user?.name || 'Unknown'}
                    </div>
                  </td>
                  <td className='p-3'>
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-yellow-400" />
                      {booking.show?.movie?.title || 'Unknown'}
                    </div>
                  </td>
                  <td className='p-3'>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      {dateFormat(booking.show?.showDateTime)}
                    </div>
                  </td>
                  <td className='p-3'>
                    <div className="flex items-center gap-2">
                      <Armchair className="w-4 h-4 text-green-400" />
                      {booking.bookedSeats?.join(', ') || 'N/A'}
                    </div>
                  </td>
                  <td className='p-3 font-medium'>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      {currency}{booking.amount}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-gray-400">
            Total Bookings: <span className="text-white font-medium">{bookings.length}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default ListBookings