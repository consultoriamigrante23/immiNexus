"use client";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BookingModal from "./BookingModal";

const VIDEOS = [
  "https://videos.pexels.com/video-files/1851190/1851190-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/2058911/2058911-uhd_2560_1440_24fps.mp4",
  "https://videos.pexels.com/video-files/2003428/2003428-uhd_2560_1440_24fps.mp4",
];

export default function Hero() {
  const t = useTranslations("hero");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoIdx,    setVideoIdx]    = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length:50 }, () => ({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22, r:.8+Math.random()*1.2,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>canvas.width) p.vx*=-1;
        if(p.y<0||p.y>canvas.height) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="rgba(255,255,255,0.3)"; ctx.fill();
      });
      pts.forEach((a,i) => pts.slice(i+1).forEach(b => {
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<90){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(255,255,255,${.055*(1-d/90)})`;ctx.lineWidth=.5;ctx.stroke();}
      }));
      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        <div className="absolute inset-0" style={{ zIndex:0 }}>
          <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,#041c1e 0%,#073d40 30%,#0d7a7e 60%,#073d40 85%,#041c1e 100%)" }}/>

          <video
            ref={videoRef}
            autoPlay muted loop playsInline
            onCanPlay={()=>setVideoLoaded(true)}
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:videoLoaded?0.5:0, transition:"opacity 2s ease" }}>
            {VIDEOS.map((src,i) => <source key={i} src={src} type="video/mp4"/>)}
          </video>

          <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,rgba(4,28,30,0.6) 0%,rgba(10,70,74,0.6) 40%,rgba(4,28,30,0.6) 100%)" }}/>
          <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse 70% 60% at 60% 40%,rgba(17,153,158,0.08) 0%,transparent 70%)" }}/>
          <div className="absolute bottom-0 left-0 right-0 h-40" style={{ background:"linear-gradient(to bottom,transparent,rgba(4,28,30,0.6))" }}/>
        </div>

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents:"none", zIndex:1 }}/>

        <div className="absolute pointer-events-none" style={{ zIndex:1, top:"10%", right:"8%", width:450, height:450, borderRadius:"50%", background:"radial-gradient(circle,rgba(22,198,204,0.1) 0%,transparent 65%)" }}/>
        <div className="absolute pointer-events-none" style={{ zIndex:1, bottom:"15%", left:"5%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(17,153,158,0.08) 0%,transparent 65%)" }}/>

        <div className="relative flex-1 max-w-7xl mx-auto px-6 w-full pt-28 pb-8" style={{ zIndex:2 }}>
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 min-h-[78vh]">

            <div className="flex-1 text-center lg:text-left max-w-2xl">

              <h1 className="fade-up delay-2 font-heading font-bold leading-tight mb-5 text-white"
                style={{ fontSize:"clamp(2.6rem,5vw,4.8rem)", textShadow:"0 2px 24px rgba(0,0,0,0.4)" }}>
                {t("title")}<br/>
                <span style={{ color:"#7de8e8", textShadow:"0 0 40px rgba(125,232,232,0.4)" }}>{t("titleAccent")}</span>
              </h1>

              <p className="fade-up delay-3 font-body text-lg leading-relaxed mb-8"
                style={{ color:"rgba(255,255,255,0.75)", maxWidth:500, lineHeight:1.8 }}>
                {t("subtitle")}
              </p>

              <div className="fade-up delay-4 flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
                <button onClick={()=>setBookingOpen(true)}
                  className="btn-brand btn-shimmer text-base px-8 py-4"
                  style={{ boxShadow:"0 8px 32px rgba(17,153,158,0.55),0 2px 8px rgba(0,0,0,0.3)", fontSize:15 }}>
                  {t("cta1")}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <a href="https://wa.me/+525531630202" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-base px-8 py-4 rounded-xl font-body font-semibold transition-all hover:-translate-y-1"
                  style={{ background:"rgba(37,211,102,0.15)", border:"1.5px solid rgba(37,211,102,0.4)", color:"white", textDecoration:"none", backdropFilter:"blur(8px)" }}>
                  WhatsApp Us
                </a>
              </div>

              <div className="fade-up delay-5 flex flex-wrap gap-2 justify-center lg:justify-start">
                {["Mexico","United States","Canada","More"].map(label => (
                  <div key={label}
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-body font-medium"
                    style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.88)", backdropFilter:"blur(8px)" }}>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-lg">

              <div className="relative flex items-center justify-center w-full">

                <div className="relative rounded-3xl p-8 flex flex-col items-center gap-4"
                  style={{ background:"rgba(255,255,255,0.08)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.2)", boxShadow:"0 20px 60px rgba(0,0,0,0.3), 0 0 80px rgba(17,153,158,0.15), inset 0 1px 0 rgba(255,255,255,0.15)", zIndex:2, animation:"float-slow 6s ease-in-out infinite" }}>
                  <Image
                    src="/logo-horizontal.png"
                    alt="ImmiNexus Consultants"
                    width={280}
                    height={90}
                    className="object-contain"
                    style={{ maxWidth:"100%", height:"auto" }}
                    priority
                  />
                  <div className="w-full h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)" }}/>
                  <p className="text-sm font-body text-center" style={{ color:"rgba(255,255,255,0.65)", maxWidth:240 }}>
                    Professional immigration consulting for Mexico, USA & Canada
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-[300px]">
                {[{ v:"98%",l:"Success Rate" },{ v:"500+",l:"Cases Handled" },{ v:"10+",l:"Countries" },{ v:"3",l:"Languages" }].map((s,i)=>(
                  <div key={i} className="rounded-2xl p-4 text-center"
                    style={{ background:"rgba(255,255,255,0.08)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.15)", animation:`float-slow ${4+i*.7}s ease-in-out infinite ${i*.35}s`, boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
                    <p className="font-heading text-2xl font-bold text-white leading-none">{s.v}</p>
                    <p className="text-xs font-body mt-1.5" style={{ color:"rgba(255,255,255,0.6)" }}>{s.l}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </section>

      <BookingModal open={bookingOpen} onClose={()=>setBookingOpen(false)}/>
    </>
  );
}