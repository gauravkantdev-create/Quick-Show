import React, { useState, useEffect } from 'react';
import { api } from '../Lib/api';
import MovieCard from '../Components/MovieCard';
import Loading from '../Components/Loading';
import BlurCircle from '../Components/BlurCircle';
import { Play, Rocket } from 'lucide-react';

const Releases = () => {
  const [sections, setSections] = useState({
    now_playing: [],
    upcoming: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllReleases = async () => {
    setIsLoading(true);
    try {
      const response = await api.getShows();
      
      let nowPlaying = [];
      let upcomingHits = [];
      if (response.success) {
        const showsArray = Array.isArray(response.data) ? response.data : 
                           Array.isArray(response.shows) ? response.shows : [];

        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Group shows by movie ID and collect all show dates
        const movieShows = {};
        for (const show of showsArray) {
          const movie = show?.movie;
          if (!movie) continue;
          const movieId = movie.id || movie._id || movie.imdbID;
          if (!movieId) continue;
          
          if (!movieShows[movieId]) {
            movieShows[movieId] = { movie: { ...movie, id: movieId, showPrice: show.showPrice }, dates: [] };
          }
          movieShows[movieId].dates.push(new Date(show.showDateTime));
        }

        // Categorize based on the earliest show
        for (const [movieId, data] of Object.entries(movieShows)) {
          const minDate = new Date(Math.min(...data.dates));
          if (minDate > nextWeek) {
            upcomingHits.push(data.movie);
          } else {
            nowPlaying.push(data.movie);
          }
        }
      }

      setSections({
        now_playing: nowPlaying,
        upcoming: upcomingHits,
      });

    } catch (error) {
      console.error("Error fetching releases from DB:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReleases();
  }, []);

  if (isLoading) return <Loading />;

  const ReleaseSection = ({ title, movies, icon: Icon, color }) => (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-8 px-4">
        <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          {title}
        </h2>
        <div className="flex-grow h-[1px] bg-gradient-to-r from-white/10 to-transparent ml-4" />
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 bg-white/5 rounded-2xl border border-white/5 mx-4">
          No active shows found. Admin must add shows first.
        </div>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-white pt-10 pb-20 overflow-hidden">
      {/* Background Decor */}
      <BlurCircle top="-10%" left="-10%" color="bg-primary/20" />
      <BlurCircle bottom="10%" right="-5%" color="bg-blue-600/10" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <header className="text-center mb-16 px-4">
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            LATEST RELEASES
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Stay ahead of the curve with the most anticipated movies and currently playing hits.
          </p>
        </header>

        <ReleaseSection 
          title="Now Playing" 
          movies={sections.now_playing} 
          icon={Play}
          color="bg-primary"
        />

        {sections.upcoming.length > 0 && (
          <ReleaseSection 
            title="Upcoming Hits" 
            movies={sections.upcoming} 
            icon={Rocket}
            color="bg-blue-500"
          />
        )}

      </div>
    </div>
  );
};

export default Releases;
