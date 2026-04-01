"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

type Message = { role: "bot" | "user"; text: string };

const FAQ: Record<string, string[]> = {
  visa: ["what visa","which visa","visa type","type of visa","need a visa","require a visa"],
  usa: ["united states","usa","us visa","america","american","h1b","h-1b","b1","b2","f1","green card","esta"],
  canada: ["canada","canadian","express entry","ita","pr canada","study permit canada","work permit canada","lmia"],
  mexico: ["mexico","mexican","residencia","residency mexico","temporal","permanente"],
  process: ["how does it work","how long","steps","process","procedure"],
  documents: ["document","docs","what do i need","required","requirements"],
  cost: ["cost","price","fee","how much","pricing","charge"],
  contact: ["contact","reach","call","phone","email","whatsapp","talk to"],
  languages: ["language","speak","english","spanish","french","français","español"],
  consultation: ["consultation","appointment","book","schedule","meeting","reserve"],
};

const ANSWERS: Record<string, Record<"en"|"es"|"fr", string>> = {
  visa: {
    en: "We handle tourist visas (B1/B2), work visas (H1-B, L1), student visas (F1), permanent residency (Green Card), Express Entry (ITA) for Canada, and residency visas for Mexico. Which destination are you interested in?",
    es: "Gestionamos visas de turista (B1/B2), trabajo (H1-B, L1), estudiante (F1), residencia permanente (Green Card), Express Entry (ITA) para Canadá y visas de residencia para México. ¿Qué destino te interesa?",
    fr: "Nous gérons les visas touriste (B1/B2), travail (H1-B, L1), étudiant (F1), résidence permanente (Green Card), Entrée Express (ITA) pour le Canada et les visas de résidence pour le Mexique. Quelle destination vous intéresse ?",
  },
  usa: {
    en: "For the United States, we offer: Tourist/B1-B2 Visa, Work Visas (H1-B, L1), Student Visa (F1), Green Card process, and ESTA. Would you like to book a free consultation to discuss your specific case?",
    es: "Para Estados Unidos ofrecemos: Visa Turista/B1-B2, Visas de Trabajo (H1-B, L1), Visa de Estudiante (F1), proceso de Green Card y ESTA. ¿Te gustaría reservar una consulta gratuita?",
    fr: "Pour les États-Unis, nous proposons : Visa Touriste/B1-B2, Visas de Travail (H1-B, L1), Visa Étudiant (F1), processus Green Card et ESTA. Souhaitez-vous réserver une consultation gratuite ?",
  },
  canada: {
    en: "For Canada, we specialize in: Express Entry (ITA), Tourist & Super Visa, Study Permit, Work Permit (LMIA), Permanent Residency, and Family Sponsorship. Canada is one of our strongest areas. Want a consultation?",
    es: "Para Canadá nos especializamos en: Express Entry (ITA), Visa Turista y Super Visa, Permiso de Estudios, Permiso de Trabajo (LMIA), Residencia Permanente y Patrocinio Familiar. ¿Quieres una consulta?",
    fr: "Pour le Canada, nous nous spécialisons dans : Entrée Express (ITA), Visa Touriste et Super Visa, Permis d'Études, Permis de Travail (LMIA), Résidence Permanente et Parrainage Familial. Consultation ?",
  },
  mexico: {
    en: "For Mexico, we handle Temporary Residency, Permanent Residency, Work Authorization, Business Visa, and Digital Nomad Visa. Would you like more details?",
    es: "Para México gestionamos Residencia Temporal, Residencia Permanente, Autorización de Trabajo, Visa de Negocios y Visa Nómada Digital. ¿Te gustaría más detalles?",
    fr: "Pour le Mexique, nous gérons la Résidence Temporaire, la Résidence Permanente, l'Autorisation de Travail, le Visa d'Affaires et le Visa Nomade Digital. Plus de détails ?",
  },
  process: {
    en: "Our process has 4 steps: 1) Free consultation to assess your profile. 2) Document preparation with personalized checklist. 3) Application filing and coordination. 4) Follow-up until final approval. The whole thing guided by experts!",
    es: "Nuestro proceso tiene 4 pasos: 1) Consulta gratuita para evaluar tu perfil. 2) Preparación de documentos con lista personalizada. 3) Presentación y coordinación. 4) Seguimiento hasta la aprobación final.",
    fr: "Notre processus en 4 étapes : 1) Consultation gratuite pour évaluer votre profil. 2) Préparation des documents avec liste personnalisée. 3) Dépôt et coordination. 4) Suivi jusqu'à l'approbation finale.",
  },
  documents: {
    en: "Required documents vary by visa type and destination. In your free consultation, we provide a complete personalized checklist based on your specific case. Book a consultation to get yours!",
    es: "Los documentos requeridos varían según el tipo de visa y destino. En tu consulta gratuita te proporcionamos una lista personalizada. ¡Reserva tu consulta para obtener la tuya!",
    fr: "Les documents requis varient selon le type de visa et la destination. Lors de votre consultation gratuite, nous vous fournissons une liste personnalisée. Réservez votre consultation !",
  },
  cost: {
    en: "Our fees depend on the type of service and complexity of the case. We offer competitive pricing and transparent costs. Contact us at +52 55 3163-0202 for a personalized quote.",
    es: "Nuestros honorarios dependen del tipo de servicio y complejidad del caso. Ofrecemos precios competitivos y costos transparentes. Contáctanos al +52 55 3163-0202 para un presupuesto.",
    fr: "Nos honoraires dépendent du type de service et de la complexité du dossier. Nous offrons des tarifs compétitifs et transparents. Contactez-nous au +52 55 3163-0202 pour un devis.",
  },
  contact: {
    en: "You can reach us at: Phone/WhatsApp: +52 55 3163-0202 | Instagram: @imminexusconsultants | Facebook: ImmiNexus Consultants. Or book a free consultation directly on this website!",
    es: "Puedes contactarnos en: Teléfono/WhatsApp: +52 55 3163-0202 | Instagram: @imminexusconsultants | Facebook: ImmiNexus Consultants. ¡O reserva una consulta gratuita en esta web!",
    fr: "Vous pouvez nous joindre : Téléphone/WhatsApp : +52 55 3163-0202 | Instagram : @imminexusconsultants | Facebook : ImmiNexus Consultants. Ou réservez une consultation gratuite sur ce site !",
  },
  languages: {
    en: "We provide our services in English, Spanish, and French — no language barriers for our clients!",
    es: "Ofrecemos nuestros servicios en español, inglés y francés — ¡sin barreras de idioma!",
    fr: "Nous proposons nos services en français, anglais et espagnol — aucune barrière linguistique pour nos clients !",
  },
  consultation: {
    en: "You can book a free consultation by clicking the 'Book Consultation' button in the menu, or by filling out the contact form below. We'll get back to you within 24 hours!",
    es: "Puedes reservar una consulta gratuita haciendo clic en 'Reservar Consulta' en el menú, o rellenando el formulario de contacto. ¡Te respondemos en 24 horas!",
    fr: "Vous pouvez réserver une consultation gratuite en cliquant sur 'Réserver une Consultation' dans le menu, ou en remplissant le formulaire. Nous vous répondons sous 24 heures !",
  },
};

