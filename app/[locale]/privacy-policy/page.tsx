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
      {/* Spacer for the fixed navbar from layout */}
      <div style={{ height: 72 }} />

      <main className="max-w-4xl mx-auto px-6 pt-8 pb-20">

        {/* Page header */}
        <div className="mb-10">
          <Link href={`/${locale}`}
            className="inline-flex items-center gap-2 mb-6 font-body text-sm font-medium transition-colors hover:text-teal-600"
            style={{ color: "#11999e", textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Back to Home
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 block"
            style={{ background: "rgba(17,153,158,0.08)", border: "1px solid rgba(17,153,158,0.15)" }}>
            <span className="text-xs font-body font-semibold tracking-widest uppercase"
              style={{ color: "#11999e" }}>
              Legal Documents
            </span>
          </div>

          <h1 className="font-heading text-4xl font-bold mb-3" style={{ color: "#293533" }}>
            Legal Information
          </h1>
          <p className="font-body text-base" style={{ color: "#576d69" }}>
            Last updated: January 2025 &nbsp;·&nbsp; ImmiNexus Consultants
          </p>
          <div className="w-16 h-1 rounded mt-4"
            style={{ background: "linear-gradient(90deg,#11999e,#16c6cc)" }}/>
        </div>

        {/* Quick navigation */}
        <div className="rounded-2xl p-5 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-3"
          style={{ background: "rgba(17,153,158,0.04)", border: "1px solid rgba(17,153,158,0.12)" }}>
          {[
            { label: "Privacy Policy",   anchor: "#privacy" },
            { label: "Terms of Service", anchor: "#terms"   },
            { label: "Cookie Policy",    anchor: "#cookies"  },
          ].map(item => (
            <a key={item.anchor} href={item.anchor}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{
                background:     "white",
                border:         "1px solid rgba(17,153,158,0.15)",
                color:          "#11999e",
                textDecoration: "none",
                boxShadow:      "0 2px 8px rgba(0,0,0,0.04)",
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              {item.label}
            </a>
          ))}
        </div>

        <div className="space-y-12">

          {/* ── PRIVACY POLICY ── */}
          <section id="privacy" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="1" title="Privacy Policy & Confidentiality" />
            <div className="space-y-4 font-body text-base leading-relaxed" style={{ color: "#576d69" }}>
              <p>
                ImmiNexus Consultants is responsible for the processing of the personal data you provide to us.
                The personal data collected, under the laws in Mexico, will be used to contact you and,
                in the event that you engage our services, to carry out the corresponding process agreed
                upon between the parties.
              </p>

              <div className="rounded-xl p-5"
                style={{ background: "rgba(17,153,158,0.04)", border: "1px solid rgba(17,153,158,0.12)" }}>
                <h3 className="font-heading text-lg font-bold mb-3" style={{ color: "#293533" }}>
                  Your ARCO Rights
                </h3>
                <p className="mb-3">
                  You have the right to know what personal data we hold about you, how it is used,
                  and the conditions under which we process it (<strong>Access</strong>). You also have the
                  right to request correction of inaccurate information (<strong>Rectification</strong>);
                  to request deletion from our records (<strong>Cancellation</strong>); and to object to
                  its use for specific purposes (<strong>Objection</strong>).
                </p>
                <p>
                  To exercise your ARCO rights, contact us at:{" "}
                  <a href="mailto:consultoriamigrante23@gmail.com?subject=ARCO Rights Request"
                    style={{ color: "#11999e", fontWeight: 600 }}>
                    consultoriamigrante23@gmail.com
                  </a>
                </p>
              </div>

              <p>
                <strong style={{ color: "#293533" }}>Changes to this Privacy Notice:</strong>{" "}
                We reserve the right to update this Privacy Notice at any time. Changes will be
                reflected on this page with an updated date.
              </p>
            </div>
          </section>

          <Divider />

          {/* ── TERMS OF SERVICE ── */}
          <section id="terms" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="2" title="Terms of Service" />
            <div className="space-y-4 font-body text-base leading-relaxed" style={{ color: "#576d69" }}>
              <p>
                By using the services of ImmiNexus Consultants ("we," "us"), you agree to be bound by
                these Terms of Service. We provide immigration consulting and related services as agreed
                with each client. We do not guarantee the approval of any application or immigration
                outcome, as all final decisions are made by government authorities.
              </p>

              <h3 className="font-heading text-lg font-bold" style={{ color: "#293533" }}>
                Client Obligations
              </h3>
              <ul className="space-y-2">
                {[
                  "Provide complete, truthful, and accurate information at all times",
                  "Submit required documentation in a timely manner",
                  "Inform us promptly of any changes that may affect your case",
                  "Comply with all agreed payment schedules and terms",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ background: "#11999e" }}/>
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="font-heading text-lg font-bold" style={{ color: "#293533" }}>
                Fees & Payments
              </h3>
              <p>
                All fees are established in a separate service agreement prior to the commencement
                of services. Fees are generally non-refundable unless otherwise expressly stated
                in writing.
              </p>

              <h3 className="font-heading text-lg font-bold" style={{ color: "#293533" }}>
                Limitations of Liability
              </h3>
              <p>
                ImmiNexus Consultants is not liable for delays, denials, or decisions made by third
                parties including immigration authorities, embassies, or government agencies. We reserve
                the right to suspend or terminate services if these Terms are breached or required
                payments are not received.
              </p>

              <div className="rounded-xl p-4"
                style={{ background: "rgba(17,153,158,0.04)", border: "1px solid rgba(17,153,158,0.12)" }}>
                <p>
                  Questions about these Terms?{" "}
                  <a href="mailto:consultoriamigrante23@gmail.com?subject=Terms of Service Inquiry"
                    style={{ color: "#11999e", fontWeight: 600 }}>
                    consultoriamigrante23@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          <Divider />

          {/* ── COOKIE POLICY ── */}
          <section id="cookies" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="3" title="Cookie Policy" />
            <div className="space-y-4 font-body text-base leading-relaxed" style={{ color: "#576d69" }}>
              <p>
                ImmiNexus Consultants uses cookies and similar technologies to enhance your browsing
                experience, analyze site traffic, and improve our services. By continuing to use our
                website, you consent to the use of cookies in accordance with this policy.
              </p>

              <h3 className="font-heading text-lg font-bold" style={{ color: "#293533" }}>
                Types of Cookies We Use
              </h3>
              <div className="space-y-3">
                {[
                  {
                    name: "Essential Cookies",
                    desc: "Required for the website to function properly, including the booking system and security verification. These cannot be disabled.",
                  },
                  {
                    name: "Analytics Cookies",
                    desc: "Help us understand how visitors interact with our website so we can improve performance. All data is anonymized.",
                  },
                  {
                    name: "Preference Cookies",
                    desc: "Remember your settings such as language selection to provide a more personalized experience on return visits.",
                  },
                ].map(c => (
                  <div key={c.name} className="rounded-xl p-4"
                    style={{ background: "rgba(17,153,158,0.03)", border: "1px solid rgba(17,153,158,0.1)" }}>
                    <p className="font-body font-semibold mb-1" style={{ color: "#293533" }}>{c.name}</p>
                    <p className="text-sm">{c.desc}</p>
                  </div>
                ))}
              </div>

              <h3 className="font-heading text-lg font-bold" style={{ color: "#293533" }}>
                Managing Cookies
              </h3>
              <p>
                You can control and manage cookies through your browser settings. Note that disabling
                certain cookies may affect site functionality. Most browsers allow you to view, delete,
                and block cookies from specific websites.
              </p>
            </div>
          </section>

          <Divider />

          {/* ── OUR SERVICES ── */}
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
                <div key={s.country} className="rounded-2xl p-5 border"
                  style={{ borderColor: `${s.color}25`, background: `${s.color}06` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: s.color }}/>
                    <h3 className="font-heading text-base font-bold" style={{ color: "#293533" }}>
                      {s.country}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {s.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-body"
                        style={{ color: "#576d69" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: s.color }}/>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* ── TEAM ── */}
          <section id="team" style={{ scrollMarginTop: "100px" }}>
            <SectionHeader number="5" title="Our Team" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  name: "Marco Rodriguez",
                  role: "Main Consultant",
                  bio: "Paralegal graduate in Ontario, Canada, and candidate for the P1 License with the Law Society of Ontario. Holds bachelor's degrees in Law and International Relations from Mexico. Experience as a Paralegal and Senior Case Manager in the United States, government officer in Mexico, and within a Canadian law firm.",
                },
                {
                  name: "Sidelghali Zouine",
                  role: "Legal Assistant",
                  bio: "Paralegal graduate in Canada and candidate for the P1 License with the Law Society of Ontario. Holds a Bachelor's Degree in Private Law from Morocco. Experienced as an administrative assistant and paralegal intern with strong organizational and legal support skills.",
                },
              ].map(m => (
                <div key={m.name} className="rounded-2xl p-6 border"
                  style={{ borderColor: "rgba(17,153,158,0.12)", background: "rgba(17,153,158,0.03)" }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-heading text-xl font-bold"
                      style={{ background: "linear-gradient(135deg,#11999e,#0d7a7e)" }}>
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold" style={{ color: "#293533" }}>{m.name}</h3>
                      <p className="text-sm font-body font-medium" style={{ color: "#11999e" }}>{m.role}</p>
                    </div>
                  </div>
                  <p className="text-sm font-body leading-relaxed" style={{ color: "#576d69" }}>{m.bio}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Contact footer */}
        <div className="mt-12 rounded-2xl p-6 text-center"
          style={{ background: "rgba(17,153,158,0.06)", border: "1px solid rgba(17,153,158,0.15)" }}>
          <p className="font-body text-sm" style={{ color: "#293533" }}>
            Questions about our legal documents?{" "}
            <a href="mailto:consultoriamigrante23@gmail.com?subject=Legal Inquiry"
              style={{ color: "#11999e", fontWeight: 600, textDecoration: "none" }}>
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
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-body font-bold text-sm flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#11999e,#0d7a7e)" }}>
        {number}
      </div>
      <h2 className="font-heading text-2xl font-bold" style={{ color: "#293533" }}>{title}</h2>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(17,153,158,0.2),transparent)" }}/>
  );
}