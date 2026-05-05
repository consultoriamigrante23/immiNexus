"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations, useLocale } from "next-intl";
import ScrollReveal from "./ScrollReveal";

type FeedbackItem = {
  _id?: string;
  name: string; country: string; service: string;
  rating: number; message: string; createdAt: string;
  isReal?: boolean; // marks hardcoded feedbacks
};
type FormData = {
  name: string; country: string; service: string;
  rating: number; message: string;
};

// Real feedbacks translated per locale
const REAL_FEEDBACKS: Record<string, FeedbackItem[]> = {
  en: [
    {
      name: "Louise", country: "China", service: "Canada", rating: 5, createdAt: "2024-01-01", isReal: true,
      message: "It's great news! Thank you for quick actions. We will definitely grab the opportunity!",
    },
    {
      name: "Fernanda", country: "Mexico", service: "Mexico", rating: 5, createdAt: "2024-02-01", isReal: true,
      message: "No inventes!!! You're amazing. Thank you so much for your support.",
    },
    {
      name: "Laura", country: "Colombia", service: "Mexico", rating: 5, createdAt: "2024-03-01", isReal: true,
      message: "Thank you for the advice and visa process. Everything went very well.",
    },
  ],
  es: [
    {
      name: "Louise", country: "China", service: "Canadá", rating: 5, createdAt: "2024-01-01", isReal: true,
      message: "¡Es una gran noticia! Gracias por actuar rápido. ¡Definitivamente aprovecharemos la oportunidad!",
    },
    {
      name: "Fernanda", country: "México", service: "México", rating: 5, createdAt: "2024-02-01", isReal: true,
      message: "No inventes!!! Eres un buenazo. Muchas gracias por el apoyo.",
    },
    {
      name: "Laura", country: "Colombia", service: "México", rating: 5, createdAt: "2024-03-01", isReal: true,
      message: "Gracias por la asesoría y trámite de la visa. Todo salió muy bien.",
    },
  ],
  fr: [
    {
      name: "Louise", country: "Chine", service: "Canada", rating: 5, createdAt: "2024-01-01", isReal: true,
      message: "C'est une excellente nouvelle! Merci pour votre rapidité. Nous allons saisir cette opportunité!",
    },
    {
      name: "Fernanda", country: "Mexique", service: "Mexique", rating: 5, createdAt: "2024-02-01", isReal: true,
      message: "Incroyable! Tu es formidable. Merci beaucoup pour ton soutien.",
    },
    {
      name: "Laura", country: "Colombie", service: "Mexique", rating: 5, createdAt: "2024-03-01", isReal: true,
      message: "Merci pour les conseils et le traitement du visa. Tout s'est très bien passé.",
    },
  ],
};

