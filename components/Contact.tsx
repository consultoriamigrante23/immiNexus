"use client";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useState } from "react";

const WHATSAPP = "https://wa.me/5255316302020";
const INSTAGRAM = "https://www.instagram.com/imminexusconsultants";
const FACEBOOK = "https://www.facebook.com/ImmiNexusConsultants";
const PHONE = "+52 55 3163-0202";
const LINKEDIN  = "https://www.linkedin.com/company/imminexus-consultants/";
const EMAIL = "consultoriamigrante23@gmail.com";

type FormData = { fullName: string; email: string; phone: string; country: string; service: string; message: string; };

export default function Contact() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const services = t.raw("services") as string[];

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "contact" }),
      });
      setSubmitted(true);
    } finally { setLoading(false); }
  };

  const inp = "w-full border border-gray-200 rounded-md px-4 py-3 text-sm font-body text-gray-800 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors";
  const err = "text-red-500 text-xs mt-1";

  return (
    <section id="contact" className="py-24 bg-white">
      <section id="services" className="py-24 bg-gray-50 section-frame"></section>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-brand-500 text-sm font-body font-medium tracking-widest uppercase mb-2">{t("subtitle")}</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t("title")}</h2>
          <div className="divider mx-auto mb-4" />
          <p className="text-gray-500 font-body max-w-lg mx-auto">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact info */}
          <div className="space-y-6">
        {[
  { label: t("phone"),     value: PHONE,                     href: WHATSAPP,   sub: t("whatsappSub"),   color: "#25D366" },
  { label: t("email"),     value: EMAIL,                     href: `mailto:${EMAIL}`, sub: t("emailSub"), color: "#2A9D9A" },
  { label: t("instagram"), value: "@imminexusconsultants",   href: INSTAGRAM,  sub: t("instaSub"),      color: "#E1306C" },
  { label: t("facebook"),  value: "ImmiNexus Consultants",   href: FACEBOOK,   sub: t("fbSub"),         color: "#1877F2" },
  { label: t("linkedin"),  value: "ImmiNexus Consultants",   href: LINKEDIN,   sub: t("linkedinSub"),   color: "#0A66C2" },
].map(item => (
  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
    className="flex items-center gap-4 p-5 border border-gray-100 rounded-2xl hover:border-brand-200 hover:shadow-sm transition-all duration-200 card-3d bg-white no-underline group">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${item.color}15` }}>
      <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
    </div>
    <div>
      <p className="text-xs font-body text-gray-400 uppercase tracking-wide">{item.label}</p>
      <p className="font-body font-medium text-gray-900 group-hover:text-brand-500 transition-colors">{item.value}</p>
      <p className="text-xs text-gray-400 font-body">{item.sub}</p>
    </div>
  </a>
))}
          </div>

          {/* Form */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="font-heading text-xl font-bold text-gray-900 mb-6">{t("formTitle")}</h3>
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h4 className="font-heading text-xl font-bold text-gray-900 mb-2">{t("success")}</h4>
                <p className="text-gray-500 text-sm font-body">{t("successDesc")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input {...register("fullName", { required: true })} placeholder={t("name")} className={inp} />
                    {errors.fullName && <p className={err}>Required</p>}
                  </div>
                  <div>
                    <input {...register("email", { required: true, pattern: /^\S+@\S+$/ })} type="email" placeholder={t("emailField")} className={inp} />
                    {errors.email && <p className={err}>Valid email required</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input {...register("phone")} placeholder={t("phoneField")} className={inp} />
                  <div>
                    <input {...register("country", { required: true })} placeholder={t("country")} className={inp} />
                    {errors.country && <p className={err}>Required</p>}
                  </div>
                </div>
                <select {...register("service", { required: true })} defaultValue="" className={inp}>
                  <option value="" disabled>{t("service")}</option>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service && <p className={err}>Required</p>}
                <textarea {...register("message")} placeholder={t("message")} rows={4} className={`${inp} resize-none`} />
                <button type="submit" disabled={loading} className="btn-brand w-full py-3">
                  {loading ? t("submitting") : t("submit")}
                </button>
                <p className="text-center text-gray-400 text-xs font-body">{t("privacy")}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}