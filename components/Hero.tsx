"use client";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const setSize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    setSize();
    window.addEventListener("resize", setSize);
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(42,157,154,0.4)"; ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(42,157,154,${.1 * (1 - d / 120)})`; ctx.lineWidth = .6; ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", setSize); };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-white">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(circle at top right, rgba(42,157,154,0.08) 0%, transparent 65%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle at bottom left, rgba(42,157,154,0.05) 0%, transparent 65%)" }} />

      {/* HERO CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16 w-full flex flex-col lg:flex-row items-center gap-12">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <div className="fade-up inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-600 rounded-full px-4 py-1.5 text-xs font-body font-medium tracking-wide mb-7">
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
            {t("badge")}
          </div>
          <h1 className="fade-up delay-1 font-heading text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-gray-900 leading-tight mb-6">
            {t("title")}<br />
            <span style={{ color: "#2A9D9A" }}>{t("titleAccent")}</span>
          </h1>
          <p className="fade-up delay-2 font-body text-lg text-gray-500 max-w-xl leading-relaxed mb-10 mx-auto lg:mx-0">
            {t("subtitle")}
          </p>
          <div className="fade-up delay-3 flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
            <a href="#contact" className="btn-brand">{t("cta1")}</a>
            <a href="#contact" className="btn-outline">{t("cta2")}</a>
          </div>
          {/* Country pills with real flags */}
          <div className="fade-up delay-4 flex flex-wrap gap-3 justify-center lg:justify-start">
            {[
              { svg: <USFlag />, label: "United States" },
              { svg: <CAFlag />, label: "Canada" },
              { svg: <MXFlag />, label: "Mexico" },
              { svg: <AUFlag />, label: "Australia" },
              { svg: <span className="text-base">🌍</span>, label: "& More" },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-2 border border-gray-200 bg-white/80 rounded-full px-4 py-2 text-sm font-body text-gray-600 shadow-sm card-3d">
                {c.svg} {c.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — 3D floating cards */}
        <div className="flex-1 flex items-center justify-center relative" style={{ minHeight: 420 }}>
          <div className="absolute w-80 h-80 rounded-full border border-brand-200 animate-spin-slow opacity-30" />
          <div className="absolute w-64 h-64 rounded-full border border-brand-300 opacity-20"
            style={{ animation: "spin-globe 20s linear infinite reverse" }} />
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4 card-3d"
            style={{ boxShadow: "0 25px 60px rgba(42,157,154,0.15), 0 0 0 1px rgba(42,157,154,0.08)" }}>
            <Image src="/logo.png" alt="ImmiNexus Consultants" width={120} height={120} className="object-contain" />
            <div className="text-center">
              <p className="font-heading text-xl font-bold text-gray-900">ImmiNexus</p>
              <p className="text-brand-500 text-xs tracking-widest uppercase font-body">Your Migration Success Partner</p>
            </div>
            <div className="flex gap-3 items-center">
              <USFlag /><CAFlag /><MXFlag />
            </div>
          </div>
          <div className="absolute top-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 border border-brand-100 card-3d"
            style={{ animation: "float 3s ease-in-out infinite" }}>
            <p className="font-heading text-2xl font-bold text-brand-500">98%</p>
            <p className="text-gray-500 text-xs font-body">Success Rate</p>
          </div>
          <div className="absolute bottom-8 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 border border-brand-100 card-3d"
            style={{ animation: "float 3.5s ease-in-out infinite 0.5s" }}>
            <p className="font-heading text-2xl font-bold text-brand-500">500+</p>
            <p className="text-gray-500 text-xs font-body">Cases Handled</p>
          </div>
          <div className="absolute top-1/2 -right-8 bg-white rounded-2xl shadow-lg px-4 py-3 border border-brand-100 card-3d"
            style={{ animation: "float 4s ease-in-out infinite 1s" }}>
            <p className="font-heading text-2xl font-bold text-brand-500">3</p>
            <p className="text-gray-500 text-xs font-body">Languages</p>
          </div>
          <div className="absolute -bottom-2 left-4 bg-white rounded-2xl shadow-lg px-4 py-3 border border-brand-100 card-3d"
            style={{ animation: "float 3.8s ease-in-out infinite 0.3s" }}>
            <p className="font-heading text-2xl font-bold text-brand-500">10+</p>
            <p className="text-gray-500 text-xs font-body">Countries</p>
          </div>
        </div>
      </div>

      {/* BANNER */}
      <div className="relative z-10 w-full mt-4 mb-0">
        <div className="relative overflow-hidden mx-6 lg:mx-16 rounded-3xl"
          style={{ background: "linear-gradient(135deg, #1a6866 0%, #2A9D9A 40%, #3bbfbb 70%, #1a8a87 100%)", boxShadow: "0 20px 60px rgba(42,157,154,0.35)" }}>
          <div className="absolute inset-0 pointer-events-none opacity-10"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px", transform: "perspective(400px) rotateX(12deg)", transformOrigin: "bottom" }} />
          <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)" }} />

          <div className="relative z-10 px-8 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left text — fully translated */}
            <div className="text-center md:text-left">
              <p className="text-white/70 text-sm font-body tracking-widest uppercase mb-2">{t("banner.eyebrow")}</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                {t("banner.title")}<br className="hidden md:block" />{" "}
                <span style={{ color: "#a8f0ee" }}>{t("banner.titleAccent")}</span>
              </h2>
              <p className="text-white/70 font-body text-base max-w-md mb-5">{t("banner.subtitle")}</p>

              {/* Real flag SVGs */}
              <div className="flex items-center gap-5 justify-center md:justify-start flex-wrap">
                {[
                  { flag: <USFlag size={28} />, label: "USA" },
                  { flag: <CAFlag size={28} />, label: "Canada" },
                  { flag: <MXFlag size={28} />, label: "México" },
                  { flag: <AUFlag size={28} />, label: "Australia" },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-2">
                    <div className="rounded-sm overflow-hidden shadow-sm">{c.flag}</div>
                    <span className="text-white/80 text-sm font-body">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-8 flex-shrink-0">
              <div className="hidden md:flex flex-col gap-4">
                {[{ n: "500+", l: "Cases" }, { n: "98%", l: "Success" }, { n: "10+", l: "Countries" }].map(s => (
                  <div key={s.l} className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full bg-white/30" />
                    <div>
                      <p className="font-heading text-xl font-bold text-white leading-none">{s.n}</p>
                      <p className="text-white/60 text-xs font-body">{s.l}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Globe SVG */}
              <div style={{ width: 130, height: 130, animation: "float 3s ease-in-out infinite" }}>
                <svg width="130" height="130" viewBox="0 0 140 140" fill="none">
                  <circle cx="70" cy="70" r="60" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                  {[20,40,60,80,100,120].map((y, i) => {
                    const r2 = Math.sqrt(Math.max(0, 3600 - (y - 10 - 60) ** 2));
                    return r2 > 0 ? <ellipse key={i} cx="70" cy={y} rx={r2} ry={r2*0.3} stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none"/> : null;
                  })}
                  {[0,30,60,90,120,150].map((a, i) => (
                    <ellipse key={i} cx="70" cy="70" rx="60" ry={60*Math.abs(Math.cos(a*Math.PI/180))} stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" transform={`rotate(${a} 70 70)`}/>
                  ))}
                  <ellipse cx="52" cy="45" rx="18" ry="12" fill="rgba(255,255,255,0.12)" transform="rotate(-20 52 45)"/>
                  {[[45,55],[90,48],[70,75],[55,40],[85,70],[60,85]].map(([x,y],i)=>(
                    <circle key={i} cx={x} cy={y} r="3" fill="rgba(255,255,255,0.8)"/>
                  ))}
                  <line x1="45" y1="55" x2="90" y2="48" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3,3"/>
                  <line x1="90" y1="48" x2="70" y2="75" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3,3"/>
                  <line x1="45" y1="55" x2="70" y2="75" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3,3"/>
                </svg>
              </div>

              {/* CTAs — translated */}
              <div className="flex flex-col gap-3">
                <a href="#contact" className="bg-white font-body font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg text-center whitespace-nowrap" style={{ color: "#2A9D9A" }}>
                  {t("banner.cta1")}
                </a>
                <a href="https://wa.me/5255316302020" target="_blank" rel="noopener noreferrer"
                  className="border border-white/40 text-white font-body font-medium text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:bg-white/10 text-center whitespace-nowrap flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {t("banner.cta2")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex flex-col items-center gap-2 py-8 opacity-40">
        <span className="text-gray-400 text-xs font-body tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-brand-500 to-transparent" />
      </div>
    </section>
  );
}

/* ── Real flag SVG components ── */
function USFlag({ size = 24 }: { size?: number }) {
  const h = Math.round(size * 0.6);
  return (
    <svg width={size} height={h} viewBox="0 0 28 18" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2 }}>
      <rect width="28" height="18" fill="#B22234"/>
      {[1,3,5,7,9,11,13].map(y => <rect key={y} y={y} width="28" height="1.38" fill="white"/>)}
      <rect width="11.2" height="9.7" fill="#3C3B6E"/>
      {[[1.4,1.2],[3.7,1.2],[6,1.2],[8.3,1.2],[10.6,1.2],[2.5,2.8],[4.8,2.8],[7.1,2.8],[9.4,2.8],[1.4,4.4],[3.7,4.4],[6,4.4],[8.3,4.4],[10.6,4.4],[2.5,6],[4.8,6],[7.1,6],[9.4,6],[1.4,7.6],[3.7,7.6],[6,7.6],[8.3,7.6],[10.6,7.6]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="0.6" fill="white"/>
      ))}
    </svg>
  );
}

