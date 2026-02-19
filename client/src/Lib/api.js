const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  // Shows
  getShows: async () => {
    const res = await fetch(`${API_URL}/shows`);
    return res.json();
  },
  
  getShow: async (id) => {
    const res = await fetch(`${API_URL}/shows/${id}`);
    return res.json();
  },
  
  createShow: async (data, token) => {
    const res = await fetch(`${API_URL}/shows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  deleteShow: async (id, token) => {
    const res = await fetch(`${API_URL}/shows/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },
  
  // Bookings
  getMyBookings: async (token) => {
    const res = await fetch(`${API_URL}/bookings/my-bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },
  
  getAllBookings: async (token) => {
    const res = await fetch(`${API_URL}/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },
  
  createBooking: async (data, token) => {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  // Dashboard
  getDashboardStats: async (token) => {
    const res = await fetch(`${API_URL}/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};
