"use client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import {
  getAvailableSlots,
  isValidFutureDate,
  getDateValidationMessage,
  formatTimeGMT5,
} from "@/lib/availability";
import { COUNTRIES, getPhoneByCountry } from "@/lib/countries";

type Tab = "book" | "track" | "modify";

type FormData = {
  fullName: string; email: string; phone: string;
  country: string; service: string; date: string;
  time: string; message: string;
};
type ModifyData = {
  trackingId: string; newDate: string; newTime: string; reason: string;
};

const SERVICES = [
  "Mexico – Visitor Visa / Non-lucrative (Tourism, Business, Transit)",
  "Mexico – Temporary Residence (Work)",
  "Mexico – Temporary Residence (Family)",
  "Mexico – Temporary Residence (Study)",
  "Mexico – Temporary Residence (Digital Nomad)",
  "Mexico – Permanent Residence",
  "Mexico – Visa Request Outside Mexico",
  "Mexico – INM Permit / National Institute of Migration",
  "Mexico – Passport",
  "USA – Visa B1 (Business Visitor)",
  "USA – Visa B2 (Tourism / Medical)",
  "Canada – Visitor Visa (Family / Transit / Tourism / Business)",
  "Canada – Electronic Travel Authorization (eTA)",
  "Other Country – Visitor Visa (Short Term)",
  "Other Country – Visitor Visa (Long Term)",
  "Other Country – Transit Visa",
  "Other Country – Business Visa",
  "Other Country – Other / Not Listed",
];

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "10000000-ffff-ffff-ffff-000000000001";

// Get today + 60 days in YYYY-MM-DD local format
function getDateStr(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

// Get a device fingerprint to prevent booking from multiple devices
function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("imminexus_device_id");
  if (!id) {
    id = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem("imminexus_device_id", id);
  }
  return id;
}

