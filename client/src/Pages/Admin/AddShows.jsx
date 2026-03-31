import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import Loading from "../../Components/Loading";
import Title from "../../Components/Admin/Title";
import { api } from "../../Lib/api.js";

const AddShows = () => {

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState("");
  const [addToAllTheaters, setAddToAllTheaters] = useState(false);
  const [dateTimeSection, setDateTimeSection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { getToken } = useAuth();

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {

    const fetchData = async () => {

      try {

        setFetchLoading(true);

        const [moviesRes, theatersRes] = await Promise.all([
          api.getNowPlayingMovies(),
          api.getTheaters()
        ]);

        if (moviesRes.success) {

          const movies = moviesRes.results.map(movie => ({
            id: movie.imdbID,
            title: movie.Title,
            poster: movie.Poster
          }));

          setNowPlayingMovies(movies);
        }

        if (theatersRes.success) {

          setTheaters(theatersRes.data);
          setSelectedTheater(theatersRes.data?.[0]?._id);

        }

      } catch (error) {

        console.error("Fetch error:", error);

      } finally {

        setFetchLoading(false);

      }

    };

    fetchData();

  }, []);

  /* ---------------- ADD DATE ---------------- */

  const handleDateTimeAdd = () => {

    if (!dateTimeInput) return;

    const [date, time] = dateTimeInput.split("T");

    setDateTimeSection(prev => ({
      ...prev,
      [date]: [...(prev[date] || []), time]
    }));

    setDateTimeInput("");

  };


  /* ---------------- CREATE SHOW ---------------- */

  const handleAddShow = async () => {

    try {

      if (!selectedMovie) {
        alert("Select Movie");
        return;
      }

      if (!showPrice) {
        alert("Enter show price");
        return;
      }

      if (!Object.keys(dateTimeSection).length) {
        alert("Add show time");
        return;
      }

      setSubmitLoading(true);

      const token = await getToken();

      const movie = nowPlayingMovies.find(
        m => m.id === selectedMovie
      );

      // Determine which theaters to create shows for
      const theatersToUse = addToAllTheaters 
        ? theaters.map(t => t._id)
        : [selectedTheater];

      let createdCount = 0;

      for (const theaterId of theatersToUse) {
        for (const [date, times] of Object.entries(dateTimeSection)) {
          for (const time of times) {
            try {
              await api.createShow({
                movie,
                theater: theaterId,
                showDateTime: `${date}T${time}`,
                showPrice
              }, token);
              createdCount++;
            } catch (err) {
              console.error(`Failed to create show for theater ${theaterId}:`, err);
            }
          }
        }
      }

      alert(`Shows Created Successfully! Created ${createdCount} shows across ${theatersToUse.length} theater(s).`);

      setSelectedMovie(null);
      setShowPrice("");
      setDateTimeSection({});
      setAddToAllTheaters(false);

    } catch (error) {

      console.error("Create error:", error);

    } finally {

      setSubmitLoading(false);

    }

  };


  return (

    <div className="p-6">

      <Title text1="Add" text2="Shows" />

      {fetchLoading ? (

        <Loading />

      ) : (

        <>

          {/* Movies */}

          <div className="flex gap-4 flex-wrap mt-6">

            {nowPlayingMovies.map(movie => (

              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie.id)}
                className={`cursor-pointer w-40 border rounded p-2 
                ${selectedMovie === movie.id ? "border-green-500" : ""}`}
              >

                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-60 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://dummyimage.com/300x450/000/fff&text=No+Image";
                  }}
                />

                <p className="text-sm mt-2">{movie.title}</p>

              </div>

            ))}

          </div>


          {/* Show Price */}

          <input
            type="number"
            placeholder="Show Price"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            className="mt-6 p-2 border rounded"
          />


          {/* Theater Selection */}

          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Theater
            </label>
            
            <select
              value={selectedTheater}
              onChange={(e) => setSelectedTheater(e.target.value)}
              disabled={addToAllTheaters}
              className={`block w-full p-3 rounded-lg border-2 transition-colors ${
                addToAllTheaters 
                  ? "bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 border-primary/50 text-white focus:border-primary focus:outline-none"
              }`}
            >
              {theaters.map(theater => (
                <option key={theater._id} value={theater._id} className="bg-gray-800">
                  {theater.name}
                </option>
              ))}
            </select>

            {/* Add to All Theaters Option */}
            <label className="flex items-center gap-3 mt-4 cursor-pointer group">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                addToAllTheaters 
                  ? "bg-primary border-primary" 
                  : "border-gray-500 group-hover:border-primary/50"
              }`}>
                {addToAllTheaters && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={addToAllTheaters}
                onChange={(e) => setAddToAllTheaters(e.target.checked)}
                className="hidden"
              />
              <span className={`text-sm font-medium transition-colors ${
                addToAllTheaters ? "text-primary" : "text-gray-300 group-hover:text-white"
              }`}>
                Add to ALL Theaters ({theaters.length} theaters)
              </span>
            </label>
          </div>


          {/* Date Time */}

          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="mt-4 p-2 border rounded"
          />


          <button
            onClick={handleDateTimeAdd}
            className="ml-3 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>


          {/* Create Button */}

          <button
            onClick={handleAddShow}
            className="block mt-6 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg font-semibold shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={submitLoading}
          >
            {submitLoading 
              ? "Creating..." 
              : addToAllTheaters 
                ? `Create Shows for All ${theaters.length} Theaters` 
                : "Create Show"
            }
          </button>

        </>

      )}

    </div>

  );

};

export default AddShows;