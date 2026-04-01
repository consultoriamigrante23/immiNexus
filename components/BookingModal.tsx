"use client";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

type FormData = {
  fullName: string; email: string; phone: string;
  country: string; service: string; preferredDate: string; message: string;
};

export default function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("booking");
  const tc = useTranslations("contact");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else { document.body.style.overflow = ""; setSubmitted(false); reset(); }
  }, [open, reset]);

  const services = tc.raw("services") as string[];

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "booking" }),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const inp = "w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm font-body text-gray-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors bg-white";
  const err = "text-red-500 text-xs mt-1 font-body";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-heading text-xl font-bold text-gray-900">{t("title")}</h2>
            <p className="text-gray-500 text-sm font-body mt-1">{t("subtitle")}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input {...register("fullName", { required: true })} placeholder={t("name")} className={inp} />
                  {errors.fullName && <p className={err}>Required</p>}
                </div>
                <div>
                  <input {...register("email", { required: true, pattern: /^\S+@\S+$/ })} placeholder={t("email")} type="email" className={inp} />
                  {errors.email && <p className={err}>Valid email required</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input {...register("phone")} placeholder={t("phone")} className={inp} />
                <div>
                  <input {...register("country", { required: true })} placeholder={t("country")} className={inp} />
                  {errors.country && <p className={err}>Required</p>}
                </div>
              </div>
              <div>
                <select {...register("service", { required: true })} defaultValue="" className={inp}>
                  <option value="" disabled>{t("service")}</option>
                  {services.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service && <p className={err}>Required</p>}
              </div>
              <input {...register("preferredDate")} type="date" placeholder={t("preferredDate")} className={inp} />
              <textarea {...register("message")} placeholder={t("message")} rows={3} className={`${inp} resize-none`} />
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