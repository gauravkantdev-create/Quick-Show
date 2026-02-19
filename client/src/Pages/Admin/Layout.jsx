import React from 'react'
import { Outlet } from 'react-router-dom'

import AdminNavbar from '../../Components/Admin/AdminNavbar'
import AdminSidebar from '../../Components/Admin/AdminSidebar'

const Layout = () => {
  return (
    <>
      {/* Top Navbar */}
      <AdminNavbar />

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-64px)]">
        
        {/* Sidebar */}
        <AdminSidebar />

        {/* Page Content */}
        <main className="flex-1 px-0 py-0 md:px-0 overflow-y-auto bg-black">
          <Outlet />
        </main>

      </div>
    </>
  )
}

export default Layout
