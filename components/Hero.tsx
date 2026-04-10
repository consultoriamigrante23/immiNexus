"use client";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BookingModal from "./BookingModal";

const VIDEO_SOURCES = [
  "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_24fps.mp4",
  "https://videos.pexels.com/video-files/9207809/9207809-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/4763824/4763824-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4",
];

export default function Hero() {
  const t = useTranslations("hero");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [srcIndex,    setSrcIndex]    = useState(0);

  // ── Canvas particle network ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .25,  vy: (Math.random() - .5) * .25,
      r: 1 + Math.random() * 1.2,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,255,255,${.07 * (1 - d / 100)})`; ctx.lineWidth = .5; ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setVideoLoaded(false);
    video.load();
  }, [srcIndex]);

  const handleVideoError = () => {
    if (srcIndex < VIDEO_SOURCES.length - 1) setSrcIndex(i => i + 1);
  };

  return (
    <>
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* ── VIDEO BACKGROUND ── */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>

          {/* Gradient fallback */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(135deg,#063336 0%,#0a5054 25%,#0d7a7e 50%,#0a5054 75%,#063336 100%)" }}/>

          {/* Video — opacity raised to 0.62 so it's clearly visible */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setVideoLoaded(true)}
            onError={handleVideoError}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: videoLoaded ? 0.62 : 0,
              transition: "opacity 2s ease",
            }}>
            <source src={VIDEO_SOURCES[srcIndex]} type="video/mp4"/>
          </video>

          {/* Lighter overlay so video breathes through */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(135deg,rgba(4,28,30,0.58) 0%,rgba(10,80,84,0.35) 50%,rgba(4,28,30,0.56) 100%)" }}/>

          {/* Soft vignette */}
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,0.32) 100%)" }}/>
        </div>

        {/* Canvas particles */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none", zIndex: 1 }}/>

        {/* Ambient glows */}
        <div className="absolute pointer-events-none"
          style={{ zIndex: 1, top: "5%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(22,198,204,0.08) 0%,transparent 65%)" }}/>
        <div className="absolute pointer-events-none"
          style={{ zIndex: 1, bottom: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(17,153,158,0.07) 0%,transparent 65%)" }}/>

        {/* ── CONTENT ── */}
        <div className="relative flex-1 max-w-7xl mx-auto px-6 w-full pt-28 pb-8" style={{ zIndex: 2 }}>
          <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[78vh]">

            {/* LEFT — badge removed */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">

              <h1 className="fade-up delay-2 font-heading font-bold leading-tight mb-6 text-white"
                style={{ fontSize: "clamp(2.8rem,5.5vw,5.2rem)", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
                {t("title")}<br/>
                <span style={{ color: "#a8f0ee" }}>{t("titleAccent")}</span>
              </h1>

              <p className="fade-up delay-3 font-body text-lg leading-relaxed mb-10"
                style={{ color: "rgba(255,255,255,0.85)", maxWidth: 520 }}>
                {t("subtitle")}
              </p>

              <div className="fade-up delay-4 flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
                <button onClick={() => setBookingOpen(true)}
                  className="btn-brand btn-shimmer text-base px-8 py-4"
                  style={{ boxShadow: "0 8px 32px rgba(17,153,158,0.5),0 2px 8px rgba(0,0,0,0.3)" }}>
                  {t("cta1")}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <a href="#contact"
                  className="text-base px-8 py-4 rounded-xl font-body font-semibold transition-all hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.3)", color: "white", textDecoration: "none", backdropFilter: "blur(12px)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"}>
                  {t("cta2")}
                </a>
              </div>

              {/* Country labels */}
              <div className="fade-up delay-5 flex flex-wrap gap-2 justify-center lg:justify-start">
                {["United States", "Canada", "Mexico", "& More"].map(label => (
                  <div key={label}
                    className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-body font-medium"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — globe without logo inside */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
                <div className="absolute rounded-full border animate-spin-slow"
                  style={{ width: 290, height: 290, borderColor: "rgba(255,255,255,0.08)", borderStyle: "dashed" }}/>
                <div className="absolute rounded-full border animate-spin-reverse"
                  style={{ width: 238, height: 238, borderColor: "rgba(255,255,255,0.12)" }}/>
                <div className="absolute rounded-full"
                  style={{ width: 200, height: 200, background: "radial-gradient(circle,rgba(17,153,158,0.18) 0%,transparent 70%)" }}/>

                <svg width="190" height="190" viewBox="0 0 240 240" fill="none" className="relative"
                  style={{ zIndex: 2, filter: "drop-shadow(0 0 30px rgba(17,153,158,0.5))" }}>
                  <defs>
                    <radialGradient id="gv2" cx="35%" cy="30%" r="70%">
                      <stop offset="0%"   stopColor="rgba(255,255,255,0.2)"/>
                      <stop offset="50%"  stopColor="rgba(17,153,158,0.45)"/>
                      <stop offset="100%" stopColor="rgba(6,51,54,0.9)"/>
                    </radialGradient>
                    <radialGradient id="gs2" cx="28%" cy="22%" r="55%">
                      <stop offset="0%"   stopColor="white" stopOpacity="0.25"/>
                      <stop offset="100%" stopColor="white" stopOpacity="0"/>
                    </radialGradient>
                    <clipPath id="cv2"><circle cx="120" cy="115" r="95"/></clipPath>
                  </defs>
                  <circle cx="120" cy="115" r="95" fill="url(#gv2)" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
                  <g clipPath="url(#cv2)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" fill="none">
                    {[-60,-40,-20,0,20,40,60].map((lat, i) => {
                      const y = 115 + (lat / 90) * 95;
                      const r = Math.sqrt(Math.max(0, 9025 - (y - 115) ** 2));
                      return r > 0 ? <ellipse key={i} cx="120" cy={y} rx={r} ry={r * 0.27}/> : null;
                    })}
                    {[0,30,60,90,120,150].map((lng, i) =>
                      <ellipse key={i} cx="120" cy="115" rx="95"
                        ry={95 * Math.abs(Math.cos(lng * Math.PI / 180)) + 1}
                        transform={`rotate(${lng} 120 115)`} strokeWidth="0.5"/>
                    )}
                  </g>
                  <g clipPath="url(#cv2)" fill="rgba(255,255,255,0.35)">
                    <path d="M52 72 Q58 62 74 66 Q86 60 93 70 Q100 80 92 91 Q83 101 72 99 Q58 96 52 85Z"/>
                    <path d="M75 107 Q82 100 91 109 Q97 122 90 138 Q82 150 70 142 Q61 132 65 118Z"/>
                    <path d="M117 63 Q128 58 139 64 Q146 72 141 81 Q132 87 121 83 Q114 76 117 63Z"/>
                    <path d="M120 88 Q133 84 142 95 Q150 110 144 129 Q137 143 123 141 Q109 139 105 126 Q101 110 108 98Z"/>
                    <path d="M144 58 Q164 53 180 63 Q193 74 188 88 Q177 101 161 99 Q147 96 142 82Z"/>
                  </g>
                  <g clipPath="url(#cv2)" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeDasharray="3 3">
                    <path d="M72 80 Q110 48 167 84"/>
                    <path d="M80 113 Q115 92 157 120"/>
                    <path d="M92 89 Q130 112 163 130"/>
                  </g>
                  {([[72,80],[167,84],[80,113],[157,120],[125,68],[178,92]] as [number,number][]).map(([x, y], i) => (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="rgba(255,255,255,0.15)"
                        style={{ animation: `pulse-ring ${2.2 + i * 0.3}s ease-out infinite ${i * 0.4}s` }}/>
                      <circle cx={x} cy={y} r="3" fill="white" stroke="rgba(17,153,158,0.6)" strokeWidth="1.5"/>
                    </g>
                  ))}
                  <circle cx="120" cy="115" r="95" fill="url(#gs2)"/>
                </svg>

                {/* Orbiting plane */}
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ animation: "plane-orbit 10s linear infinite" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"
                    style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}>
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                </div>
              </div>

              {/* Stats grid 2×2 */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
                {[
                  { v: "98%",  l: "Success Rate"  },
                  { v: "500+", l: "Cases Handled" },
                  { v: "10+",  l: "Countries"     },
                  { v: "3",    l: "Languages"     },
                ].map((s, i) => (
                  <div key={i} className="rounded-2xl p-4 text-center"
                    style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.18)", animation: `float-slow ${4 + i * .6}s ease-in-out infinite ${i * .4}s`, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
                    <p className="font-heading text-2xl font-bold text-white">{s.v}</p>
                    <p className="text-xs font-body mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BANNER */}
        <div className="relative px-6 lg:px-14 pb-8" style={{ zIndex: 2 }}>
          <div className="relative overflow-hidden rounded-3xl"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "36px 36px" }}/>
            <div className="relative px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ zIndex: 1 }}>
              <div className="text-center md:text-left">
                <p className="text-xs font-body font-semibold tracking-widest uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.55)" }}>{t("banner.eyebrow")}</p>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                  {t("banner.title")} <span style={{ color: "#a8f0ee" }}>{t("banner.titleAccent")}</span>
                </h2>
                <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.68)", maxWidth: 480 }}>{t("banner.subtitle")}</p>
                <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start mt-4">
                  {["USA","Canada","México","& More"].map(l => (
                    <span key={l} className="text-xs font-body font-semibold px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.85)" }}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="hidden md:flex flex-col gap-3">
                  {[{n:"500+",l:"Cases"},{n:"98%",l:"Success"},{n:"10+",l:"Countries"}].map(s => (
                    <div key={s.l} className="flex items-center gap-3">
                      <div className="w-1 h-6 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }}/>
                      <div>
                        <p className="font-heading text-lg font-bold text-white leading-none">{s.n}</p>
                        <p className="text-xs font-body" style={{ color: "rgba(255,255,255,0.45)" }}>{s.l}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setBookingOpen(true)}
                    className="font-body font-semibold text-sm px-6 py-3 rounded-xl whitespace-nowrap transition-all hover:-translate-y-1"
                    style={{ background: "white", color: "#11999e", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                    {t("banner.cta1")}
                  </button>
                  <a href="https://wa.me/5255316302020" target="_blank" rel="noopener noreferrer"
                    className="font-body font-medium text-sm px-6 py-3 rounded-xl transition-all hover:bg-white/15 text-center whitespace-nowrap flex items-center justify-center gap-2 text-white"
                    style={{ border: "1.5px solid rgba(255,255,255,0.3)", textDecoration: "none" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {t("banner.cta2")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative flex flex-col items-center gap-2 py-5" style={{ zIndex: 2 }}>
          <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
            style={{ borderColor: "rgba(255,255,255,0.3)" }}>
            <div className="w-1 h-2 rounded-full bg-white" style={{ animation: "float 1.8s ease-in-out infinite" }}/>
          </div>
        </div>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)}/>
    </>
  );
}