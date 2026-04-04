"use client";
import { useTranslations } from "next-intl";

const countryData = [
  {
    key: "usa", accent: "#3B82F6",
    bg: "https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=500&q=75",
    flag: <USFlag/>,
  },
  {
    key: "canada", accent: "#EF4444",
    bg: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=500&q=75",
    flag: <CAFlag/>,
  },
  {
    key: "mexico", accent: "#22C55E",
    bg: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=500&q=75",
    flag: <MXFlag/>,
  },
  {
    key: "other", accent: "#F59E0B",
    bg: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=75",
    flag: null,
  },
] as const;

export default function Services() {
  const t = useTranslations("services");
  return (
    <section id="services" className="py-24 bg-gray-50 section-frame">
      <div className="max-w-7xl mx-auto px-6">

        {/* 3D Section header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
            <svg width="300" height="120" viewBox="0 0 300 120" fill="none" opacity="0.06">
              <ellipse cx="150" cy="60" rx="140" ry="50" stroke="#11999e" strokeWidth="2"/>
              <ellipse cx="150" cy="60" rx="100" ry="35" stroke="#11999e" strokeWidth="1.5"/>
              <line x1="10" y1="60" x2="290" y2="60" stroke="#11999e" strokeWidth="1"/>
              <line x1="150" y1="10" x2="150" y2="110" stroke="#11999e" strokeWidth="1"/>
            </svg>
          </div>
          <div className="relative" style={{ zIndex: 1 }}>
            <p className="text-sm font-body font-medium tracking-widest uppercase mb-2" style={{ color: "#11999e" }}>
              {t("subtitle")}
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4" style={{ color: "#293533" }}>
              {t("title")}
            </h2>
            <div className="divider mx-auto mb-4"/>
            <p className="font-body max-w-lg mx-auto" style={{ color: "#576d69" }}>{t("description")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {countryData.map(({ key, accent, bg, flag }) => {
            const items = t.raw(`${key}.items`) as string[];
            return (
              <div key={key}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-400 group card-3d">
                {/* Image header */}
                <div className="relative h-36 overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${bg})` }}/>
                  <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.42)" }}/>
                  <div className="absolute inset-0" style={{ background: `${accent}25` }}/>
                  <div className="absolute inset-0 flex items-center px-5 gap-3">
                    {flag && <div className="rounded overflow-hidden shadow-lg" style={{ border: "2px solid rgba(255,255,255,0.35)" }}>{flag}</div>}
                    {!flag && (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)" }}>
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/>
                          <ellipse cx="10" cy="10" rx="4" ry="8" stroke="white" strokeWidth="1"/>
                          <line x1="2" y1="10" x2="18" y2="10" stroke="white" strokeWidth="1"/>
                        </svg>
                      </div>
                    )}
                    <h3 className="font-heading text-xl font-bold text-white drop-shadow">{t(`${key}.title`)}</h3>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: accent }}/>
                </div>
                <div className="p-5">
                  <ul className="space-y-2 mb-5">
                    {items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm font-body" style={{ color: "#576d69" }}>
                        <span style={{ color: "#11999e", marginTop: 3, fontSize: 9, flexShrink: 0 }}>▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact"
                    className="block text-center text-sm font-body font-medium py-2.5 rounded-lg border transition-all hover:-translate-y-0.5"
                    style={{ borderColor: "#11999e", color: "#11999e" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "#11999e"; el.style.color = "#fff"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = ""; el.style.color = "#11999e"; }}>
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

function USFlag() {
  return (
    <svg width="38" height="25" viewBox="0 0 36 24">
      <rect width="36" height="24" fill="#B22234"/>
      {[1.85,3.7,5.54,7.38,9.23,11.08,12.92,14.77,16.62,18.46,20.31,22.15].map((y,i)=>(
        <rect key={i} y={y} width="36" height="1.85" fill={i%2===0?"white":"#B22234"}/>
      ))}
      <rect width="14.4" height="12.92" fill="#3C3B6E"/>
      {[[1.4,1.2],[3.6,1.2],[5.8,1.2],[8,1.2],[10.2,1.2],[12.4,1.2],[2.4,3],[4.6,3],[6.8,3],[9,3],[11.2,3]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="0.75" fill="white"/>
      ))}
    </svg>
  );
}
function CAFlag() {
  return (
    <svg width="38" height="25" viewBox="0 0 36 24">
      <rect width="36" height="24" fill="white"/>
      <rect width="9" height="24" fill="#FF0000"/>
      <rect x="27" width="9" height="24" fill="#FF0000"/>
      <path d="M18 4l1.6 3.2 3.5.5-2.55 2.4.65 3.5L18 11.8l-3.2 1.8.65-3.5L12.9 7.7l3.5-.5z" fill="#FF0000"/>
    </svg>
  );
}
function MXFlag() {
  return (
    <svg width="38" height="25" viewBox="0 0 36 24">
      <rect width="36" height="24" fill="white"/>
      <rect width="12" height="24" fill="#006847"/>
      <rect x="24" width="12" height="24" fill="#CE1126"/>
    </svg>
  );
}