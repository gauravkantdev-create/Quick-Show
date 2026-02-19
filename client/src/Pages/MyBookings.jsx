import React, { useState, useEffect } from 'react'
import { dummyBookingData } from '../assets/assets'
import Loading from '../Components/Loading'
import BlurCircle from '../Components/BlurCircle'
import { dateFormat } from '../Lib/dateFormat'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  /* -------------------- FETCH BOOKINGS -------------------- */
  const getMyBookings = () => {
    // simulate API fetch — replace with real API call later
    setBookings(dummyBookingData)
    setIsLoading(false)
  }

  useEffect(() => {
    getMyBookings()
  }, [])

  /* -------------------- LOADING -------------------- */
  if (isLoading) return <Loading />

  /* -------------------- UI -------------------- */
  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-16 md:pt-28 pb-20 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />

      <h1 className="text-lg font-semibold mb-4">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-sm text-gray-400">
          No bookings found.
        </p>
      ) : (
        bookings.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-3 max-w-3xl"
          >
            {/* Movie Info */}
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={item.show.movie.poster_path}
                alt={item.show.movie.title}
                className="md:max-w-44 aspect-video h-auto object-cover object-bottom rounded"
              />

              <div className="flex flex-col justify-center">
                <p className="text-lg font-semibold">
                  {item.show.movie.title}
                </p>
                <p className="text-gray-400 text-sm">
                  {item.show.movie.runtime} mins
                </p>
                <p className="text-gray-400 text-sm">
                  Date: {new Date(item.show.showDateTime).toLocaleDateString()}
                </p>
                <p className="text-gray-400 text-sm">
                  Time: {dateFormat(item.show.showDateTime)}
                </p>
              </div>
            </div>

                     <div className='text-gray-400 text-sm mt-auto'>
                      </div>   





            {/* Booking Meta */}
            <div className="flex flex-col justify-center mt-4 md:mt-0 text-sm text-gray-300">
              <p>
                Seats:{' '}
                <span className="font-medium">{item.bookedSeats?.join(', ')}</span>
              </p>
              <p>
                Total:{' '}
                <span className="font-semibold">
                  {currency}
                  {item.amount}
                </span>
              </p>

<div className='flex flex-col md:items-end md:text-right justify-between p-4'>
<div className='flex items-center gap-4'>
  <p  className='text-2xl font-semibold mb-3'>{ currency}{item.amount}</p>
  {item.isPaid &&<button className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>

PayNow

    </button>}

</div>
</div>

       <div className='text-sm'>
         <p>
           <span className='text-gray-400'>Total Tickets:</span>
           {item.bookedSeats.length}
         </p>

         <p>
           <span className='text-gray-400'>Seat Number:</span>
           {item.bookedSeats.join(', ')}
         </p>
       </div>

            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default MyBookings
