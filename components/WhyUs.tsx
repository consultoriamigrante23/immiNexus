"use client";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const statsData = [
  { key: "cases",     value: 500, suffix: "+" },
  { key: "success",   value: 98,  suffix: "%" },
  { key: "countries", value: 10,  suffix: "+" },
  { key: "clients",   value: 300, suffix: "+" },
];
const reasonKeys = ["licensed","multilingual","secure","fast","endToEnd","global"] as const;

const reasonIcons: Record<string, React.ReactNode> = {
  licensed:    <ShieldIcon/>,
  multilingual:<LangIcon/>,
  secure:      <LockIcon/>,
  fast:        <SpeedIcon/>,
  endToEnd:    <CheckIcon/>,
  global:      <GlobeIcon/>,
};

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let start = 0;
        const step = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / 1600, 1);
          setN(Math.floor((1 - Math.pow(1 - p, 3)) * value));
          if (p < 1) requestAnimationFrame(step); else setN(value);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="font-heading text-4xl font-bold" style={{ color: "#293533" }}>
      {n}{suffix}
    </div>
  );
}

export default function WhyUs() {
  const t = useTranslations("whyUs");
  return (
    <section id="why-us" className="py-24 bg-white section-frame">
      <div className="max-w-7xl mx-auto px-6">

        {/* 3D Section header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
            <svg width="280" height="100" viewBox="0 0 280 100" fill="none" opacity="0.05">
              <rect x="20" y="20" width="240" height="60" rx="8" stroke="#11999e" strokeWidth="2"/>
              <rect x="40" y="35" width="200" height="30" rx="4" stroke="#11999e" strokeWidth="1.5"/>
              {[60,100,140,180,220].map(x => <line key={x} x1={x} y1="20" x2={x} y2="80" stroke="#11999e" strokeWidth="0.8"/>)}
            </svg>
          </div>
          <div className="relative" style={{ zIndex: 1 }}>
            <p className="text-sm font-body font-medium tracking-widest uppercase mb-2" style={{ color: "#11999e" }}>{t("subtitle")}</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4" style={{ color: "#293533" }}>{t("title")}</h2>
            <div className="divider mx-auto"/>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {statsData.map(s => (
            <div key={s.key} className="rounded-2xl p-6 text-center card-3d border"
              style={{ background: "#f0fafa", borderColor: "rgba(17,153,158,0.15)" }}>
              <Counter value={s.value} suffix={s.suffix}/>
              <p className="text-sm font-body mt-1" style={{ color: "#576d69" }}>{t(`stats.${s.key}`)}</p>
            </div>
          ))}
        </div>

        {/* Reasons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasonKeys.map(key => (
            <div key={key} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-300 card-3d flex gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#e8f6f7", border: "1px solid rgba(17,153,158,0.15)" }}>
                {reasonIcons[key]}
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold mb-2" style={{ color: "#293533" }}>{t(`reasons.${key}.title`)}</h3>
                <p className="text-sm font-body leading-relaxed" style={{ color: "#576d69" }}>{t(`reasons.${key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShieldIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function LangIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function LockIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function SpeedIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="2"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>; }
function CheckIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>; }
function GlobeIcon()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }