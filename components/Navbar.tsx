"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import BookingModal from "./BookingModal";

const WHATSAPP  = "https://wa.me/5255316302020";
const INSTAGRAM = "https://www.instagram.com/imminexusconsultants";
const FACEBOOK  = "https://www.facebook.com/ImmiNexusConsultants";
const LINKEDIN  = "https://www.linkedin.com/company/imminexus-consultants/";

const LANGS = [
  {
    code: "en", label: "EN", name: "English",
    flag: (
      <svg width="22" height="14" viewBox="0 0 36 24">
        <rect width="36" height="24" fill="#B22234"/>
        {[1.85,3.7,5.54,7.38,9.23,11.08,12.92,14.77,16.62,18.46,20.31,22.15].map((y,i)=>(
          <rect key={i} y={y} width="36" height="1.85" fill={i%2===0?"white":"#B22234"}/>
        ))}
        <rect width="14.4" height="12.92" fill="#3C3B6E"/>
        {[[1.4,1.2],[3.6,1.2],[5.8,1.2],[8,1.2],[10.2,1.2],[12.4,1.2],[2.4,3],[4.6,3],[6.8,3],[9,3],[11.2,3]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="0.75" fill="white"/>
        ))}
      </svg>
    ),
  },
  {
    code: "es", label: "ES", name: "Español",
    flag: (
      <svg width="22" height="14" viewBox="0 0 36 24">
        <rect width="36" height="24" fill="#AA151B"/>
        <rect y="6" width="36" height="12" fill="#F1BF00"/>
      </svg>
    ),
  },
  {
    code: "fr", label: "FR", name: "Français",
    flag: (
      <svg width="22" height="14" viewBox="0 0 36 24">
        <rect width="36" height="24" fill="white"/>
        <rect width="12" height="24" fill="#002395"/>
        <rect x="24" width="12" height="24" fill="#ED2939"/>
      </svg>
    ),
  },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const locale   = useLocale();
  const router   = useRouter();
  const pathname = usePathname();
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [bookingOpen,  setBookingOpen]  = useState(false);
  const [langOpen,     setLangOpen]     = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const switchLocale = (code: string) => {
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
    setLangOpen(false);
    setMobileOpen(false);
  };

  const currentLang = LANGS.find(l => l.code === locale) ?? LANGS[0];

  const navLinks = [
    { label: t("services"), href: "#services"   },
    { label: t("whyUs"),    href: "#why-us"     },
    { label: t("process"),  href: "#process"    },
    { label: t("feedback"), href: "#feedback"   },
    { label: t("contact"),  href: "#contact"    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-white/95 backdrop-blur-lg shadow-sm border-b"
            : "py-5 bg-transparent"
        }`}
        style={{ borderColor: scrolled ? "rgba(17,153,158,0.12)" : "transparent" }}>

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <a href={`/${locale}`} className="flex items-center gap-3 flex-shrink-0" style={{ textDecoration: "none" }}>
            <Image src="/logo-icon.png" alt="ImmiNexus" width={38} height={38} className="object-contain" priority/>
            <div>
              <div className="font-heading font-bold text-base leading-none" style={{ color: "#293533" }}>ImmiNexus</div>
              <div className="text-[9px] font-body tracking-widest uppercase" style={{ color: "#11999e" }}>{t("tagline")}</div>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                className="text-sm font-body font-medium transition-colors hover:text-teal-600"
                style={{ color: "#40514e", textDecoration: "none" }}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Socials */}
            {[
              { href: WHATSAPP,  label: "WhatsApp",  color: "#25D366", icon: <WaIcon/> },
              { href: INSTAGRAM, label: "Instagram", color: "#E1306C", icon: <IgIcon/> },
              { href: FACEBOOK,  label: "Facebook",  color: "#1877F2", icon: <FbIcon/> },
              { href: LINKEDIN,  label: "LinkedIn",  color: "#0A66C2", icon: <LiIcon/> },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110"
                style={{ background: `${s.color}15` }}>
                {s.icon}
              </a>
            ))}

            {/* Language dropdown */}
            <div className="relative ml-1" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-body font-medium transition-all hover:shadow-sm"
                style={{ borderColor: "rgba(17,153,158,0.25)", color: "#293533", background: "white" }}>
                <span className="rounded overflow-hidden shadow-sm" style={{ lineHeight: 0 }}>{currentLang.flag}</span>
                <span>{currentLang.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ transform: langOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border overflow-hidden z-50"
                  style={{ minWidth: 160, borderColor: "rgba(17,153,158,0.15)", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
                  {LANGS.map(l => (
                    <button key={l.code} onClick={() => switchLocale(l.code)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-left transition-colors hover:bg-gray-50"
                      style={{ background: locale === l.code ? "#e8f6f7" : undefined, color: locale === l.code ? "#11999e" : "#293533" }}>
                      <span className="rounded overflow-hidden shadow-sm" style={{ lineHeight: 0, flexShrink: 0 }}>{l.flag}</span>
                      <span className="font-medium">{l.name}</span>
                      {locale === l.code && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="2.5" className="ml-auto">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <button onClick={() => setBookingOpen(true)} className="btn-brand text-sm px-5 py-2.5 ml-1">
              {t("bookConsultation")}
            </button>
          </div>

          {/* Mobile right */}
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={() => setBookingOpen(true)} className="btn-brand text-xs px-3 py-2">
              {t("bookConsultation")}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2" style={{ color: "#293533" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t px-6 py-4 shadow-lg" style={{ borderColor: "rgba(17,153,158,0.1)" }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block py-3 text-base font-body border-b transition-colors hover:text-teal-600"
                style={{ color: "#293533", borderColor: "#f0f4f4", textDecoration: "none" }}>
                {l.label}
              </a>
            ))}

            {/* Mobile language selector */}
            <div className="flex gap-2 mt-4">
              {LANGS.map(l => (
                <button key={l.code} onClick={() => switchLocale(l.code)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-body font-medium transition-all"
                  style={{
                    borderColor: locale === l.code ? "#11999e" : "#e5e7eb",
                    background:  locale === l.code ? "#e8f6f7" : "white",
                    color:       locale === l.code ? "#11999e" : "#576d69",
                  }}>
                  <span className="rounded overflow-hidden" style={{ lineHeight: 0 }}>{l.flag}</span>
                  {l.name}
                </button>
              ))}
            </div>

            {/* Mobile socials */}
            <div className="flex gap-3 mt-4">
              {[
                { href: WHATSAPP,  icon: <WaIcon/>, color: "#25D366" },
                { href: INSTAGRAM, icon: <IgIcon/>, color: "#E1306C" },
                { href: FACEBOOK,  icon: <FbIcon/>, color: "#1877F2" },
                { href: LINKEDIN,  icon: <LiIcon/>, color: "#0A66C2" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: `${s.color}15` }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)}/>
    </>
  );
}

/* ── Icons ── */
function WaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
function IgIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#E1306C">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}
function FbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
function LiIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}