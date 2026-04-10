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
  { code:"en", label:"EN", name:"English",  flag:<FlagUS/> },
  { code:"es", label:"ES", name:"Español",  flag:<FlagES/> },
  { code:"fr", label:"FR", name:"Français", flag:<FlagFR/> },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [langOpen,    setLangOpen]    = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const switchLocale = (code: string) => {
    const segs = pathname.split("/"); segs[1] = code;
    router.push(segs.join("/")); setLangOpen(false); setMobileOpen(false);
  };

  const currentLang = LANGS.find(l => l.code === locale) ?? LANGS[0];
  const navLinks = [
    { label: t("services"), href: "#services"  },
    { label: t("whyUs"),    href: "#why-us"    },
    { label: t("process"),  href: "#process"   },
    { label: t("feedback"), href: "#feedback"  },
    { label: t("contact"),  href: "#contact"   },
  ];

  const socials = [
    { href: WHATSAPP,  label:"WhatsApp", icon:<WaIcon/>,  bg:"#25D366" },
    { href: INSTAGRAM, label:"Instagram",icon:<IgIcon/>,  bg:"#E1306C" },
    { href: FACEBOOK,  label:"Facebook", icon:<FbIcon/>,  bg:"#1877F2" },
    { href: LINKEDIN,  label:"LinkedIn", icon:<LiIcon/>,  bg:"#0A66C2" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
          padding: scrolled ? "10px 0" : "18px 0",
          background: scrolled ? "rgba(255,255,255,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(17,153,158,0.1)" : "none",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.06)" : "none",
        }}>

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <a href={`/${locale}`} className="flex items-center gap-3 flex-shrink-0" style={{ textDecoration: "none" }}>
            <div className="relative">
              <div className="absolute inset-0 rounded-full" style={{ background: "rgba(17,153,158,0.1)", transform: "scale(1.3)", filter: "blur(6px)" }}/>
              <Image src="/logo-icon.png" alt="ImmiNexus" width={36} height={36} className="object-contain relative" priority/>
            </div>
            <div>
              <div className="font-heading font-bold text-base leading-none" style={{ color: "var(--text-primary)" }}>ImmiNexus</div>
              <div className="text-[9px] font-body font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--brand)" }}>{t("tagline")}</div>
            </div>
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                className="relative px-4 py-2 text-sm font-body font-medium rounded-lg transition-all group"
                style={{ color: "var(--text-mid)", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; (e.currentTarget as HTMLElement).style.background = "rgba(17,153,158,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-mid)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110"
                style={{ background: `${s.bg}18` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${s.bg}30`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${s.bg}18`}>
                {s.icon}
              </a>
            ))}

            {/* Language selector */}
            <div className="relative ml-1" ref={langRef}>
              <button onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-body font-medium transition-all hover:shadow-sm"
                style={{ background: scrolled ? "white" : "rgba(255,255,255,0.8)", borderColor: "rgba(17,153,158,0.2)", color: "var(--text-primary)", backdropFilter: "blur(8px)" }}>
                <span className="rounded overflow-hidden shadow-sm" style={{ lineHeight: 0 }}>{currentLang.flag}</span>
                <span style={{ color: "var(--text-mid)" }}>{currentLang.label}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ color:"var(--text-soft)", transform: langOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden"
                  style={{ minWidth: 170, background:"rgba(255,255,255,0.95)", backdropFilter:"blur(20px)", border:"1px solid rgba(17,153,158,0.12)", boxShadow:"0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)" }}>
                  {LANGS.map(l => (
                    <button key={l.code} onClick={() => switchLocale(l.code)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-left transition-all"
                      style={{
                        background: locale===l.code ? "rgba(17,153,158,0.07)" : "transparent",
                        color: locale===l.code ? "var(--brand)" : "var(--text-primary)",
                      }}
                      onMouseEnter={e => { if(locale!==l.code)(e.currentTarget as HTMLElement).style.background="rgba(17,153,158,0.04)"; }}
                      onMouseLeave={e => { if(locale!==l.code)(e.currentTarget as HTMLElement).style.background="transparent"; }}>
                      <span className="rounded overflow-hidden shadow-sm" style={{ lineHeight: 0, flexShrink: 0 }}>{l.flag}</span>
                      <span className="font-medium">{l.name}</span>
                      {locale===l.code && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5" className="ml-auto">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setBookingOpen(true)} className="btn-brand btn-shimmer text-sm px-5 py-2.5 ml-1">
              {t("bookConsultation")}
            </button>
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={() => setBookingOpen(true)} className="btn-brand text-xs px-3.5 py-2">
              {t("bookConsultation")}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
              style={{ background: mobileOpen ? "rgba(17,153,158,0.1)" : "transparent", color: "var(--text-primary)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden px-6 py-5"
            style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(24px)", borderTop:"1px solid rgba(17,153,158,0.08)" }}>
            {navLinks.map((l,i) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-3.5 text-base font-body font-medium border-b"
                style={{ color:"var(--text-primary)", borderColor:"rgba(17,153,158,0.07)", textDecoration:"none", animationDelay:`${i*0.05}s` }}>
                {l.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            ))}
            <div className="flex gap-2 mt-4 flex-wrap">
              {LANGS.map(l => (
                <button key={l.code} onClick={() => switchLocale(l.code)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-body font-semibold transition-all"
                  style={{ borderColor: locale===l.code ? "var(--brand)" : "rgba(17,153,158,0.15)", background: locale===l.code ? "rgba(17,153,158,0.08)" : "white", color: locale===l.code ? "var(--brand)" : "var(--text-soft)" }}>
                  <span className="rounded overflow-hidden" style={{ lineHeight:0 }}>{l.flag}</span>
                  {l.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background:`${s.bg}15` }}>
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

/* Icons */
function WaIcon(){return<svg width="17" height="17" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;}
function IgIcon(){return<svg width="17" height="17" viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;}
function FbIcon(){return<svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;}
function LiIcon(){return<svg width="17" height="17" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;}
function FlagUS(){return<svg width="22" height="14" viewBox="0 0 36 24"><rect width="36" height="24" fill="#B22234"/>{[1.85,3.7,5.54,7.38,9.23,11.08,12.92,14.77,16.62,18.46,20.31,22.15].map((y,i)=><rect key={i} y={y} width="36" height="1.85" fill={i%2===0?"white":"#B22234"}/>)}<rect width="14.4" height="12.92" fill="#3C3B6E"/></svg>;}
function FlagES(){return<svg width="22" height="14" viewBox="0 0 36 24"><rect width="36" height="24" fill="#AA151B"/><rect y="6" width="36" height="12" fill="#F1BF00"/></svg>;}
function FlagFR(){return<svg width="22" height="14" viewBox="0 0 36 24"><rect width="36" height="24" fill="white"/><rect width="12" height="24" fill="#002395"/><rect x="24" width="12" height="24" fill="#ED2939"/></svg>;}