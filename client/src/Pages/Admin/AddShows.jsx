import React, { useState, useEffect } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../Components/Loading";
import Title from "../../Components/Admin/Title";
import { CheckIcon, Star, X } from "lucide-react";
import { kConverter } from "../../Lib/kConverter";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSection, setDateTimeSection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");

  useEffect(() => {
    setNowPlayingMovies(dummyShowsData);
  }, []);

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

  return nowPlayingMovies.length ? (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Title text1="Add" text2="Shows" />

      {/* 🎬 Movies */}
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>

      <div className="flex flex-wrap gap-4 mt-4">
        {nowPlayingMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() =>
              setSelectedMovie(selectedMovie === movie.id ? null : movie.id)
            }
            className="relative max-w-40 cursor-pointer transition duration-300 hover:-translate-y-1"
          >
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-full object-cover brightness-90"
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
              <p className="text-gray-400 text-sm">
                {movie.release_date}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 💰 Show Price */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">
          Show Price
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
            className="outline-none bg-transparent text-white"
          />

          <button
            onClick={handleDateTimeAdd}
            className="bg-primary/80 px-3 py-2 text-sm rounded-lg hover:bg-primary transition"
          >
            Add Time
          </button>
        </div>

        {/* Display Selected Times */}
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
                        onClick={() =>
                          handleRemoveTime(date, time)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    <button className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer">
    Add Show </button>



    </div>
  ) : (
    <Loading />
  );
};

export default AddShows;
