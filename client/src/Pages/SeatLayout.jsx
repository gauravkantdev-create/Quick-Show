import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import { api } from '../Lib/api'
import Loading from '../Components/Loading'
import { usePayment } from '../Components/Payment/usePayment'

const SeatLayout = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { isSignedIn, user } = useUser()
  const { handlePayment, isProcessing: paymentProcessing } = usePayment()

  const [selectedSeats, setSelectedSeats] = useState([])
  const [show, setShow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const rows = ["A","B","C","D","E","F","G","H"]
  const seatsPerRow = 12

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await api.getShow(id)
        if (response.success) {
          setShow(response.data)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchShow()
  }, [id])

  const bookedSeats = useMemo(
    () => Object.keys(show?.occupiedSeats || {}),
    [show]
  )

  const toggleSeat = (seat) => {

    if (bookedSeats.includes(seat)) return

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat))
    } else {
      setSelectedSeats([...selectedSeats, seat])
    }

  }

  const seatPrice = show?.showPrice || 150
  const totalPrice = selectedSeats.length * seatPrice


  /* ---------------- SAVE BOOKING ---------------- */

  const confirmBooking = async () => {
    if (!isSignedIn) {
      alert("Please sign in to book tickets")
      return
    }

    if (!show || selectedSeats.length === 0) return

    try {
      setSubmitting(true)
      const token = await getToken()
      if (!token) {
        alert("Please login again")
        return
      }

      const response = await api.createBooking(
        {
          show: show._id,
          bookedSeats: selectedSeats,
          amount: totalPrice,
        },
        token
      )

      if (!response.success) {
        alert(response.error || "Failed to create booking")
        return
      }

      // Initiate Payment immediately after booking
      try {
        if (response.data && response.data._id) {
          await handlePayment(response.data._id, {
            userName: user?.fullName || user?.firstName || '',
            userEmail: user?.primaryEmailAddress?.emailAddress || '',
          })
          alert("Payment successful! 🎉")
        }
      } catch (error) {
        if (error.message !== 'Payment cancelled by user') {
          alert("Payment failed: " + error.message)
        } else {
          console.log("Payment cancelled by user.")
        }
      }

      navigate("/my-bookings")
    } finally {
      setSubmitting(false)
    }

  }

  if (loading) return <Loading />
  if (!show) {
    return (
      <div className="min-h-screen pt-24 px-6 text-white bg-[#020617]">
        Show not found.
      </div>
    )
  }

  const showDate = new Date(show.showDateTime)


  return (

    <div className="min-h-screen pt-28 sm:pt-32 md:pt-36 px-4 sm:px-6 md:px-12 lg:px-16 text-white bg-[#020617] pb-32 sm:pb-36">

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 md:mb-10 animate-in fade-in duration-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Select Seats
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-gray-400">
          <p>{showDate.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })} • {showDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          <span className="hidden sm:inline w-1 h-1 bg-gray-600 rounded-full"></span>
          <p>{show.theater?.name || "Theater"}</p>
        </div>

        <p className="text-primary mt-2 font-semibold text-sm sm:text-base tracking-wide uppercase">
          {show.movie?.title || "Movie"}
        </p>
      </div>

      {/* Screen */}
      <div className="flex flex-col items-center mb-10 sm:mb-12 md:mb-16">
        <div className="w-[85%] sm:w-[70%] h-1.5 sm:h-2 bg-primary rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)] mb-2"></div>
        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-[0.3em] font-medium">Screen This Way</p>
      </div>



      {/* Seat Layout */}
      <div className="w-full overflow-x-auto pb-6 cursor-grab active:cursor-grabbing scrollbar-hide">
        <div className="flex flex-col gap-3 sm:gap-4 items-center min-w-max px-4">
          {rows.map((row) => (
            <div key={row} className="flex gap-1.5 sm:gap-2 items-center">
              {/* Row Label */}
              <span className="w-6 text-gray-500 font-bold text-xs sm:text-sm">
                {row}
              </span>

              {Array.from({ length: seatsPerRow }).map((_, i) => {
                const seat = `${row}${i+1}`
                return (
                  <React.Fragment key={seat}>
                    {/* Center Gap */}
                    {i === 6 && (
                      <div className="w-4 sm:w-6" />
                    )}

                    <button
                      onClick={() => toggleSeat(seat)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md text-[10px] sm:text-xs transition-all duration-300 font-medium
                      ${
                        bookedSeats.includes(seat)
                        ? "bg-gray-800/40 text-gray-600 cursor-not-allowed border border-white/5"
                        : selectedSeats.includes(seat)
                        ? "bg-primary text-white scale-110 shadow-lg shadow-primary/40 z-10"
                        : "bg-gray-800/80 hover:bg-gray-700 hover:border-white/20 border border-white/5 text-gray-400"
                      }
                      `}
                    >
                      {i+1}
                    </button>
                  </React.Fragment>
                )
              })}
            </div>
          ))}
        </div>
      </div>



      {/* Seat Type */}

      <div className="text-center mt-8 text-sm text-gray-400">
        Premium • ₹{seatPrice}
      </div>


      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-10 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-gray-800/80 rounded border border-white/5"></div>
          Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-primary rounded shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
          Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-gray-800/40 rounded border border-white/5"></div>
          Booked
        </div>
      </div>


      {/* Booking Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/5 p-4 sm:p-6 z-[40]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-tight">Selected Seats ({selectedSeats.length})</span>
            <p className="text-sm sm:text-lg font-bold text-white truncate max-w-[120px] sm:max-w-none">
              {selectedSeats.join(", ") || "None"}
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex flex-col text-right">
              <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-tight">Total Price</span>
              <p className="text-lg sm:text-2xl font-black text-primary">
                ₹{totalPrice}
              </p>
            </div>

            <button
              disabled={selectedSeats.length === 0 || submitting || paymentProcessing}
              onClick={confirmBooking}
              className={`px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 transform active:scale-95 shadow-xl
              ${
                selectedSeats.length > 0
                ? "bg-primary text-white hover:bg-primary/90 hover:shadow-primary/20"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }
              `}
            >
              {submitting || paymentProcessing ? "Processing..." : "Book Now"}
            </button>
          </div>

        </div>
      </div>


    </div>

  )

}

export default SeatLayout