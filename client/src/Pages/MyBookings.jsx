import React, { useState, useEffect } from 'react'
import { useAuth, useUser, SignInButton } from '@clerk/clerk-react'
import Loading from '../Components/Loading'
import BlurCircle from '../Components/BlurCircle'
import { api } from '../Lib/api'

const MyBookings = () => {

  const currency = import.meta.env.VITE_CURRENCY || '₹'
  const { getToken } = useAuth()
  const { isSignedIn } = useUser()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)


  /* ---------------- FETCH BOOKINGS ---------------- */
  const getMyBookings = async () => {
    try {
      if (!isSignedIn) {
        setBookings([])
        return
      }

      const token = await getToken()
      const response = await api.getMyBookings(token)
      setBookings(response.success ? response.data || [] : [])

    } catch (error) {

      console.error("Error loading bookings:", error)
      setBookings([])

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMyBookings()
  }, [isSignedIn])


  /* ---------------- DELETE BOOKING ---------------- */
  const deleteBooking = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to cancel this booking?")) return

      const token = await getToken()
      const response = await api.deleteBooking(id, token)

      if (response.success) {
        getMyBookings() // Refresh list
      } else {
        alert(response.error || "Failed to cancel booking")
      }
    } catch (error) {
      console.error("Error deleting booking:", error)
      alert("An error occurred while cancelling your booking")
    }
  }



  /* ---------------- LOADING ---------------- */
  if (isLoading) return <Loading />


  /* ---------------- EMPTY STATE ---------------- */
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-300 px-6 text-center">
        <p className="text-lg mb-4">Please sign in to see your bookings</p>
        <SignInButton mode="modal">
          <button className="px-6 py-2.5 bg-primary rounded-lg text-white">
            Sign In
          </button>
        </SignInButton>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
        <p className="text-lg">No bookings found 🎬</p>
      </div>
    )
  }


  /* ---------------- UI ---------------- */
  return (
    <div className="relative w-full px-4 md:px-10 lg:px-20 pt-24 pb-20 min-h-screen bg-black text-white">

      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" right="0px" />

      <h1 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
        My Bookings 🎟
      </h1>


      <div className="max-w-5xl mx-auto space-y-6">

        {bookings.map((item, index) => {

          const seatCount = item.bookedSeats?.length || 0
          const totalAmount = item.amount || 0

          return (

            <div
              key={index}
              className="flex flex-col md:flex-row justify-between items-center bg-primary/10 border border-primary/20 rounded-xl p-5 shadow-lg hover:scale-[1.01] transition"
            >

              {/* LEFT */}
              <div className="flex gap-4 w-full md:w-auto">

                {/* Poster */}
                {item.show?.movie?.poster ? (
                  <img
                    src={item.show.movie.poster}
                    alt={item.show?.movie?.title}
                    className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-24 h-32 sm:w-28 sm:h-36 bg-gray-800 border border-white/5 flex items-center justify-center rounded-lg text-xs text-gray-500">
                    No Image
                  </div>
                )}



                {/* Info */}
                <div className="flex flex-col justify-center gap-1">

                  <p className="text-lg font-semibold">
                    {item.show?.movie?.title || "Unknown Movie"}
                  </p>

                  <p className="text-gray-400 text-sm">
                    🎬 {item.show?.theater?.name || "Unknown Theater"}
                  </p>

                  <p className="text-gray-400 text-sm">
                    📅 {item.show?.showDateTime ? new Date(item.show.showDateTime).toLocaleDateString() : "-"}
                  </p>

                  <p className="text-gray-400 text-sm">
                    ⏰ {item.show?.showDateTime ? new Date(item.show.showDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                  </p>

                  <p className="text-gray-400 text-sm">
                    🎟 Seats: {item.bookedSeats?.join(', ') || "-"}
                  </p>

                </div>

              </div>


              {/* RIGHT */}
              <div className="flex flex-col items-center md:items-end mt-4 md:mt-0 gap-2">

                <p className="text-sm text-gray-400">
                  Total Seats:
                  <span className="font-semibold text-white ml-2">
                    {seatCount}
                  </span>
                </p>

                <p className="text-lg font-semibold">
                  {currency}{totalAmount}
                </p>


                <div className="flex gap-3">

                  {/* Pay */}
                  <button
                    className="bg-primary px-5 py-2 rounded-full text-sm hover:scale-105 transition"
                  >
                    Pay Now
                  </button>


                  {/* Delete */}
                  <button
                    onClick={() => deleteBooking(item._id)}
                    className="bg-red-600/20 text-red-500 border border-red-500/30 px-5 py-2 rounded-full text-xs sm:text-sm hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    Cancel Booking
                  </button>


                </div>

              </div>

            </div>

          )
        })}

      </div>

    </div>
  )
}

export default MyBookings