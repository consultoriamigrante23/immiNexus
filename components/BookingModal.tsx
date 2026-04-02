"use client";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { getAvailableSlots, isValidFutureDate, TIMEZONE } from "@/lib/availability";

type FormData = {
  fullName: string; email: string; phone: string;
  country: string; service: string; date: string; time: string; message: string;
};

export default function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("booking");
  const tc = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>();
  const services = tc.raw("services") as string[];
  const watchedDate = watch("date");

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else { document.body.style.overflow = ""; setSubmitted(false); setError(""); reset(); setAvailableSlots([]); }
  }, [open, reset]);

  useEffect(() => {
    if (watchedDate && isValidFutureDate(watchedDate)) {
      setAvailableSlots(getAvailableSlots(watchedDate));
      setSelectedDate(watchedDate);
    } else {
      setAvailableSlots([]);
    }
  }, [watchedDate]);

  // Min date = today
  const today = new Date().toISOString().split("T")[0];
  // Max date = 60 days from now
  const maxDate = new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0];

  const onSubmit = async (data: FormData) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Something went wrong."); return; }
      setSubmitted(true);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  if (!open) return null;

  const inp = "w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm font-body text-gray-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors bg-white";
  const err = "text-red-500 text-xs mt-1 font-body";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-heading text-xl font-bold text-gray-900">{t("title")}</h2>
            <p className="text-gray-500 text-sm font-body mt-1">Ottawa timezone (EST) · Mon–Sat · 9AM–9PM</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">{t("success")}</h3>
              <p className="text-gray-500 font-body text-sm">{t("successDesc")}</p>
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
                  {errors.fullName && <p className={err}>Required</p>}
                </div>
                <div>
                  <input {...register("email", { required: true, pattern: /^\S+@\S+$/ })} placeholder={t("email")} type="email" className={inp}/>
                  {errors.email && <p className={err}>Valid email required</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input {...register("phone")} placeholder={t("phone")} className={inp}/>
                <div>
                  <input {...register("country", { required: true })} placeholder={t("country")} className={inp}/>
                  {errors.country && <p className={err}>Required</p>}
                </div>
              </div>

              <div>
                <select {...register("service", { required: true })} defaultValue="" className={inp}>
                  <option value="" disabled>{t("service")}</option>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service && <p className={err}>Required</p>}
              </div>

              {/* Date picker */}
              <div>
                <label className="block text-xs font-body text-gray-500 mb-1 uppercase tracking-wide">Select Date (Mon–Sat)</label>
                <input {...register("date", { required: true, validate: v => isValidFutureDate(v) || "Must be a future weekday (Mon–Sat)" })}
                  type="date" min={today} max={maxDate} className={inp}/>
                {errors.date && <p className={err}>{errors.date.message || "Required"}</p>}
              </div>

              {/* Time slots */}
              {availableSlots.length > 0 && (
                <div>
                  <label className="block text-xs font-body text-gray-500 mb-2 uppercase tracking-wide">
                    Select Time · Ottawa EST (9AM–9PM)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map(slot => {
                      const [h, m] = slot.split(":").map(Number);
                      const ampm = h >= 12 ? "PM" : "AM";
                      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
                      const label = `${h12}:${m === 0 ? "00" : m} ${ampm}`;
                      return (
                        <button key={slot} type="button"
                          onClick={() => setValue("time", slot)}
                          className={`py-2 px-2 rounded-lg text-xs font-body font-medium border transition-all duration-150 ${
                            watch("time") === slot
                              ? "border-brand-500 bg-brand-500 text-white"
                              : "border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-500"
                          }`}>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  <input type="hidden" {...register("time", { required: true })}/>
                  {errors.time && <p className={err}>Please select a time slot</p>}
                </div>
              )}

              <textarea {...register("message")} placeholder={t("message")} rows={3} className={`${inp} resize-none`}/>

              <button type="submit" disabled={loading} className="btn-brand w-full py-3">
                {loading ? t("submitting") : t("submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}