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
  return <div ref={ref} className="font-heading text-4xl font-bold text-gray-900">{n}{suffix}</div>;
}

export default function WhyUs() {
  const t = useTranslations("whyUs");
  return (
    <section id="why-us" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-brand-500 text-sm font-body font-medium tracking-widest uppercase mb-2">{t("subtitle")}</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t("title")}</h2>
          <div className="divider mx-auto" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {statsData.map(s => (
            <div key={s.key} className="bg-brand-50 border border-brand-100 rounded-2xl p-6 text-center card-3d">
              <Counter value={s.value} suffix={s.suffix} />
              <p className="text-gray-500 text-sm font-body mt-1">{t(`stats.${s.key}`)}</p>
            </div>
          ))}
        </div>

        {/* Reasons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasonKeys.map(key => (
            <div key={key} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300 card-3d">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4 border border-brand-100">
                <div className="w-3 h-3 bg-brand-500 rounded-full" />
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{t(`reasons.${key}.title`)}</h3>
              <p className="text-gray-500 text-sm font-body leading-relaxed">{t(`reasons.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}