export default function FeedbackSection() {
  const t      = useTranslations("feedback");
  const tc     = useTranslations("contact");
  const locale = useLocale();

  const [dbFeedbacks,    setDbFeedbacks]    = useState<FeedbackItem[]>([]);
  const [showForm,       setShowForm]       = useState(false);
  const [submitted,      setSubmitted]      = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [isLocalhost,    setIsLocalhost]    = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const services = tc.raw("services") as string[];

  useEffect(() => {
    setIsLocalhost(
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    );
    fetch("/api/feedback")
      .then(r => r.json())
      .then(d => { if (d.feedbacks) setDbFeedbacks(d.feedbacks); })
      .catch(() => {});
  }, []);

  const realFeedbacks = REAL_FEEDBACKS[locale] ?? REAL_FEEDBACKS.en;
  const allFeedbacks  = [...realFeedbacks, ...dbFeedbacks];

  const handleDelete = async (feedback: FeedbackItem, dbIndex: number) => {
    if (!feedback._id) return;
    if (!confirm(`Delete feedback from ${feedback.name}?`)) return;
    try {
      const res = await fetch(`/api/feedback?id=${feedback._id}`, { method: "DELETE" });
      if (res.ok) {
        setDbFeedbacks(prev => prev.filter((_, i) => i !== dbIndex));
      } else {
        const json = await res.json();
        alert(json.error || "Failed to delete");
      }
    } catch { alert("Network error"); }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rating: selectedRating }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || t("errorGeneric")); return; }
      setSubmitted(true);
    } catch { setError(t("errorNetwork")); }
    finally { setLoading(false); }
  };

  return (
    <section id="feedback" className="py-28 bg-white section-frame">
      <div className="max-w-7xl mx-auto px-6">

        <ScrollReveal className="text-center mb-16">
          <span className="section-eyebrow">{t("subtitle")}</span>
          <h2 className="section-title text-4xl md:text-5xl mb-4">{t("title")}</h2>
          <div className="divider mx-auto mb-4"/>
          <p className="font-body text-lg max-w-lg mx-auto" style={{ color: "var(--text-soft)" }}>
            {t("description")}
          </p>
        </ScrollReveal>

        {/* Feedback cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {allFeedbacks.map((f, i) => {
            // Index into dbFeedbacks (subtract real feedbacks count)
            const dbIdx = i - realFeedbacks.length;
            const isDbFeedback = dbIdx >= 0 && !f.isReal;

            return (
              <ScrollReveal key={i} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div
                  className="relative bg-white rounded-2xl p-6 border h-full flex flex-col transition-all duration-300"
                  style={{ borderColor: "rgba(17,153,158,0.1)", boxShadow: "var(--shadow-sm)" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow   = "0 16px 40px rgba(17,153,158,0.14)";
                    el.style.transform   = "translateY(-6px)";
                    el.style.borderColor = "rgba(17,153,158,0.22)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow   = "var(--shadow-sm)";
                    el.style.transform   = "translateY(0)";
                    el.style.borderColor = "rgba(17,153,158,0.1)";
                  }}>

                  {/* Quote mark */}
                  <div className="absolute top-3 right-4 font-heading text-6xl font-bold pointer-events-none select-none leading-none"
                    style={{ color: "rgba(17,153,158,0.07)" }}>"</div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array(5).fill(null).map((_, s) => (
                      <svg key={s} width="16" height="16" viewBox="0 0 24 24"
                        fill={s < f.rating ? "#F59E0B" : "#E5E7EB"}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>

                  {/* Message */}
                  <p className="font-body text-sm leading-relaxed mb-5 italic flex-1"
                    style={{ color: "var(--text-mid)", lineHeight: 1.75 }}>
                    "{f.message}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between border-t pt-4"
                    style={{ borderColor: "rgba(17,153,158,0.08)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold font-heading"
                        style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-dark))", boxShadow: "0 4px 12px rgba(17,153,158,0.3)" }}>
                        {f.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-body font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                          {f.name}
                        </p>
                        <p className="text-xs font-body" style={{ color: "var(--text-soft)" }}>
                          {f.country}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-body font-medium px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(17,153,158,0.07)", color: "var(--brand-dark)", border: "1px solid rgba(17,153,158,0.12)" }}>
                      {f.service}
                    </span>
                  </div>

                  {/* Delete button — localhost only, DB feedbacks only */}
                  {isLocalhost && isDbFeedback && f._id && (
                    <button
                      onClick={() => handleDelete(f, dbIdx)}
                      className="mt-3 w-full text-xs font-body py-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{
                        background: "rgba(239,68,68,0.07)",
                        color:      "#ef4444",
                        border:     "1px solid rgba(239,68,68,0.18)",
                        cursor:     "pointer",
                      }}>
                      Delete (admin · localhost only)
                    </button>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA strip */}
        <ScrollReveal>
          <div className="rounded-2xl p-8 mb-12 text-center"
            style={{ background: "linear-gradient(135deg,rgba(17,153,158,0.06),rgba(17,153,158,0.03))", border: "1px solid rgba(17,153,158,0.1)" }}>
            <h3 className="font-heading text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {t("ctaTitle")}
            </h3>
            <p className="font-body text-base mb-6" style={{ color: "var(--text-soft)" }}>
              {t("ctaDesc")}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="#contact" className="btn-brand btn-shimmer px-8 py-3.5 text-base">
                {t("ctaButton")}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="https://wa.me/525531630202" target="_blank" rel="noopener noreferrer"
                className="btn-outline px-8 py-3.5 text-base flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--brand)">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Leave feedback */}
        <ScrollReveal>
          <div className="max-w-xl mx-auto">
            {!showForm ? (
              <div className="text-center">
                <p className="font-body text-sm mb-4" style={{ color: "var(--text-soft)" }}>
                  {t("hadGoodExperience")}
                </p>
                <button onClick={() => setShowForm(true)} className="btn-outline text-base px-8 py-3.5">
                  {t("shareButton")}
                </button>
              </div>
            ) : submitted ? (
              <div className="glass rounded-2xl p-10 text-center" style={{ boxShadow: "var(--shadow-md)" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.2)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  {t("thankYouTitle")}
                </h3>
                <p className="font-body text-sm" style={{ color: "var(--text-soft)" }}>
                  {t("thankYouDesc")}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border"
                style={{ borderColor: "rgba(17,153,158,0.1)", boxShadow: "var(--shadow-md)" }}>
                <h3 className="font-heading text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
                  {t("formTitle")}
                </h3>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-xl mb-4">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input {...register("name", { required: true })}
                        placeholder={t("namePlaceholder")} className="inp"/>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{t("required")}</p>}
                    </div>
                    <input {...register("country", { required: true })}
                      placeholder={t("countryPlaceholder")} className="inp"/>
                  </div>
                  <select {...register("service", { required: true })} defaultValue="" className="inp">
                    <option value="" disabled>{t("servicePlaceholder")}</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div>
                    <label className="block text-xs font-body font-semibold tracking-wide uppercase mb-2"
                      style={{ color: "var(--text-soft)" }}>
                      {t("ratingLabel")}
                    </label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} type="button" onClick={() => setSelectedRating(star)}
                          className="transition-all hover:scale-125"
                          style={{
                            fontSize:   28,
                            color:      star <= selectedRating ? "#F59E0B" : "#E5E7EB",
                            background: "none",
                            border:     "none",
                            cursor:     "pointer",
                            transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                          }}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <textarea {...register("message", { required: true, minLength: 10 })}
                      placeholder={t("messagePlaceholder")} rows={4} className="inp"
                      style={{ resize: "none" }}/>
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{t("minChars")}</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowForm(false)}
                      className="btn-outline flex-1 py-3">
                      {t("cancel")}
                    </button>
                    <button type="submit" disabled={loading}
                      className="btn-brand btn-shimmer flex-1 py-3">
                      {loading ? t("submitting") : t("submit")}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}