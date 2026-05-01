"use client";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

const LOGO_COLOR = "#11999e";

const serviceData = [
  { key: "mexico", bg: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=500&q=75" },
  { key: "usa", bg: "https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=500&q=75" },
  { key: "other", bg: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=75" },
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
  };

  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "all 0.4s ease", ...style }}
    >
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
          <div className="divider mx-auto mb-5" />
          <p className="font-body text-lg max-w-lg mx-auto" style={{ color: "var(--text-soft)" }}>
            {t("description")}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {serviceData.map(({ key, bg }) => (
            <ScrollReveal key={key} className="h-full">
              <Card3D className="bg-white rounded-2xl overflow-hidden border shadow-sm h-full flex flex-col">
                <div className="relative h-36 flex-shrink-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bg})` }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center px-5">
                    <h3 className="text-white font-bold text-xl">
                      {t(`${key}.title`)}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 min-h-[360px]">
                  <ul className="space-y-2.5 flex-1">
                    {t.raw(`${key}.items`).map((item: string) => (
                      <li key={item} className="flex gap-2 text-sm">
                        <span style={{ color: LOGO_COLOR }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="mt-auto text-center py-2 rounded-lg border font-semibold transition-all"
                    style={{
                      borderColor: LOGO_COLOR,
                      color: LOGO_COLOR,
                      textDecoration: "none"
                    }}
                  >
                    {t("getStarted")}
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