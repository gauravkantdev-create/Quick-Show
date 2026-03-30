import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layout Components
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

// Pages
import Home from './Pages/Home'
import Movies from './Pages/Movies'
import MovieDetails from './Pages/MovieDetails'
import MyBookings from './Pages/MyBookings'
import Favourite from './Pages/Favourite'
import Theaters from './Pages/Theaters'
import TheaterDetails from './Pages/TheaterDetails'
import SeatLayout from './Pages/SeatLayout'
import Releases from './Pages/Releases'


// Admin Pages
import AdminLayout from './Pages/Admin/Layout'
import Dashboard from './Pages/Admin/Dashboard'
import AddShows from './Pages/Admin/AddShows'
import ListShows from './Pages/Admin/ListShows'
import ListBookings from './Pages/Admin/ListBookings'

const App = () => {
  const location = useLocation()
  console.log('location:', location.pathname)

  // 🔐 check if admin route
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">

      {/* Toast notifications */}
      <Toaster />

      {/* Navbar (hide in admin) */}
      {!isAdminRoute && <Navbar />}

      {/* MAIN CONTENT */}
      <div className={`flex-grow ${!isAdminRoute ? "" : ""}`}>

        <Routes>

          {/* ---------------- PUBLIC ROUTES ---------------- */}
          <Route path='/' element={<Home />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/theaters' element={<Theaters />} />
          <Route path='/theaters/:id' element={<TheaterDetails />} />
          <Route path='/releases' element={<Releases />} />


          {/* ---------------- MOVIE FLOW ---------------- */}
          <Route path='/movies/:id' element={<MovieDetails />} />

          {/* ---------------- SEAT BOOKING ---------------- */}
          <Route path="/seat/:id" element={<SeatLayout />} />

          {/* ---------------- USER ---------------- */}
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/favourite' element={<Favourite />} />

          {/* ---------------- ADMIN ---------------- */}
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='add-shows' element={<AddShows />} />
            <Route path='list-shows' element={<ListShows />} />
            <Route path='list-bookings' element={<ListBookings />} />
          </Route>

        </Routes>

      </div>

      {/* Footer (hide in admin) */}
      {!isAdminRoute && <Footer />}

    </div>
  )
}

export default App