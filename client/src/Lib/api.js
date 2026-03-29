const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = {

  /* ==================== SHOWS ==================== */

  getShows: async (token) => {
    try {

      const res = await fetch(`${API_URL}/shows`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      const data = await res.json();

      return data;

    } catch (error) {

      console.error("getShows error:", error);

      return {
        success: false,
        data: [],
      };

    }

  },


  getShow: async (id) => {

    try {

      const res = await fetch(`${API_URL}/shows/${id}`);
      return res.json();

    } catch (error) {

      console.error("getShow error:", error);
      return { success: false };

    }

  },


  createShow: async (data, token) => {

    try {

      const res = await fetch(`${API_URL}/shows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      return result;

    } catch (error) {

      console.error("createShow error:", error);
      return { success: false };

    }

  },


  deleteShow: async (id, token) => {

    try {

      const res = await fetch(`${API_URL}/shows/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return res.json();

    } catch (error) {

      console.error("deleteShow error:", error);
      return { success: false };

    }

  },


  /* ==================== DASHBOARD ==================== */

  getDashboardStats: async (token) => {

    try {

      const res = await fetch(`${API_URL}/dashboard`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return res.json();

    } catch (error) {

      console.error("Dashboard API error:", error);

      return {
        success: true,
        data: {
          totalBookings: 0,
          totalRevenue: 0,
          activeShows: [],
          totalUsers: 0,
        },
      };

    }

  },


  /* ==================== OMDB MOVIES ==================== */

  getNowPlayingMovies: async () => {

    try {
      const apiKey = import.meta.env.VITE_OMDB_API_KEY;
      const searchTerms = [
        "Joker",
        "Gladiator",
        "Deadpool",
        "Spider",
        "Wicked",
        "Moana",
        "Venom",
        "Paddington",
      ];

      const responses = await Promise.all(
        searchTerms.map(async (term) => {
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(term)}&type=movie&page=1`
          );
          const data = await res.json();
          return data.Search || [];
        })
      );

      const merged = responses.flat();
      const uniqueMovies = Array.from(
        new Map(merged.map((movie) => [movie.imdbID, movie])).values()
      );

      // Normalize for MovieCard
      const normalized = uniqueMovies.map(movie => ({
        ...movie,
        id: movie.imdbID,
        poster: movie.Poster,
        title: movie.Title,
        release_date: movie.Year, // OMDB only gives Year in search
      }));

      return {
        success: true,
        results: normalized,
      };

    } catch (error) {

      console.error("OMDB API error:", error);

      return {
        success: true,
        results: []
      };

    }

  },

  getMoviesByCategory: async (category) => {
    try {
      const apiKey = import.meta.env.VITE_OMDB_API_KEY;
      
      let searchTerms = [];
      if (category === 'now_playing') {
        searchTerms = ["Dune", "Civil War", "Godzilla", "Kung Fu Panda", "The Fall Guy"];
      } else if (category === 'upcoming') {
        searchTerms = ["Joker Folie", "Gladiator II", "Sonic", "Moana 2", "Mufasa"];
      } else if (category === 'recent') {
        searchTerms = ["Oppenheimer", "Barbie", "Poor Things", "Napoleon", "Wonka"];
      } else {
        searchTerms = ["Movie"];
      }

      const responses = await Promise.all(
        searchTerms.map(async (term) => {
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(term)}&type=movie&page=1`
          );
          const data = await res.json();
          return data.Search || [];
        })
      );

      const merged = responses.flat();
      const uniqueMovies = Array.from(
        new Map(merged.map((movie) => [movie.imdbID, movie])).values()
      ).filter(m => m.Poster !== 'N/A');

      const normalized = uniqueMovies.map(movie => ({
        ...movie,
        id: movie.imdbID,
        poster: movie.Poster,
        title: movie.Title,
        release_date: movie.Year,
      }));

      return { success: true, results: normalized };
    } catch (error) {
      console.error("getMoviesByCategory error:", error);
      return { success: false, results: [] };
    }
  },


  getTheaters: async () => {

    try {

      const res = await fetch(`${API_URL}/theaters`);
      return res.json();

    } catch (error) {

      console.error("getTheaters error:", error);
      return { success: false, data: [] };

    }

  },


  /* ==================== BOOKINGS ==================== */

  getMyBookings: async (token) => {

    try {

      const res = await fetch(`${API_URL}/bookings/my-bookings`, {
        headers: {
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      });

      return res.json();

    } catch (error) {

      console.error("getMyBookings error:", error);
      return { success: false };

    }

  },


  createBooking: async (data, token) => {

    try {

      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
        body: JSON.stringify(data),
      });

      return res.json();

    } catch (error) {

      console.error("createBooking error:", error);
      return { success: false };

    }

  },


  /* ==================== ADMIN BOOKINGS ==================== */

  getAllBookings: async (token) => {

    try {

      const res = await fetch(`${API_URL}/bookings`, {
        headers: {
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      });

      return res.json();

    } catch (error) {

      console.error("getAllBookings error:", error);
      return { success: false };

    }

  },


  deleteBooking: async (id, token) => {

    try {

      const res = await fetch(`${API_URL}/bookings/cancel/${id}`, {

        method: "DELETE",
        headers: {
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response received:", text);
        return { success: false, error: `Server error: ${res.status}` };
      }


    } catch (error) {

      console.error("deleteBooking error:", error);
      return { success: false };

    }

  }

};