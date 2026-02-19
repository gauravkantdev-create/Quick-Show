import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import BlurCircle from './BlurCircle'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DateSelect = ({ dateTime, id }) => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  if (!dateTime) return null

  const onBookHandler = () => {
    if (!selected) {
      toast.error('Please select a date')
      return
    }

    // Route changed to use existing SheetLayout route: /movies/:id/:date
    navigate(`/movies/${id}/${encodeURIComponent(selected)}`)
    window.scrollTo(0, 0)
  }

  return (
    <div id="dateSelect" className="pt-16 sm:pt-20 md:pt-24">
      <div className="relative p-4 sm:p-6 md:p-8 bg-primary/10 border border-primary/20 rounded-lg mx-3 sm:mx-4 md:mx-6 lg:mx-0">

        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0" />

        <p className="text-base sm:text-lg font-semibold">Choose Date</p>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-xs sm:text-sm mt-4 sm:mt-5">
          <div className="flex items-center gap-3 sm:gap-6 flex-1">
            <ChevronLeft width={24} height={24} className="flex-shrink-0" />

            <div className="grid grid-cols-3 md:flex gap-2 sm:gap-4">
              {Object.keys(dateTime).map((date) => {
                const parsedDate = new Date(date)

                return (
                  <button
                    key={date}
                    onClick={() => setSelected(date)}
                    className={`flex flex-col items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-md transition
                      ${
                        selected === date
                          ? 'border-2 border-white bg-primary text-white'
                          : 'border border-primary/70 bg-gray-800 hover:bg-gray-700'
                      }`}
                  >
                    <span className="text-xs sm:text-sm">{parsedDate.getDate()}</span>
                    <span className="text-xs">
                      {parsedDate.toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </span>
                  </button>
                )
              })}
            </div>

            <ChevronRight width={24} height={24} className="flex-shrink-0" />
          </div>

          <button
            onClick={onBookHandler}
            disabled={!selected}
            className={`px-6 sm:px-8 py-2 sm:py-2.5 rounded transition-all whitespace-nowrap w-full sm:w-auto
              ${
                selected
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default DateSelect
