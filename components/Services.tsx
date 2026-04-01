"use client";
import { useTranslations } from "next-intl";

const countryData = [
  { key: "usa",    flag: "🇺🇸", accent: "#3B82F6" },
  { key: "canada", flag: "🇨🇦", accent: "#EF4444" },
  { key: "mexico", flag: "🇲🇽", accent: "#22C55E" },
  { key: "other",  flag: "🌍",  accent: "#F59E0B" },
] as const;

export default function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-brand-500 text-sm font-body font-medium tracking-widest uppercase mb-2">{t("subtitle")}</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t("title")}</h2>
          <div className="divider mx-auto mb-4" />
          <p className="text-gray-500 font-body max-w-lg mx-auto">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {countryData.map(({ key, flag, accent }) => {
            const items = t.raw(`${key}.items`) as string[];
            return (
              <div key={key}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm card-3d hover:border-brand-200 transition-all duration-300">
                <div className="text-4xl mb-4">{flag}</div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">{t(`${key}.title`)}</h3>
                <div className="h-0.5 w-8 rounded mb-4" style={{ background: accent }} />
                <ul className="space-y-2 mb-6">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm font-body text-gray-600">
                      <span style={{ color: "#2A9D9A", marginTop: 2, flexShrink: 0 }}>▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact"
                  className="block text-center text-sm font-body font-medium py-2 rounded-md border transition-all duration-200 hover:-translate-y-0.5"
                  style={{ borderColor: "#2A9D9A", color: "#2A9D9A" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#2A9D9A"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "#2A9D9A"; }}>
                  {t("getStarted")} →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}