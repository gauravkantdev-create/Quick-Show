const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const FALLBACK_MOVIES = [
  {
    imdbID: "tt1877830",
    Title: "The Batman",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BM2Y0OTc0MWQtNTVhZi00NDA1LWIxM2UtMWU3YWQ1M2I0M2MxXkEyXkFqcGc@._V1_SX300.jpg",
    Year: "2022",
  },
  {
    imdbID: "tt15398776",
    Title: "Oppenheimer",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzBlN2EzYTQtZDJmYi00MTk1LWI0YTAtNWQ4ZjI3ZjQxN2EwXkEyXkFqcGc@._V1_SX300.jpg",
    Year: "2023",
  },
  {
    imdbID: "tt9362722",
    Title: "Spider-Man: Across the Spider-Verse",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMDhhZDhmOWQtZmM5Yi00YWMwLWE0YjEtZjIxN2FiNjJmZmQxXkEyXkFqcGc@._V1_SX300.jpg",
    Year: "2023",
  },
  {
    imdbID: "tt6263850",
    Title: "Deadpool & Wolverine",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYTFkOTRkZTQtM2Y5YS00YjA4LTk2MDItM2Q2ZDVmZjQyODNhXkEyXkFqcGc@._V1_SX300.jpg",
    Year: "2024",
  },
];

const normalizeMovie = (movie) => ({
  ...movie,
  id: movie.imdbID,
  poster: movie.Poster,
  title: movie.Title,
  release_date: movie.Year,
});

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

      if (!res.ok) {
        return {
          success: false,
          error: result.error || result.message || "Failed to create show",
        };
      }

      return result;
    } catch (error) {
      console.error("createShow error:", error);
      return {
        success: false,
        error: "Unable to reach the show service",
      };
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
      if (!apiKey) {
        return {
          success: true,
          results: FALLBACK_MOVIES.map(normalizeMovie),
          source: "fallback",
        };
      }

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

      const normalizedSource =
        uniqueMovies.length > 0 ? uniqueMovies : FALLBACK_MOVIES;

      return {
        success: true,
        results: normalizedSource.map(normalizeMovie),
        source: uniqueMovies.length > 0 ? "omdb" : "fallback",
      };
    } catch (error) {
      console.error("OMDB API error:", error);

      return {
        success: true,
        results: FALLBACK_MOVIES.map(normalizeMovie),
        source: "fallback",
      };
    }
  },

  getMoviesByCategory: async (category) => {
    try {
      const apiKey = import.meta.env.VITE_OMDB_API_KEY;

      let searchTerms = [];
      if (category === "now_playing") {
        searchTerms = ["Dune", "Civil War", "Godzilla", "Kung Fu Panda", "The Fall Guy"];
      } else if (category === "upcoming") {
        searchTerms = ["Joker Folie", "Gladiator II", "Sonic", "Moana 2", "Mufasa"];
      } else if (category === "recent") {
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
      ).filter((movie) => movie.Poster !== "N/A");

      const normalized = uniqueMovies.map(normalizeMovie);

      return { success: true, results: normalized };
    } catch (error) {
      console.error("getMoviesByCategory error:", error);
      return { success: false, results: [] };
    }
  },

  getTheaters: async () => {
    try {
      const res = await fetch(`${API_URL}/theaters`);
      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          data: [],
          error: result.error || result.message || "Failed to fetch theaters",
        };
      }

      return result;
    } catch (error) {
      console.error("getTheaters error:", error);
      return {
        success: false,
        data: [],
        error: "Unable to reach the theater service",
      };
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
      }

      const text = await res.text();
      console.error("Non-JSON response received:", text);
      return { success: false, error: `Server error: ${res.status}` };
    } catch (error) {
      console.error("deleteBooking error:", error);
      return { success: false };
    }
  },

  /* ==================== PAYMENTS ==================== */

  createPaymentOrder: async (bookingId, token) => {
    try {
      const res = await fetch(`${API_URL}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ bookingId }),
      });
      return res.json();
    } catch (error) {
      console.error("createPaymentOrder error:", error);
      return { success: false };
    }
  },

  verifyPayment: async (paymentData, token) => {
    try {
      const res = await fetch(`${API_URL}/payments/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(paymentData),
      });
      return res.json();
    } catch (error) {
      console.error("verifyPayment error:", error);
      return { success: false };
    }
  },

  getPaymentStatus: async (bookingId, token) => {
    try {
      const res = await fetch(`${API_URL}/payments/status/${bookingId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      return res.json();
    } catch (error) {
      console.error("getPaymentStatus error:", error);
      return { success: false };
    }
  },
};
