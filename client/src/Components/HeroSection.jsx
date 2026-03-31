import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Ticket, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import backgroundImageFallback from "../assets/backgroundImage.png";
import { api } from "../Lib/api";

const INTERVAL = 6000;

const HeroSection = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);

  /* ── RESPONSIVE CHECK ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── FETCH ── */
  useEffect(() => {
    (async () => {
      const res = await api.getShows();
      if (res.success) {
        const raw = res.data
          .filter((s) => s.theater && s.movie) // Only shows with theater and movie
          .map((s) => s.movie);
        const unique = Array.from(
          new Map(raw.map((m) => [m._id || m.title, m])).values()
        );
        setMovies(unique.slice(0, 8));
        setTimeout(() => setLoaded(true), 100);
      } else {
        setLoaded(true);
      }
    })();
  }, []);

  /* ── AUTO-ADVANCE ── */
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (movies.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrent((p) => (p + 1) % movies.length);
      }, INTERVAL);
    }
  }, [movies.length]);

  useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, [resetTimer]);

  const goTo = (idx) => { setCurrent(idx); resetTimer(); };
  const prev = () => goTo((current - 1 + movies.length) % movies.length);
  const next = () => goTo((current + 1) % movies.length);

  /* ── DRAG / SWIPE ── */
  const onDragStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX ?? e.touches?.[0]?.clientX ?? 0);
    setDragOffset(0);
  };
  const onDragMove = (e) => {
    if (!isDragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setDragOffset(x - dragStartX);
  };
  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = isMobile ? 40 : 60;
    if (dragOffset > threshold) prev();
    else if (dragOffset < -threshold) next();
    setDragOffset(0);
  };

  const movie = movies[current];

  /* ── LOADING ── */
  if (!loaded) {
    return (
      <div className="relative h-screen h-[100dvh] bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-red-600/30 rounded-full" />
            <div className="absolute inset-0 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase font-medium">Quick Show</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-[#030303] select-none">

      {/* ════════════════════════════════
          BACKGROUND
      ════════════════════════════════ */}
      {movies.map((m, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-[1800ms] ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            transform: i === current ? "scale(1.05)" : "scale(1.15)",
          }}
        >
          <img
            src={m?.backdrop || m?.poster || backgroundImageFallback}
            alt=""
            className="absolute inset-0 w-full h-full object-cover hero-zoom"
            style={{ filter: "brightness(0.55) saturate(1.2) contrast(1.05)" }}
          />
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-[#030303]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/95 via-[#030303]/40 to-transparent sm:from-[#030303] sm:via-[#030303]/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/50" />
      <div className="absolute bottom-0 left-0 right-0 h-[60%] sm:h-[55%] bg-gradient-to-t from-[#030303] to-transparent" />

      {/* Ambient orbs (smaller on mobile) */}
      <div className="absolute top-[15%] left-[5%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-red-600/[0.04] rounded-full blur-[100px] sm:blur-[150px] hero-orb-1 pointer-events-none" />
      <div className="absolute bottom-[20%] right-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-indigo-500/[0.03] rounded-full blur-[80px] sm:blur-[130px] hero-orb-2 pointer-events-none" />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.015] sm:opacity-[0.02] pointer-events-none z-20 mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />


      {/* ════════════════════════════════
          CONTENT
      ════════════════════════════════ */}
      <div className="relative z-10 h-full flex flex-col justify-between">

        {/* ── Movie Info (center on mobile, left on desktop) ── */}
        <div className="flex-1 flex items-end sm:items-center px-5 sm:px-12 md:px-20 lg:px-28 pb-6 sm:pb-0 pt-20 sm:pt-20">
          <div className="w-full sm:max-w-2xl space-y-3 sm:space-y-5">

            {/* Badge */}
            <div key={`tag-${current}`} className="hero-s1 flex items-center gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white/[0.06] backdrop-blur-2xl rounded-full border border-white/[0.08]">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-50" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
                </span>
                <span className="text-[9px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] font-semibold text-white/70 uppercase">
                  Now Playing
                </span>
              </div>
              <span className="text-white/25 text-[10px] sm:text-[11px] font-mono tabular-nums">
                {String(current + 1).padStart(2, "0")} / {String(movies.length).padStart(2, "0")}
              </span>
            </div>

            {/* Title */}
            <h1
              key={`title-${current}`}
              className="hero-s2 text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1] sm:leading-[0.95] tracking-[-0.02em] sm:tracking-[-0.03em]"
              style={{ textShadow: "0 2px 30px rgba(0,0,0,0.6)" }}
            >
              {movie?.title}
            </h1>

            {/* Accent line */}
            <div key={`accent-${current}`} className="hero-s3 flex items-center gap-3">
              <div className="h-[2px] w-10 sm:w-14 bg-gradient-to-r from-red-600 to-red-600/0 rounded-full" />
              <span className="text-white/25 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-medium">
                Premium Cinema
              </span>
            </div>

            {/* Subtext — hidden on very small screens to save space */}
            <p
              key={`sub-${current}`}
              className="hero-s4 hidden sm:block text-white/35 text-sm sm:text-base font-light max-w-md leading-relaxed"
            >
              Step into the story. Premium seats, immersive sound, unforgettable moments await.
            </p>

            {/* CTA */}
            <div key={`cta-${current}`} className="hero-s5 flex items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={() => navigate(`/movies/${movie?._id || movie?.id}`)}
                className="group relative overflow-hidden bg-red-600 hover:bg-red-500 text-white
                  px-6 sm:px-9 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm
                  flex items-center gap-2 sm:gap-2.5
                  shadow-[0_6px_24px_-4px_rgba(220,38,38,0.6)]
                  sm:shadow-[0_8px_30px_-6px_rgba(220,38,38,0.6)]
                  hover:shadow-[0_12px_45px_-6px_rgba(220,38,38,0.85)]
                  active:scale-[0.96] sm:hover:scale-[1.04]
                  transition-all duration-300 ease-out"
              >
                <Ticket size={14} className="relative z-10 sm:hidden" />
                <Ticket size={15} className="relative z-10 hidden sm:block" />
                <span className="relative z-10 tracking-wide">Get Tickets</span>
                <ArrowRight size={14} className="relative z-10 sm:hidden" />
                <ArrowRight size={15} className="relative z-10 hidden sm:block group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>

              {movie?.imdbRating && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white/[0.05] backdrop-blur-xl rounded-full border border-white/[0.08]">
                  <Star size={11} className="text-amber-400 fill-amber-400 sm:hidden" />
                  <Star size={12} className="text-amber-400 fill-amber-400 hidden sm:block" />
                  <span className="text-white/70 text-[11px] sm:text-xs font-semibold">{movie.imdbRating}</span>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* ════════════════════════════════
            GALLERY CAROUSEL
        ════════════════════════════════ */}
        <div className="relative z-20 pb-4 sm:pb-8">

          {/* Label + Arrows */}
          <div className="flex items-center justify-between px-5 sm:px-12 md:px-20 lg:px-28 mb-3 sm:mb-4">
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-white/20 uppercase font-semibold">
              Featured
            </span>
            <div className="flex gap-1.5 sm:gap-2">
              <button onClick={prev} className="hero-nav-btn group" aria-label="Previous">
                <ChevronLeft size={14} className="text-white/40 group-hover:text-white group-active:text-white transition-colors" />
              </button>
              <button onClick={next} className="hero-nav-btn group" aria-label="Next">
                <ChevronRight size={14} className="text-white/40 group-hover:text-white group-active:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Card Strip */}
          <div
            className="flex items-end justify-center gap-1.5 sm:gap-2.5 md:gap-4 px-2 sm:px-4 md:px-6 overflow-x-auto scrollbar-hide"
            style={{
              perspective: isMobile ? "none" : "1200px",
              cursor: isDragging ? "grabbing" : "grab",
              transform: isDragging ? `translateX(${dragOffset * 0.2}px)` : "none",
              transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              WebkitOverflowScrolling: "touch",
            }}
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            onTouchStart={onDragStart}
            onTouchMove={onDragMove}
            onTouchEnd={onDragEnd}
          >
            {movies.map((m, idx) => {
              const isActive = idx === current;
              const diff = idx - current;
              const dist = Math.abs(diff);
              const poster = m?.poster || m?.backdrop || backgroundImageFallback;

              /* Mobile: simpler transforms, bigger cards */
              const activeW = isMobile ? "140px" : "clamp(190px, 22vw, 280px)";
              const inactiveW = isMobile ? "52px" : "clamp(75px, 8.5vw, 120px)";
              const activeH = isMobile ? "200px" : "clamp(270px, 33vw, 420px)";
              const inactiveH = isMobile ? "90px" : "clamp(110px, 13vw, 170px)";

              const liftY = isActive ? (isMobile ? -50 : -80) : 0;
              const rotY = isMobile ? 0 : (isActive ? 0 : diff * 4);
              const tZ = isMobile ? 0 : (isActive ? 50 : -dist * 30);

              /* On mobile, hide cards beyond distance 2 to avoid clutter */
              if (isMobile && dist > 3) return null;

              return (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className="flex-shrink-0 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden relative group
                    transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    width: isActive ? activeW : inactiveW,
                    height: isActive ? activeH : inactiveH,
                    opacity: dist > 3 ? 0.05 : isActive ? 1 : Math.max(0.25, 0.6 - dist * 0.12),
                    transform: `
                      translateY(${liftY}px)
                      ${!isMobile ? `rotateY(${rotY}deg) translateZ(${tZ}px)` : ""}
                      scale(${isActive ? 1 : 1 - dist * 0.03})
                    `,
                    transformStyle: isMobile ? "flat" : "preserve-3d",
                    zIndex: isActive ? 20 : 10 - dist,
                    filter: isActive ? "none" : `brightness(${Math.max(0.3, 0.6 - dist * 0.1)})`,
                  }}
                >
                  <img
                    src={poster}
                    alt={m?.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    draggable={false}
                  />

                  {/* Active: glow */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl hero-active-border pointer-events-none" />
                      <div className="absolute -inset-1.5 sm:-inset-2 rounded-xl sm:rounded-[1.5rem] bg-red-600/20 sm:bg-red-600/15 blur-lg sm:blur-xl pointer-events-none -z-10" />
                    </>
                  )}

                  {/* Inactive: overlay */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  )}

                  {/* Active: info */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2.5 sm:p-4 pt-8 sm:pt-12">
                      <p className="text-white text-[10px] sm:text-sm font-bold leading-tight line-clamp-2 drop-shadow-lg">
                        {m?.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-red-400 text-[8px] sm:text-[10px] tracking-wider uppercase font-semibold">
                          Now Playing
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center mt-3 sm:mt-5 gap-1 sm:gap-1.5">
            {movies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className="relative rounded-full overflow-hidden transition-all duration-500"
                style={{
                  width: idx === current ? (isMobile ? 32 : 48) : (isMobile ? 6 : 8),
                  height: isMobile ? 3 : 3,
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              >
                {idx === current && (
                  <div
                    className="absolute inset-0 rounded-full hero-progress"
                    style={{
                      background: "linear-gradient(90deg, #dc2626, #ef4444)",
                      animationDuration: `${INTERVAL}ms`,
                      boxShadow: "0 0 6px rgba(220,38,38,0.5)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* ════════════════════════════════
          MOBILE SWIPE HINT (first visit)
      ════════════════════════════════ */}
      {isMobile && (
        <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2 z-30 pointer-events-none hero-swipe-hint">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] backdrop-blur-xl rounded-full border border-white/[0.08]">
            <ChevronLeft size={10} className="text-white/30" />
            <span className="text-[8px] tracking-[0.2em] text-white/30 uppercase font-medium">Swipe</span>
            <ChevronRight size={10} className="text-white/30" />
          </div>
        </div>
      )}


      {/* ════════════════════════════════
          ANIMATIONS
      ════════════════════════════════ */}
      <style>{`
/* Background zoom */
@keyframes heroZoom {
  0%   { transform: scale(1); }
  100% { transform: scale(1.06); }
}
.hero-zoom { animation: heroZoom 16s ease-in-out alternate infinite; }

/* Orbs */
@keyframes orbDrift1 {
  0%, 100% { transform: translate(0,0); }
  50% { transform: translate(20px, -15px); }
}
@keyframes orbDrift2 {
  0%, 100% { transform: translate(0,0); }
  50% { transform: translate(-15px, 20px); }
}
.hero-orb-1 { animation: orbDrift1 20s ease-in-out infinite; }
.hero-orb-2 { animation: orbDrift2 25s ease-in-out infinite; }

/* Content stagger */
@keyframes heroStagger {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-s1 { animation: heroStagger 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
.hero-s2 { animation: heroStagger 0.6s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
.hero-s3 { animation: heroStagger 0.6s cubic-bezier(0.16,1,0.3,1) 0.18s both; }
.hero-s4 { animation: heroStagger 0.6s cubic-bezier(0.16,1,0.3,1) 0.24s both; }
.hero-s5 { animation: heroStagger 0.6s cubic-bezier(0.16,1,0.3,1) 0.30s both; }

/* Progress */
@keyframes heroProgress {
  from { width: 0%; }
  to   { width: 100%; }
}
.hero-progress { animation: heroProgress linear both; }

/* Active card border */
.hero-active-border {
  box-shadow:
    inset 0 0 0 1.5px rgba(220,38,38,0.45),
    inset 0 0 15px rgba(220,38,38,0.05);
}

/* Nav buttons */
.hero-nav-btn {
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.3s ease;
}
.hero-nav-btn:hover,
.hero-nav-btn:active {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.15);
}

/* Swipe hint */
@keyframes swipeHint {
  0%, 100% { opacity: 0.5; transform: translate(-50%, 0); }
  50% { opacity: 0; transform: translate(-50%, 4px); }
}
.hero-swipe-hint {
  animation: swipeHint 3s ease-in-out 2s 3 both;
}

/* Mobile: reduce motion for performance */
@media (prefers-reduced-motion: reduce) {
  .hero-zoom, .hero-orb-1, .hero-orb-2 { animation: none !important; }
  .hero-s1,.hero-s2,.hero-s3,.hero-s4,.hero-s5 { animation: none !important; opacity: 1; }
}
      `}</style>
    </div>
  );
};

export default HeroSection;