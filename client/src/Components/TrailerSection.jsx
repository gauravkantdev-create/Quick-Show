import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import BlurCircle from './BlurCircle';
import { dummyTrailers } from '../assets/assets';

const TrailerSection = () => {
  const playerRef = useRef(null);
  const progressInterval = useRef(null);
  const bufferingTimeout = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const playableTrailers = useMemo(
    () => dummyTrailers.filter(t => t.isPlayable && t.videoId && t.thumbnail),
    []
  );

  const [currentTrailer, setCurrentTrailer] = useState(playableTrailers[0]);

  /* ------------------ INIT YOUTUBE ------------------ */

  useEffect(() => {
    if (!playableTrailers.length) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    function createPlayer() {
      if (!currentTrailer?.videoId) return;

      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: currentTrailer.videoId,
        playerVars: {
          controls: 0,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
          origin: window.location.origin
        },
        events: {
          onReady,
          onStateChange,
          onError
        }
      });
    }

    function onReady(e) {
      const dur = e.target.getDuration();
      if (!isNaN(dur)) setDuration(dur);
      e.target.mute();
      setIsLoading(false);
    }

    function onStateChange(e) {
      const state = window.YT.PlayerState;

      switch (e.data) {
        case state.BUFFERING:
          bufferingTimeout.current = setTimeout(() => {
            setIsLoading(true);
          }, 400);
          break;

        case state.PLAYING:
          clearTimeout(bufferingTimeout.current);
          setIsLoading(false);
          setIsPlaying(true);
          startProgress();
          break;

        case state.PAUSED:
          clearTimeout(bufferingTimeout.current);
          setIsLoading(false);
          setIsPlaying(false);
          stopProgress();
          break;

        case state.ENDED:
          clearTimeout(bufferingTimeout.current);
          setIsLoading(false);
          setIsPlaying(false);
          stopProgress();
          setProgress(0);
          setCurrentTime(0);
          break;

        case state.UNSTARTED:
          // 🔥 black screen fallback (Dune / Marvel fix)
          setTimeout(() => {
            try {
              playerRef.current?.playVideo();
            } catch {}
          }, 600);
          break;

        default:
          break;
      }
    }

    function onError() {
      handlePlayerError();
    }

    return () => {
      clearInterval(progressInterval.current);
      clearTimeout(bufferingTimeout.current);
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [playableTrailers]);

  /* ------------------ ERROR HANDLING ------------------ */

  const handlePlayerError = useCallback(() => {
    setError('Error loading trailer. Switching…');
    const index = playableTrailers.findIndex(t => t.id === currentTrailer?.id);
    const next = playableTrailers[index + 1] || playableTrailers[0];
    changeTrailer(next);
  }, [currentTrailer, playableTrailers]);

  /* ------------------ PROGRESS ------------------ */

  const startProgress = () => {
    stopProgress();
    progressInterval.current = setInterval(() => {
      if (!playerRef.current) return;
      const cur = playerRef.current.getCurrentTime();
      const dur = playerRef.current.getDuration() || 1;
      setCurrentTime(cur);
      setProgress((cur / dur) * 100);
    }, 1000);
  };

  const stopProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  /* ------------------ CONTROLS ------------------ */

  const togglePlay = () => {
    if (!playerRef.current) return;

    const state = playerRef.current.getPlayerState();
    if (state === window.YT.PlayerState.CUED) {
      playerRef.current.playVideo();
    } else {
      isPlaying
        ? playerRef.current.pauseVideo()
        : playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    isMuted ? playerRef.current.unMute() : playerRef.current.mute();
    setIsMuted(!isMuted);
  };

  const changeTrailer = useCallback((trailer) => {
    if (!trailer || trailer.id === currentTrailer?.id) return;

    setError(null);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setCurrentTrailer(trailer);

    if (playerRef.current) {
      playerRef.current.cueVideoById({
        videoId: trailer.videoId,
        suggestedQuality: 'hd720'
      });
    }
  }, [currentTrailer]);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  /* ------------------ UI ------------------ */

  return (
    <div id="trailer-section" className="w-full overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-black relative">
      <BlurCircle top="-100px" right="-100px" />

      {error && (
        <div className="max-w-6xl mx-auto mb-4 sm:mb-6 px-3 sm:px-4 py-2 sm:py-3 bg-red-900/40 text-red-200 rounded text-xs sm:text-sm">
          {error}
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto mb-8 sm:mb-10 md:mb-12">
        <div className="relative aspect-video bg-black rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">
          {isLoading && (
            <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-600 animate-spin" />
            </div>
          )}

          <div id="youtube-player" className="w-full h-full" />

          <div className="absolute bottom-0 w-full p-2 sm:p-3 md:p-4 bg-gradient-to-t from-black/90">
            <div className="h-1 sm:h-1.5 bg-gray-700 rounded mb-2 sm:mb-3">
              <div className="h-full bg-red-600" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex justify-between items-center text-white gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={togglePlay} className="flex-shrink-0">
                  {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
                <span className="text-xs sm:text-sm text-gray-300 whitespace-nowrap">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <button onClick={toggleMute} className="flex-shrink-0">
                {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MORE TRAILERS */}
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 px-3 sm:px-4">More Trailers</h2>
        <div className="w-full overflow-x-auto pb-4">
          <div className="flex gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4" style={{ width: 'max-content' }}>
        {playableTrailers.map(trailer => (
          <div
            key={trailer.id}
            onClick={() => changeTrailer(trailer)}
            className={`flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 cursor-pointer rounded-lg sm:rounded-xl overflow-hidden transition ${
              currentTrailer.id === trailer.id
                ? 'ring-2 ring-red-500'
                : 'hover:ring-2 hover:ring-white/50'
            }`}
          >
            <img src={trailer.thumbnail} alt={trailer.title} className="w-full aspect-video object-cover" />
            <div className="p-2 sm:p-3 bg-black/80 text-white text-xs sm:text-sm font-semibold truncate">
              {trailer.title}
            </div>
          </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerSection;
 