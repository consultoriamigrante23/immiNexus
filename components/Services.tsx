"use client";
import { useTranslations } from "next-intl";

const countryData = [
  {
    key: "usa",
    accent: "#3B82F6",
    flag: <USFlag />,
    bg: "https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=400&q=80", // Washington DC Capitol
  },
  {
    key: "canada",
    accent: "#EF4444",
    flag: <CAFlag />,
    bg: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&q=80", // Ottawa Parliament
  },
  {
    key: "mexico",
    accent: "#22C55E",
    flag: <MXFlag />,
    bg: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=400&q=80", // Mexico City
  },
  {
    key: "other",
    accent: "#F59E0B",
    flag: null,
    bg: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80", // Airplane/world travel
  },
] as const;

export default function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-24 bg-gray-50">
      <section id="services" className="py-24 bg-gray-50 section-frame"></section>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-brand-500 text-sm font-body font-medium tracking-widest uppercase mb-2">
            {t("subtitle")}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <div className="divider mx-auto mb-4"/>
          <p className="text-gray-500 font-body max-w-lg mx-auto">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {countryData.map(({ key, accent, flag, bg }) => {
            const items = t.raw(`${key}.items`) as string[];
            return (
              <div key={key}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-brand-200 transition-all duration-300 group"
                style={{ transform: "translateZ(0)" }}>

                {/* Country background image header */}
                <div className="relative h-32 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${bg})` }}
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }}/>
                  {/* Accent color overlay */}
                  <div className="absolute inset-0" style={{ background: `${accent}33` }}/>

                  {/* Flag + title overlay */}
                  <div className="absolute inset-0 flex items-center px-5 gap-3">
                    {flag && (
                      <div className="flex-shrink-0 shadow-lg rounded overflow-hidden" style={{ border: "2px solid rgba(255,255,255,0.3)" }}>
                        {flag}
                      </div>
                    )}
                    {!flag && (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)" }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/>
                          <ellipse cx="10" cy="10" rx="4" ry="8" stroke="white" strokeWidth="1"/>
                          <line x1="2" y1="10" x2="18" y2="10" stroke="white" strokeWidth="1"/>
                        </svg>
                      </div>
                    )}
                    <h3 className="font-heading text-xl font-bold text-white drop-shadow-sm">
                      {t(`${key}.title`)}
                    </h3>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: accent }}/>
                </div>

                {/* Content */}
                <div className="p-5">
                  <ul className="space-y-2 mb-5">
                    {items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm font-body text-gray-600">
                        <span style={{ color: "#2A9D9A", marginTop: 2, flexShrink: 0, fontSize: 10 }}>▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact"
                    className="block text-center text-sm font-body font-medium py-2 rounded-md border transition-all duration-200 hover:-translate-y-0.5"
                    style={{ borderColor: "#2A9D9A", color: "#2A9D9A" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "#2A9D9A";
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "";
                      (e.currentTarget as HTMLElement).style.color = "#2A9D9A";
                    }}>
                    {t("getStarted")} →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Flag SVGs ── */
function USFlag() {
  return (
    <svg width="36" height="24" viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" fill="#B22234"/>
      {[1.85,3.7,5.54,7.38,9.23,11.08,12.92,14.77,16.62,18.46,20.31,22.15].map((y,i)=>(
        <rect key={i} y={y} width="36" height="1.85" fill={i%2===0?"white":"#B22234"}/>
      ))}
      <rect width="14.4" height="12.92" fill="#3C3B6E"/>
      {[[1.4,1.2],[3.6,1.2],[5.8,1.2],[8,1.2],[10.2,1.2],[12.4,1.2],[2.4,3],[4.6,3],[6.8,3],[9,3],[11.2,3],[1.4,4.8],[3.6,4.8],[5.8,4.8],[8,4.8],[10.2,4.8],[12.4,4.8],[2.4,6.6],[4.6,6.6],[6.8,6.6],[9,6.6],[11.2,6.6],[1.4,8.4],[3.6,8.4],[5.8,8.4],[8,8.4],[10.2,8.4],[12.4,8.4],[2.4,10.2],[4.6,10.2],[6.8,10.2],[9,10.2],[11.2,10.2]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="0.7" fill="white"/>
      ))}
    </svg>
  );
}
function CAFlag() {
  return (
    <svg width="36" height="24" viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" fill="white"/>
      <rect width="9" height="24" fill="#FF0000"/>
      <rect x="27" width="9" height="24" fill="#FF0000"/>
      <path d="M18 4l1.6 3.2 3.5.5-2.55 2.4.65 3.5L18 11.8l-3.2 1.8.65-3.5L12.9 7.7l3.5-.5z" fill="#FF0000"/>
    </svg>
  );
}
function MXFlag() {
  return (
    <svg width="36" height="24" viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" fill="white"/>
      <rect width="12" height="24" fill="#006847"/>
      <rect x="24" width="12" height="24" fill="#CE1126"/>
      <ellipse cx="18" cy="12" rx="3.5" ry="4.5" fill="#006847" opacity="0.2"/>
      <ellipse cx="18" cy="12" rx="2.2" ry="2.8" fill="#8B4513" opacity="0.3"/>
    </svg>
  );
}