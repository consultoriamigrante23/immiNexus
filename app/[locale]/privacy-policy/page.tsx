export const dynamic = "force-dynamic";

import Footer from "@/components/Footer";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <>
      <div style={{ height: 80 }} />
      <main className="max-w-4xl mx-auto px-6 pt-8 pb-20">

        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <Link href={`/${locale}`}
            className="inline-flex items-center gap-2 font-body text-sm font-medium transition-colors"
            style={{ color: "#11999e", textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            {t("backHome")}
          </Link>
          <span className="text-gray-300">·</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-semibold tracking-widest uppercase"
            style={{ background: "rgba(17,153,158,0.08)", border: "1px solid rgba(17,153,158,0.15)", color: "#11999e" }}>
            {t("badge")}
          </span>
        </div>

        <div className="mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3" style={{ color: "#293533" }}>
            {t("pageTitle")}
          </h1>
          <p className="font-body text-base" style={{ color: "#9ca3af" }}>{t("lastUpdated")}</p>
          <div className="w-16 h-1 rounded mt-5" style={{ background: "linear-gradient(90deg,#11999e,#16c6cc)" }}/>
        </div>

        <div className="rounded-2xl p-5 mb-14"
          style={{ background: "rgba(17,153,158,0.04)", border: "1px solid rgba(17,153,158,0.12)" }}>
          <p className="text-xs font-body font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#9ca3af" }}>{t("jumpTo")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: t("privacyTitle"), anchor: "#privacy" },
              { label: t("termsTitle"),   anchor: "#terms"   },
              { label: t("cookiesTitle"), anchor: "#cookies"  },
            ].map(item => (
              <a key={item.anchor} href={item.anchor}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: "white", border: "1.5px solid rgba(17,153,158,0.18)", color: "#11999e", textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-16">

          <section id="privacy" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="1" title={t("privacyTitle")} />
            <div className="space-y-5">
              <p className="font-body text-base leading-loose" style={{ color: "#576d69" }}>
                {t("privacyIntro")}
              </p>
              <div className="rounded-2xl p-6"
                style={{ background: "rgba(17,153,158,0.04)", border: "1px solid rgba(17,153,158,0.12)" }}>
                <h3 className="font-heading text-xl font-bold mb-4" style={{ color: "#293533" }}>
                  {t("arcoTitle")}
                </h3>
                <div className="space-y-3">
                  {[
                    [t("arcoAccess"), t("arcoAccessDesc")],
                    [t("arcoRect"),   t("arcoRectDesc")],
                    [t("arcoCancel"), t("arcoCancelDesc")],
                    [t("arcoObject"), t("arcoObjectDesc")],
                  ].map(([right, desc]) => (
                    <div key={right} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: "#11999e" }}/>
                      <p className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>
                        <span className="font-semibold" style={{ color: "#293533" }}>{right}:</span> {desc}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t" style={{ borderColor: "rgba(17,153,158,0.12)" }}>
                  <p className="font-body text-sm" style={{ color: "#576d69" }}>
                    {t("arcoContact")}{" "}
                    <a href="mailto:consultoriamigrante23@gmail.com?subject=ARCO Rights Request"
                      className="font-semibold" style={{ color: "#11999e" }}>
                      consultoriamigrante23@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="rounded-2xl p-5" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <h4 className="font-heading text-base font-bold mb-2" style={{ color: "#293533" }}>
                  {t("changesTitle")}
                </h4>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>
                  {t("changesDesc")}
                </p>
              </div>
            </div>
          </section>

          <Divider />

          <section id="terms" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="2" title={t("termsTitle")} />
            <div className="space-y-6">
              <p className="font-body text-base leading-loose" style={{ color: "#576d69" }}>
                {t("termsIntro")}
              </p>
              <div className="rounded-2xl p-6" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <h3 className="font-heading text-xl font-bold mb-4" style={{ color: "#293533" }}>
                  {t("obligationsTitle")}
                </h3>
                <div className="space-y-3">
                  {[t("oblig1"), t("oblig2"), t("oblig3"), t("oblig4")].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(17,153,158,0.1)" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#11999e" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <p className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-6" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <h3 className="font-heading text-xl font-bold mb-3" style={{ color: "#293533" }}>
                  {t("feesTitle")}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>
                  {t("feesDesc")}
                </p>
              </div>
              <div className="rounded-2xl p-6" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <h3 className="font-heading text-xl font-bold mb-3" style={{ color: "#293533" }}>
                  {t("liabilityTitle")}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>
                  {t("liabilityDesc")}
                </p>
              </div>
              <div className="rounded-2xl p-4"
                style={{ background: "rgba(17,153,158,0.04)", border: "1px solid rgba(17,153,158,0.12)" }}>
                <p className="font-body text-sm" style={{ color: "#576d69" }}>
                  {t("termsQuestion")}{" "}
                  <a href="mailto:consultoriamigrante23@gmail.com?subject=Terms of Service Inquiry"
                    className="font-semibold" style={{ color: "#11999e" }}>
                    consultoriamigrante23@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          <Divider />

          <section id="cookies" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="3" title={t("cookiesTitle")} />
            <div className="space-y-6">
              <p className="font-body text-base leading-loose" style={{ color: "#576d69" }}>
                {t("cookiesIntro")}
              </p>
              <div className="space-y-4">
                {[
                  { name: t("essentialCookies"), color: "#11999e", desc: t("essentialDesc") },
                  { name: t("analyticsCookies"), color: "#3B82F6", desc: t("analyticsDesc") },
                  { name: t("prefCookies"),      color: "#F59E0B", desc: t("prefDesc")      },
                ].map(c => (
                  <div key={c.name} className="rounded-2xl p-5"
                    style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }}/>
                      <h4 className="font-body font-semibold text-sm" style={{ color: "#293533" }}>{c.name}</h4>
                    </div>
                    <p className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>{c.desc}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-6" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <h3 className="font-heading text-xl font-bold mb-3" style={{ color: "#293533" }}>
                  {t("manageCookiesTitle")}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>
                  {t("manageCookiesDesc")}
                </p>
              </div>
            </div>
          </section>

          <Divider />

          <section id="services" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="4" title={t("servicesTitle")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { country: t("mexico"),  color: "#22C55E", items: [t("mex1"),t("mex2"),t("mex3"),t("mex4"),t("mex5"),t("mex6")] },
                { country: t("usa"),     color: "#3B82F6", items: [t("usa1"),t("usa2")] },

                { country: t("others"),  color: "#F59E0B", items: [t("oth1"),t("oth2"),t("oth3"),t("oth4")] },
              ].map(s => (
                <div key={s.country} className="rounded-2xl p-5"
                  style={{ border: `1.5px solid ${s.color}30`, background: `${s.color}08` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full" style={{ background: s.color }}/>
                    <h3 className="font-heading text-base font-bold" style={{ color: "#293533" }}>{s.country}</h3>
                  </div>
                  <ul className="space-y-2">
                    {s.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: s.color }}/>
                        <span className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          <section id="team" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="5" title={t("teamTitle")} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Marco Rodriguez",   role: t("mainConsultant"), bio: t("marcoBio") },
                { name: "Sidelghali Zouine", role: t("legalAssistant"), bio: t("sidelBio") },
              ].map(m => (
                <div key={m.name} className="rounded-2xl p-6"
                  style={{ border: "1.5px solid rgba(17,153,158,0.15)", background: "rgba(17,153,158,0.03)" }}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-heading text-xl font-bold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#11999e,#0d7a7e)" }}>
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold" style={{ color: "#293533" }}>{m.name}</h3>
                      <p className="text-sm font-body font-medium" style={{ color: "#11999e" }}>{m.role}</p>
                    </div>
                  </div>
                  <p className="font-body text-sm leading-loose" style={{ color: "#576d69" }}>{m.bio}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        <div className="mt-14 rounded-2xl p-6 text-center"
          style={{ background: "rgba(17,153,158,0.06)", border: "1px solid rgba(17,153,158,0.15)" }}>
          <p className="font-body text-sm font-medium" style={{ color: "#293533" }}>
            {t("contactQuestion")}{" "}
            <a href="mailto:consultoriamigrante23@gmail.com?subject=Legal Inquiry"
              style={{ color: "#11999e", fontWeight: 700, textDecoration: "none" }}>
              consultoriamigrante23@gmail.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-body font-bold text-sm flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#11999e,#0d7a7e)", boxShadow: "0 4px 12px rgba(17,153,158,0.3)" }}>
        {number}
      </div>
      <h2 className="font-heading text-2xl md:text-3xl font-bold" style={{ color: "#293533" }}>{title}</h2>
    </div>
  );
}

function Divider() {
  return (
    <div className="py-2">
      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(17,153,158,0.25),transparent)" }}/>
    </div>
  );
}