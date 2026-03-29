import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import BlurCircle from './BlurCircle'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DateSelect = ({ dateTime, id }) => {

  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(
    dateTime ? Object.keys(dateTime)[0] : null
  )

  const [selectedTime, setSelectedTime] = useState(null)

  if (!dateTime) return null


  const handleBookShow = () => {

    if (!selectedDate || !selectedTime) {
      toast.error("Please select date & time")
      return
    }

    navigate(`/movie/${id}/${selectedDate}/${selectedTime}`)
  }


  return (

    <div className="mt-12">

      <div className="relative bg-[#020617] border border-gray-800 p-6 rounded-xl">

        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="-100px" right="-100px" />

        {/* Title */}

        <h2 className="text-xl font-semibold mb-6">
          Select Date & Time
        </h2>


        {/* DATE SELECT */}

        <div className="flex items-center gap-3 mb-6">

          <ChevronLeft className="text-gray-500" />

          <div className="flex gap-3 overflow-x-auto">

            {Object.keys(dateTime).map((date) => {

              const parsed = new Date(date)

              return (

                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date)
                    setSelectedTime(null)
                  }}

                  className={`flex flex-col items-center justify-center
                  w-16 h-16 rounded-lg transition

                  ${
                    selectedDate === date
                      ? 'bg-primary text-white'
                      : 'bg-gray-900 border border-gray-700'
                  }`}
                >

                  <span className="font-semibold">
                    {parsed.getDate()}
                  </span>

                  <span className="text-xs">
                    {parsed.toLocaleDateString('en-US', {
                      month: 'short'
                    })}
                  </span>

                </button>

              )

            })}

          </div>

          <ChevronRight className="text-gray-500" />

        </div>


        {/* TIME SELECT */}

        {selectedDate && (

          <div>

            <p className="text-gray-400 mb-3">
              Available Times
            </p>

            <div className="flex flex-wrap gap-3">

              {dateTime[selectedDate]?.map((time, index) => (

                <button
                  key={index}
                  onClick={() => setSelectedTime(time)}

                  className={`px-4 py-2 rounded-lg transition

                  ${
                    selectedTime === time
                      ? 'bg-primary text-white'
                      : 'bg-gray-900 border border-gray-700'
                  }`}
                >

                  {time}

                </button>

              ))}

            </div>

          </div>

        )}


        {/* BOOK BUTTON */}

        <div className="mt-8">

          <button
            onClick={handleBookShow}
            disabled={!selectedDate || !selectedTime}

            className={`w-full py-3 rounded-lg font-semibold transition

            ${
              selectedDate && selectedTime
                ? 'bg-primary hover:bg-primary/90'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >

            Book Show

          </button>

        </div>

      </div>

    </div>

  )

}

export default DateSelect