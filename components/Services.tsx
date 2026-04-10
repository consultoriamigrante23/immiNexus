"use client";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

const countryData = [
  { key:"usa",    accent:"#3B82F6", bg:"https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=500&q=75" },
  { key:"canada", accent:"#EF4444", bg:"https://images.unsplash.com/photo-1517935706615-2717063c2225?w=500&q=75" },
  { key:"mexico", accent:"#22C55E", bg:"https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=500&q=75" },
  { key:"other",  accent:"#F59E0B", bg:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=75" },
] as const;

function Card3D({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-y*10}deg) rotateY(${x*10}deg) translateY(-8px) scale(1.02)`;
    el.style.boxShadow = `${-x*20}px ${-y*20}px 50px rgba(17,153,158,0.15), 0 20px 40px rgba(0,0,0,0.08)`;
  };
  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)";
    el.style.boxShadow = "var(--shadow-sm)";
    el.style.transition = "all 0.6s cubic-bezier(0.23,1,0.32,1)";
  };
  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    el.style.transition = "transform 0.15s ease, box-shadow 0.15s ease";
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onMouseEnter={onEnter}
      className={className} style={{ transition:"all 0.6s cubic-bezier(0.23,1,0.32,1)", willChange:"transform", ...style }}>
      {children}
    </div>
  );
}

export default function Services() {
  const t = useTranslations("services");
  return (
    <section id="services" className="py-28 bg-gray-50 section-frame bg-dot">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="section-eyebrow">{t("subtitle")}</span>
          <h2 className="section-title text-4xl md:text-5xl mb-4">{t("title")}</h2>
          <div className="divider mx-auto mb-5"/>
          <p className="font-body text-lg max-w-lg mx-auto" style={{ color:"var(--text-soft)" }}>{t("description")}</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {countryData.map(({ key, accent, bg }, i) => {
            const items = t.raw(`${key}.items`) as string[];
            return (
              <ScrollReveal key={key} delay={i+1 as 1|2|3|4}>
                <Card3D className="bg-white rounded-2xl overflow-hidden border shadow-sm h-full"
                  style={{ borderColor:"rgba(17,153,158,0.08)" }}>

                  {/* Image header */}
                  <div className="relative h-36 overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
                      style={{ backgroundImage:`url(${bg})` }}/>
                    <div className="absolute inset-0" style={{ background:"rgba(0,0,0,0.4)" }}/>
                    <div className="absolute inset-0" style={{ background:`linear-gradient(135deg, ${accent}30, transparent)` }}/>
                    <div className="absolute inset-0 flex items-center px-5 gap-3">
                      <div className="rounded-lg overflow-hidden shadow-lg flex-shrink-0"
                        style={{ border:"2px solid rgba(255,255,255,0.4)", display:"block" }}>
                        {key==="usa"    && <svg width="36" height="22" viewBox="0 0 36 24"><rect width="36" height="24" fill="#B22234"/>{[1.85,3.7,5.54,7.38,9.23,11.08,12.92,14.77,16.62,18.46,20.31,22.15].map((y,i)=><rect key={i} y={y} width="36" height="1.85" fill={i%2===0?"white":"#B22234"}/>)}<rect width="14.4" height="12.92" fill="#3C3B6E"/></svg>}
                        {key==="canada" && <svg width="36" height="22" viewBox="0 0 36 24"><rect width="36" height="24" fill="white"/><rect width="9" height="24" fill="#FF0000"/><rect x="27" width="9" height="24" fill="#FF0000"/><path d="M18 4l1.6 3.2 3.5.5-2.55 2.4.65 3.5L18 11.8l-3.2 1.8.65-3.5L12.9 7.7l3.5-.5z" fill="#FF0000"/></svg>}
                        {key==="mexico" && <svg width="36" height="22" viewBox="0 0 36 24"><rect width="36" height="24" fill="white"/><rect width="12" height="24" fill="#006847"/><rect x="24" width="12" height="24" fill="#CE1126"/></svg>}
                        {key==="other"  && <div className="w-9 h-6 flex items-center justify-center rounded" style={{background:"rgba(255,255,255,0.15)"}}><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/><ellipse cx="10" cy="10" rx="4" ry="8" stroke="white" strokeWidth="1"/><line x1="2" y1="10" x2="18" y2="10" stroke="white" strokeWidth="1"/></svg></div>}
                      </div>
                      <h3 className="font-heading text-xl font-bold text-white drop-shadow">{t(`${key}.title`)}</h3>
                    </div>
                    {/* Accent bottom line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background:`linear-gradient(90deg, ${accent}, transparent)` }}/>
                  </div>

                  <div className="p-5">
                    <ul className="space-y-2.5 mb-5">
                      {items.map(item => (
                        <li key={item} className="flex items-start gap-2.5 text-sm font-body" style={{ color:"var(--text-soft)" }}>
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background:accent }}/>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a href="#contact"
                      className="flex items-center justify-center gap-2 text-sm font-body font-semibold py-2.5 rounded-xl border transition-all hover:-translate-y-0.5"
                      style={{ borderColor:"rgba(17,153,158,0.2)", color:"var(--brand)", background:"rgba(17,153,158,0.04)", textDecoration:"none" }}
                      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background="var(--brand)";el.style.color="#fff";el.style.borderColor="var(--brand)";}}
                      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background="rgba(17,153,158,0.04)";el.style.color="var(--brand)";el.style.borderColor="rgba(17,153,158,0.2)";}}>
                      {t("getStarted")}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                  </div>
                </Card3D>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}