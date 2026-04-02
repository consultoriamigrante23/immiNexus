"use client";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { getAvailableSlots, isValidFutureDate } from "@/lib/availability";

type Tab = "book" | "track" | "modify";
type FormData = { fullName: string; email: string; phone: string; country: string; service: string; date: string; time: string; message: string; };
type ModifyData = { trackingId: string; newDate: string; newTime: string; reason: string; };

const SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";

export default function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("booking");
  const tc = useTranslations("contact");
  const services = tc.raw("services") as string[];

  const [tab, setTab]               = useState<Tab>("book");
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [bookedSlots, setBookedSlots]   = useState<string[]>([]);
  const [modifyBookedSlots, setModifyBookedSlots] = useState<string[]>([]);

  // Tracking state
  const [trackingId, setTrackingId]   = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackingError, setTrackingError] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [modifySuccess, setModifySuccess] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>();
  const { register: regM, handleSubmit: handleM, watch: watchM, setValue: setVM, formState: { errors: errM } } = useForm<ModifyData>();

  const watchedDate   = watch("date");
  const watchedTime   = watch("time");
  const watchedModDate = watchM("newDate");
  const watchedModTime = watchM("newTime");

  const today   = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0];

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; setSubmitted(false); setError(""); reset(); setCaptchaToken(""); setTab("book"); setTrackingData(null); setModifySuccess(false); }
  }, [open, reset]);

  // Fetch booked slots when date changes (book form)
  useEffect(() => {
    if (!watchedDate || !isValidFutureDate(watchedDate)) { setBookedSlots([]); return; }
    fetch(`/api/booking?date=${watchedDate}`)
      .then(r => r.json())
      .then(d => setBookedSlots(d.bookedSlots ?? []))
      .catch(() => {});
  }, [watchedDate]);

  // Fetch booked slots when date changes (modify form)
  useEffect(() => {
    if (!watchedModDate || !isValidFutureDate(watchedModDate)) { setModifyBookedSlots([]); return; }
    fetch(`/api/booking?date=${watchedModDate}`)
      .then(r => r.json())
      .then(d => setModifyBookedSlots(d.bookedSlots ?? []))
      .catch(() => {});
  }, [watchedModDate]);

  const onSubmit = async (data: FormData) => {
    if (!captchaToken) { setError("Please complete the captcha."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, captchaToken }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Something went wrong."); return; }
      setSubmitted(true);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const onTrack = async () => {
    if (!trackingId.trim()) return;
    setTrackingLoading(true); setTrackingError(""); setTrackingData(null);
    try {
      const res = await fetch(`/api/booking/track?id=${encodeURIComponent(trackingId.trim())}`);
      const json = await res.json();
      if (!res.ok) { setTrackingError(json.error || "Not found."); return; }
      setTrackingData(json);
    } catch { setTrackingError("Network error."); }
    finally { setTrackingLoading(false); }
  };

  const onModify = async (data: ModifyData) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/booking/track", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Error."); return; }
      setModifySuccess(true);
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  };

  const renderSlots = (slots: string[], booked: string[], selectedTime: string, onSelect: (t: string) => void) => {
    return (
      <div className="grid grid-cols-4 gap-2">
        {slots.map(slot => {
          const [h, m] = slot.split(":").map(Number);
          const ampm = h >= 12 ? "PM" : "AM";
          const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
          const label = `${h12}:${m === 0 ? "00" : m} ${ampm}`;
          const isBooked = booked.includes(slot);
          return (
            <button key={slot} type="button" disabled={isBooked}
              onClick={() => !isBooked && onSelect(slot)}
              className={`py-2 px-1 rounded-lg text-xs font-body font-medium border transition-all duration-150 ${
                isBooked
                  ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                  : selectedTime === slot
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-500"
              }`}>
              {label}
            </button>
          );
        })}
      </div>
    );
  };

  if (!open) return null;

  const inp = "w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm font-body text-gray-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors bg-white";
  const errCls = "text-red-500 text-xs mt-1";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(5px)" }}>
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex gap-2">
            {([["book","📅"], ["track","🔍"], ["modify","✏️"]] as [Tab, string][]).map(([key, icon]) => (
              <button key={key} onClick={() => { setTab(key); setError(""); setSubmitted(false); setModifySuccess(false); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${
                  tab === key ? "bg-brand-500 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}>
                {icon} {t(key)}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="p-6">

          {/* ── BOOK TAB ── */}
          {tab === "book" && (
            submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">{t("success")}</h3>
                <p className="text-gray-500 font-body text-sm mb-4">{t("successDesc")}</p>
                <p className="text-xs text-gray-400 font-body">📎 A PDF receipt has been sent to your email with your tracking ID.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 text-xs font-body text-brand-700">
                  📅 Ottawa EST · Mon–Sat · 9AM–9PM · One booking per 7 days
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">{error}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <div><input {...register("fullName", { required: true })} placeholder={t("name")} className={inp}/>
                    {errors.fullName && <p className={errCls}>Required</p>}</div>
                  <div><input {...register("email", { required: true, pattern: /^\S+@\S+$/ })} placeholder={t("email")} type="email" className={inp}/>
                    {errors.email && <p className={errCls}>Valid email required</p>}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input {...register("phone")} placeholder={t("phone")} className={inp}/>
                  <div><input {...register("country", { required: true })} placeholder={t("country")} className={inp}/>
                    {errors.country && <p className={errCls}>Required</p>}</div>
                </div>
                <div>
                  <select {...register("service", { required: true })} defaultValue="" className={inp}>
                    <option value="" disabled>{t("service")}</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.service && <p className={errCls}>Required</p>}
                </div>
                <div>
                  <label className="block text-xs font-body text-gray-500 mb-1 uppercase tracking-wide">Select Date (Mon–Sat)</label>
                  <input {...register("date", { required: true, validate: v => isValidFutureDate(v) || "Must be a future weekday" })}
                    type="date" min={today} max={maxDate} className={inp}/>
                  {errors.date && <p className={errCls}>{errors.date.message}</p>}
                </div>
                {watchedDate && isValidFutureDate(watchedDate) && (
                  <div>
                    <label className="block text-xs font-body text-gray-500 mb-2 uppercase tracking-wide">
                      Select Time · Ottawa EST
                      {bookedSlots.length > 0 && <span className="text-red-400 ml-2">({bookedSlots.length} slots taken)</span>}
                    </label>
                    {renderSlots(getAvailableSlots(watchedDate), bookedSlots, watchedTime, (slot) => setValue("time", slot))}
                    <input type="hidden" {...register("time", { required: true })}/>
                    {errors.time && <p className={errCls}>Please select a time slot</p>}
                  </div>
                )}
                <textarea {...register("message")} placeholder={t("message")} rows={3} className={`${inp} resize-none`}/>
                <div className="flex justify-center">
                  <HCaptcha sitekey={SITE_KEY} onVerify={setCaptchaToken} onExpire={() => setCaptchaToken("")}/>
                </div>
                <button type="submit" disabled={loading || !captchaToken} className="btn-brand w-full py-3 disabled:opacity-60">
                  {loading ? t("submitting") : t("submit")}
                </button>
              </form>
            )
          )}

          {/* ── TRACK TAB ── */}
          {tab === "track" && (
            <div className="space-y-4">
              <p className="text-sm font-body text-gray-500">Enter your Tracking ID to check your booking status.</p>
              <div className="flex gap-2">
                <input value={trackingId} onChange={e => setTrackingId(e.target.value)}
                  placeholder="IMN-XXXXXXXX" className={`${inp} flex-1`}/>
                <button onClick={onTrack} disabled={trackingLoading}
                  className="btn-brand px-4 py-2.5 text-sm whitespace-nowrap">
                  {trackingLoading ? "..." : "Track"}
                </button>
              </div>
              {trackingError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">{trackingError}</div>}
              {trackingData && (
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-body font-bold px-3 py-1 rounded-full ${
                      trackingData.booking.status === "confirmed" ? "bg-green-100 text-green-700"
                      : trackingData.booking.status === "cancelled" ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {trackingData.booking.status.toUpperCase()}
                    </span>
                    <span className="text-xs font-body text-brand-600 font-medium">
                      {trackingData.daysLeft > 0 ? `${trackingData.daysLeft} day${trackingData.daysLeft !== 1 ? "s" : ""} until appointment` : "Today!"}
                    </span>
                  </div>
                  {[
                    ["Name",    trackingData.booking.fullName],
                    ["Service", trackingData.booking.service],
                    ["Date",    trackingData.booking.date],
                    ["Time",    `${trackingData.booking.time} (Ottawa EST)`],
                    ["Country", trackingData.booking.country],
                  ].map(([l, v]) => (
                    <div key={l} className="flex gap-3 text-sm font-body">
                      <span className="text-gray-400 w-20 flex-shrink-0">{l}</span>
                      <span className="text-gray-900 font-medium">{v}</span>
                    </div>
                  ))}
                  {trackingData.booking.modifications?.length > 0 && (
                    <div className="border-t border-brand-200 pt-3">
                      <p className="text-xs font-body text-gray-500 mb-2">Modification History</p>
                      {trackingData.booking.modifications.map((m: any, i: number) => (
                        <div key={i} className="text-xs font-body text-gray-500 mb-1">
                          Changed from {m.previousDate} {m.previousTime} → {m.newDate} {m.newTime}
                          <span className="text-gray-400"> · "{m.reason}"</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── MODIFY TAB ── */}
          {tab === "modify" && (
            modifySuccess ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">Booking Modified!</h3>
                <p className="text-gray-500 font-body text-sm">A new PDF receipt has been sent to your email and the consultant.</p>
              </div>
            ) : (
              <form onSubmit={handleM(onModify)} className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs font-body text-yellow-700">
                  ✏️ You can only select available time slots. Booked slots are disabled.
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">{error}</div>}
                <div>
                  <input {...regM("trackingId", { required: true })} placeholder="Your Tracking ID (IMN-XXXXXXXX)" className={inp}/>
                  {errM.trackingId && <p className={errCls}>Required</p>}
                </div>
                <div>
                  <label className="block text-xs font-body text-gray-500 mb-1 uppercase tracking-wide">New Date (Mon–Sat)</label>
                  <input {...regM("newDate", { required: true, validate: v => isValidFutureDate(v) || "Must be a future weekday" })}
                    type="date" min={today} max={maxDate} className={inp}/>
                  {errM.newDate && <p className={errCls}>{errM.newDate.message}</p>}
                </div>
                {watchedModDate && isValidFutureDate(watchedModDate) && (
                  <div>
                    <label className="block text-xs font-body text-gray-500 mb-2 uppercase tracking-wide">New Time Slot</label>
                    {renderSlots(getAvailableSlots(watchedModDate), modifyBookedSlots, watchedModTime, (slot) => setVM("newTime", slot))}
                    <input type="hidden" {...regM("newTime", { required: true })}/>
                    {errM.newTime && <p className={errCls}>Please select a slot</p>}
                  </div>
                )}
                <div>
                  <textarea {...regM("reason", { required: true, minLength: 5 })}
                    placeholder="Reason for modification (required)" rows={3} className={`${inp} resize-none`}/>
                  {errM.reason && <p className={errCls}>Please provide a reason (min 5 chars)</p>}
                </div>
                <button type="submit" disabled={loading} className="btn-brand w-full py-3 disabled:opacity-60">
                  {loading ? "Saving..." : "Modify Booking"}
                </button>
              </form>
            )
          )}

        </div>
      </div>
    </div>
  );
}