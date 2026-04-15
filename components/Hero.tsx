"use client";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BookingModal from "./BookingModal";

export default function Hero() {
  const t = useTranslations("hero");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: 0.8 + Math.random() * 1.2,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.28)";
        ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 90) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - d / 90)})`;
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
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* ── VIDEO BACKGROUND ── */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          {/* Always-visible teal gradient behind video */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg,#041c1e 0%,#073d40 30%,#0d7a7e 55%,#073d40 80%,#041c1e 100%)"
          }}/>

          {/*
            Using Coverr.co & Mazwai free aviation videos
            — served from their public CDNs, no auth required, no referrer block.
            Multiple sources: browser picks first one that loads.
          */}
          <video
  autoPlay
  muted
  loop
  playsInline
  style={{
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  }}
>
  <source src="/videos/plane.mp4" type="video/mp4" />
</video>

          {/* Readability overlay */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg,rgba(4,28,30,0.78) 0%,rgba(10,70,74,0.52) 45%,rgba(4,28,30,0.72) 100%)"
          }}/>
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse 70% 60% at 55% 45%,rgba(17,153,158,0.07) 0%,transparent 70%)"
          }}/>
          <div className="absolute bottom-0 left-0 right-0 h-36" style={{
            background: "linear-gradient(to bottom,transparent,rgba(4,28,30,0.55))"
          }}/>
        </div>

        {/* Particles */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none", zIndex: 1 }}/>

        {/* Ambient glows */}
        <div className="absolute pointer-events-none" style={{
          zIndex: 1, top: "8%", right: "6%", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(22,198,204,0.09) 0%,transparent 65%)"
        }}/>
        <div className="absolute pointer-events-none" style={{
          zIndex: 1, bottom: "12%", left: "4%", width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(17,153,158,0.07) 0%,transparent 65%)"
        }}/>

        {/* ── MAIN CONTENT ── */}
        <div className="relative flex-1 max-w-7xl mx-auto px-6 w-full pt-28 pb-8" style={{ zIndex: 2 }}>
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 min-h-[78vh]">

            {/* LEFT */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              <h1 className="fade-up delay-2 font-heading font-bold leading-tight mb-5 text-white"
                style={{ fontSize: "clamp(2.6rem,5vw,4.8rem)", textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}>
                {t("title")}<br/>
                <span style={{ color: "#7de8e8", textShadow: "0 0 40px rgba(125,232,232,0.35)" }}>
                  {t("titleAccent")}
                </span>
              </h1>

              <p className="fade-up delay-3 font-body text-lg leading-relaxed mb-10"
                style={{ color: "rgba(255,255,255,0.75)", maxWidth: 500, lineHeight: 1.8 }}>
                {t("subtitle")}
              </p>

              <div className="fade-up delay-4 flex flex-wrap gap-4 justify-center lg:justify-start">
                <button onClick={() => setBookingOpen(true)}
                  className="btn-brand btn-shimmer text-base px-8 py-4"
                  style={{ boxShadow: "0 8px 32px rgba(17,153,158,0.55),0 2px 8px rgba(0,0,0,0.3)", fontSize: 15 }}>
                  {t("cta1")}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <a href="https://wa.me/5255316302020" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-base px-8 py-4 rounded-xl font-body font-semibold transition-all hover:-translate-y-1"
                  style={{ background: "rgba(37,211,102,0.15)", border: "1.5px solid rgba(37,211,102,0.4)", color: "white", textDecoration: "none", backdropFilter: "blur(8px)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(37,211,102,0.26)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(37,211,102,0.15)"}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* RIGHT — logo orbit only */}
            <div className="flex-1 flex items-center justify-center w-full max-w-lg">
              <LogoOrbit />
            </div>
          </div>
        </div>

        {/* BANNER */}
        <div className="relative px-6 lg:px-14 pb-8" style={{ zIndex: 2 }}>
          <div className="relative overflow-hidden rounded-3xl"
            style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.13)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px)", backgroundSize: "40px 40px" }}/>
            <div className="relative px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ zIndex: 1 }}>
              <div className="text-center md:text-left">
                <p className="text-xs font-body font-semibold tracking-widest uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.45)" }}>{t("banner.eyebrow")}</p>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                  {t("banner.title")} <span style={{ color: "#7de8e8" }}>{t("banner.titleAccent")}</span>
                </h2>
                <p className="font-body text-sm mb-4" style={{ color: "rgba(255,255,255,0.6)", maxWidth: 460 }}>
                  {t("banner.subtitle")}
                </p>
                <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                  {["Mexico","USA","Canada","& More"].map(l => (
                    <span key={l} className="text-xs font-body font-medium px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)", color: "rgba(255,255,255,0.85)" }}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="hidden md:flex flex-col gap-3">
                  {[{n:"500+",l:"Cases"},{n:"98%",l:"Success"},{n:"3",l:"Languages"}].map(s => (
                    <div key={s.l} className="flex items-center gap-3">
                      <div className="w-1 h-6 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }}/>
                      <div>
                        <p className="font-heading text-lg font-bold text-white leading-none">{s.n}</p>
                        <p className="text-xs font-body" style={{ color: "rgba(255,255,255,0.38)" }}>{s.l}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setBookingOpen(true)}
                    className="font-body font-semibold text-sm px-7 py-3.5 rounded-xl whitespace-nowrap transition-all hover:-translate-y-1"
                    style={{ background: "white", color: "#11999e", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                    {t("banner.cta1")}
                  </button>
                  <a href="https://wa.me/5255316302020" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 font-body font-medium text-sm px-7 py-3.5 rounded-xl transition-all hover:bg-white/10 text-center whitespace-nowrap text-white"
                    style={{ border: "1.5px solid rgba(255,255,255,0.25)", textDecoration: "none" }}>
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
            style={{ borderColor: "rgba(255,255,255,0.22)" }}>
            <div className="w-1 h-2 rounded-full bg-white" style={{ animation: "float 1.8s ease-in-out infinite" }}/>
          </div>
        </div>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)}/>
    </>
  );
}

/* ── Logo orbit — UNCHANGED, planes only ── */
function LogoOrbit() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 420, height: 420 }}>

      <div className="absolute rounded-full animate-spin-slow"
        style={{ width: 410, height: 410, border: "1px dashed rgba(255,255,255,0.07)" }}/>
      <div className="absolute rounded-full animate-spin-reverse"
        style={{ width: 350, height: 350, border: "1px solid rgba(17,153,158,0.18)" }}/>
      <div className="absolute rounded-full"
        style={{ width: 295, height: 295, border: "1px dotted rgba(17,153,158,0.11)", animation: "spin-slow 35s linear infinite" }}/>
      <div className="absolute rounded-full"
        style={{ width: 240, height: 240, background: "radial-gradient(circle,rgba(17,153,158,0.26) 0%,rgba(17,153,158,0.07) 55%,transparent 75%)", filter: "blur(10px)" }}/>

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 420 420" fill="none">
        <circle cx="210" cy="210" r="175" stroke="rgba(17,153,158,0.12)" strokeWidth="1" strokeDasharray="6 8"/>
        <circle cx="210" cy="210" r="140" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 12"/>
        <path d="M 52 210 Q 210 58 368 210"  stroke="rgba(17,153,158,0.1)"   strokeWidth="1" strokeDasharray="5 9"  fill="none"/>
        <path d="M 210 52 Q 368 210 210 368" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 11" fill="none"/>
      </svg>

      {/* Logo */}
      <div className="relative z-10" style={{ animation: "float-slow 6s ease-in-out infinite" }}>
        <Image
          src="/logonobackground.png"
          alt="ImmiNexus"
          width={155}
          height={155}
          className="object-contain"
          style={{ filter: "drop-shadow(0 0 24px rgba(17,153,158,0.75)) drop-shadow(0 0 52px rgba(17,153,158,0.35))" }}
          priority
        />
      </div>

      {/* Plane 1 — clockwise, outer orbit */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ animation: "plane-orbit-1 9s linear infinite" }}>
        <div style={{ position: "absolute", top: "3%", left: "50%", transform: "translateX(-50%) rotate(90deg)" }}>
          <svg width="26" height="26" viewBox="0 0 24 24"
            style={{ filter: "drop-shadow(0 0 8px rgba(17,153,158,0.95)) drop-shadow(0 0 18px rgba(17,153,158,0.55))" }}>
            <path fill="white" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
      </div>

      {/* Plane 2 — counter-clockwise, mid orbit */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ animation: "plane-orbit-2 14s linear infinite reverse" }}>
        <div style={{ position: "absolute", top: "-2%", left: "50%", transform: "translateX(-50%) rotate(-50deg)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24"
            style={{ filter: "drop-shadow(0 0 7px rgba(22,198,204,0.9))", opacity: 0.82 }}>
            <path fill="#7de8e8" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
      </div>

      {/* Plane 3 — clockwise, inner orbit, slow */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ animation: "plane-orbit-3 20s linear infinite" }}>
        <div style={{ position: "absolute", top: "50%", right: "-1%", transform: "translateY(-50%) rotate(5deg)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24"
            style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.55))", opacity: 0.48 }}>
            <path fill="white" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
      </div>

      {/* Orbit dots */}
      {([
        { angle: 45,  r: 175, size: 5, color: "rgba(17,153,158,0.7)",  delay: "0s"   },
        { angle: 225, r: 175, size: 5, color: "rgba(17,153,158,0.7)",  delay: "1s"   },
        { angle: 135, r: 175, size: 4, color: "rgba(255,255,255,0.45)",delay: "0.5s" },
        { angle: 315, r: 175, size: 4, color: "rgba(255,255,255,0.45)",delay: "1.5s" },
        { angle: 0,   r: 140, size: 3, color: "rgba(22,198,204,0.55)", delay: "0.3s" },
        { angle: 180, r: 140, size: 3, color: "rgba(22,198,204,0.55)", delay: "1.3s" },
        { angle: 90,  r: 140, size: 3, color: "rgba(22,198,204,0.55)", delay: "0.9s" },
        { angle: 270, r: 140, size: 3, color: "rgba(22,198,204,0.55)", delay: "2s"   },
      ] as { angle: number; r: number; size: number; color: string; delay: string }[])
        .map(({ angle, r, size, color, delay }, i) => {
          const rad = (angle * Math.PI) / 180;
          const x   = Math.cos(rad) * r;
          const y   = Math.sin(rad) * r;
          return (
            <div key={i} className="absolute rounded-full"
              style={{
                width: size, height: size, background: color,
                left: `calc(50% + ${x}px - ${size / 2}px)`,
                top:  `calc(50% + ${y}px - ${size / 2}px)`,
                boxShadow: `0 0 ${size * 3}px ${color}`,
                animation: `pulse-ring 2.8s ease-out infinite ${delay}`,
              }}/>
          );
        })}
    </div>
  );
}