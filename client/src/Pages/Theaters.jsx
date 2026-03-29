import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Theaters = () => {

  const [theaters, setTheaters] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  /* ---------------- FETCH THEATERS ---------------- */
  useEffect(() => {
    fetch('http://localhost:3000/api/theaters')
      .then(res => res.json())
      .then(data => {
        setTheaters(data.data || [])
      })
      .catch(err => {
        console.error("Error:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])


  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading theaters...
      </div>
    )
  }


  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 md:px-12 lg:px-16 text-white pb-16">

      {/* HEADER */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center sm:text-left">
        Explore Theaters 🎬
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">


        {theaters.map((t) => (

          <div
            key={t._id}
            onClick={() => navigate(`/theaters/${t._id}`)}
            className="cursor-pointer bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow hover:scale-105 transition duration-300"
          >

            {/* IMAGE */}
            <div className="h-48 overflow-hidden">
              <img
                src={
                  t.image ||
                  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1470&auto=format&fit=crop"
                }
                alt={t.name}
                className="w-full h-full object-cover hover:scale-110 transition duration-500"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">

              <h2 className="text-xl font-semibold">
                {t.name}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                📍 {t.location}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                🎬 Screens: {t.screens}
              </p>

              {/* Rating (optional future use) */}
              {t.rating > 0 && (
                <p className="text-yellow-400 text-sm mt-1">
                  ⭐ {t.rating}
                </p>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Theaters