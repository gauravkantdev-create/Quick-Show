import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import Loading from "../../Components/Loading";
import Title from "../../Components/Admin/Title";
import { api } from "../../Lib/api.js";

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='280' viewBox='0 0 500 280'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%231a1a2e'/%3E%3Cstop offset='100%25' stop-color='%2316213e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='500' height='280'/%3E%3Ctext fill='%23555' font-family='Arial' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

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

  /* ---------------- FETCH MOVIES ---------------- */

  useEffect(() => {

    const fetchMovies = async () => {

      try {

        setFetchLoading(true);

        const [moviesRes, theatersRes] = await Promise.all([
          api.getNowPlayingMovies(),
          api.getTheaters(),
        ]);

        if (moviesRes.success && moviesRes.results?.length > 0) {

          // 🔥 REMOVE DUPLICATES
          const uniqueMovies = Array.from(
            new Map(
              moviesRes.results.map(movie => [movie.imdbID, movie])
            ).values()
          );

          const movies = uniqueMovies.map((movie) => ({
            
            id: movie.imdbID,
            imdbID: movie.imdbID,
            title: movie.Title,
            release_date: movie.Year,
            poster: movie.Poster,
            poster_path: movie.Poster,
            vote_average: 0

          }));

          setNowPlayingMovies(movies);

        }

        if (theatersRes.success && theatersRes.data?.length > 0) {
          setTheaters(theatersRes.data);
          setSelectedTheater(theatersRes.data[0]._id);
        }

      } catch (error) {

        console.error(error);

      } finally {

        setFetchLoading(false);

      }

    };

    fetchMovies();

  }, []);


  /* ---------------- ADD DATE ---------------- */

  const handleDateTimeAdd = () => {

    if (!dateTimeInput) return;

    const [date, time] = dateTimeInput.split("T");

    setDateTimeSection((prev) => {

      const times = prev[date] || [];

      return {

        ...prev,
        [date]: [...times, time]

      };

    });

    setDateTimeInput("");

  };


  /* ---------------- CREATE SHOW ---------------- */

  const handleAddShow = async () => {

    if (!selectedMovie) {
      alert("Please select a movie");
      return;
    }

    if (!selectedTheater && !addToAllTheaters) {
      alert("Please select a theater or check 'Create in all theaters'");
      return;
    }

    if (showPrice === '' || Number(showPrice) <= 0) {
      alert("Show price must be greater than 0");
      return;
    }

    if (Object.keys(dateTimeSection).length === 0) {
      alert("Add at least one show date and time");
      return;

    }

    try {

      setSubmitLoading(true);
      let createdCount = 0;
      let skippedCount = 0;

      const token = await getToken();
      if (!token) {
        alert("Please login again to continue");
        return;
      }

      const movie = nowPlayingMovies.find(
        (m) => m.id === selectedMovie
      );
      const theaterIds = addToAllTheaters
        ? theaters.map((theater) => theater._id)
        : [selectedTheater];

      if (theaterIds.length === 0) {
        alert("No theaters available");
        return;
      }

      for (const theaterId of theaterIds) {
        for (const [date, times] of Object.entries(dateTimeSection)) {

          for (const time of times) {

            const response = await api.createShow({

              movie,
              theater: theaterId,
              showDateTime: `${date}T${time}`,
              showPrice

            }, token);

            if (!response.success) {
              if ((response.error || "").toLowerCase().includes("already exists")) {
                skippedCount += 1;
                continue;
              }
              throw new Error(response.error || "Failed to create show");
            }
            createdCount += 1;

          }
        }
      }

      alert(`Shows created: ${createdCount} | duplicates skipped: ${skippedCount}`);

      setSelectedMovie(null);
      setShowPrice("");
      setDateTimeSection({});

    } catch (error) {

      console.error(error);

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
        
        <p className="mt-8 text-lg font-semibold">
          Now Playing Movies
        </p>

        {/* Movies */}

        <div className="flex gap-5 mt-6 flex-wrap">

          {nowPlayingMovies.map((movie) => (

            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie.id)}
              className={`cursor-pointer w-40 border rounded-lg p-2 transition
              ${selectedMovie === movie.id ? "border-primary scale-105" : "border-gray-700"}
              `}
            >

              <img
                src={movie.poster || movie.poster_path}
                onError={(e)=>{
                  // Prevent infinite loop
                  if (e.target.getAttribute('data-error-handled') === 'true') {
                    return;
                  }
                  
                  const currentSrc = e.target.src;
                  // Try to fix Amazon image URL if it has size parameter
                  if (currentSrc.includes('media-amazon.com') && currentSrc.includes('_V1_') && !currentSrc.endsWith('_V1_.jpg')) {
                    const fullResUrl = currentSrc.replace(/_V1_.*\.jpg$/i, '_V1_.jpg');
                    if (fullResUrl !== currentSrc) {
                      e.target.src = fullResUrl;
                      return;
                    }
                  }
                  
                  // Fallback to placeholder
                  e.target.setAttribute('data-error-handled', 'true');
                  e.target.src = PLACEHOLDER_IMG;
                }}
                className="w-full h-60 object-cover rounded bg-gray-800"
              />

              <p className="mt-2 text-sm">
                {movie.title}
              </p>

            </div>

          ))}

        </div>


        {/* Price */}

        <div className="mt-6">

          <input
            type="number"
            placeholder="Show Price"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            className="p-2 border bg-black rounded"
          />

        </div>

        {/* Theater */}
        <div className="mt-4">
          <label className="flex items-center gap-2 mb-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={addToAllTheaters}
              onChange={(e) => setAddToAllTheaters(e.target.checked)}
            />
            Create this show in all theaters
          </label>

          <select
            value={selectedTheater}
            onChange={(e) => setSelectedTheater(e.target.value)}
            disabled={addToAllTheaters}
            className="p-2 border bg-black rounded min-w-64 disabled:opacity-60"
          >
            {theaters.length === 0 && (
              <option value="">No theaters available</option>
            )}
            {theaters.map((theater) => (
              <option key={theater._id} value={theater._id}>
                {theater.name} - {theater.location}
              </option>
            ))}
          </select>
        </div>


        {/* Date */}

        <div className="mt-6">

          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e)=>setDateTimeInput(e.target.value)}
            className="p-2 bg-black border rounded"
          />

          <button
            onClick={handleDateTimeAdd}
            className="ml-3 px-4 py-2 bg-primary rounded"
          >
            Add
          </button>

        </div>


        <button
          onClick={handleAddShow}
          className="mt-6 px-6 py-2 bg-primary rounded"
        >
          {submitLoading ? "Creating..." : "Create Show"}
        </button>

        </>

      )}

    </div>

  );

};

export default AddShows;