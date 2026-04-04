"use client";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BookingModal from "./BookingModal";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(17,153,158,0.3)";
        ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(17,153,158,${0.07*(1-d/100)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-white">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none", zIndex: 0 }}/>

        {/* Glow spots */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ zIndex: 0, background: "radial-gradient(circle at 80% 20%, rgba(17,153,158,0.06) 0%, transparent 60%)" }}/>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none" style={{ zIndex: 0, background: "radial-gradient(circle at 20% 80%, rgba(17,153,158,0.04) 0%, transparent 60%)" }}/>

        {/* CONTENT */}
        <div className="relative flex-1 max-w-7xl mx-auto px-6 pt-32 pb-10 w-full flex flex-col lg:flex-row items-center gap-16" style={{ zIndex: 1 }}>

          {/* LEFT */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <h1 className="fade-up delay-1 font-heading font-bold leading-tight mb-6"
              style={{ fontSize: "clamp(2.8rem, 5vw, 5rem)", color: "#293533" }}>
              {t("title")}<br/>
              <span style={{ color: "#11999e" }}>{t("titleAccent")}</span>
            </h1>
            <p className="fade-up delay-2 font-body text-lg leading-relaxed mb-10" style={{ color: "#576d69" }}>
              {t("subtitle")}
            </p>
            <div className="fade-up delay-3 flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
              <button onClick={() => setBookingOpen(true)} className="btn-brand text-base px-8 py-3.5">
                {t("cta1")}
              </button>
              <a href="#contact" className="btn-outline text-base px-8 py-3.5">{t("cta2")}</a>
            </div>

            {/* Country pills */}
            <div className="fade-up delay-4 flex flex-wrap gap-2 justify-center lg:justify-start">
              {[
                { flag: <USFlag/>, label: "United States" },
                { flag: <CAFlag/>, label: "Canada" },
                { flag: <MXFlag/>, label: "Mexico" },
                { flag: <AUFlag/>, label: "Australia" },
                { flag: <span className="text-sm font-bold" style={{ color: "#11999e" }}>+</span>, label: "More" },
              ].map(c => (
                <div key={c.label}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-body border"
                  style={{ borderColor: "rgba(17,153,158,0.2)", background: "rgba(17,153,158,0.04)", color: "#40514e" }}>
                  {c.flag} {c.label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Premium 3D Globe */}
          <div className="flex-1 flex items-center justify-center relative" style={{ minHeight: 420, maxWidth: 500 }}>
            <Globe3D/>

            {/* Floating stat cards */}
            {[
              { v: "98%",  l: "Success Rate",   pos: { top: "5%",  left: "-5%" } },
              { v: "500+", l: "Cases Handled",  pos: { bottom: "10%", right: "-5%" } },
              { v: "10+",  l: "Countries",      pos: { top: "40%", right: "-8%" } },
              { v: "3",    l: "Languages",      pos: { bottom: "2%", left: "5%" } },
            ].map((s, i) => (
              <div key={i}
                className="absolute bg-white rounded-2xl px-4 py-3 border shadow-lg"
                style={{
                  ...s.pos,
                  borderColor: "rgba(17,153,158,0.15)",
                  boxShadow: "0 8px 24px rgba(17,153,158,0.1)",
                  animation: `float ${3.2 + i * 0.4}s ease-in-out infinite ${i * 0.4}s`,
                }}>
                <p className="font-heading text-xl font-bold" style={{ color: "#11999e" }}>{s.v}</p>
                <p className="text-xs font-body" style={{ color: "#576d69" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BANNER */}
        <div className="relative px-6 lg:px-16 pb-8" style={{ zIndex: 1 }}>
          <div className="relative overflow-hidden rounded-3xl"
            style={{ background: "linear-gradient(135deg, #0a6b6f 0%, #11999e 50%, #16c6cc 100%)", boxShadow: "0 20px 50px rgba(17,153,158,0.28)" }}>
            {/* Grid bg */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px", transform: "perspective(500px) rotateX(8deg)", transformOrigin: "bottom" }}/>
            <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 70%)" }}/>

            <div className="relative px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8" style={{ zIndex: 1 }}>
              <div className="text-center md:text-left">
                <p className="text-xs font-body tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {t("banner.eyebrow")}
                </p>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
                  {t("banner.title")}<br/>
                  <span style={{ color: "#a8f0ee" }}>{t("banner.titleAccent")}</span>
                </h2>
                <p className="font-body text-base max-w-md mb-5" style={{ color: "rgba(255,255,255,0.72)" }}>
                  {t("banner.subtitle")}
                </p>
                <div className="flex items-center gap-5 flex-wrap justify-center md:justify-start">
                  {[
                    { flag: <USFlag size={28}/>, label: "USA" },
                    { flag: <CAFlag size={28}/>, label: "Canada" },
                    { flag: <MXFlag size={28}/>, label: "México" },
                    { flag: <AUFlag size={28}/>, label: "Australia" },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-2">
                      <span className="rounded overflow-hidden shadow">{c.flag}</span>
                      <span className="text-sm font-body" style={{ color: "rgba(255,255,255,0.85)" }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="hidden md:flex flex-col gap-4">
                  {[{ n: "500+", l: "Cases" }, { n: "98%", l: "Success" }, { n: "10+", l: "Countries" }].map(s => (
                    <div key={s.l} className="flex items-center gap-3">
                      <div className="w-1 h-7 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }}/>
                      <div>
                        <p className="font-heading text-lg font-bold text-white leading-none">{s.n}</p>
                        <p className="text-xs font-body" style={{ color: "rgba(255,255,255,0.55)" }}>{s.l}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setBookingOpen(true)}
                    className="bg-white font-body font-semibold text-sm px-6 py-3 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg whitespace-nowrap"
                    style={{ color: "#11999e" }}>
                    {t("banner.cta1")}
                  </button>
                  <a href="https://wa.me/5255316302020" target="_blank" rel="noopener noreferrer"
                    className="border text-white font-body font-medium text-sm px-6 py-3 rounded-xl transition-all hover:bg-white/10 text-center whitespace-nowrap flex items-center justify-center gap-2"
                    style={{ borderColor: "rgba(255,255,255,0.35)" }}>
                    <WaIconWhite/> {t("banner.cta2")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative flex flex-col items-center gap-2 py-6" style={{ zIndex: 1 }}>
          <div className="w-6 h-9 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "rgba(17,153,158,0.3)" }}>
            <div className="w-1 h-2 rounded-full" style={{ background: "#11999e", animation: "float 1.5s ease-in-out infinite" }}/>
          </div>
        </div>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)}/>
    </>
  );
}

/* ── 3D Globe SVG ── */
function Globe3D() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(17,153,158,0.08) 0%, transparent 70%)" }}/>
      <div className="absolute rounded-full border" style={{ width: 320, height: 320, borderColor: "rgba(17,153,158,0.12)", animation: "spin-slow 18s linear infinite" }}/>
      <div className="absolute rounded-full border" style={{ width: 260, height: 260, borderColor: "rgba(17,153,158,0.18)", animation: "spin-reverse 14s linear infinite" }}/>

      {/* Globe SVG */}
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" className="relative" style={{ zIndex: 2 }}>
        {/* Shadow */}
        <ellipse cx="120" cy="228" rx="70" ry="8" fill="rgba(17,153,158,0.1)"/>

        {/* Globe sphere */}
        <defs>
          <radialGradient id="globeGrad" cx="38%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#e8f6f7"/>
            <stop offset="40%"  stopColor="#c5eaea"/>
            <stop offset="100%" stopColor="#7dd8da"/>
          </radialGradient>
          <radialGradient id="globeShine" cx="30%" cy="25%" r="50%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <clipPath id="globeClip">
            <circle cx="120" cy="115" r="95"/>
          </clipPath>
        </defs>

        <circle cx="120" cy="115" r="95" fill="url(#globeGrad)" stroke="rgba(17,153,158,0.3)" strokeWidth="1.5"/>

        {/* Latitude lines */}
        <g clipPath="url(#globeClip)" stroke="rgba(17,153,158,0.25)" strokeWidth="0.8" fill="none">
          {[-60,-40,-20,0,20,40,60].map((lat, i) => {
            const y = 115 + (lat / 90) * 95;
            const r = Math.sqrt(Math.max(0, 95*95 - (y-115)*(y-115)));
            return <ellipse key={i} cx="120" cy={y} rx={r} ry={r * 0.28}/>;
          })}
          {/* Longitude lines */}
          {[0,30,60,90,120,150].map((lng, i) => (
            <ellipse key={i} cx="120" cy="115" rx="95" ry={95 * Math.abs(Math.cos(lng * Math.PI / 180))}
              transform={`rotate(${lng} 120 115)`} strokeWidth="0.6"/>
          ))}
        </g>

        {/* Continents (simplified) */}
        <g clipPath="url(#globeClip)" fill="rgba(17,153,158,0.55)" opacity="0.9">
          {/* North America */}
          <path d="M55 75 Q60 65 75 68 Q85 62 92 70 Q98 80 90 90 Q82 100 72 98 Q60 95 55 85 Z"/>
          {/* South America */}
          <path d="M75 105 Q82 100 90 108 Q95 120 88 135 Q80 148 70 140 Q62 130 65 118 Z"/>
          {/* Europe */}
          <path d="M118 65 Q128 60 138 65 Q145 72 140 80 Q132 85 122 82 Q115 76 118 65 Z"/>
          {/* Africa */}
          <path d="M120 88 Q132 85 140 95 Q148 110 142 128 Q135 142 122 140 Q110 138 106 125 Q102 110 108 98 Z"/>
          {/* Asia */}
          <path d="M142 60 Q162 55 178 65 Q190 75 185 88 Q175 100 160 98 Q148 95 142 82 Z"/>
          {/* Australia */}
          <path d="M162 118 Q175 112 185 120 Q190 132 182 140 Q172 146 162 140 Q155 132 158 122 Z"/>
        </g>

        {/* Route paths between cities */}
        <g clipPath="url(#globeClip)" fill="none" stroke="rgba(17,153,158,0.5)" strokeWidth="1" strokeDasharray="4 3">
          <path d="M75 80 Q120 55 165 85"/>
          <path d="M80 112 Q115 95 155 118"/>
          <path d="M90 88 Q130 108 160 128"/>
        </g>

        {/* City dots */}
        {[
          [75, 80], [165, 85], [80, 112], [155, 118], [125, 70], [175, 92], [90, 130], [170, 132]
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3.5" fill="#11999e" opacity="0.9"/>
            <circle cx={x} cy={y} r="3.5" fill="none" stroke="rgba(17,153,158,0.4)" strokeWidth="2"
              style={{ animation: `pulse-ring ${2 + i * 0.3}s ease-out infinite ${i * 0.5}s` }}/>
          </g>
        ))}

        {/* Shine overlay */}
        <circle cx="120" cy="115" r="95" fill="url(#globeShine)"/>
        <circle cx="120" cy="115" r="95" fill="none" stroke="rgba(17,153,158,0.2)" strokeWidth="1"/>
      </svg>

      {/* Airplane orbiting */}
      <div className="absolute" style={{ width: "100%", height: "100%", animation: "spin-slow 12s linear infinite" }}>
        <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#11999e" opacity="0.8">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
      </div>

      {/* Logo in center */}
      <div className="absolute bg-white rounded-2xl p-3 shadow-xl border"
        style={{ zIndex: 3, borderColor: "rgba(17,153,158,0.15)", boxShadow: "0 10px 40px rgba(17,153,158,0.15)" }}>
        <Image src="/logo-icon.png" alt="ImmiNexus" width={48} height={48} className="object-contain"/>
      </div>
    </div>
  );
}

/* ── Flag SVGs ── */
function USFlag({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size*0.6)} viewBox="0 0 36 24">
      <rect width="36" height="24" fill="#B22234"/>
      {[1.85,3.7,5.54,7.38,9.23,11.08,12.92,14.77,16.62,18.46,20.31,22.15].map((y,i)=>(
        <rect key={i} y={y} width="36" height="1.85" fill={i%2===0?"white":"#B22234"}/>
      ))}
      <rect width="14.4" height="12.92" fill="#3C3B6E"/>
    </svg>
  );
}
function CAFlag({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size*0.6)} viewBox="0 0 36 24">
      <rect width="36" height="24" fill="white"/>
      <rect width="9" height="24" fill="#FF0000"/>
      <rect x="27" width="9" height="24" fill="#FF0000"/>
      <path d="M18 4l1.6 3.2 3.5.5-2.55 2.4.65 3.5L18 11.8l-3.2 1.8.65-3.5L12.9 7.7l3.5-.5z" fill="#FF0000"/>
    </svg>
  );
}
function MXFlag({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size*0.6)} viewBox="0 0 36 24">
      <rect width="36" height="24" fill="white"/>
      <rect width="12" height="24" fill="#006847"/>
      <rect x="24" width="12" height="24" fill="#CE1126"/>
    </svg>
  );
}
function AUFlag({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size*0.6)} viewBox="0 0 36 24">
      <rect width="36" height="24" fill="#012169"/>
      <line x1="0" y1="0" x2="18" y2="12" stroke="white" strokeWidth="4"/>
      <line x1="18" y1="0" x2="0" y2="12" stroke="white" strokeWidth="4"/>
      <line x1="0" y1="0" x2="18" y2="12" stroke="#C8102E" strokeWidth="2.5"/>
      <line x1="18" y1="0" x2="0" y2="12" stroke="#C8102E" strokeWidth="2.5"/>
      <line x1="9" y1="0" x2="9" y2="12" stroke="white" strokeWidth="5"/>
      <line x1="0" y1="6" x2="18" y2="6" stroke="white" strokeWidth="5"/>
      <line x1="9" y1="0" x2="9" y2="12" stroke="#C8102E" strokeWidth="3"/>
      <line x1="0" y1="6" x2="18" y2="6" stroke="#C8102E" strokeWidth="3"/>
    </svg>
  );
}
function WaIconWhite() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}