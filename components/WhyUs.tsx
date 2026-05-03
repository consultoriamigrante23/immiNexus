"use client";
import { useTranslations } from "next-intl";
import { JSX, useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

const statsData = [
  { key:"cases",     value:500, suffix:"+" },
  { key:"success",   value:98,  suffix:"%" },
  { key:"countries", value:10,  suffix:"+" },
  { key:"clients",   value:300, suffix:"+" },
];
const reasonKeys = ["licensed","multilingual","secure","fast","endToEnd","global"] as const;

const icons: Record<string,JSX.Element> = {
  licensed:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  multilingual:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  secure:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  fast:        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.8"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  endToEnd:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>,
  global:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
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
          const p = Math.min((ts - start) / 1800, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.floor(eased * value));
          if (p < 1) requestAnimationFrame(step); else setN(value);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="font-heading text-4xl md:text-5xl font-bold" style={{ color:"var(--text-primary)" }}>
      {n}{suffix}
    </div>
  );
}

export default function WhyUs() {
  const t = useTranslations("whyUs");
  const p = useTranslations("privacy");
  return (
    <section id="why-us" className="py-28 bg-white section-frame">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="section-eyebrow">{t("subtitle")}</span>
          <h2 className="section-title text-4xl md:text-5xl mb-4">{t("title")}</h2>
          <div className="divider mx-auto"/>
        </ScrollReveal>
        {/* ── WHO WE ARE ── */}
<ScrollReveal className="mb-20">
  <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
    style={{
      background: "linear-gradient(135deg, rgba(17,153,158,0.07) 0%, rgba(17,153,158,0.03) 100%)",
      border: "1px solid rgba(17,153,158,0.15)",
      boxShadow: "0 20px 60px rgba(17,153,158,0.08)"
    }}>

    {/* subtle glow */}
    <div className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(circle at 20% 30%, rgba(17,153,158,0.12), transparent 60%)"
      }}/>

    <div className="relative">
      <h3 className="font-heading text-2xl md:text-3xl font-bold mb-8"
        style={{ color: "var(--text-primary)" }}>
        {p("teamTitle")}
      </h3>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Marco */}
        <div className="group rounded-2xl p-6 transition-all duration-300"
          style={{
            background: "white",
            border: "1px solid rgba(17,153,158,0.12)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
          }}
          onMouseEnter={e=>{
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "translateY(-6px)";
            el.style.boxShadow = "0 16px 40px rgba(17,153,158,0.12)";
          }}
          onMouseLeave={e=>{
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.04)";
          }}>

          <h4 className="font-heading text-lg font-bold mb-1" style={{ color:"var(--text-primary)" }}>
            Marco Rodriguez
          </h4>
          <p className="text-xs font-body mb-3" style={{ color:"var(--brand)" }}>
            {p("mainConsultant")}
          </p>

          <p className="text-sm font-body leading-relaxed" style={{ color:"var(--text-soft)" }}>
            {p("marcoBio")}
          </p>

         
        </div>

        {/* Sidelghali */}
        <div className="group rounded-2xl p-6 transition-all duration-300"
          style={{
            background: "white",
            border: "1px solid rgba(17,153,158,0.12)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
          }}
          onMouseEnter={e=>{
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "translateY(-6px)";
            el.style.boxShadow = "0 16px 40px rgba(17,153,158,0.12)";
          }}
          onMouseLeave={e=>{
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.04)";
          }}>

          <h4 className="font-heading text-lg font-bold mb-1" style={{ color:"var(--text-primary)" }}>
            Sidelghali Zouine
          </h4>
          <p className="text-xs font-body mb-3" style={{ color:"var(--brand)" }}>
           {p("legalAssistant")}
          </p>

          <p className="text-sm font-body leading-relaxed" style={{ color:"var(--text-soft)" }}>
           {p("sidelBio")}</p>

         
        </div>

      </div>
    </div>
  </div>
</ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {statsData.map((s, i) => (
            <ScrollReveal key={s.key} delay={i+1 as 1|2|3|4}>
              <div className="relative rounded-2xl p-6 text-center overflow-hidden group"
                style={{ background:"linear-gradient(135deg, rgba(17,153,158,0.06) 0%, rgba(17,153,158,0.03) 100%)", border:"1px solid rgba(17,153,158,0.12)", transition:"all 0.35s ease" }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform="translateY(-4px)"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform="translateY(0)"}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background:"linear-gradient(135deg, rgba(17,153,158,0.1), transparent)" }}/>
                <Counter value={s.value} suffix={s.suffix}/>
                <p className="text-sm font-body mt-2" style={{ color:"var(--text-soft)" }}>{t(`stats.${s.key}`)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Reason cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasonKeys.map((key, i) => (
            <ScrollReveal key={key} delay={((i%3)+1) as 1|2|3}>
              <div className="group relative bg-white rounded-2xl p-6 border transition-all duration-350 flex gap-4 overflow-hidden"
                style={{ borderColor:"rgba(17,153,158,0.1)", boxShadow:"var(--shadow-sm)" }}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(17,153,158,0.25)";el.style.boxShadow="0 12px 32px rgba(17,153,158,0.12)";el.style.transform="translateY(-4px)";}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(17,153,158,0.1)";el.style.boxShadow="var(--shadow-sm)";el.style.transform="translateY(0)";}}>

                {/* Hover accent */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background:"linear-gradient(135deg, rgba(17,153,158,0.04) 0%, transparent 60%)" }}/>

                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 group-hover:rotate-3"
                  style={{ background:"rgba(17,153,158,0.08)", border:"1px solid rgba(17,153,158,0.12)", transition:"all 0.3s cubic-bezier(0.23,1,0.32,1)" }}>
                  {icons[key]}
                </div>
                <div className="relative">
                  <h3 className="font-heading text-lg font-bold mb-2" style={{ color:"var(--text-primary)" }}>{t(`reasons.${key}.title`)}</h3>
                  <p className="text-sm font-body leading-relaxed" style={{ color:"var(--text-soft)" }}>{t(`reasons.${key}.desc`)}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}