function getAnswer(input: string, locale: string): string {
  const lower = input.toLowerCase();
  const lang = (["en","es","fr"].includes(locale) ? locale : "en") as "en"|"es"|"fr";
  for (const [key, triggers] of Object.entries(FAQ)) {
    if (triggers.some(t => lower.includes(t))) return ANSWERS[key][lang];
  }
  return "";
}

export default function Chatbot() {
  const t = useTranslations("chatbot");
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const l = window.location.pathname.split("/")[1];
    if (["en","es","fr"].includes(l)) setLocale(l);
  }, []);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: "bot", text: t("greeting") }]);
    }
  }, [open, msgs.length, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = () => {
    const q = input.trim();
    if (!q) return;
    const newMsgs: Message[] = [...msgs, { role: "user", text: q }];
    setMsgs(newMsgs);
    setInput("");
    setTimeout(() => {
      const answer = getAnswer(q, locale) || t("fallback");
      setMsgs(prev => [...prev, { role: "bot", text: answer }]);
    }, 600);
  };

  return (
    <>
      {/* Bubble */}
      <button onClick={() => setOpen(!open)} aria-label="Open chat"
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ background: "#2A9D9A", boxShadow: "0 4px 20px rgba(42,157,154,0.4)" }}>
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
      </button>

      {/* Window */}
      {open && (
        <div className="fixed bottom-44 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ maxHeight: "420px" }}>
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: "#2A9D9A" }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/>
                <ellipse cx="10" cy="10" rx="4" ry="8" stroke="white" strokeWidth="1"/>
                <line x1="2" y1="10" x2="18" y2="10" stroke="white" strokeWidth="1"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-body font-semibold text-sm leading-none">{t("title")}</p>
              <p className="text-white/70 text-xs font-body mt-0.5">{t("subtitle")}</p>
            </div>
            <div className="ml-auto w-2 h-2 bg-green-300 rounded-full animate-pulse" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 200, maxHeight: 260 }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs font-body leading-relaxed ${
                  m.role === "user"
                    ? "text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-700 rounded-bl-sm"
                }`}
                  style={m.role === "user" ? { background: "#2A9D9A" } : {}}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder={t("placeholder")}
              className="flex-1 text-xs font-body border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors"
            />
            <button onClick={send}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:opacity-90 flex-shrink-0"
              style={{ background: "#2A9D9A" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}