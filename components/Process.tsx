"use client";
import { useTranslations } from "next-intl";

const stepKeys = ["consultation","documents","filing","approval"] as const;

export default function Process() {
  const t = useTranslations("process");
  return (
    <section id="process" className="py-24 bg-gray-50">
      <section id="services" className="py-24 bg-gray-50 section-frame"></section>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-brand-500 text-sm font-body font-medium tracking-widest uppercase mb-2">{t("subtitle")}</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t("title")}</h2>
          <div className="divider mx-auto mb-4" />
          <p className="text-gray-500 font-body max-w-lg mx-auto">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* connector line desktop */}
          <div className="hidden lg:block absolute top-10 left-[14%] right-[14%] h-px bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />

          {stepKeys.map((key, i) => (
            <div key={key} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-white border-2 border-brand-500 flex items-center justify-center shadow-md z-10 relative">
                  <span className="font-heading text-2xl font-bold" style={{ color: "#2A9D9A" }}>0{i + 1}</span>
                </div>
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{t(`steps.${key}.title`)}</h3>
              <p className="text-gray-500 text-sm font-body leading-relaxed">{t(`steps.${key}.desc`)}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a href="#contact" className="btn-brand">{t("cta")}</a>
        </div>
      </div>
    </section>
  );
}