function CAFlag({ size = 24 }: { size?: number }) {
  const h = Math.round(size * 0.6);
  return (
    <svg width={size} height={h} viewBox="0 0 28 18" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2 }}>
      <rect width="28" height="18" fill="white"/>
      <rect width="7" height="18" fill="#FF0000"/>
      <rect x="21" width="7" height="18" fill="#FF0000"/>
      <path d="M14 3l1.2 2.5H18l-2.2 1.6.8 2.6L14 8.2l-2.6 1.5.8-2.6L10 5.5h2.8z" fill="#FF0000"/>
    </svg>
  );
}

function MXFlag({ size = 24 }: { size?: number }) {
  const h = Math.round(size * 0.6);
  return (
    <svg width={size} height={h} viewBox="0 0 28 18" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2 }}>
      <rect width="28" height="18" fill="white"/>
      <rect width="9.33" height="18" fill="#006847"/>
      <rect x="18.67" width="9.33" height="18" fill="#CE1126"/>
      <ellipse cx="14" cy="9" rx="2.5" ry="3" fill="#006847" opacity="0.6"/>
      <circle cx="14" cy="9" r="1.5" fill="#8B4513" opacity="0.4"/>
    </svg>
  );
}

function AUFlag({ size = 24 }: { size?: number }) {
  const h = Math.round(size * 0.6);
  return (
    <svg width={size} height={h} viewBox="0 0 28 18" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2 }}>
      <rect width="28" height="18" fill="#00008B"/>
      <rect width="14" height="9" fill="#00008B"/>
      <line x1="0" y1="0" x2="14" y2="9" stroke="white" strokeWidth="3"/>
      <line x1="14" y1="0" x2="0" y2="9" stroke="white" strokeWidth="3"/>
      <line x1="0" y1="0" x2="14" y2="9" stroke="#CC0000" strokeWidth="1.8"/>
      <line x1="14" y1="0" x2="0" y2="9" stroke="#CC0000" strokeWidth="1.8"/>
      <line x1="7" y1="0" x2="7" y2="9" stroke="white" strokeWidth="3"/>
      <line x1="0" y1="4.5" x2="14" y2="4.5" stroke="white" strokeWidth="3"/>
      <line x1="7" y1="0" x2="7" y2="9" stroke="#CC0000" strokeWidth="1.8"/>
      <line x1="0" y1="4.5" x2="14" y2="4.5" stroke="#CC0000" strokeWidth="1.8"/>
      <circle cx="21" cy="13.5" r="1.5" fill="white"/>
      <circle cx="25" cy="10.5" r="1.5" fill="white"/>
      <circle cx="23" cy="6.5" r="1.5" fill="white"/>
      <circle cx="18.5" cy="7.5" r="1.5" fill="white"/>
      <circle cx="25" cy="15" r="1" fill="white"/>
    </svg>
  );
}