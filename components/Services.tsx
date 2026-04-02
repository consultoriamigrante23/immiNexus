"use client";
import { useTranslations } from "next-intl";

const countryData = [
  {
    key: "usa",
    accent: "#3B82F6",
    flag: (
      <svg width="40" height="27" viewBox="0 0 40 27" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <rect width="40" height="27" fill="#B22234"/>
        {[2.08,4.15,6.23,8.31,10.38,12.46,14.54,16.62,18.69,20.77,22.85,24.92].map((y,i) => (
          <rect key={i} y={y} width="40" height="2.08" fill={i%2===0?"white":"#B22234"}/>
        ))}
        <rect width="16" height="14.54" fill="#3C3B6E"/>
        {[[1.6,1.4],[4.2,1.4],[6.8,1.4],[9.4,1.4],[12,1.4],[14.4,1.4],[2.8,3.3],[5.4,3.3],[8,3.3],[10.6,3.3],[13.2,3.3],[1.6,5.2],[4.2,5.2],[6.8,5.2],[9.4,5.2],[12,5.2],[14.4,5.2],[2.8,7.1],[5.4,7.1],[8,7.1],[10.6,7.1],[13.2,7.1],[1.6,9],[4.2,9],[6.8,9],[9.4,9],[12,9],[14.4,9],[2.8,11],[5.4,11],[8,11],[10.6,11],[13.2,11],[1.6,12.9],[4.2,12.9],[6.8,12.9],[9.4,12.9],[12,12.9],[14.4,12.9]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="0.8" fill="white"/>
        ))}
      </svg>
    ),
  },
  {
    key: "canada",
    accent: "#EF4444",
    flag: (
      <svg width="40" height="27" viewBox="0 0 40 27" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <rect width="40" height="27" fill="white"/>
        <rect width="10" height="27" fill="#FF0000"/>
        <rect x="30" width="10" height="27" fill="#FF0000"/>
        <path d="M20 4.5l1.8 3.6 3.9.6-2.85 2.7.7 3.9L20 13.2l-3.55 2.1.7-3.9L14.3 8.7l3.9-.6z" fill="#FF0000"/>
      </svg>
    ),
  },
  {
    key: "mexico",
    accent: "#22C55E",
    flag: (
      <svg width="40" height="27" viewBox="0 0 40 27" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <rect width="40" height="27" fill="white"/>
        <rect width="13.33" height="27" fill="#006847"/>
        <rect x="26.67" width="13.33" height="27" fill="#CE1126"/>
        <ellipse cx="20" cy="13.5" rx="4" ry="5" fill="#006847" opacity="0.25"/>
        <ellipse cx="20" cy="13.5" rx="2.5" ry="3.2" fill="#8B4513" opacity="0.35"/>
        <circle cx="20" cy="13.5" r="1.5" fill="#CE1126" opacity="0.4"/>
      </svg>
    ),
  },
  {
    key: "other",
    accent: "#F59E0B",
    flag: (
      <svg width="40" height="27" viewBox="0 0 40 27" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <rect width="40" height="27" rx="3" fill="#e8f7f7"/>
        <circle cx="20" cy="13.5" r="10" fill="none" stroke="#2A9D9A" strokeWidth="1.5"/>
        <ellipse cx="20" cy="13.5" rx="4.5" ry="10" fill="none" stroke="#2A9D9A" strokeWidth="1"/>
        <line x1="10" y1="13.5" x2="30" y2="13.5" stroke="#2A9D9A" strokeWidth="1"/>
        <line x1="11.5" y1="8.5" x2="28.5" y2="8.5" stroke="#2A9D9A" strokeWidth="0.8"/>
        <line x1="11.5" y1="18.5" x2="28.5" y2="18.5" stroke="#2A9D9A" strokeWidth="0.8"/>
      </svg>
    ),
  },
] as const;

export default function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-brand-500 text-sm font-body font-medium tracking-widest uppercase mb-2">{t("subtitle")}</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t("title")}</h2>
          <div className="divider mx-auto mb-4"/>
          <p className="text-gray-500 font-body max-w-lg mx-auto">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {countryData.map(({ key, accent, flag }) => {
            const items = t.raw(`${key}.items`) as string[];
            return (
              <div key={key}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm card-3d hover:border-brand-200 hover:shadow-md transition-all duration-300">
                {/* Real flag */}
                <div className="mb-4">{flag}</div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">{t(`${key}.title`)}</h3>
                <div className="h-0.5 w-8 rounded mb-4" style={{ background: accent }}/>
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
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#2A9D9A"; (e.currentTarget as HTMLElement).style.color="#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background=""; (e.currentTarget as HTMLElement).style.color="#2A9D9A"; }}>
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