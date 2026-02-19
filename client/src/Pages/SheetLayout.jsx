import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRight, ClockIcon } from 'lucide-react'

import { dummyDateTimeData, dummyShowsData, assets } from '../assets/assets'
import Loading from '../Components/Loading'
import BlurCircle from '../Components/BlurCircle'
import isoTimeFormat from '../Lib/isoTimeFormat'


/* -------------------------------------------------------------------------- */
/*                                CONFIGURATION                               */
/* -------------------------------------------------------------------------- */

const SEATS_PER_ROW = 9

const GROUP_ROWS = [
  ['A', 'B'],
  ['C', 'D'],
  ['E', 'F'],
  ['G', 'H'],
  ['I', 'J'],
]

// Demo reserved seats (replace with real API data later)
const RESERVED_SEATS = ['A3', 'B5', 'C1', 'E8']

const COLUMN_NUMBERS = Array.from({ length: SEATS_PER_ROW }, (_, i) => i + 1)

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

const SheetLayout = () => {
  const { id, date } = useParams()
  const navigate = useNavigate()

  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)

  // Temporary notice (toast) shown when user action is invalid
  const [notice, setNotice] = useState(null)
  const showNotice = msg => {
    setNotice(msg)
    setTimeout(() => setNotice(null), 2500)
  }

  /* ------------------------------ SEAT RENDERER ----------------------------- */
  const renderSeats = (row, count = SEATS_PER_ROW) => (
    <div
      key={row}
      className="flex gap-2 mb-2 items-center justify-center"
    >
      <div className="w-6 text-right text-xs text-gray-400 mr-2 hidden md:block">
        {row}
      </div> 

      {Array.from({ length: count }).map((_, index) => {
        const seatNumber = index + 1
        const seatId = `${row}${seatNumber}`
        const isSelected = selectedSeats.includes(seatId)
        const isReserved = RESERVED_SEATS.includes(seatId)

        return (
          <button
            key={seatId}
            title={isReserved ? 'Booked' : `Seat ${seatId}`}
            disabled={isReserved}
            onClick={() => {
              if (!selectedTime) {
                showNotice('Please select a time first')
                return
              }

              if (isReserved) {
                showNotice('This seat is already booked')
                return
              }

              if (!isSelected && selectedSeats.length >= 5) {
                showNotice('You can select up to 5 seats only')
                return
              }

              setSelectedSeats(prev =>
                isSelected
                  ? prev.filter(seat => seat !== seatId)
                  : [...prev, seatId]
              )
            }}
            className={`w-8 h-8 rounded-md text-[11px] uppercase tracking-wider font-semibold
              flex items-center justify-center border transition transform hover:-translate-y-0.5
              ${
                isReserved
                  ? 'bg-gray-700/50 cursor-not-allowed border-gray-600'
                  : isSelected
                  ? 'bg-primary text-white shadow-lg ring-2 ring-primary/40'
                  : 'bg-transparent border-primary/30 hover:bg-primary/10 hover:shadow-md'
              } ${!selectedTime ? 'opacity-60 cursor-not-allowed' : (!isSelected && selectedSeats.length >= 5 ? 'opacity-60 cursor-not-allowed' : '')}`}
          >
            {seatId}
          </button>
        )
      })}
    </div>
  )

  /* ------------------------------ FETCH SHOW ------------------------------ */
  useEffect(() => {
    const movie = dummyShowsData.find(item => item._id === id)

    if (movie) {
      setShow({
        movie,
        dateTime: dummyDateTimeData,
      })
    }
  }, [id])

  /* ------------------------------ LOADING ------------------------------ */
  if (!show) return <Loading />

  const timings = show.dateTime?.[date] || []

  /* -------------------------------------------------------------------------- */
  /*                                    UI                                      */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 pt-24 gap-10 pb-12 md:pb-16">

      {/* Temporary notice toast */}
      {notice && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-red-600 text-white text-sm px-4 py-2 rounded shadow">{notice}</div>
        </div>
      )} 

      {/* --------------------------- Available Timings -------------------------- */}
      <div className="w-full md:w-60 bg-primary/10 border border-primary/20 rounded-lg py-8 h-max md:sticky md:top-28">
        <p className="text-lg font-semibold px-6">
          Available Timings
        </p>

        <div className="mt-5 space-y-1">
          {timings.length ? (
            timings.map(item => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-6 py-2 cursor-pointer rounded-r-md transition
                  ${
                    selectedTime?.time === item.time
                      ? 'bg-primary text-white'
                      : 'hover:bg-primary/20'
                  }`}
              >
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">
                  {isoTimeFormat(item.time)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 px-6">
              No timings available
            </p>
          )}
        </div>
      </div>

      {/* ------------------------------ Seat Layout ------------------------------ */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-10">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0px" right="0px" />

        <h1 className="text-2xl font-semibold mb-4">
          Select Your Seat
        </h1>

        <img
          src={assets.screenImage}
          alt="Screen"
          className="mb-3 w-80 md:w-96 lg:w-[500px]"
        />

        <p className="text-gray-400 text-sm mb-6">
          SCREEN SIDE
        </p>

        {/* --------------------------- Front Seat Block --------------------------- */}
        <div className="flex flex-col items-center mt-10 text-xs text-gray-300 w-full">
          <div className="w-full md:w-[880px] bg-gradient-to-br from-black/40 via-transparent to-black/30 border border-primary/15 rounded-xl px-6 py-3 shadow-2xl flex flex-col items-center">

            {/* Column Numbers */}
            <div className="flex gap-2 mb-1 justify-center items-center md:w-[880px]">
              <div className="w-6 mr-2 hidden md:block" />
              {COLUMN_NUMBERS.map(num => (
                <div
                  key={num}
                  className="w-8 h-3 text-center text-xs text-gray-400"
                >
                  {num}
                </div>
              ))}
            </div>

            {/* First Group Rows */}
            <div className="flex flex-col items-center gap-0.5 mb-1">
              {GROUP_ROWS[0].map(row => renderSeats(row))}
            </div>

          </div>
        </div>

        <div className="h-4 md:h-6" />

        {/* --------------------------- Remaining Rows ---------------------------- */}
        <div className="grid grid-cols-2 gap-10">
          {GROUP_ROWS.slice(1).map((group, index) => (
            <div key={index}>
              {group.map(row => renderSeats(row))}
            </div>
          ))}
        </div>

        {/* ------------------------------- Legend -------------------------------- */}
        <div className="w-full mt-6 flex items-center justify-between max-md:flex-col max-md:items-start">
          <div className="flex items-center gap-4">
            <Legend color="bg-gray-700" label="Booked" />
            <Legend color="bg-transparent border border-primary/20" label="Available" />
            <Legend color="bg-primary" label="Selected" />
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-300">
              Selected:{' '}
              <span className="font-semibold">
                {selectedSeats.join(', ') || 'none'}
              </span>
            </p>
            <p className="text-sm text-gray-300">
              Count:{' '}
              <span className="font-semibold">
                {selectedSeats.length}
              </span>
            </p>
          </div>
        </div>
    
                {/* Proceed: enabled only when time selected and at least one seat selected */}
                <button
                  onClick={() => {
                    if (!selectedTime) {
                      showNotice('Please select a time before proceeding')
                      return
                    }
                    if (!selectedSeats.length) {
                      showNotice('Please select at least one seat before proceeding')
                      return
                    }
                    navigate('/my-bookings')
                  }}
                  aria-disabled={!(selectedTime && selectedSeats.length)}
                  className={`flex items-center gap-2 mt-6 md:mt-20 mb-4 md:mb-6 px-8 py-3 text-sm rounded-full font-medium transition active:scale-95 ${
                    selectedTime && selectedSeats.length
                      ? 'bg-primary text-white hover:bg-primary-dull cursor-pointer'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Proceed
                  <ArrowRight strokeWidth={3} className="w-4 h-4" />
                </button>

        



      </div>
    </div>
  )
}

/* ------------------------------- Legend UI -------------------------------- */
const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <span className={`w-4 h-4 rounded-sm inline-block ${color}`} />
    <span className="text-xs text-gray-300">{label}</span>
  </div>
)

export default SheetLayout
