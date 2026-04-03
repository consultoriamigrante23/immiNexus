"use client";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

const WHATSAPP  = "https://wa.me/5255316302020";
const INSTAGRAM = "https://www.instagram.com/imminexusconsultants";
const FACEBOOK  = "https://www.facebook.com/ImmiNexusConsultants";
const LINKEDIN  = "https://www.linkedin.com/company/imminexus-consultants/";
const PHONE     = "+52 55 3163-0202";
const EMAIL     = "consultoriamigrante23@gmail.com";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-gray-700">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo-icon.png"
                alt="ImmiNexus"
                width={44}
                height={44}
                className="object-contain"
              />
              <div>
                <div className="font-heading text-lg font-bold leading-none text-white">ImmiNexus</div>
                <div className="text-[10px] tracking-widest uppercase font-body" style={{ color: "#11999e" }}>
                  {t("tagline")}
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm font-body leading-relaxed mb-5">
              {t("description")}
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.510-.173-.008-.371-.010-.57-.010-.198 0-.520.074-.792.372-.272.297-1.040 1.016-1.040 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.200 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.360.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.570-.347"/></svg>
              </a>

              {/* (rest of icons unchanged) */}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-5">{t("services")}</h4>
            <ul className="space-y-2 text-gray-400 text-sm font-body">
              {(t.raw("servicesList") as string[]).map((s: string) => (
                <li key={s}>
                  <a href="#services" className="hover:text-brand-400 transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Legal */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-5">{t("contact")}</h4>
            <ul className="space-y-3 text-gray-400 text-sm font-body mb-6">
              <li>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                  className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <span style={{ color: "#25D366" }}>●</span> {PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <span style={{ color: "#2A9D9A" }}>●</span> {EMAIL}
                </a>
              </li>
              <li>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer"
                  className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <span style={{ color: "#E1306C" }}>●</span> @imminexusconsultants
                </a>
              </li>
              <li>
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer"
                  className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <span style={{ color: "#0A66C2" }}>●</span> LinkedIn
                </a>
              </li>
            </ul>

            <h4 className="font-heading text-base font-semibold mb-3">{t("legal")}</h4>
            <ul className="space-y-2 text-gray-400 text-sm font-body">
              <li>
                <a href={`/${locale}/privacy-policy`} className="hover:text-brand-400 transition-colors">
                  {t("privacy")}
                </a>
              </li>
              <li>
                <a href={`/${locale}/privacy-policy#cookies`} className="hover:text-brand-400 transition-colors">
                  {t("cookies")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 text-center">
          <p className="text-gray-500 text-xs font-body">
            © {year} ImmiNexus Consultants. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}