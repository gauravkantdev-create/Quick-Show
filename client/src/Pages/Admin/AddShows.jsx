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
  const [pageError, setPageError] = useState("");
  const [movieSource, setMovieSource] = useState("omdb");

  const { getToken } = useAuth();

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        setPageError("");

        const [moviesRes, theatersRes] = await Promise.all([
          api.getNowPlayingMovies(),
          api.getTheaters(),
        ]);

        if (moviesRes.success) {
          setNowPlayingMovies(moviesRes.results || []);
          setMovieSource(moviesRes.source || "omdb");
        }

        if (theatersRes.success) {
          setTheaters(theatersRes.data || []);
          setSelectedTheater(theatersRes.data?.[0]?._id || "");
        } else {
          setTheaters([]);
          setSelectedTheater("");
          setPageError(theatersRes.error || "Unable to load theaters.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setPageError("Unable to load movies or theaters right now.");
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

    setDateTimeSection((prev) => ({
      ...prev,
      [date]: Array.from(new Set([...(prev[date] || []), time])),
    }));

    setDateTimeInput("");
  };

  /* ---------------- CREATE SHOW ---------------- */

  const handleAddShow = async () => {
    try {
      if (!selectedMovie) {
        alert("Select movie");
        return;
      }

      if (!showPrice || Number(showPrice) <= 0) {
        alert("Enter a valid show price");
        return;
      }

      if (!addToAllTheaters && !selectedTheater) {
        alert("Select theater");
        return;
      }

      if (theaters.length === 0) {
        alert("No theaters found. Fix the database connection and seed theaters first.");
        return;
      }

      if (!Object.keys(dateTimeSection).length) {
        alert("Add show time");
        return;
      }

      setSubmitLoading(true);

      const token = await getToken();

      const movie = nowPlayingMovies.find((entry) => entry.id === selectedMovie);
      if (!movie) {
        alert("Selected movie could not be found. Refresh and try again.");
        return;
      }

      const theatersToUse = addToAllTheaters
        ? theaters.map((theater) => theater._id)
        : [selectedTheater];

      let createdCount = 0;
      const failedMessages = [];

      for (const theaterId of theatersToUse) {
        for (const [date, times] of Object.entries(dateTimeSection)) {
          for (const time of times) {
            const result = await api.createShow(
              {
                movie,
                theater: theaterId,
                showDateTime: `${date}T${time}`,
                showPrice,
              },
              token
            );

            if (result.success) {
              createdCount++;
            } else {
              failedMessages.push(
                `${date} ${time} (${result.error || "Unknown error"})`
              );
            }
          }
        }
      }

      if (createdCount === 0) {
        alert(
          `No shows were created. ${failedMessages[0] || "Please check the database connection and selected theater."}`
        );
        return;
      }

      if (failedMessages.length > 0) {
        alert(
          `Created ${createdCount} show(s), but some failed. First issue: ${failedMessages[0]}`
        );
      } else {
        alert(
          `Shows created successfully. Created ${createdCount} show(s) across ${theatersToUse.length} theater(s).`
        );
      }

      setSelectedMovie(null);
      setShowPrice("");
      setDateTimeSection({});
      setAddToAllTheaters(false);
    } catch (error) {
      console.error("Create error:", error);
      alert("Something went wrong while creating shows.");
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
          {pageError && (
            <div className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {pageError}
            </div>
          )}

          {movieSource === "fallback" && (
            <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Movie search is using the built-in fallback list because OMDB is unavailable right now.
            </div>
          )}

          {/* Movies */}

          <div className="mt-6 flex flex-wrap gap-4">
            {nowPlayingMovies.length === 0 && (
              <div className="rounded-lg border border-gray-700 bg-gray-800/60 px-4 py-6 text-sm text-gray-300">
                No movies available to select right now.
              </div>
            )}

            {nowPlayingMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie.id)}
                className={`w-40 cursor-pointer rounded border p-2 ${
                  selectedMovie === movie.id ? "border-green-500" : "border-gray-700"
                }`}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-60 w-full rounded object-cover"
                  onError={(event) => {
                    event.target.onerror = null;
                    event.target.src =
                      "https://dummyimage.com/300x450/000/fff&text=No+Image";
                  }}
                />

                <p className="mt-2 text-sm">{movie.title}</p>
              </div>
            ))}
          </div>

          {/* Show Price */}

          <input
            type="number"
            placeholder="Show Price"
            value={showPrice}
            onChange={(event) => setShowPrice(event.target.value)}
            className="mt-6 rounded border p-2"
          />

          {/* Theater Selection */}

          <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            <label className="mb-3 block text-sm font-medium text-gray-300">
              Select Theater
            </label>

            <select
              value={selectedTheater}
              onChange={(event) => setSelectedTheater(event.target.value)}
              disabled={addToAllTheaters || theaters.length === 0}
              className={`block w-full rounded-lg border-2 p-3 transition-colors ${
                addToAllTheaters || theaters.length === 0
                  ? "cursor-not-allowed border-gray-600 bg-gray-700 text-gray-500"
                  : "border-primary/50 bg-gray-800 text-white focus:border-primary focus:outline-none"
              }`}
            >
              {theaters.length === 0 && (
                <option value="">No theaters available</option>
              )}

              {theaters.map((theater) => (
                <option key={theater._id} value={theater._id} className="bg-gray-800">
                  {theater.name}
                </option>
              ))}
            </select>

            <label className="group mt-4 flex cursor-pointer items-center gap-3">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                  addToAllTheaters
                    ? "border-primary bg-primary"
                    : "border-gray-500 group-hover:border-primary/50"
                }`}
              >
                {addToAllTheaters && (
                  <svg
                    className="h-3.5 w-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={addToAllTheaters}
                onChange={(event) => setAddToAllTheaters(event.target.checked)}
                className="hidden"
              />
              <span
                className={`text-sm font-medium transition-colors ${
                  addToAllTheaters ? "text-primary" : "text-gray-300 group-hover:text-white"
                }`}
              >
                Add to ALL Theaters ({theaters.length} theaters)
              </span>
            </label>

            {theaters.length === 0 && (
              <p className="mt-3 text-sm text-amber-200">
                Theater list is empty. Once MongoDB connects, run the theater seed script to populate this dropdown.
              </p>
            )}
          </div>

          {/* Date Time */}

          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(event) => setDateTimeInput(event.target.value)}
            className="mt-4 rounded border p-2"
          />

          <button
            onClick={handleDateTimeAdd}
            className="ml-3 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Add
          </button>

          {/* Create Button */}

          <button
            onClick={handleAddShow}
            className="mt-6 block rounded-lg bg-gradient-to-r from-primary to-primary/80 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            disabled={submitLoading || nowPlayingMovies.length === 0 || theaters.length === 0}
          >
            {submitLoading
              ? "Creating..."
              : addToAllTheaters
                ? `Create Shows for All ${theaters.length} Theaters`
                : "Create Show"}
          </button>
        </>
      )}
    </div>
  );
};

export default AddShows;
