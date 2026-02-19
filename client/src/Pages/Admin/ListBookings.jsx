import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets'
import Loading from '../../Components/Loading'
import Title from '../../Components/Admin/Title'
import { dateFormat } from '../../Lib/dateFormat'

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹'
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getAllBookings = async () => {
    setBookings(dummyBookingData)
    setIsLoading(false)
  }

  useEffect(() => {
    getAllBookings()
  }, [])

  return isLoading ? (
    <Loading />
  ) : (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Title text1='List' text2='Bookings'/>
      
      <div className='max-w-6xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium pl-5'>User Name</th>
              <th className='p-2 font-medium'>Movie Name</th>
              <th className='p-2 font-medium'>Show Time</th>
              <th className='p-2 font-medium'>Seats</th>
              <th className='p-2 font-medium'>Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} className='border-b border-primary/10 hover:bg-primary/5'>
                <td className='p-2 pl-5'>{booking.user.name}</td>
                <td className='p-2'>{booking.show.movie.title}</td>
                <td className='p-2'>{dateFormat(booking.show.showDateTime)}</td>
                <td className='p-2'>{booking.bookedSeats.join(', ')}</td>
                <td className='p-2'>{currency}{booking.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListBookings