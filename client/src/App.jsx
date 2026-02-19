import React from 'react'
import Navbar from './Components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Movies from './Pages/Movies'
import MovieDetails from './Pages/MovieDetails'
import SheetLayout from './Pages/SheetLayout'
import MyBookings from './Pages/MyBookings'
import Favourite from './Pages/Favourite'
import { Toaster } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import Footer from './Components/Footer'
import AdminLayout from './Pages/Admin/Layout'
import Dashboard from './Pages/Admin/Dashboard'
import AddShows from './Pages/Admin/AddShows'
import ListShows from './Pages/Admin/ListShows'
import ListBookings from './Pages/Admin/ListBookings' 

const App = () => {
  const location = useLocation()
  console.log('location:', location.pathname)
  const isAdminRoute = location?.pathname?.toLowerCase().startsWith('/admin')

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SheetLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/favourite' element={<Favourite />} />
<Route path='/admin' element={<AdminLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="add-shows" element={<AddShows />} />
  <Route path="list-shows" element={<ListShows />} />
  <Route path="list-bookings" element={<ListBookings />} />
</Route>

      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App