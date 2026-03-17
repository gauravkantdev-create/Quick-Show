
import React, { useState, useEffect } from "react";
import Loading from "../../Components/Loading";
import Title from "../../Components/Admin/Title";
import { CheckIcon, Star, X } from "lucide-react";
import { kConverter } from "../../Lib/kConverter";
import { api } from "../../Lib/api.js";
import { dummyCastsData } from "../../assets/assets";
import { useUser } from "@clerk/clerk-react";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";


  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSection, setDateTimeSection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const { isLoaded, isSignedIn } = useUser();
const [fetchLoading, setFetchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setFetchLoading(true);
        const key =
          import.meta.env.VITE_TMDB_API_KEY || "b0ae498d04a2e38a0fc868cfba63838d";
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=1`
        );
        if (!res.ok) throw new Error("TMDB fetch failed");
        const data = await res.json();
        const movies = data.results.map((m) => ({
          id: m.id,
          title: m.title,
          overview: m.overview,
          poster_path: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
          vote_average: m.vote_average,
          vote_count: m.vote_count,
          release_date: m.release_date,
          casts: dummyCastsData.slice(0, 8),
          genres: m.genre_ids.map((id) => ({ id })),
        }));
        setNowPlayingMovies(movies);
      } catch (err) {
        console.error("TMDB Error:", err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // ─── Date/Time Handlers ──────────────────────────────────────────────────────
  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSection((prev) => {
      const times = prev[date] || [];
      if (times.includes(time)) return prev;
      return { ...prev, [date]: [...times, time] };
    });
    setDateTimeInput("");
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSection((prev) => {
      const updatedTimes = prev[date].filter((t) => t !== time);
      if (!updatedTimes.length) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: updatedTimes };
    });
  };

  // ─── Submit Handler ──────────────────────────────────────────────────────────
  const handleAddShow = async () => {
    if (
      !selectedMovie ||
      !showPrice ||
      Object.keys(dateTimeSection).length === 0
    ) {
      alert("Please select a movie, set a price, and add at least one time.");
      return;
    }
    try {
      setSubmitLoading(true);
      const token = localStorage.getItem("token") || "";
      const movie = nowPlayingMovies.find((m) => m.id === selectedMovie);
      const price = parseInt(showPrice);
      let successCount = 0;

      for (const [date, times] of Object.entries(dateTimeSection)) {
        for (const time of times) {
          const showDateTime = `${date}T${time}`;
          const result = await api.createShow(
            { movie, showDateTime, showPrice: price },
            token
          );
          if (result.success) successCount++;
        }
      }

      alert(`✅ Created ${successCount} show(s) successfully!`);
      setSelectedMovie(null);
      setShowPrice("");
      setDateTimeSection({});
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Title text1="Add" text2="Shows" />

      {fetchLoading ? (
        <Loading />
      ) : nowPlayingMovies.length === 0 ? (
        <p className="mt-10 text-gray-400">
          No movies loaded. Check console for errors.
        </p>
      ) : (
        <>
          {/* 🎬 Movie Grid */}
          <p className="mt-10 text-lg font-medium">Now Playing — TMDB</p>
          <div className="flex flex-wrap gap-4 mt-4">
            {nowPlayingMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() =>
                  setSelectedMovie(
                    selectedMovie === movie.id ? null : movie.id
                  )
                }
                className="relative max-w-40 cursor-pointer transition duration-300 hover:-translate-y-1"
              >
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-60 object-cover brightness-90"
                  />
                  <div className="text-sm flex items-center justify-between p-2 bg-black/70 absolute bottom-0 w-full">
                    <p className="flex items-center gap-1 text-gray-400">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      {movie.vote_average.toFixed(1)}
                    </p>
                    <p className="text-gray-300">
                      {kConverter(movie.vote_count)} votes
                    </p>
                  </div>
                </div>

                {selectedMovie === movie.id && (
                  <div className="absolute top-2 right-2 bg-primary h-6 w-6 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                )}

                <div className="mt-2">
                  <p className="font-medium truncate">{movie.title}</p>
                  <p className="text-gray-400 text-sm">{movie.release_date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 💰 Show Price */}
          <div className="mt-8">
            <label className="block text-sm font-medium mb-2">
              Show Price ({currency})
            </label>
            <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md bg-black">
              <span className="text-gray-400 text-sm">{currency}</span>
              <input
                type="number"
                min={0}
                value={showPrice}
                onChange={(e) => setShowPrice(e.target.value)}
                placeholder="Enter show price"
                className="outline-none bg-transparent text-white"
              />
            </div>
          </div>

          {/* 📅 Date & Time */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Select Date & Time
            </label>
            <div className="flex gap-3 border border-gray-600 p-2 rounded-lg bg-black">
              <input
                type="datetime-local"
                value={dateTimeInput}
                onChange={(e) => setDateTimeInput(e.target.value)}
                className="flex-1 outline-none bg-transparent text-white"
              />
              <button
                onClick={handleDateTimeAdd}
                disabled={!dateTimeInput}
                className="bg-primary/80 px-3 py-2 text-sm rounded-lg hover:bg-primary transition disabled:opacity-50"
              >
                Add Time
              </button>
            </div>

            {/* Selected Times Display */}
            {Object.keys(dateTimeSection).length > 0 && (
              <div className="mt-4 space-y-3">
                {Object.entries(dateTimeSection).map(([date, times]) => (
                  <div
                    key={date}
                    className="border border-gray-600 rounded-lg p-3"
                  >
                    <p className="text-sm font-medium mb-2">{date}</p>
                    <div className="flex flex-wrap gap-2">
                      {times.map((time) => (
                        <div
                          key={time}
                          className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-md"
                        >
                          <span className="text-sm">{time}</span>
                          <X
                            className="w-4 h-4 cursor-pointer hover:text-red-500"
                            onClick={() => handleRemoveTime(date, time)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🚀 Submit */}
          <button
            onClick={handleAddShow}
            disabled={submitLoading || !isSignedIn}
            className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitLoading ? "Creating..." : "Create Shows"}
          </button>
        </>
      )}
    </div>
  );
};

export default AddShows;