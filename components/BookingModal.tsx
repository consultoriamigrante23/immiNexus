"use client";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { getAvailableSlots, isValidFutureDate } from "@/lib/availability";

type Tab = "book" | "track" | "modify";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  date: string;
  time: string;
  message: string;
};

type ModifyData = {
  trackingId: string;
  newDate: string;
  newTime: string;
  reason: string;
};

export default function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("booking");
  const tc = useTranslations("contact");
  const services = tc.raw("services") as string[];

  const [tab, setTab] = useState<Tab>("book");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [modifyBookedSlots, setModifyBookedSlots] = useState<string[]>([]);

  const [trackingId, setTrackingId] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackingError, setTrackingError] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [modifySuccess, setModifySuccess] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>();
  const { register: regM, handleSubmit: handleM, watch: watchM, setValue: setVM, formState: { errors: errM } } = useForm<ModifyData>();

  const watchedDate = watch("date");
  const watchedTime = watch("time");
  const watchedModDate = watchM("newDate");
  const watchedModTime = watchM("newTime");

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0];

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else {
      document.body.style.overflow = "";
      setSubmitted(false);
      setError("");
      reset();
      setTab("book");
      setTrackingData(null);
      setModifySuccess(false);
    }
  }, [open, reset]);

  useEffect(() => {
    if (!watchedDate || !isValidFutureDate(watchedDate)) { setBookedSlots([]); return; }
    fetch(`/api/booking?date=${watchedDate}`)
      .then(r => r.json())
      .then(d => setBookedSlots(d.bookedSlots ?? []))
      .catch(() => {});
  }, [watchedDate]);

  useEffect(() => {
    if (!watchedModDate || !isValidFutureDate(watchedModDate)) { setModifyBookedSlots([]); return; }
    fetch(`/api/booking?date=${watchedModDate}`)
      .then(r => r.json())
      .then(d => setModifyBookedSlots(d.bookedSlots ?? []))
      .catch(() => {});
  }, [watchedModDate]);

  const onSubmit = async (data: FormData) => {
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

  const renderSlots = (slots: string[], booked: string[], selectedTime: string, onSelect: (t: string) => void) => (
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
            className={`py-2 px-1 rounded-lg text-xs font-body font-medium border ${
              isBooked
                ? "border-gray-100 bg-gray-50 text-gray-300 line-through"
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

  if (!open) return null;

  const inp = "w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm";
  const errCls = "text-red-500 text-xs mt-1";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Sticky Header with Tabs & Close */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex gap-2">
            {([["book", t("book")], ["track", t("track")], ["modify", t("modify")]] as [Tab, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setTab(key as Tab); setError(""); setSubmitted(false); setModifySuccess(false); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${
                  tab === key ? "bg-brand-500 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            style={{ color: "#9ca3af" }}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="p-6">

          {/* BOOK Tab */}
{tab === "book" && (
  submitted ? (
    <div className="text-center">
      <p className="text-xs text-gray-400 font-body">
        {t("receiptSent")} 
      </p>
    </div>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Translated info banner */}
      <div className="border rounded-xl p-3 text-xs font-body" style={{ background: "#e8f6f7", borderColor: "#c5eaea", color: "#0d7a7e" }}>
        {t("bookingInfo")}
      </div>

      <input {...register("fullName", { required: true })} placeholder={t("name")} className={inp}/>
      <input {...register("email", { required: true })} placeholder={t("email")} className={inp}/>

      <button type="submit" disabled={loading} className="btn-brand w-full py-3">
        {loading ? t("submitting") : t("submit")}
      </button>
    </form>
  )
)}

          {/* MODIFY Tab */}
          {tab === "modify" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs font-body text-yellow-700">
              You can only select available time slots. Booked slots are disabled.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}