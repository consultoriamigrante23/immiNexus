"use client";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

const COOKIE_KEY = "imminexus_cookie_consent";

export default function CookieBanner() {
  const t = useTranslations("cookies");
  const locale = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setTimeout(() => setShow(true), 1500);
  }, []);

  const accept = () => { localStorage.setItem(COOKIE_KEY, "all"); setShow(false); };
  const decline = () => { localStorage.setItem(COOKIE_KEY, "essential"); setShow(false); };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] p-4 md:p-6">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-gray-700 text-sm font-body leading-relaxed">{t("message")}{" "}
            <a href={`/${locale}/privacy-policy`} className="underline font-medium" style={{ color: "#2A9D9A" }}>{t("policy")}</a>
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={decline}
            className="px-4 py-2 text-sm font-body font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            {t("decline")}
          </button>
          <button onClick={accept}
            className="px-4 py-2 text-sm font-body font-medium text-white rounded-lg transition-colors hover:opacity-90"
            style={{ background: "#2A9D9A" }}>
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}