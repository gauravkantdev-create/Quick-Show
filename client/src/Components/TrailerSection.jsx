import { useEffect, useMemo, useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import BlurCircle from './BlurCircle';
import { api } from '../Lib/api';

const DEFAULT_TRAILER_ID = 'mqqft2x_Aa4';

const TrailerSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isResolvingTrailer, setIsResolvingTrailer] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [trailerIdByMovie, setTrailerIdByMovie] = useState({});
  const [currentTrailerId, setCurrentTrailerId] = useState(null);

  /* ------------------ FETCH MOVIES ------------------ */
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.getShows();
        const showsArray = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.shows)
            ? response.shows
            : [];

        if (response.success && showsArray.length > 0) {
          const uniqueMoviesMap = new Map();
          showsArray.forEach(show => {
            const movie = show?.movie;
            if (!movie) return;
            const key = String(movie.id || movie._id || movie.imdbID || movie.title || '');
            if (!key) return;
            if (!uniqueMoviesMap.has(key)) {
              uniqueMoviesMap.set(key, movie);
            }
          });
          const uniqueMovies = Array.from(uniqueMoviesMap.values());
          setMovies(uniqueMovies);
          if (uniqueMovies.length > 0) {
            setCurrentTrailer(uniqueMovies[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching movies for trailers:', err);
        setError('Could not load trailers.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const movieKey = (movieObj) => String(movieObj?.id || movieObj?._id || movieObj?.imdbID || movieObj?.title || '');

  const resolveImdbIdByTitle = async (movieObj) => {
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;
    if (!apiKey) return null;
    const title =
      movieObj?.original_title ||
      movieObj?.title ||
      movieObj?.name ||
      movieObj?.original_name;
    if (!title) return null;

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}&type=movie`
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (data?.Response === 'True' && data?.imdbID && String(data.imdbID).startsWith('tt')) {
        return data.imdbID;
      }
    } catch (e) {
      console.warn('OMDb title resolve failed', e);
    }
    return null;
  };

  /* ------------------ FETCH TRAILER VIDEO ID ------------------ */
  const fetchTrailerId = async (movieObj) => {
    if (!movieObj) return DEFAULT_TRAILER_ID;
    const key = movieKey(movieObj);
    if (trailerIdByMovie[key] !== undefined) return trailerIdByMovie[key];

    let imdbId = movieObj.imdbID || movieObj.id;
    if (!imdbId || !String(imdbId).startsWith('tt')) {
      imdbId = await resolveImdbIdByTitle(movieObj);
    }
    if (!imdbId || !String(imdbId).startsWith('tt')) return DEFAULT_TRAILER_ID;

    try {
      const res = await fetch(`https://api.kinocheck.de/movies?imdb_id=${imdbId}`);
      if (!res.ok) return DEFAULT_TRAILER_ID;
      const data = await res.json();
      const kinocheckId =
        data?.trailer?.youtube_video_id ||
        data?.trailers?.[0]?.youtube_video_id ||
        data?.videos?.[0]?.youtube_video_id ||
        data?.movie?.trailer?.youtube_video_id;

      if (kinocheckId) {
        return kinocheckId;
      }
    } catch (e) {
      console.warn('Kinocheck API failed', e);
    }
    return DEFAULT_TRAILER_ID;
  };

  const buildYoutubeEmbedUrl = (_, trailerId) =>
    `https://www.youtube.com/embed/${trailerId || DEFAULT_TRAILER_ID}?autoplay=1&rel=0`;

  const buildYoutubeWatchUrl = (trailerId) =>
    `https://www.youtube.com/watch?v=${trailerId || DEFAULT_TRAILER_ID}`;

  /* ------------------ CORE: PLAY ANY MOVIE ------------------ */
  const playMovie = async (movieObj) => {
    if (!movieObj) return;

    setError(null);
    setIsResolvingTrailer(true);
    setCurrentTrailer(movieObj);

    const key = movieKey(movieObj);
    const videoId = await fetchTrailerId(movieObj);
    setTrailerIdByMovie((prev) => ({ ...prev, [key]: videoId }));
    setCurrentTrailerId(videoId);
    setIsResolvingTrailer(false);
  };

  useEffect(() => {
    const loadFirstTrailer = async () => {
      if (!currentTrailer) return;
      const key = movieKey(currentTrailer);
      if (trailerIdByMovie[key] !== undefined) {
        setCurrentTrailerId(trailerIdByMovie[key]);
        return;
      }
      setIsResolvingTrailer(true);
      const videoId = await fetchTrailerId(currentTrailer);
      setTrailerIdByMovie((prev) => ({ ...prev, [key]: videoId }));
      setCurrentTrailerId(videoId);
      setIsResolvingTrailer(false);
    }
    loadFirstTrailer();
  }, [currentTrailer]);

  const isActiveTrailer = (trailer) =>
    currentTrailer?.id === trailer.id ||
    currentTrailer?.imdbID === trailer.imdbID;

  const currentPoster = useMemo(() => {
    if (!currentTrailer) return 'https://via.placeholder.com/1280x720?text=No+Trailer';
    let imgUrl = currentTrailer.backdrop_path || currentTrailer.poster_path;
    if (imgUrl && imgUrl.startsWith('http') && imgUrl.includes('media-amazon.com')) {
      return imgUrl.replace(/_V1_.*\.jpg$/i, '_V1_SX1000.jpg');
    }
    if (imgUrl && !imgUrl.startsWith('http')) {
      return `https://image.tmdb.org/t/p/w1280${imgUrl}`;
    }
    return imgUrl || 'https://via.placeholder.com/1280x720?text=No+Trailer';
  }, [currentTrailer]);

  /* ------------------ UI ------------------ */
  return (
    <div
      id="trailer-section"
      className="w-full overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-black relative"
    >
      <BlurCircle top="-100px" right="-100px" />

      {error && (
        <div className="max-w-6xl mx-auto mb-4 sm:mb-6 px-3 sm:px-4 py-2 sm:py-3 bg-red-900/40 text-red-200 rounded text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* ── Main Player ── */}
      <div className="w-full max-w-6xl mx-auto mb-8 sm:mb-10 md:mb-12">
        <div className="relative aspect-video bg-black rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">
          {(isLoading || isResolvingTrailer) && (
            <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-600 animate-spin" />
            </div>
          )}

          {currentTrailer ? (
            <iframe
              title={currentTrailer?.title || 'Trailer'}
              src={buildYoutubeEmbedUrl(currentTrailer, currentTrailerId)}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full relative">
              <img src={currentPoster} alt={currentTrailer?.title || 'Trailer not available'} className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <p className="text-white text-xl font-semibold mb-2">Trailer not available</p>
                <p className="text-gray-300 text-sm">Trailer is not found for this movie.</p>
              </div>
            </div>
          )}
        </div>

        {/* Now playing info */}
        {currentTrailer && (
          <div className="mt-3 px-1 flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
              NOW PLAYING
            </span>
            <h3 className="text-white text-sm sm:text-base font-semibold truncate">
              {currentTrailer.title}
            </h3>
            <a
              href={buildYoutubeWatchUrl(currentTrailerId)}
              target="_blank"
              rel="noreferrer"
              className="ml-auto text-xs sm:text-sm px-3 py-1 rounded border border-white/20 text-white hover:bg-white/10 transition"
            >
              Watch on YouTube
            </a>
          </div>
        )}
      </div>

      {/* ── More Trailers ── */}
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 px-3 sm:px-4">
          More Trailers
        </h2>

        {movies.length > 0 ? (
          <div className="w-full overflow-x-auto pb-4">
            <div
              className="flex gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4"
              style={{ width: 'max-content' }}
            >
              {movies.map((trailer, index) => {
                let imgUrl = trailer.backdrop_path || trailer.poster_path;
                if (imgUrl && imgUrl.startsWith('http') && imgUrl.includes('media-amazon.com')) {
                  imgUrl = imgUrl.replace(/_V1_.*\.jpg$/i, '_V1_SX500.jpg');
                } else if (imgUrl && !imgUrl.startsWith('http')) {
                  imgUrl = `https://image.tmdb.org/t/p/w500${imgUrl}`;
                }

                const active = isActiveTrailer(trailer);

                return (
                  <div
                    key={`${trailer.id || trailer.imdbID || 'movie'}-${index}`}
                    onClick={() => playMovie(trailer)}
                    className={`flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 cursor-pointer rounded-lg sm:rounded-xl overflow-hidden transition-all duration-200 ${active
                        ? 'ring-2 ring-red-500 scale-105'
                        : 'hover:ring-2 hover:ring-white/50'
                      }`}
                  >
                    <div className="relative group">
                      <img
                        src={imgUrl || 'https://via.placeholder.com/500x281?text=No+Image'}
                        alt={trailer.title}
                        className="w-full aspect-video object-cover"
                      />

                      {/* Hover play overlay */}
                      {!active && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-red-600 rounded-full p-2">
                            <Play className="w-5 h-5 text-white fill-white" />
                          </div>
                        </div>
                      )}

                      {/* Active badge */}
                      {active && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
                          ▶ Playing
                        </div>
                      )}
                    </div>

                    <div
                      className={`p-2 sm:p-3 text-xs sm:text-sm font-semibold truncate transition-colors ${active ? 'bg-red-900/60 text-white' : 'bg-black/80 text-white'
                        }`}
                    >
                      {trailer.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 px-3 sm:px-4">No trailers available.</p>
        )}
      </div>
    </div>
  );
};

export default TrailerSection;