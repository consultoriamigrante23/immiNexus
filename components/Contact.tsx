"use client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import { COUNTRIES, getPhoneByCountry } from "@/lib/countries";

const WHATSAPP  = "https://wa.me/5255316302020";
const INSTAGRAM = "https://www.instagram.com/imminexusconsultants";
const FACEBOOK  = "https://www.facebook.com/ImmiNexusConsultants";
const LINKEDIN  = "https://www.linkedin.com/company/imminexus-consultants/";
const PHONE     = "+52 55 3163-0202";
const EMAIL     = "consultoriamigrante23@gmail.com";

const SERVICES = [
  "Mexico – Visitor Visa / Non-lucrative",
  "Mexico – Temporary Residence (Work)",
  "Mexico – Temporary Residence (Family)",
  "Mexico – Temporary Residence (Study)",
  "Mexico – Temporary Residence (Digital Nomad)",
  "Mexico – Permanent Residence",
  "Mexico – Visa Request Outside Mexico",
  "Mexico – INM Permit",
  "Mexico – Passport",
  "USA – Visa B1 (Business Visitor)",
  "USA – Visa B2 (Tourism / Medical)",
  "Other Country – Canada Visitor Visa",
  "Other Country – Canada eTA",
  "Other Country – Visitor Visa (Short Term)",
  "Other Country – Visitor Visa (Long Term)",
  "Other Country – Transit Visa",
  "Other Country – Business Visa",
  "Other Country – Other / Not Listed",
];

type FormData = {
  fullName: string; email: string; phone: string;
  country: string; service: string; message: string;
};

const contactItems = [
  { key: "phone",     value: PHONE,                   href: WHATSAPP,  color: "#25D366", icon: <PhoneIcon /> },
  { key: "email",     value: EMAIL,                   href: `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=Immigration+Inquiry+%E2%80%93+ImmiNexus`, color: "#11999e", icon: <MailIcon /> },
  { key: "instagram", value: "@imminexusconsultants", href: INSTAGRAM, color: "#E1306C", icon: <IgIcon /> },
  { key: "facebook",  value: "ImmiNexus Consultants", href: FACEBOOK,  color: "#1877F2", icon: <FbIcon /> },
  { key: "linkedin",  value: "ImmiNexus Consultants", href: LINKEDIN,  color: "#0A66C2", icon: <LiIcon /> },
];

export default function Contact() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();
  const watchedCountry = watch("country");

  useEffect(() => {
    if (watchedCountry) setValue("phone", getPhoneByCountry(watchedCountry));
  }, [watchedCountry, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "contact", captchaToken: "dev-bypass" }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Something went wrong."); return; }
      setSubmitted(true);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors";

  return (
    <section id="contact" className="py-28 bg-gray-50 section-frame">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="section-eyebrow">{t("subtitle")}</span>
          <h2 className="section-title text-4xl md:text-5xl mb-4">{t("title")}</h2>
          <div className="divider mx-auto mb-4"/>
          <p className="font-body text-lg max-w-lg mx-auto" style={{ color: "var(--text-soft)" }}>
            {t("description")}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-3">
            {contactItems.map((item, i) => (
              <ScrollReveal key={item.key} delay={((i % 3) + 1) as 1|2|3}>
                <a href={item.href} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 bg-white rounded-2xl border transition-all duration-300 cursor-pointer"
                  style={{ borderColor: "rgba(17,153,158,0.08)", boxShadow: "var(--shadow-sm)", textDecoration: "none" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(17,153,158,0.22)"; el.style.boxShadow = "0 12px 32px rgba(17,153,158,0.1)"; el.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(17,153,158,0.08)"; el.style.boxShadow = "var(--shadow-sm)"; el.style.transform = "translateX(0)"; }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: `${item.color}12`, border: `1.5px solid ${item.color}25`, transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)" }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-body font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--text-soft)" }}>
                      {t(item.key as any)}
                    </p>
                    <p className="font-body font-medium text-sm truncate transition-colors group-hover:text-teal-600" style={{ color: "var(--text-primary)" }}>
                      {item.value}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2"
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={2}>
            <div className="bg-white rounded-2xl p-8 border"
              style={{ borderColor: "rgba(17,153,158,0.1)", boxShadow: "var(--shadow-lg)" }}>
              <div className="mb-6">
                <h3 className="font-heading text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                  {t("formTitle")}
                </h3>
                <div className="h-0.5 w-10 rounded" style={{ background: "var(--brand)" }}/>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.2)" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h4 className="font-heading text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                    {t("success")}
                  </h4>
                  <p className="font-body text-sm" style={{ color: "var(--text-soft)" }}>{t("successDesc")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input {...register("fullName", { required: true })} placeholder={t("name")} className={inp}/>
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{t("required") || "Required"}</p>}
                    </div>
                    <div>
                      <input {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                        type="email" placeholder={t("emailField")} className={inp}/>
                      {errors.email && <p className="text-red-500 text-xs mt-1">Valid email required</p>}
                    </div>
                  </div>
                  <div>
                    <select {...register("country", { required: true })} defaultValue="" className={inp}>
                      <option value="" disabled>{t("country")}</option>
                      {COUNTRIES.map(c => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    {errors.country && <p className="text-red-500 text-xs mt-1">Required</p>}
                  </div>
                  <div>
                    <input {...register("phone")} placeholder="Phone (auto-filled from country)" className={inp}/>
                  </div>
                  <div>
                    <select {...register("service", { required: true })} defaultValue="" className={inp}>
                      <option value="" disabled>{t("service")}</option>
                      <optgroup label="── Mexico ──">
                        {SERVICES.filter(s => s.startsWith("Mexico")).map(s => (
                          <option key={s} value={s}>{s.replace("Mexico – ", "")}</option>
                        ))}
                      </optgroup>
                      <optgroup label="── United States ──">
                        {SERVICES.filter(s => s.startsWith("USA")).map(s => (
                          <option key={s} value={s}>{s.replace("USA – ", "")}</option>
                        ))}
                      </optgroup>
                      <optgroup label="── Other Countries (incl. Canada) ──">
                        {SERVICES.filter(s => s.startsWith("Other")).map(s => (
                          <option key={s} value={s}>{s.replace("Other Country – ", "")}</option>
                        ))}
                      </optgroup>
                    </select>
                    {errors.service && <p className="text-red-500 text-xs mt-1">Required</p>}
                  </div>
                  <textarea {...register("message")} placeholder={t("message")} rows={4} className={`${inp} resize-none`}/>
                  <button type="submit" disabled={loading}
                    className="btn-brand btn-shimmer w-full py-3.5 text-base justify-center">
                    {loading ? t("submitting") : t("submit")}
                    {!loading && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                    )}
                  </button>
                  <p className="text-center text-xs font-body" style={{ color: "var(--text-soft)" }}>
                    {t("privacy")}
                  </p>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function PhoneIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>; }
function MailIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>; }
function IgIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>; }
function FbIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1877F2" strokeWidth="1.8"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>; }
function LiIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="1.8"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>; }