"use client";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { getAvailableSlots, isValidFutureDate } from "@/lib/availability";

type Tab = "book" | "track" | "modify";
type FormData = {
  fullName: string; email: string; phone: string;
  country: string; service: string; date: string;
  time: string; message: string;
};
type ModifyData = { trackingId: string; newDate: string; newTime: string; reason: string; };

export default function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t  = useTranslations("booking");
  const tc = useTranslations("contact");
  const services = tc.raw("services") as string[];

  const [tab,            setTab]            = useState<Tab>("book");
  const [submitted,      setSubmitted]      = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");
  const [bookedSlots,    setBookedSlots]    = useState<string[]>([]);
  const [modBookedSlots, setModBookedSlots] = useState<string[]>([]);
  const [trackingId,     setTrackingId]     = useState("");
  const [trackingData,   setTrackingData]   = useState<any>(null);
  const [trackingError,  setTrackingError]  = useState("");
  const [trackingLoading,setTrackingLoading]= useState(false);
  const [modifySuccess,  setModifySuccess]  = useState(false);

  const {
    register, handleSubmit, reset, watch, setValue,
    formState: { errors },
  } = useForm<FormData>();

  const {
    register: regM, handleSubmit: handleM, watch: watchM, setValue: setVM,
    formState: { errors: errM },
  } = useForm<ModifyData>();

  const watchedDate    = watch("date");
  const watchedTime    = watch("time");
  const watchedModDate = watchM("newDate");
  const watchedModTime = watchM("newTime");

  const today   = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0];

  // Lock scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSubmitted(false); setError(""); setModifySuccess(false);
      setTrackingData(null); setTrackingError("");
      reset();
    }
  }, [open, reset]);

  // Fetch booked slots for booking form
  useEffect(() => {
    if (!watchedDate || !isValidFutureDate(watchedDate)) { setBookedSlots([]); return; }
    fetch(`/api/booking?date=${watchedDate}`)
      .then(r => r.json())
      .then(d => setBookedSlots(d.bookedSlots ?? []))
      .catch(() => {});
  }, [watchedDate]);

  // Fetch booked slots for modify form
  useEffect(() => {
    if (!watchedModDate || !isValidFutureDate(watchedModDate)) { setModBookedSlots([]); return; }
    fetch(`/api/booking?date=${watchedModDate}`)
      .then(r => r.json())
      .then(d => setModBookedSlots(d.bookedSlots ?? []))
      .catch(() => {});
  }, [watchedModDate]);

  const onSubmit = async (data: FormData) => {
    if (!data.time) { setError("Please select a time slot."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, captchaToken: "dev-bypass" }),
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
    if (!data.newTime) { setError("Please select a time slot."); return; }
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

  const renderSlots = (
    date: string,
    booked: string[],
    selected: string,
    onSelect: (t: string) => void
  ) => {
    if (!date || !isValidFutureDate(date)) return null;
    const slots = getAvailableSlots(date);
    return (
      <div>
        <label className="block text-xs font-body uppercase tracking-wide mb-2" style={{ color: "#9ca3af" }}>
          Select Time · Ottawa EST (9AM–9PM)
          {booked.length > 0 && <span className="ml-2" style={{ color: "#ef4444" }}>({booked.length} taken)</span>}
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {slots.map(slot => {
            const [h, m] = slot.split(":").map(Number);
            const ampm = h >= 12 ? "PM" : "AM";
            const h12  = h > 12 ? h - 12 : h === 0 ? 12 : h;
            const label = `${h12}:${m === 0 ? "00" : m}${ampm}`;
            const isBooked = booked.includes(slot);
            return (
              <button key={slot} type="button" disabled={isBooked}
                onClick={() => !isBooked && onSelect(slot)}
                className="py-2 px-1 rounded-lg text-xs font-body font-medium border transition-all"
                style={{
                  borderColor: isBooked ? "#f0f0f0" : selected === slot ? "#11999e" : "#e5e7eb",
                  background:  isBooked ? "#fafafa" : selected === slot ? "#11999e" : "white",
                  color:       isBooked ? "#d1d5db" : selected === slot ? "white" : "#576d69",
                  cursor:      isBooked ? "not-allowed" : "pointer",
                  textDecoration: isBooked ? "line-through" : "none",
                }}>
                {label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!open) return null;

  const inp = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors";
  const errCls = "text-red-500 text-xs mt-1 font-body";

  const tabs: [Tab, string][] = [
    ["book",   t("book")],
    ["track",  t("track")],
    ["modify", t("modify")],
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 200, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl"
        style={{ maxHeight: "92vh", overflowY: "auto" }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10"
          style={{ borderRadius: "16px 16px 0 0" }}>
          <div className="flex gap-1">
            {tabs.map(([key, label]) => (
              <button key={key}
                onClick={() => { setTab(key); setError(""); setSubmitted(false); setModifySuccess(false); }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-body font-medium transition-all"
                style={{
                  background: tab === key ? "#11999e" : "transparent",
                  color:      tab === key ? "white" : "#9ca3af",
                }}>
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onClose(); }}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            style={{ color: "#9ca3af" }}
            aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="p-6">

          {/* BOOK TAB */}
          {tab === "book" && (
            submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#f0fdf4" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2" style={{ color: "#293533" }}>{t("success")}</h3>
                <p className="font-body text-sm mb-3" style={{ color: "#576d69" }}>{t("successDesc")}</p>
                <p className="font-body text-xs" style={{ color: "#9ca3af" }}>
                  A PDF receipt with your tracking ID has been sent to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Info banner */}
                <div className="rounded-xl p-3 text-xs font-body" style={{ background: "#e8f6f7", color: "#0d7a7e" }}>
                  {t("bookingInfo")}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input {...register("fullName", { required: true })} placeholder={t("name")} className={inp}/>
                    {errors.fullName && <p className={errCls}>Required</p>}
                  </div>
                  <div>
                    <input {...register("email", { required: true, pattern: /^\S+@\S+$/ })} type="email" placeholder={t("email")} className={inp}/>
                    {errors.email && <p className={errCls}>Valid email required</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input {...register("phone")} placeholder={t("phone")} className={inp}/>
                  <div>
                    <input {...register("country", { required: true })} placeholder={t("country")} className={inp}/>
                    {errors.country && <p className={errCls}>Required</p>}
                  </div>
                </div>

                <div>
                  <select {...register("service", { required: true })} defaultValue="" className={inp}>
                    <option value="" disabled>{t("service")}</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.service && <p className={errCls}>Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-body uppercase tracking-wide mb-1" style={{ color: "#9ca3af" }}>
                    Select Date (Mon–Sat)
                  </label>
                  <input {...register("date", {
                    required: true,
                    validate: v => isValidFutureDate(v) || "Must be a future weekday (Mon–Sat)"
                  })} type="date" min={today} max={maxDate} className={inp}/>
                  {errors.date && <p className={errCls}>{errors.date.message}</p>}
                </div>

                {renderSlots(watchedDate, bookedSlots, watchedTime, slot => setValue("time", slot))}
                <input type="hidden" {...register("time", { required: "Please select a time slot" })}/>
                {errors.time && <p className={errCls}>{errors.time.message}</p>}

                <textarea {...register("message")} placeholder={t("message")} rows={3} className={`${inp} resize-none`}/>

                <button type="submit" disabled={loading}
                  className="btn-brand w-full py-3.5 text-base disabled:opacity-60">
                  {loading ? t("submitting") : t("submit")}
                </button>
              </form>
            )
          )}

          {/* TRACK TAB */}
          {tab === "track" && (
            <div className="space-y-4">
              <p className="text-sm font-body" style={{ color: "#576d69" }}>
                Enter your Tracking ID from your confirmation email to check your booking status.
              </p>
              <div className="flex gap-2">
                <input
                  value={trackingId}
                  onChange={e => setTrackingId(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && onTrack()}
                  placeholder="IMN-XXXXXXXX-XXXXXX"
                  className={`${inp} flex-1`}/>
                <button onClick={onTrack} disabled={trackingLoading}
                  className="btn-brand px-5 py-2.5 text-sm whitespace-nowrap">
                  {trackingLoading ? "..." : "Track"}
                </button>
              </div>

              {trackingError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">
                  {trackingError}
                </div>
              )}

              {trackingData && (
                <div className="rounded-xl p-5 border" style={{ background: "#f0fafa", borderColor: "rgba(17,153,158,0.2)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-body font-bold px-3 py-1 rounded-full"
                      style={{
                        background: trackingData.booking.status === "confirmed" ? "#f0fdf4"
                                  : trackingData.booking.status === "cancelled" ? "#fef2f2"
                                  : "#fefce8",
                        color: trackingData.booking.status === "confirmed" ? "#15803d"
                             : trackingData.booking.status === "cancelled" ? "#dc2626"
                             : "#92400e",
                      }}>
                      {trackingData.booking.status.toUpperCase()}
                    </span>
                    {trackingData.daysLeft > 0 && (
                      <span className="text-xs font-body font-medium" style={{ color: "#11999e" }}>
                        {trackingData.daysLeft} day{trackingData.daysLeft !== 1 ? "s" : ""} remaining
                      </span>
                    )}
                  </div>
                  {[
                    ["Name",    trackingData.booking.fullName],
                    ["Service", trackingData.booking.service],
                    ["Date",    trackingData.booking.date],
                    ["Time",    `${trackingData.booking.time} Ottawa EST`],
                    ["Country", trackingData.booking.country],
                  ].map(([l, v]) => (
                    <div key={l} className="flex gap-3 text-sm font-body py-1.5 border-b" style={{ borderColor: "rgba(17,153,158,0.1)" }}>
                      <span className="w-20 flex-shrink-0" style={{ color: "#9ca3af" }}>{l}</span>
                      <span className="font-medium" style={{ color: "#293533" }}>{v}</span>
                    </div>
                  ))}
                  {trackingData.booking.modifications?.length > 0 && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(17,153,158,0.1)" }}>
                      <p className="text-xs font-body mb-2" style={{ color: "#9ca3af" }}>Modification History</p>
                      {trackingData.booking.modifications.map((m: any, i: number) => (
                        <p key={i} className="text-xs font-body" style={{ color: "#576d69" }}>
                          {m.previousDate} {m.previousTime} → {m.newDate} {m.newTime} · "{m.reason}"
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MODIFY TAB */}
          {tab === "modify" && (
            modifySuccess ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#f0fdf4" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2" style={{ color: "#293533" }}>Booking Modified!</h3>
                <p className="font-body text-sm" style={{ color: "#576d69" }}>
                  A new PDF receipt has been sent to your email and the consultant.
                </p>
              </div>
            ) : (
              <form onSubmit={handleM(onModify)} className="space-y-4">
                <div className="rounded-xl p-3 text-xs font-body" style={{ background: "#fefce8", color: "#92400e" }}>
                  Only available time slots can be selected. Taken slots are disabled.
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <input {...regM("trackingId", { required: true })} placeholder="Your Tracking ID (IMN-XXXXXXXX)" className={inp}/>
                  {errM.trackingId && <p className={errCls}>Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-body uppercase tracking-wide mb-1" style={{ color: "#9ca3af" }}>
                    New Date (Mon–Sat)
                  </label>
                  <input {...regM("newDate", {
                    required: true,
                    validate: v => isValidFutureDate(v) || "Must be a future weekday"
                  })} type="date" min={today} max={maxDate} className={inp}/>
                  {errM.newDate && <p className={errCls}>{errM.newDate.message}</p>}
                </div>

                {renderSlots(watchedModDate, modBookedSlots, watchedModTime, slot => setVM("newTime", slot))}
                <input type="hidden" {...regM("newTime", { required: "Please select a time slot" })}/>
                {errM.newTime && <p className={errCls}>{errM.newTime.message}</p>}

                <div>
                  <textarea {...regM("reason", { required: true, minLength: 5 })}
                    placeholder="Reason for modification (required)" rows={3} className={`${inp} resize-none`}/>
                  {errM.reason && <p className={errCls}>Please provide a reason (min 5 chars)</p>}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setTab("book")} className="btn-outline flex-1 py-3">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn-brand flex-1 py-3 disabled:opacity-60">
                    {loading ? "Saving..." : "Modify Booking"}
                  </button>
                </div>
              </form>
            )
          )}

        </div>
      </div>
    </div>
  );
}