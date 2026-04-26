export const dynamic = "force-dynamic";

import Footer from "@/components/Footer";
import Link from "next/link";

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <div style={{ height: 80 }} />

      <main className="max-w-4xl mx-auto px-6 pt-8 pb-20">

        {/* Back link + badge row */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <Link href={`/${locale}`}
            className="inline-flex items-center gap-2 font-body text-sm font-medium transition-colors"
            style={{ color: "#11999e", textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Back to Home
          </Link>
          <span className="text-gray-300">·</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-semibold tracking-widest uppercase"
            style={{ background: "rgba(17,153,158,0.08)", border: "1px solid rgba(17,153,158,0.15)", color: "#11999e" }}>
            Legal Documents
          </span>
        </div>

        {/* Page header */}
        <div className="mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3" style={{ color: "#293533" }}>
            Legal Information
          </h1>
          <p className="font-body text-base" style={{ color: "#9ca3af" }}>
            Last updated: January 2025 &nbsp;·&nbsp; ImmiNexus Consultants
          </p>
          <div className="w-16 h-1 rounded mt-5"
            style={{ background: "linear-gradient(90deg,#11999e,#16c6cc)" }}/>
        </div>

        {/* Quick navigation */}
        <div className="rounded-2xl p-5 mb-14"
          style={{ background: "rgba(17,153,158,0.04)", border: "1px solid rgba(17,153,158,0.12)" }}>
          <p className="text-xs font-body font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#9ca3af" }}>Jump to section</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Privacy Policy",   anchor: "#privacy" },
              { label: "Terms of Service", anchor: "#terms"   },
              { label: "Cookie Policy",    anchor: "#cookies"  },
            ].map(item => (
              <a key={item.anchor} href={item.anchor}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background:     "white",
                  border:         "1.5px solid rgba(17,153,158,0.18)",
                  color:          "#11999e",
                  textDecoration: "none",
                  boxShadow:      "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-16">

          {/* ── 1. PRIVACY POLICY ── */}
          <section id="privacy" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="1" title="Privacy Policy & Confidentiality" />

            <div className="space-y-5">
              <p className="font-body text-base leading-loose" style={{ color: "#576d69" }}>
                ImmiNexus Consultants is responsible for the processing of the personal data you provide to us.
                The personal data collected, under the laws in Mexico, will be used to contact you and,
                in the event that you engage our services, to carry out the corresponding process agreed
                upon between the parties.
              </p>

              <div className="rounded-2xl p-6"
                style={{ background: "rgba(17,153,158,0.04)", border: "1px solid rgba(17,153,158,0.12)" }}>
                <h3 className="font-heading text-xl font-bold mb-4" style={{ color: "#293533" }}>
                  Your ARCO Rights
                </h3>
                <div className="space-y-3">
                  {[
                    ["Access",        "Know what personal data we hold about you, how it is used, and the conditions under which we process it."],
                    ["Rectification", "Request correction of your personal information if it is outdated, inaccurate, or incomplete."],
                    ["Cancellation",  "Request that we delete your data from our records when it is not being used in accordance with the law."],
                    ["Objection",     "Object to the use of your personal data for specific purposes."],
                  ].map(([right, desc]) => (
                    <div key={right} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: "#11999e" }}/>
                      <p className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>
                        <span className="font-semibold" style={{ color: "#293533" }}>{right}:</span>{" "}{desc}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t" style={{ borderColor: "rgba(17,153,158,0.12)" }}>
                  <p className="font-body text-sm" style={{ color: "#576d69" }}>
                    To exercise your ARCO rights, submit a written request to:{" "}
                    <a href="mailto:consultoriamigrante23@gmail.com?subject=ARCO Rights Request"
                      className="font-semibold" style={{ color: "#11999e" }}>
                      consultoriamigrante23@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <h4 className="font-heading text-base font-bold mb-2" style={{ color: "#293533" }}>
                  Changes to this Privacy Notice
                </h4>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>
                  We reserve the right to update this Privacy Notice at any time to address legislative
                  changes, internal policies, or new requirements. Changes will be reflected on this page
                  with an updated date.
                </p>
              </div>
            </div>
          </section>

          <Divider />

          {/* ── 2. TERMS OF SERVICE ── */}
          <section id="terms" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="2" title="Terms of Service" />

            <div className="space-y-6">
              <p className="font-body text-base leading-loose" style={{ color: "#576d69" }}>
                By using the services of ImmiNexus Consultants ("we," "us"), you agree to be bound by
                these Terms of Service. We provide immigration consulting and related services as agreed
                with each client. We do not guarantee the approval of any application or immigration
                outcome, as all final decisions are made by government authorities.
              </p>

              <div className="rounded-2xl p-6" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <h3 className="font-heading text-xl font-bold mb-4" style={{ color: "#293533" }}>
                  Client Obligations
                </h3>
                <div className="space-y-3">
                  {[
                    "Provide complete, truthful, and accurate information at all times",
                    "Submit required documentation in a timely manner",
                    "Inform us promptly of any changes that may affect your case",
                    "Comply with all agreed payment schedules and terms",
                  ].map((item, i) => (
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
                  Fees & Payments
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>
                  All fees are established in a separate service agreement prior to the commencement
                  of services. Fees are generally non-refundable unless otherwise expressly stated
                  in writing in the agreement.
                </p>
              </div>

              <div className="rounded-2xl p-6" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <h3 className="font-heading text-xl font-bold mb-3" style={{ color: "#293533" }}>
                  Limitations of Liability
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>
                  ImmiNexus Consultants is not liable for delays, denials, or decisions made by third
                  parties including immigration authorities, embassies, or government agencies. We reserve
                  the right to suspend or terminate services if these Terms are breached or required
                  payments are not received.
                </p>
              </div>

              <div className="rounded-2xl p-4"
                style={{ background: "rgba(17,153,158,0.04)", border: "1px solid rgba(17,153,158,0.12)" }}>
                <p className="font-body text-sm" style={{ color: "#576d69" }}>
                  Questions about these Terms?{" "}
                  <a href="mailto:consultoriamigrante23@gmail.com?subject=Terms of Service Inquiry"
                    className="font-semibold" style={{ color: "#11999e" }}>
                    consultoriamigrante23@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          <Divider />

          {/* ── 3. COOKIE POLICY ── */}
          <section id="cookies" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="3" title="Cookie Policy" />

            <div className="space-y-6">
              <p className="font-body text-base leading-loose" style={{ color: "#576d69" }}>
                ImmiNexus Consultants uses cookies and similar technologies to enhance your browsing
                experience, analyze site traffic, and improve our services. By continuing to use our
                website, you consent to the use of cookies in accordance with this policy.
              </p>

              <div className="space-y-4">
                {[
                  {
                    name:  "Essential Cookies",
                    color: "#11999e",
                    desc:  "Required for the website to function properly, including the booking system and security verification. These cannot be disabled.",
                  },
                  {
                    name:  "Analytics Cookies",
                    color: "#3B82F6",
                    desc:  "Help us understand how visitors interact with our website so we can improve performance and user experience. All data is anonymized.",
                  },
                  {
                    name:  "Preference Cookies",
                    color: "#F59E0B",
                    desc:  "Remember your settings such as language selection to provide a more personalized experience on return visits.",
                  },
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
                  Managing Cookies
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>
                  You can control and manage cookies through your browser settings. Note that disabling
                  certain cookies may affect website functionality. Most browsers allow you to view,
                  delete, and block cookies from specific websites.
                </p>
              </div>
            </div>
          </section>

          <Divider />

          {/* ── 4. OUR SERVICES ── */}
          <section id="services" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="4" title="Our Services" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  country: "Mexico", color: "#22C55E",
                  items: [
                    "Visitor Visa / Non-lucrative (Tourism, Business, Transit)",
                    "Temporary Residence (Work, Family, Study, Digital Nomad)",
                    "Permanent Residence",
                    "Visa requests outside Mexico",
                    "Permits at the National Institute of Migration (INM)",
                    "Passport services",
                  ],
                },
                {
                  country: "United States", color: "#3B82F6",
                  items: ["Visa B1 – Business Visitor", "Visa B2 – Tourism & Medical"],
                },
                {
                  country: "Canada", color: "#EF4444",
                  items: [
                    "Visitor Visa (Family, Transit, Tourism, Business)",
                    "Electronic Travel Authorization (eTA)",
                  ],
                },
                {
                  country: "Other Countries", color: "#F59E0B",
                  items: ["Visitor Visas – Short and Long Term", "Transit Visas", "Business Visas", "And more"],
                },
              ].map(s => (
                <div key={s.country} className="rounded-2xl p-5"
                  style={{ border: `1.5px solid ${s.color}30`, background: `${s.color}08` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full" style={{ background: s.color }}/>
                    <h3 className="font-heading text-base font-bold" style={{ color: "#293533" }}>
                      {s.country}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {s.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ background: s.color }}/>
                        <span className="font-body text-sm leading-relaxed" style={{ color: "#576d69" }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* ── 5. TEAM ── */}
          <section id="team" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="5" title="Our Team" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "Marco Rodriguez",
                  role: "Main Consultant",
                  bio:  "Paralegal graduate in Ontario, Canada, and candidate for the P1 License with the Law Society of Ontario. Holds bachelor's degrees in Law and International Relations from Mexico. Experience as a Paralegal and Senior Case Manager in the United States, government officer in Mexico, and within a Canadian law firm.",
                },
                {
                  name: "Sidelghali Zouine",
                  role: "Legal Assistant",
                  bio:  "Paralegal graduate in Canada and candidate for the P1 License with the Law Society of Ontario. Holds a Bachelor's Degree in Private Law from Morocco. Experienced as an administrative assistant and paralegal intern with strong organizational and legal support skills.",
                },
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

        {/* Contact footer */}
        <div className="mt-14 rounded-2xl p-6 text-center"
          style={{ background: "rgba(17,153,158,0.06)", border: "1px solid rgba(17,153,158,0.15)" }}>
          <p className="font-body text-sm font-medium" style={{ color: "#293533" }}>
            Questions about our legal documents?{" "}
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