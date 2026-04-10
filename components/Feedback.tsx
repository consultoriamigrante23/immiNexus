"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

type FeedbackItem = { name:string; country:string; service:string; rating:number; message:string; createdAt:string; };
type FormData = { name:string; country:string; service:string; rating:number; message:string; };

export default function FeedbackSection() {
  const t  = useTranslations("feedback");
  const tc = useTranslations("contact");
  const [feedbacks,      setFeedbacks]      = useState<FeedbackItem[]>([]);
  const [showForm,       setShowForm]       = useState(false);
  const [submitted,      setSubmitted]      = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const { register, handleSubmit, formState:{ errors } } = useForm<FormData>();
  const services = tc.raw("services") as string[];

  useEffect(() => {
    fetch("/api/feedback").then(r=>r.json()).then(d=>{if(d.feedbacks)setFeedbacks(d.feedbacks);}).catch(()=>{});
  },[]);

  const onSubmit = async (data: FormData) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/feedback",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...data,rating:selectedRating}) });
      const json = await res.json();
      if(!res.ok){setError(json.error||t("errorGeneric"));return;}
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
          <p className="font-body text-lg max-w-lg mx-auto" style={{ color:"var(--text-soft)" }}>{t("description")}</p>
        </ScrollReveal>

        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {feedbacks.map((f,i) => (
              <ScrollReveal key={i} delay={((i%3)+1) as 1|2|3}>
                <div className="relative bg-white rounded-2xl p-6 border h-full transition-all duration-350"
                  style={{ borderColor:"rgba(17,153,158,0.1)", boxShadow:"var(--shadow-sm)" }}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow="0 12px 32px rgba(17,153,158,0.12)";el.style.transform="translateY(-4px)";el.style.borderColor="rgba(17,153,158,0.2)";}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.boxShadow="var(--shadow-sm)";el.style.transform="translateY(0)";el.style.borderColor="rgba(17,153,158,0.1)";}}>

                  {/* Quote mark */}
                  <div className="absolute top-4 right-5 font-heading text-5xl font-bold leading-none pointer-events-none select-none"
                    style={{ color:"rgba(17,153,158,0.08)" }}>"</div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array(5).fill(null).map((_,s)=>(
                      <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s<f.rating?"#F59E0B":"#E5E7EB"}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>

                  <p className="font-body text-sm leading-relaxed mb-5 italic" style={{ color:"var(--text-mid)" }}>
                    "{f.message}"
                  </p>

                  <div className="flex items-center justify-between border-t pt-4" style={{ borderColor:"rgba(17,153,158,0.08)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background:"linear-gradient(135deg, var(--brand), var(--brand-dark))" }}>
                        {f.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-body font-semibold text-sm" style={{ color:"var(--text-primary)" }}>{f.name}</p>
                        <p className="text-xs font-body" style={{ color:"var(--text-soft)" }}>{f.country}</p>
                      </div>
                    </div>
                    <span className="text-xs font-body font-medium px-2.5 py-1 rounded-full" style={{ background:"rgba(17,153,158,0.07)", color:"var(--brand-dark)", border:"1px solid rgba(17,153,158,0.12)" }}>
                      {f.service.split("–")[0].trim()}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal>
            <div className="text-center py-12 font-body" style={{ color:"var(--text-soft)" }}>{t("empty")}</div>
          </ScrollReveal>
        )}

        {/* Form */}
        <ScrollReveal>
          <div className="max-w-xl mx-auto">
            {!showForm ? (
              <div className="text-center">
                <button onClick={() => setShowForm(true)} className="btn-outline text-base px-8 py-3.5">
                  {t("shareButton")}
                </button>
              </div>
            ) : submitted ? (
              <div className="glass rounded-2xl p-10 text-center" style={{ boxShadow:"var(--shadow-md)" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background:"rgba(34,197,94,0.1)", border:"2px solid rgba(34,197,94,0.2)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2" style={{ color:"var(--text-primary)" }}>{t("thankYouTitle")}</h3>
                <p className="font-body text-sm" style={{ color:"var(--text-soft)" }}>{t("thankYouDesc")}</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border" style={{ borderColor:"rgba(17,153,158,0.1)", boxShadow:"var(--shadow-md)" }}>
                <h3 className="font-heading text-xl font-bold mb-6" style={{ color:"var(--text-primary)" }}>{t("formTitle")}</h3>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-xl mb-4">{error}</div>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input {...register("name",{required:true})} placeholder={t("namePlaceholder")} className="inp"/>
                      {errors.name&&<p className="text-red-500 text-xs mt-1">{t("required")}</p>}
                    </div>
                    <input {...register("country",{required:true})} placeholder={t("countryPlaceholder")} className="inp"/>
                  </div>
                  <select {...register("service",{required:true})} defaultValue="" className="inp">
                    <option value="" disabled>{t("servicePlaceholder")}</option>
                    {services.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                  <div>
                    <label className="block text-xs font-body font-semibold tracking-wide uppercase mb-2" style={{ color:"var(--text-soft)" }}>{t("ratingLabel")}</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(star=>(
                        <button key={star} type="button" onClick={()=>setSelectedRating(star)}
                          className="transition-all hover:scale-125"
                          style={{ fontSize:28, color:star<=selectedRating?"#F59E0B":"#E5E7EB", background:"none", border:"none", cursor:"pointer", transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <textarea {...register("message",{required:true,minLength:10})} placeholder={t("messagePlaceholder")} rows={4} className="inp" style={{ resize:"none" }}/>
                    {errors.message&&<p className="text-red-500 text-xs mt-1">{t("minChars")}</p>}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={()=>setShowForm(false)} className="btn-outline flex-1 py-3">{t("cancel")}</button>
                    <button type="submit" disabled={loading} className="btn-brand btn-shimmer flex-1 py-3">
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