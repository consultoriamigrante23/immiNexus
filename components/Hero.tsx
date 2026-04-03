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

    const setSize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));

    const planes = Array.from({ length: 3 }, () => ({
      x: Math.random() * canvas.width,
      y: 60 + Math.random() * (canvas.height * 0.5),
      speed: 0.4 + Math.random() * 0.3,
      size: 8 + Math.random() * 5,
      angle: -0.12,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Particles
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(17,153,158,0.35)";
        ctx.fill();
      });

      // Connections
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(17,153,158,${0.08 * (1 - d / 110)})`;
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      }));

      // Planes
      planes.forEach(p => {
        p.x += p.speed;
        if (p.x > canvas.width + 30) {
          p.x = -30;
          p.y = 60 + Math.random() * (canvas.height * 0.5);
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = "rgba(17,153,158,0.1)";
        ctx.beginPath();
        ctx.moveTo(p.size, 0);
        ctx.lineTo(-p.size * 0.6, -p.size * 0.35);
        ctx.lineTo(-p.size * 0.4, 0);
        ctx.lineTo(-p.size * 0.6, p.size * 0.35);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none", zIndex: 0 }}
        />

        {/* Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none" style={{ zIndex: 0, background: "radial-gradient(circle at top right, rgba(17,153,158,0.07) 0%, transparent 65%)" }}/>
        <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none" style={{ zIndex: 0, background: "radial-gradient(circle at bottom left, rgba(17,153,158,0.04) 0%, transparent 65%)" }}/>

        {/* MAIN CONTENT */}
        <div className="relative flex-1 max-w-7xl mx-auto px-6 pt-32 pb-16 w-full flex flex-col lg:flex-row items-center gap-12" style={{ zIndex: 1 }}>

          {/* Left text */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="fade-up delay-1 font-heading text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-tight mb-6" style={{ color: "#293533" }}>
              {t("title")}<br />
              <span style={{ color: "#11999e" }}>{t("titleAccent")}</span>
            </h1>
            <p className="fade-up delay-2 font-body text-lg leading-relaxed mb-10 mx-auto lg:mx-0 max-w-xl" style={{ color: "#576d69" }}>
              {t("subtitle")}
            </p>
            <div className="fade-up delay-3 flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
              <button
                onClick={() => setBookingOpen(true)}
                className="btn-brand"
              >
                {t("cta1")}
              </button>
              <a href="#contact" className="btn-outline">{t("cta2")}</a>
            </div>

            {/* Country pills */}
            <div className="fade-up delay-4 flex flex-wrap gap-3 justify-center lg:justify-start">
              {[
                { svg: <USFlag />, label: "United States" },
                { svg: <CAFlag />, label: "Canada" },
                { svg: <MXFlag />, label: "Mexico" },
                { svg: <AUFlag />, label: "Australia" },
                { svg: <span style={{ fontSize: 18 }}>+</span>, label: "More" },
              ].map(c => (
                <div key={c.label}
                  className="flex items-center gap-2 border border-gray-200 bg-white/80 rounded-full px-4 py-2 text-sm font-body shadow-sm"
                  style={{ color: "#40514e" }}>
                  {c.svg} {c.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating cards */}
          <div className="flex-1 flex items-center justify-center relative" style={{ minHeight: 380 }}>
            <div className="absolute w-72 h-72 rounded-full border opacity-20" style={{ borderColor: "#11999e", animation: "spin-slow 18s linear infinite" }}/>
            <div className="absolute w-56 h-56 rounded-full border opacity-15" style={{ borderColor: "#11999e", animation: "spin-slow 22s linear infinite reverse" }}/>

            {/* Center card */}
            <div className="relative bg-white rounded-3xl p-8 flex flex-col items-center gap-4"
              style={{ zIndex: 2, boxShadow: "0 20px 60px rgba(17,153,158,0.15), 0 0 0 1px rgba(17,153,158,0.08)" }}>
              <Image src="/logo-icon.png" alt="ImmiNexus" width={110} height={110} className="object-contain"/>
              <div className="text-center">
                <p className="font-heading text-xl font-bold" style={{ color: "#293533" }}>ImmiNexus</p>
                <p className="text-xs tracking-widest uppercase font-body" style={{ color: "#11999e" }}>
                  Your Migration Success Partner
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <USFlag/><CAFlag/><MXFlag/>
              </div>
            </div>

            {/* Floating stats */}
            {[
              { label: "Success Rate", value: "98%", top: "8%", left: "-8%" },
              { label: "Cases Handled", value: "500+", bottom: "12%", right: "-8%" },
              { label: "Languages", value: "3", top: "45%", right: "-14%" },
              { label: "Countries", value: "10+", bottom: "2%", left: "6%" },
            ].map((s, i) => (
              <div key={i}
                className="absolute bg-white rounded-2xl px-4 py-3 border shadow-lg"
                style={{
                  borderColor: "rgba(17,153,158,0.15)",
                  top:    s.top,
                  left:   s.left,
                  right:  s.right,
                  bottom: s.bottom,
                  animation: `float ${3 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
                  zIndex: 2,
                }}>
                <p className="font-heading text-xl font-bold" style={{ color: "#11999e" }}>{s.value}</p>
                <p className="text-xs font-body" style={{ color: "#576d69" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BANNER */}
        <div className="relative w-full px-6 lg:px-16 pb-8" style={{ zIndex: 1 }}>
          <div className="relative overflow-hidden rounded-3xl"
            style={{ background: "linear-gradient(135deg, #0d7a7e 0%, #11999e 45%, #16c6cc 80%, #0d7a7e 100%)", boxShadow: "0 20px 50px rgba(17,153,158,0.3)" }}>

            {/* Grid bg */}
            <div className="absolute inset-0 pointer-events-none opacity-10"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px", transform: "perspective(400px) rotateX(10deg)", transformOrigin: "bottom" }}/>
            <div className="absolute top-0 right-1/4 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }}/>

            <div className="relative px-8 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8" style={{ zIndex: 1 }}>
              <div className="text-center md:text-left">
                <p className="text-xs font-body tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {t("banner.eyebrow")}
                </p>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
                  {t("banner.title")}<br/>
                  <span style={{ color: "#a8f0ee" }}>{t("banner.titleAccent")}</span>
                </h2>
                <p className="font-body text-base max-w-md mb-5" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {t("banner.subtitle")}
                </p>
                {/* Real flag row */}
                <div className="flex items-center gap-5 flex-wrap justify-center md:justify-start">
                  {[
                    { flag: <USFlag size={28}/>, label: "USA" },
                    { flag: <CAFlag size={28}/>, label: "Canada" },
                    { flag: <MXFlag size={28}/>, label: "México" },
                    { flag: <AUFlag size={28}/>, label: "Australia" },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-2">
                      <div className="rounded overflow-hidden shadow-sm">{c.flag}</div>
                      <span className="text-sm font-body" style={{ color: "rgba(255,255,255,0.85)" }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right CTAs */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="hidden md:flex flex-col gap-4">
                  {[{ n: "500+", l: "Cases" }, { n: "98%", l: "Success" }, { n: "10+", l: "Countries" }].map(s => (
                    <div key={s.l} className="flex items-center gap-3">
                      <div className="w-1.5 h-7 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }}/>
                      <div>
                        <p className="font-heading text-lg font-bold text-white leading-none">{s.n}</p>
                        <p className="text-xs font-body" style={{ color: "rgba(255,255,255,0.6)" }}>{s.l}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="bg-white font-body font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg text-center whitespace-nowrap"
                    style={{ color: "#11999e" }}>
                    {t("banner.cta1")}
                  </button>
                  <a href="https://wa.me/5255316302020" target="_blank" rel="noopener noreferrer"
                    className="border font-body font-medium text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:bg-white/10 text-center whitespace-nowrap flex items-center justify-center gap-2 text-white"
                    style={{ borderColor: "rgba(255,255,255,0.4)" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {t("banner.cta2")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative flex flex-col items-center gap-2 py-6 opacity-30" style={{ zIndex: 1 }}>
          <span className="text-xs font-body tracking-widest uppercase" style={{ color: "#576d69" }}>Scroll</span>
          <div className="w-px h-7" style={{ background: "linear-gradient(to bottom, #11999e, transparent)" }}/>
        </div>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}

/* ── Flag SVGs ── */
function USFlag({ size = 22 }: { size?: number }) {
  const h = Math.round(size * 0.6);
  return (
    <svg width={size} height={h} viewBox="0 0 36 24">
      <rect width="36" height="24" fill="#B22234"/>
      {[1.85,3.7,5.54,7.38,9.23,11.08,12.92,14.77,16.62,18.46,20.31,22.15].map((y,i)=>(
        <rect key={i} y={y} width="36" height="1.85" fill={i%2===0?"white":"#B22234"}/>
      ))}
      <rect width="14.4" height="12.92" fill="#3C3B6E"/>
      {[[1.4,1.2],[3.6,1.2],[5.8,1.2],[8,1.2],[10.2,1.2],[12.4,1.2],[2.4,3],[4.6,3],[6.8,3],[9,3],[11.2,3],[1.4,4.8],[3.6,4.8],[5.8,4.8],[8,4.8],[10.2,4.8],[12.4,4.8],[2.4,6.6],[4.6,6.6],[6.8,6.6],[9,6.6],[11.2,6.6],[1.4,8.4],[3.6,8.4],[5.8,8.4],[8,8.4],[10.2,8.4],[12.4,8.4],[2.4,10.2],[4.6,10.2],[6.8,10.2],[9,10.2],[11.2,10.2]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="0.7" fill="white"/>
      ))}
    </svg>
  );
}
function CAFlag({ size = 22 }: { size?: number }) {
  const h = Math.round(size * 0.6);
  return (
    <svg width={size} height={h} viewBox="0 0 36 24">
      <rect width="36" height="24" fill="white"/>
      <rect width="9" height="24" fill="#FF0000"/>
      <rect x="27" width="9" height="24" fill="#FF0000"/>
      <path d="M18 4l1.6 3.2 3.5.5-2.55 2.4.65 3.5L18 11.8l-3.2 1.8.65-3.5L12.9 7.7l3.5-.5z" fill="#FF0000"/>
    </svg>
  );
}
function MXFlag({ size = 22 }: { size?: number }) {
  const h = Math.round(size * 0.6);
  return (
    <svg width={size} height={h} viewBox="0 0 36 24">
      <rect width="36" height="24" fill="white"/>
      <rect width="12" height="24" fill="#006847"/>
      <rect x="24" width="12" height="24" fill="#CE1126"/>
      <ellipse cx="18" cy="12" rx="3.2" ry="4" fill="#006847" opacity="0.2"/>
    </svg>
  );
}
function AUFlag({ size = 22 }: { size?: number }) {
  const h = Math.round(size * 0.6);
  return (
    <svg width={size} height={h} viewBox="0 0 36 24">
      <rect width="36" height="24" fill="#00008B"/>
      <line x1="0" y1="0" x2="18" y2="12" stroke="white" strokeWidth="4"/>
      <line x1="18" y1="0" x2="0" y2="12" stroke="white" strokeWidth="4"/>
      <line x1="0" y1="0" x2="18" y2="12" stroke="#CC0000" strokeWidth="2.5"/>
      <line x1="18" y1="0" x2="0" y2="12" stroke="#CC0000" strokeWidth="2.5"/>
      <line x1="9" y1="0" x2="9" y2="12" stroke="white" strokeWidth="4"/>
      <line x1="0" y1="6" x2="18" y2="6" stroke="white" strokeWidth="4"/>
      <line x1="9" y1="0" x2="9" y2="12" stroke="#CC0000" strokeWidth="2.5"/>
      <line x1="0" y1="6" x2="18" y2="6" stroke="#CC0000" strokeWidth="2.5"/>
      <circle cx="27" cy="18" r="2" fill="white"/>
      <circle cx="32" cy="14" r="2" fill="white"/>
      <circle cx="30" cy="9" r="2" fill="white"/>
      <circle cx="24" cy="10" r="2" fill="white"/>
    </svg>
  );
}