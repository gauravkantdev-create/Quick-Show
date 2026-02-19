import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets'
import Loading from '../../Components/Loading'
import Title from '../../Components/Admin/Title'

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹'
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  const getAllShows = async () => {
    try {
      setShows([{
        movie: dummyShowsData[0],
        showDateTime: "2026-06-30T02:30:00.000Z",
        showPrice: 59,
        occupiedSeats: {
          A1: "user_1",
          B1: "user_2",
          C1: "user_3"
        }
      }])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching shows", error)
      setLoading(false)
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

      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium pl-5'>Movie Name</th>
              <th className='p-2 font-medium'>Show Time</th>
              <th className='p-2 font-medium'>Total Bookings</th>
              <th className='p-2 font-medium'>Earnings</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show, index) => (
              <tr key={index} className='border-b border-primary/10 hover:bg-primary/5'>
                <td className='p-2 pl-5'>{show.movie.title}</td>
                <td className='p-2'>{new Date(show.showDateTime).toLocaleString()}</td>
                <td className='p-2'>{Object.keys(show.occupiedSeats).length}</td>
                <td className='p-2'>{currency}{show.showPrice * Object.keys(show.occupiedSeats).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListShows