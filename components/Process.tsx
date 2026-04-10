"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

const stepKeys = ["consultation","documents","filing","approval"] as const;
const stepColors = ["#11999e","#0d7a7e","#16c6cc","#293533"];
const stepIcons = [
  <svg key="1" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  <svg key="2" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  <svg key="3" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  <svg key="4" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
];

export default function Process() {
  const t = useTranslations("process");
  const [active, setActive] = useState<number|null>(null);

  return (
    <section id="process" className="py-28 bg-gray-50 section-frame">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="section-eyebrow">{t("subtitle")}</span>
          <h2 className="section-title text-4xl md:text-5xl mb-4">{t("title")}</h2>
          <div className="divider mx-auto mb-4"/>
          <p className="font-body text-lg max-w-lg mx-auto" style={{ color:"var(--text-soft)" }}>{t("description")}</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector */}
          <div className="hidden lg:block absolute top-12 left-[14%] right-[14%] h-px"
            style={{ background:"linear-gradient(90deg, rgba(17,153,158,0.1), rgba(17,153,158,0.4), rgba(17,153,158,0.1))" }}/>

          {stepKeys.map((key, i) => (
            <ScrollReveal key={key} delay={i+1 as 1|2|3|4}>
              <div
                className="flex flex-col items-center text-center cursor-pointer group"
                onClick={() => setActive(active===i ? null : i)}>

                {/* Circle */}
                <div className="relative mb-6">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center relative z-10 transition-all duration-400"
                    style={{
                      background: active===i ? `linear-gradient(135deg, ${stepColors[i]}, ${stepColors[i]}cc)` : "white",
                      border:`2px solid ${stepColors[i]}`,
                      color: active===i ? "white" : stepColors[i],
                      boxShadow: active===i
                        ? `0 12px 32px ${stepColors[i]}40, 0 0 0 8px ${stepColors[i]}12`
                        : "0 4px 16px rgba(0,0,0,0.06)",
                      transform: active===i ? "scale(1.1)" : "scale(1)",
                      transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
                    }}>
                    {stepIcons[i]}
                  </div>

                  {/* Step number badge */}
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                    style={{ background:`linear-gradient(135deg, ${stepColors[i]}, ${stepColors[i]}aa)` }}>
                    {i+1}
                  </div>
                </div>

                <h3 className="font-heading text-lg font-bold mb-3 transition-colors"
                  style={{ color: active===i ? stepColors[i] : "var(--text-primary)" }}>
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="text-sm font-body leading-relaxed" style={{ color:"var(--text-soft)" }}>
                  {t(`steps.${key}.desc`)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center mt-14">
          <a href="#contact" className="btn-brand btn-shimmer text-base px-10 py-4">{t("cta")}</a>
        </ScrollReveal>
      </div>
    </section>
  );
}