"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const stepKeys = ["consultation","documents","filing","approval"] as const;
const stepColors = ["#11999e","#0d7a7e","#16c6cc","#40514e"];

const stepIcons = [
  <svg key="1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  <svg key="3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  <svg key="4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
];

export default function Process() {
  const t = useTranslations("process");
  const [active, setActive] = useState<number|null>(null);

  return (
    <section id="process" className="py-24 bg-gray-50 section-frame">
      <div className="max-w-7xl mx-auto px-6">

        {/* 3D Section header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
            <svg width="320" height="80" viewBox="0 0 320 80" fill="none" opacity="0.05">
              {[0,1,2,3].map(i => (
                <g key={i}>
                  <circle cx={50 + i*75} cy="40" r="24" stroke="#11999e" strokeWidth="1.5"/>
                  {i < 3 && <line x1={74+i*75} y1="40" x2={126+i*75} y2="40" stroke="#11999e" strokeWidth="1.5" strokeDasharray="4 3"/>}
                </g>
              ))}
            </svg>
          </div>
          <div className="relative" style={{ zIndex: 1 }}>
            <p className="text-sm font-body font-medium tracking-widest uppercase mb-2" style={{ color: "#11999e" }}>{t("subtitle")}</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4" style={{ color: "#293533" }}>{t("title")}</h2>
            <div className="divider mx-auto mb-4"/>
            <p className="font-body max-w-lg mx-auto" style={{ color: "#576d69" }}>{t("description")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[13%] right-[13%] h-px"
            style={{ background: "linear-gradient(90deg, rgba(17,153,158,0.15), rgba(17,153,158,0.45), rgba(17,153,158,0.15))" }}/>

          {stepKeys.map((key, i) => (
            <div key={key}
              className="flex flex-col items-center text-center cursor-pointer group"
              onClick={() => setActive(active === i ? null : i)}>

              {/* Step circle */}
              <div className="relative mb-6 transition-all duration-300 group-hover:-translate-y-1">
                <div className="w-24 h-24 rounded-full flex items-center justify-center relative z-10 transition-all duration-300"
                  style={{
                    background: active === i ? stepColors[i] : "white",
                    border: `2px solid ${stepColors[i]}`,
                    boxShadow: active === i ? `0 12px 32px ${stepColors[i]}40` : "0 4px 16px rgba(0,0,0,0.06)",
                    color: active === i ? "white" : stepColors[i],
                  }}>
                  {stepIcons[i]}
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold font-body"
                  style={{ background: stepColors[i] }}>
                  {i + 1}
                </div>
              </div>

              <h3 className="font-heading text-lg font-bold mb-3" style={{ color: "#293533" }}>
                {t(`steps.${key}.title`)}
              </h3>
              <p className="text-sm font-body leading-relaxed" style={{ color: "#576d69" }}>
                {t(`steps.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a href="#contact" className="btn-brand text-base px-10 py-4">{t("cta")}</a>
        </div>
      </div>
    </section>
  );
}