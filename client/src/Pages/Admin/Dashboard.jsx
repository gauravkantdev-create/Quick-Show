import React, { useEffect, useMemo, useState } from 'react'
import { ChartLine, CircleDollarSign, PlayCircle, Star, User } from 'lucide-react'
import { dummyDashboardData } from '../../assets/assets'
import Title from '../../Components/Admin/Title'
import Loading from '../../Components/Loading'
import BlurCircle from '../../Components/BlurCircle'
import { dateFormat } from '../../Lib/dateFormat'

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹'

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUsers: 0,
  })

  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setDashboardData(dummyDashboardData)
    } catch (error) {
      console.error('Failed to fetch dashboard data', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const dashboardCards = useMemo(
    () => [
      {
        title: 'Total Bookings',
        value: dashboardData.totalBookings ?? 0,
        icon: ChartLine,
      },
      {
        title: 'Total Revenue',
        value: `${currency}${dashboardData.totalRevenue ?? 0}`,
        icon: CircleDollarSign,
      },
      {
        title: 'Active Shows',
        value: dashboardData.activeShows?.length ?? 0,
        icon: PlayCircle,
      },
      {
        title: 'Total Users',
        value: dashboardData.totalUsers ?? 0,
        icon: User,
      },
    ],
    [dashboardData, currency]
  )

  // ✅ Proper loading handling
  if (loading) return <Loading />

  return (
    <div className="relative bg-black min-h-screen w-full text-white">
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <Title text1="Admin" text2="Dashboard" />

        <div className='relative mt-6 sm:mt-8'>
          <BlurCircle top="-100px" left='0'/>
          <BlurCircle bottom="-100px" right='0'/>
          
          <div className='relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full'>
            {dashboardCards.map((card, index) => (
              <div key={index} className='flex items-center justify-between px-4 py-4 bg-primary/10 border border-primary/20 rounded-lg transition-all duration-300 hover:bg-primary/20'>
                <div>
                  <p className='text-xs tracking-widest text-gray-400 uppercase'>{card.title}</p>
                  <h2 className='text-xl sm:text-2xl font-semibold mt-1'>{card.value}</h2>
                </div>
                <card.icon className='w-6 h-6 sm:w-7 sm:h-7 text-primary'/>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='p-4 sm:p-6 md:p-8 lg:p-10'>
        <p className='text-base sm:text-lg font-medium mb-4'>ACTIVE SHOWS</p>

        <div className='relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
          <BlurCircle top="100px" left="-100px"/>
          {dashboardData.activeShows.map((show)=>(
            <div key={show._id} className="rounded-lg overflow-hidden pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300">
              <img src={show.movie.poster_path} alt={show.movie.title} className="h-48 sm:h-56 md:h-60 w-full object-cover" />
              <p className='font-medium p-2 truncate text-sm sm:text-base'>{show.movie.title}</p>

              <div className='flex items-center justify-between px-2'>
                <p className='text-base sm:text-lg font-medium'>{currency} {show.showPrice}</p>
                <p className='flex items-center gap-1 text-xs sm:text-sm text-gray-400 mt-1 pr-1'>
                  <Star className='w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary'/>
                  {show.movie.vote_average.toFixed(1)}
                </p>
              </div>

              <p className='px-2 pt-2 text-xs sm:text-sm text-gray-500'>
                {dateFormat(show.showDateTime)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
