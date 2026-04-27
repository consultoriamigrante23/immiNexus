"use client";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

const serviceData = [
  {
    key: "mexico",
    accent: "#22C55E",
    bg: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=500&q=75",
    titleKey: "Mexico",
    items: [
      "Visitor visa / Non-lucrative (tourism, business, transit)",
      "Temporary Residence (Work, Family, Study, Digital Nomad)",
      "Permanent Residence",
      "Visa requests outside Mexico",
      "Permits at the National Institute of Migration",
      "Passport services",
    ],
  },
  {
    key: "usa",
    accent: "#3B82F6",
    bg: "https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=500&q=75",
    titleKey: "United States",
    items: [
      "Visa B1 – Business visitor",
      "Visa B2 – Tourism & medical",
    ],
  },
  {
    key: "canada",
    accent: "#EF4444",
    bg: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=500&q=75",
    titleKey: "Canada",
    items: [
      "Visitor visa (family, transit, tourism, business)",
      "Electronic Travel Authorization (eTA)",
    ],
  },
  {
    key: "other",
    accent: "#F59E0B",
    bg: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=75",
    titleKey: "Other Countries",
    items: [
      "Visitor visas – short and long term",
      "Transit visas",
      "Business visas",
      "And more",
    ],
  },
] as const;

function Card3D({ children, className = "", style = {} }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    el.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-8px) scale(1.02)`;
    el.style.boxShadow = `${-x * 15}px ${-y * 15}px 40px rgba(17,153,158,0.15),0 20px 40px rgba(0,0,0,0.08)`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transition = "all 0.6s cubic-bezier(0.23,1,0.32,1)";
    el.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)";
    el.style.boxShadow = "var(--shadow-sm)";
  };
  const onEnter = () => {
    const el = ref.current; if (!el) return;
    el.style.transition = "transform 0.15s ease,box-shadow 0.15s ease";
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onMouseEnter={onEnter}
      className={className}
      style={{ transition: "all 0.6s cubic-bezier(0.23,1,0.32,1)", willChange: "transform", ...style }}>
      {children}
    </div>
  );
}

export default function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-28 bg-gray-50 section-frame">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="section-eyebrow">{t("subtitle")}</span>
          <h2 className="section-title text-4xl md:text-5xl mb-4">{t("title")}</h2>
          <div className="divider mx-auto mb-5"/>
          <p className="font-body text-lg max-w-lg mx-auto" style={{ color: "var(--text-soft)" }}>
            {t("description")}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceData.map(({ key, accent, bg, titleKey, items }, i) => (
            <ScrollReveal key={key} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              {/* h-full on Card3D + flex flex-col on inner div = button always at bottom */}
              <Card3D className="bg-white rounded-2xl overflow-hidden border shadow-sm h-full"
                style={{ borderColor: "rgba(17,153,158,0.08)" }}>

                {/* Image header */}
                <div className="relative h-36 overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
                    style={{ backgroundImage: `url(${bg})` }}/>
                  <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }}/>
                  <div className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg,${accent}28,transparent)` }}/>
                  <div className="absolute inset-0 flex items-center px-5">
                    <h3 className="font-heading text-xl font-bold text-white drop-shadow">{titleKey}</h3>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(90deg,${accent},transparent)` }}/>
                </div>

                {/* Card body — flex col so button sticks to bottom */}
                <div className="p-5 flex flex-col" style={{ height: "calc(100% - 144px)" }}>
                  <ul className="space-y-2.5 flex-1">
                    {items.map(item => (
                      <li key={item} className="flex items-start gap-2.5 text-sm font-body"
                        style={{ color: "var(--text-soft)" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: accent }}/>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Button always at bottom */}
                  <a href="#contact"
                    className="flex items-center justify-center gap-2 text-sm font-body font-semibold py-2.5 rounded-xl border transition-all hover:-translate-y-0.5 mt-5"
                    style={{
                      borderColor:    "rgba(17,153,158,0.2)",
                      color:          "var(--brand)",
                      background:     "rgba(17,153,158,0.04)",
                      textDecoration: "none",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background   = "var(--brand)";
                      el.style.color        = "#fff";
                      el.style.borderColor  = "var(--brand)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background   = "rgba(17,153,158,0.04)";
                      el.style.color        = "var(--brand)";
                      el.style.borderColor  = "rgba(17,153,158,0.2)";
                    }}>
                    {t("getStarted")} →
                  </a>
                </div>
              </Card3D>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}