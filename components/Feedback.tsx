"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

type FeedbackItem = {
  name: string; country: string; service: string;
  rating: number; message: string; createdAt: string;
};
type FormData = {
  name: string; country: string; service: string;
  rating: number; message: string;
};

export default function FeedbackSection() {
  const t = useTranslations("feedback");
  const tc = useTranslations("contact");
  const [feedbacks, setFeedbacks]     = useState<FeedbackItem[]>([]);
  const [showForm, setShowForm]       = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [selectedRating, setSelectedRating] = useState(5);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const services = tc.raw("services") as string[];

  useEffect(() => {
    fetch("/api/feedback")
      .then(r => r.json())
      .then(d => { if (d.feedbacks) setFeedbacks(d.feedbacks); })
      .catch(() => {});
  }, []);

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

  const inp = "w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm font-body text-gray-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors bg-white";

  return (
    <section id="feedback" className="py-24 bg-gray-50">
      <section id="services" className="py-24 bg-gray-50 section-frame"></section>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-brand-500 text-sm font-body font-medium tracking-widest uppercase mb-2">
            {t("subtitle")}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <div className="divider mx-auto mb-4"/>
          <p className="text-gray-500 font-body max-w-lg mx-auto">{t("description")}</p>
        </div>

        {/* Cards */}
        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {feedbacks.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm card-3d hover:border-brand-200 transition-all duration-300">
                <div className="flex gap-1 mb-3">
                  {Array(5).fill(null).map((_, s) => (
                    <span key={s} style={{ color: s < f.rating ? "#F59E0B" : "#E5E7EB", fontSize: 16 }}>★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm font-body leading-relaxed mb-4 italic">"{f.message}"</p>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <div>
                    <p className="font-body font-semibold text-gray-900 text-sm">{f.name}</p>
                    <p className="text-gray-400 text-xs font-body">{f.country}</p>
                  </div>
                  <span className="text-xs font-body bg-brand-50 text-brand-600 px-2 py-1 rounded-full border border-brand-100">
                    {f.service.split("–")[0].trim()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 font-body mb-12 py-8">
            {t("empty")}
          </div>
        )}

        {/* Form */}
        <div className="max-w-xl mx-auto">
          {!showForm ? (
            <div className="text-center">
              <button onClick={() => setShowForm(true)} className="btn-outline">
                {t("shareButton")}
              </button>
            </div>
          ) : submitted ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">{t("thankYouTitle")}</h3>
              <p className="text-gray-500 font-body text-sm">{t("thankYouDesc")}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-6">{t("formTitle")}</h3>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input {...register("name", { required: true })} placeholder={t("namePlaceholder")} className={inp}/>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{t("required")}</p>}
                  </div>
                  <input {...register("country", { required: true })} placeholder={t("countryPlaceholder")} className={inp}/>
                </div>
                <select {...register("service", { required: true })} defaultValue="" className={inp}>
                  <option value="" disabled>{t("servicePlaceholder")}</option>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div>
                  <label className="block text-xs font-body text-gray-500 mb-2 uppercase tracking-wide">
                    {t("ratingLabel")}
                  </label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setSelectedRating(star)}
                        className="text-3xl transition-transform hover:scale-110"
                        style={{ color: star <= selectedRating ? "#F59E0B" : "#D1D5DB" }}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <textarea {...register("message", { required: true, minLength: 10 })}
                    placeholder={t("messagePlaceholder")} rows={4} className={`${inp} resize-none`}/>
                  {errors.message && <p className="text-red-500 text-xs mt-1">{t("minChars")}</p>}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 py-3">
                    {t("cancel")}
                  </button>
                  <button type="submit" disabled={loading} className="btn-brand flex-1 py-3">
                    {loading ? t("submitting") : t("submit")}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}