export default function BookingModal({
  open, onClose,
}: {
  open: boolean; onClose: () => void;
}) {
  const t = useTranslations("booking");

  const [tab,             setTab]             = useState<Tab>("book");
  const [submitted,       setSubmitted]       = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [bookedSlots,     setBookedSlots]     = useState<string[]>([]);
  const [modBookedSlots,  setModBookedSlots]  = useState<string[]>([]);
  const [trackingId,      setTrackingId]      = useState("");
  const [trackingData,    setTrackingData]    = useState<any>(null);
  const [trackingError,   setTrackingError]   = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [modifySuccess,   setModifySuccess]   = useState(false);
  const [captchaToken,    setCaptchaToken]    = useState<string | null>(null);
  const [pdfUrl,          setPdfUrl]          = useState<string | null>(null);
  const [successTracking, setSuccessTracking] = useState("");
  const [modifyPdfUrl,    setModifyPdfUrl]    = useState<string | null>(null);
  const [modifyTracking,  setModifyTracking]  = useState("");
  const captchaRef = useRef<HCaptcha>(null);

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
  const watchedCountry = watch("country");
  const watchedModDate = watchM("newDate");
  const watchedModTime = watchM("newTime");

  // Auto-fill phone from country
  useEffect(() => {
    if (watchedCountry) setValue("phone", getPhoneByCountry(watchedCountry));
  }, [watchedCountry, setValue]);

  // Lock scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSubmitted(false); setError(""); setModifySuccess(false);
      setTrackingData(null); setTrackingError("");
      setCaptchaToken(null); setPdfUrl(null); setSuccessTracking("");
      setModifyPdfUrl(null); setModifyTracking("");
      captchaRef.current?.resetCaptcha();
      reset();
    }
  }, [open, reset]);

  // Fetch booked slots
  useEffect(() => {
    if (!watchedDate || !isValidFutureDate(watchedDate)) { setBookedSlots([]); return; }
    fetch(`/api/booking?date=${watchedDate}`)
      .then(r => r.json()).then(d => setBookedSlots(d.bookedSlots ?? [])).catch(() => {});
  }, [watchedDate]);

  useEffect(() => {
    if (!watchedModDate || !isValidFutureDate(watchedModDate)) { setModBookedSlots([]); return; }
    fetch(`/api/booking?date=${watchedModDate}`)
      .then(r => r.json()).then(d => setModBookedSlots(d.bookedSlots ?? [])).catch(() => {});
  }, [watchedModDate]);

  const triggerDownload = (base64: string, filename: string) => {
    const byteChars = atob(base64);
    const bytes = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    return url;
  };

  const onSubmit = async (data: FormData) => {
    if (!data.time) { setError("Please select a time slot."); return; }

    const dateMsg = getDateValidationMessage(data.date);
    if (dateMsg) { setError(dateMsg); return; }

    const token = process.env.NODE_ENV === "development" ? "dev-bypass" : captchaToken;
    if (!token) { setError("Please complete the 'I am not a robot' verification."); return; }

    setLoading(true); setError("");
    try {
      const deviceId = getDeviceId();
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, captchaToken: token, deviceId }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Something went wrong."); return; }

      setSuccessTracking(json.trackingId);

      if (json.pdfBase64) {
        const url = triggerDownload(json.pdfBase64, `ImmiNexus-Booking-${json.trackingId}.pdf`);
        setPdfUrl(url);
      }
      setSubmitted(true);
    } catch { setError("Network error. Please try again or contact us via WhatsApp."); }
    finally { setLoading(false); }
  };

  const onTrack = async () => {
    if (!trackingId.trim()) return;
    setTrackingLoading(true); setTrackingError(""); setTrackingData(null);
    try {
      const res  = await fetch(`/api/booking/track?id=${encodeURIComponent(trackingId.trim())}`);
      const json = await res.json();
      if (!res.ok) { setTrackingError(json.error || "Booking not found. Check your tracking ID."); return; }
      setTrackingData(json);
    } catch { setTrackingError("Network error."); }
    finally { setTrackingLoading(false); }
  };

  const onModify = async (data: ModifyData) => {
    if (!data.newTime) { setError("Please select a time slot."); return; }

    const dateMsg = getDateValidationMessage(data.newDate);
    if (dateMsg) { setError(dateMsg); return; }

    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/booking/track", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Error modifying booking."); return; }

      setModifyTracking(data.trackingId);
      if (json.pdfBase64) {
        const url = triggerDownload(json.pdfBase64, `ImmiNexus-Modified-${data.trackingId}.pdf`);
        setModifyPdfUrl(url);
      }
      setModifySuccess(true);
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  };

  const renderSlots = (
    date: string, booked: string[], selected: string, onSelect: (t: string) => void
  ) => {
    if (!date || !isValidFutureDate(date)) return null;
    const slots = getAvailableSlots(date);
    return (
      <div>
        <label className="block text-xs font-body uppercase tracking-wide mb-2"
          style={{ color: "#9ca3af" }}>
          Select Time (GMT-5) — 9:00 AM to 9:00 PM
          {booked.length > 0 && (
            <span className="ml-2" style={{ color: "#ef4444" }}>
              ({booked.length} taken)
            </span>
          )}
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {slots.map(slot => {
            const isBooked   = booked.includes(slot);
            const isSelected = selected === slot;
            const label      = formatTimeGMT5(slot).replace(" GMT-5","");
            return (
              <button key={slot} type="button" disabled={isBooked}
                onClick={() => !isBooked && onSelect(slot)}
                className="py-2 px-1 rounded-lg text-xs font-body font-medium border transition-all"
                style={{
                  borderColor:    isBooked ? "#f0f0f0" : isSelected ? "#11999e" : "#e5e7eb",
                  background:     isBooked ? "#fafafa" : isSelected ? "#11999e" : "white",
                  color:          isBooked ? "#d1d5db" : isSelected ? "white"   : "#576d69",
                  cursor:         isBooked ? "not-allowed" : "pointer",
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

  const inp    = "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-body bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors";
  const errCls = "text-red-500 text-xs mt-1 font-body";
  const tabs: [Tab, string][] = [
    ["book",   t("book")],
    ["track",  t("track")],
    ["modify", t("modify")],
  ];

  const resetTab = (key: Tab) => {
    setTab(key); setError(""); setSubmitted(false); setModifySuccess(false);
    setCaptchaToken(null); captchaRef.current?.resetCaptcha();
  };

  const today   = getDateStr(0);
  const maxDate = getDateStr(60);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-3 md:p-4"
      style={{ zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      {/* Modal — full height on mobile, max height on desktop */}
      <div className="bg-white rounded-2xl w-full shadow-2xl flex flex-col"
        style={{
          maxWidth: 560,
          height: "min(92vh, 800px)",
          maxHeight: "92vh",
        }}>

        {/* Sticky header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0"
          style={{ borderRadius: "16px 16px 0 0" }}>
          <div className="flex gap-1">
            {tabs.map(([key, label]) => (
              <button key={key} onClick={() => resetTab(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all"
                style={{
                  background: tab === key ? "#11999e" : "transparent",
                  color:      tab === key ? "white"   : "#9ca3af",
                }}>
                {label}
              </button>
            ))}
          </div>
          <button type="button" onClick={e => { e.stopPropagation(); onClose(); }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            style={{ color: "#9ca3af" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5"
          style={{ WebkitOverflowScrolling: "touch" }}>

          {/* ── BOOK TAB ── */}
          {tab === "book" && (
            submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#f0fdf4", border: "2px solid rgba(34,197,94,0.25)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2" style={{ color: "#293533" }}>
                  Booking Confirmed!
                </h3>
                {successTracking && (
                  <div className="rounded-xl p-3 mb-4"
                    style={{ background: "#e8f6f7", border: "1px solid rgba(17,153,158,0.2)" }}>
                    <p className="text-xs font-body" style={{ color: "#576d69" }}>Your Tracking ID</p>
                    <p className="font-heading text-lg font-bold" style={{ color: "#11999e" }}>
                      {successTracking}
                    </p>
                  </div>
                )}
                <p className="font-body text-sm mb-5" style={{ color: "#576d69" }}>
                  A confirmation email with your PDF receipt has been sent.<br/>
                  Your PDF was also downloaded automatically.
                </p>
                {pdfUrl && (
                  <a href={pdfUrl} download={`ImmiNexus-Booking-${successTracking}.pdf`}
                    className="btn-brand text-sm px-6 py-2.5 inline-flex items-center gap-2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF Again
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Info */}
                <div className="rounded-xl p-3 text-xs font-body" style={{ background: "#e8f6f7", color: "#0d7a7e" }}>
                  Free consultation · Mon–Sat · 9AM–9PM GMT-5 · Book at least 48h in advance
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input {...register("fullName", { required: true })} placeholder="Full Name" className={inp}/>
                    {errors.fullName && <p className={errCls}>Required</p>}
                  </div>
                  <div>
                    <input {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                      type="email" placeholder="Email Address" className={inp}/>
                    {errors.email && <p className={errCls}>Valid email required</p>}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <select {...register("country", { required: true })} defaultValue="" className={inp}>
                    <option value="" disabled>Your country of residence...</option>
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {errors.country && <p className={errCls}>Required</p>}
                </div>

                {/* Phone */}
                <div>
                  <input {...register("phone")}
                    placeholder="Phone (auto-filled, add your number)"
                    className={inp}/>
                  <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                    Country code auto-filled. Complete with your number.
                  </p>
                </div>

                {/* Service */}
                <div>
                  <select {...register("service", { required: true })} defaultValue="" className={inp}>
                    <option value="" disabled>Select a service...</option>
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
                    <optgroup label="── Canada ──">
                      {SERVICES.filter(s => s.startsWith("Canada")).map(s => (
                        <option key={s} value={s}>{s.replace("Canada – ", "")}</option>
                      ))}
                    </optgroup>
                    <optgroup label="── Other Countries ──">
                      {SERVICES.filter(s => s.startsWith("Other")).map(s => (
                        <option key={s} value={s}>{s.replace("Other Country – ", "")}</option>
                      ))}
                    </optgroup>
                  </select>
                  {errors.service && <p className={errCls}>Required</p>}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-body uppercase tracking-wide mb-1"
                    style={{ color: "#9ca3af" }}>
                    Preferred Date (Mon–Sat, 48h advance required)
                  </label>
                  <input
                    {...register("date", {
                      required: true,
                      validate: v => {
                        const msg = getDateValidationMessage(v);
                        return msg === "" || msg;
                      },
                    })}
                    type="date" min={today} max={maxDate}
                    className={inp}
                  />
                  {errors.date && (
                    <p className={errCls}>{errors.date.message || "Invalid date"}</p>
                  )}
                </div>

                {/* Time slots */}
                {renderSlots(watchedDate, bookedSlots, watchedTime, slot => setValue("time", slot))}
                <input type="hidden" {...register("time", { required: "Please select a time slot" })}/>
                {errors.time && <p className={errCls}>{errors.time.message}</p>}

                {/* Message */}
                <textarea {...register("message")}
                  placeholder="Additional notes or questions (optional)"
                  rows={2} className={`${inp} resize-none`}/>

                {/* hCaptcha */}
                {process.env.NODE_ENV !== "development" && (
                  <div className="flex justify-center pt-1">
                    <HCaptcha
                      ref={captchaRef}
                      sitekey={HCAPTCHA_SITE_KEY}
                      onVerify={token => setCaptchaToken(token)}
                      onExpire={() => setCaptchaToken(null)}
                      onError={() => setCaptchaToken(null)}
                    />
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="btn-brand w-full py-3.5 text-base justify-center disabled:opacity-60">
                  {loading ? "Booking..." : "Book Free Consultation"}
                </button>

                <p className="text-center text-xs font-body" style={{ color: "#9ca3af" }}>
                  By booking, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            )
          )}

          {/* ── TRACK TAB ── */}
          {tab === "track" && (
            <div className="space-y-4">
              <p className="text-sm font-body" style={{ color: "#576d69" }}>
                Enter your Tracking ID from your confirmation email to check your booking status.
              </p>
              <div className="flex gap-2">
                <input value={trackingId}
                  onChange={e => setTrackingId(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && onTrack()}
                  placeholder="IMN-XXXXXXXX-XXXXXX"
                  className={`${inp} flex-1`}/>
                <button onClick={onTrack} disabled={trackingLoading}
                  className="btn-brand px-4 py-2.5 text-sm whitespace-nowrap">
                  {trackingLoading ? "..." : "Track"}
                </button>
              </div>

              {trackingError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">
                  {trackingError}
                </div>
              )}

              {trackingData && (
                <div className="rounded-xl p-4 border" style={{ background: "#f0fafa", borderColor: "rgba(17,153,158,0.2)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-body font-bold px-3 py-1 rounded-full"
                      style={{
                        background: trackingData.booking.status === "confirmed" ? "#f0fdf4" : "#fefce8",
                        color:      trackingData.booking.status === "confirmed" ? "#15803d" : "#92400e",
                      }}>
                      {trackingData.booking.status?.toUpperCase()}
                    </span>
                    {trackingData.daysLeft > 0 && (
                      <span className="text-xs font-body" style={{ color: "#11999e" }}>
                        {trackingData.daysLeft} day{trackingData.daysLeft !== 1 ? "s" : ""} remaining
                      </span>
                    )}
                  </div>
                  {[
                    ["Name",    trackingData.booking.fullName],
                    ["Service", trackingData.booking.service],
                    ["Date",    trackingData.booking.date],
                    ["Time",    formatTimeGMT5(trackingData.booking.time)],
                    ["Country", trackingData.booking.country],
                  ].map(([l, v]) => (
                    <div key={l} className="flex gap-3 text-sm font-body py-1.5 border-b"
                      style={{ borderColor: "rgba(17,153,158,0.08)" }}>
                      <span className="w-16 flex-shrink-0 text-xs" style={{ color: "#9ca3af" }}>{l}</span>
                      <span className="font-medium text-xs" style={{ color: "#293533" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MODIFY TAB ── */}
          {tab === "modify" && (
            modifySuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#f0fdf4", border: "2px solid rgba(34,197,94,0.25)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2" style={{ color: "#293533" }}>
                  Booking Modified!
                </h3>
                <p className="font-body text-sm mb-5" style={{ color: "#576d69" }}>
                  Your PDF receipt has been downloaded and sent to your email.
                </p>
                {modifyPdfUrl && (
                  <a href={modifyPdfUrl} download={`ImmiNexus-Modified-${modifyTracking}.pdf`}
                    className="btn-brand text-sm px-6 py-2.5 inline-flex items-center gap-2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF Again
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleM(onModify)} className="space-y-4">
                <div className="rounded-xl p-3 text-xs font-body"
                  style={{ background: "#fefce8", color: "#92400e" }}>
                  Only available slots can be selected. 48h advance booking required. Sundays unavailable.
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-body uppercase tracking-wide mb-1"
                    style={{ color: "#9ca3af" }}>Tracking ID</label>
                  <input {...regM("trackingId", { required: true })}
                    placeholder="IMN-XXXXXXXX-XXXXXX" className={inp}/>
                  {errM.trackingId && <p className={errCls}>Required</p>}
                </div>

                <div>
                  <label className="block text-xs font-body uppercase tracking-wide mb-1"
                    style={{ color: "#9ca3af" }}>New Date (Mon–Sat)</label>
                  <input {...regM("newDate", {
                    required: true,
                    validate: v => {
                      const msg = getDateValidationMessage(v);
                      return msg === "" || msg;
                    },
                  })} type="date" min={today} max={maxDate} className={inp}/>
                  {errM.newDate && <p className={errCls}>{errM.newDate.message || "Invalid date"}</p>}
                </div>

                {renderSlots(watchedModDate, modBookedSlots, watchedModTime, slot => setVM("newTime", slot))}
                <input type="hidden" {...regM("newTime", { required: "Please select a time slot" })}/>
                {errM.newTime && <p className={errCls}>{errM.newTime.message}</p>}

                <textarea {...regM("reason", { required: true, minLength: 5 })}
                  placeholder="Reason for modification (required)"
                  rows={2} className={`${inp} resize-none`}/>
                {errM.reason && <p className={errCls}>Please provide a reason (min 5 chars)</p>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setTab("book")}
                    className="btn-outline flex-1 py-3">Cancel</button>
                  <button type="submit" disabled={loading}
                    className="btn-brand flex-1 py-3 disabled:opacity-60">
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