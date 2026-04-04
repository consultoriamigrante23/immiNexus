"use client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useState } from "react";

const WHATSAPP  = "https://wa.me/5255316302020";
const INSTAGRAM = "https://www.instagram.com/imminexusconsultants";
const FACEBOOK  = "https://www.facebook.com/ImmiNexusConsultants";
const LINKEDIN  = "https://www.linkedin.com/company/imminexus-consultants/";
const PHONE     = "+52 55 3163-0202";
const EMAIL     = "consultoriamigrante23@gmail.com";

type FormData = {
  fullName: string; email: string; phone: string;
  country: string; service: string; message: string;
};

export default function Contact() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const services = t.raw("services") as string[];

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

  const inp = "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-body text-gray-800 bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors";
  const errCls = "text-red-500 text-xs mt-1 font-body";

  const contactItems = [
    { label: t("phone"),     value: PHONE,                   href: WHATSAPP,              color: "#25D366", dot: true },
    { label: t("email"),     value: EMAIL,                   href: `mailto:${EMAIL}`,     color: "#11999e", dot: true },
    { label: t("instagram"), value: "@imminexusconsultants", href: INSTAGRAM,             color: "#E1306C", dot: true },
    { label: t("facebook"),  value: "ImmiNexus Consultants", href: FACEBOOK,              color: "#1877F2", dot: true },
    { label: t("linkedin"),  value: "ImmiNexus Consultants", href: LINKEDIN,              color: "#0A66C2", dot: true },
  ];

  return (
    <section id="contact" className="py-24 bg-white section-frame">
      <div className="max-w-7xl mx-auto px-6">

        {/* 3D Section header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
            <svg width="260" height="90" viewBox="0 0 260 90" fill="none" opacity="0.05">
              <path d="M20 45 Q65 10 130 45 Q195 80 240 45" stroke="#11999e" strokeWidth="2" fill="none"/>
              <path d="M20 45 Q65 80 130 45 Q195 10 240 45" stroke="#11999e" strokeWidth="1.5" fill="none"/>
              <circle cx="20"  cy="45" r="5" fill="#11999e"/>
              <circle cx="130" cy="45" r="5" fill="#11999e"/>
              <circle cx="240" cy="45" r="5" fill="#11999e"/>
            </svg>
          </div>
          <div className="relative" style={{ zIndex: 1 }}>
            <p className="text-sm font-body font-medium tracking-widest uppercase mb-2" style={{ color: "#11999e" }}>{t("subtitle")}</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4" style={{ color: "#293533" }}>{t("title")}</h2>
            <div className="divider mx-auto mb-4"/>
            <p className="font-body max-w-lg mx-auto" style={{ color: "#576d69" }}>{t("description")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Contact info */}
          <div className="space-y-4">
            {contactItems.map(item => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 border border-gray-100 rounded-2xl hover:border-teal-200 hover:shadow-md transition-all duration-200 card-3d bg-white no-underline group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}15` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }}/>
                </div>
                <div>
                  <p className="text-xs font-body uppercase tracking-wide" style={{ color: "#9ca3af" }}>{item.label}</p>
                  <p className="font-body font-medium transition-colors group-hover:text-teal-600" style={{ color: "#293533" }}>{item.value}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="font-heading text-xl font-bold mb-6" style={{ color: "#293533" }}>{t("formTitle")}</h3>
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h4 className="font-heading text-xl font-bold mb-2" style={{ color: "#293533" }}>{t("success")}</h4>
                <p className="font-body text-sm" style={{ color: "#576d69" }}>{t("successDesc")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input {...register("fullName", { required: true })} placeholder={t("name")} className={inp}/>
                    {errors.fullName && <p className={errCls}>Required</p>}
                  </div>
                  <div>
                    <input {...register("email", { required: true, pattern: /^\S+@\S+$/ })} type="email" placeholder={t("emailField")} className={inp}/>
                    {errors.email && <p className={errCls}>Valid email required</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input {...register("phone")} placeholder={t("phoneField")} className={inp}/>
                  <div>
                    <input {...register("country", { required: true })} placeholder={t("country")} className={inp}/>
                    {errors.country && <p className={errCls}>Required</p>}
                  </div>
                </div>
                <select {...register("service", { required: true })} defaultValue="" className={inp}>
                  <option value="" disabled>{t("service")}</option>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service && <p className={errCls}>Required</p>}
                <textarea {...register("message")} placeholder={t("message")} rows={4} className={`${inp} resize-none`}/>
                <button type="submit" disabled={loading} className="btn-brand w-full py-3.5 disabled:opacity-60">
                  {loading ? t("submitting") : t("submit")}
                </button>
                <p className="text-center text-xs font-body" style={{ color: "#9ca3af" }}>{t("privacy")}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}