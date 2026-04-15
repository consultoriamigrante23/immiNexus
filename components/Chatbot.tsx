"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

type Message = { role: "bot" | "user"; text: string };

const KB: { triggers: string[]; answer: Record<"en" | "es" | "fr", string> }[] = [
  {
    triggers: ["hello","hi","hola","bonjour","hey","good morning","good evening","greetings","salut"],
    answer: {
      en: "Hello! Welcome to ImmiNexus Consultants. I can help you with immigration services for Mexico, the United States, and Canada. What would you like to know?",
      es: "Hola! Bienvenido a ImmiNexus Consultants. Puedo ayudarte con servicios de inmigración para México, Estados Unidos y Canadá. En qué puedo ayudarte?",
      fr: "Bonjour! Bienvenue chez ImmiNexus Consultants. Je peux vous aider avec les services d'immigration pour le Mexique, les États-Unis et le Canada. Comment puis-je vous aider?",
    },
  },
  {
    triggers: ["mexico","mexican","visitor visa mexico","non-lucrative","temporary residence","permanent residence mexico","digital nomad mexico","passport","immigration mexico","work permit mexico","study mexico","family visa mexico","INM","residencia","residencia temporal","residencia permanente"],
    answer: {
      en: "For Mexico, ImmiNexus offers the following services:\n\nVisitor visa / Non-lucrative (tourism, business visitor, transit)\nTemporary Residence (Work, Family, Study, Digital Nomad, and more)\nPermanent Residence\nVisa requests outside Mexico\nPermits at the National Institute of Migration (INM)\nPassport services",
      es: "Para México, ImmiNexus ofrece los siguientes servicios:\n\nVisa de visitante / No lucrativa (turismo, visitante de negocios, tránsito)\nResidencia Temporal (Trabajo, Familia, Estudios, Nómada Digital, etc.)\nResidencia Permanente\nSolicitudes de visa fuera de México\nTrámites en el Instituto Nacional de Migración (INM)\nServicios de Pasaporte",
      fr: "Pour le Mexique, ImmiNexus propose les services suivants:\n\nVisa visiteur / Non lucratif (tourisme, visiteur d'affaires, transit)\nRésidence Temporaire (Travail, Famille, Études, Nomade Digital, etc.)\nRésidence Permanente\nDemandes de visa hors du Mexique\nPermis à l'Institut National de Migration (INM)\nServices de passeport",
    },
  },
  {
    triggers: ["usa","united states","b1","b2","visa b1","visa b2","business visa usa","tourist visa usa","american visa","us visa"],
    answer: {
      en: "For the United States, ImmiNexus handles:\n\nVisa B1 – Business visitor (meetings, conferences, negotiations)\nVisa B2 – Tourism, leisure, and medical treatment\n\nThese are nonimmigrant visas for temporary stays. Contact us for personalized guidance.",
      es: "Para Estados Unidos, ImmiNexus tramita:\n\nVisa B1 – Visitante de negocios (reuniones, conferencias, negociaciones)\nVisa B2 – Turismo, ocio y tratamiento médico\n\nSon visas de no inmigrante para estancias temporales. Contáctenos para orientación personalizada.",
      fr: "Pour les États-Unis, ImmiNexus traite:\n\nVisa B1 – Visiteur d'affaires (réunions, conférences, négociations)\nVisa B2 – Tourisme, loisirs et traitement médical\n\nCe sont des visas de non-immigrant pour des séjours temporaires. Contactez-nous pour des conseils personnalisés.",
    },
  },
  {
    triggers: ["canada","canadian","visitor visa canada","eta","electronic travel","canada tourism","canada business","transit canada"],
    answer: {
      en: "For Canada, ImmiNexus offers:\n\nVisitor Visa (family visits, transit, tourism, business)\nElectronic Travel Authorization (eTA) – required for visa-exempt nationals flying to Canada\n\nContact us and we will assess your situation.",
      es: "Para Canadá, ImmiNexus ofrece:\n\nVisa de visitante (visitas familiares, tránsito, turismo, negocios)\nAutorización Electrónica de Viaje (eTA) – requerida para nacionales exentos de visa que vuelan a Canadá\n\nContáctanos y evaluaremos tu situación.",
      fr: "Pour le Canada, ImmiNexus propose:\n\nVisa visiteur (visites familiales, transit, tourisme, affaires)\nAutorisation de Voyage Électronique (AVE) – requise pour les ressortissants exemptés de visa voyageant au Canada\n\nContactez-nous et nous évaluerons votre situation.",
    },
  },
  {
    triggers: ["other countries","other visa","schengen","europe","uk","short term","long term","transit visa","business visa other"],
    answer: {
      en: "For other countries, ImmiNexus assists with:\n\nVisitor visas – short and long term\nTransit visas\nBusiness visas\nAnd more based on your destination\n\nContact us to discuss your specific situation.",
      es: "Para otros países, ImmiNexus ayuda con:\n\nVisas de visitante – corta y larga estancia\nVisas de tránsito\nVisas de negocios\nY más según tu destino\n\nContáctanos para discutir tu situación específica.",
      fr: "Pour d'autres pays, ImmiNexus aide avec:\n\nVisas visiteur – court et long séjour\nVisas de transit\nVisas d'affaires\nEt plus selon votre destination\n\nContactez-nous pour discuter de votre situation spécifique.",
    },
  },
  {
    triggers: ["consultant","who","marco","marco rodriguez","sidelghali","team","about","paralegal","law society","ontario"],
    answer: {
      en: "ImmiNexus is led by:\n\nMarco Rodriguez – Main Consultant\nParalegal graduate in Ontario, Canada and P1 License candidate with the Law Society of Ontario. Holds degrees in Law and International Relations from Mexico. Experience as Paralegal and Senior Case Manager in the US, government officer in Mexico, and within a Canadian law firm.\n\nSidelghali Zouine – Legal Assistant\nParalegal graduate in Canada and P1 License candidate with the Law Society of Ontario. Bachelor's in Private Law from Morocco. Experienced in administrative and paralegal support.",
      es: "ImmiNexus está liderado por:\n\nMarco Rodriguez – Consultor Principal\nGraduado en Paralegal en Ontario, Canadá y candidato a la Licencia P1 con el Colegio de Abogados de Ontario. Licenciado en Derecho y Relaciones Internacionales de México.\n\nSidelghali Zouine – Asistente Legal\nGraduado en Paralegal en Canadá y candidato a la Licencia P1. Licenciado en Derecho Privado de Marruecos.",
      fr: "ImmiNexus est dirigé par:\n\nMarco Rodriguez – Consultant Principal\nDiplômé parajuriste en Ontario, Canada et candidat à la Licence P1 auprès du Barreau de l'Ontario. Diplômé en Droit et Relations Internationales du Mexique.\n\nSidelghali Zouine – Assistant Juridique\nDiplômé parajuriste au Canada et candidat à la Licence P1. Licence en Droit Privé du Maroc.",
    },
  },
  {
    triggers: ["book","consultation","appointment","schedule","meeting","reservar","réserver","free consultation","consulta"],
    answer: {
      en: "To book a free consultation:\n\n1. Click the Book Consultation button in the top navigation bar\n2. Select your preferred date and time (Ottawa EST, Mon–Sat, 9AM–9PM)\n3. Fill in your details and service needed\n4. You will receive a confirmation email with a PDF receipt and your Tracking ID",
      es: "Para reservar una consulta gratuita:\n\n1. Haz clic en Reservar Consulta en la barra de navegación\n2. Selecciona tu fecha y hora preferida (Ottawa EST, Lun–Sáb, 9AM–9PM)\n3. Completa tus datos y el servicio requerido\n4. Recibirás un email de confirmación con PDF y tu ID de seguimiento",
      fr: "Pour réserver une consultation gratuite:\n\n1. Cliquez sur Réserver une Consultation dans la barre de navigation\n2. Sélectionnez votre date et heure préférées (Ottawa EST, Lun–Sam, 9h–21h)\n3. Remplissez vos coordonnées et le service souhaité\n4. Vous recevrez un email de confirmation avec un PDF et votre ID de suivi",
    },
  },
  {
    triggers: ["tracking","track","check booking","modify booking","booking status","tracking id"],
    answer: {
      en: "To check or modify your booking:\n\n1. Click the Book Consultation button\n2. Select the Track or Modify tab\n3. Enter your Tracking ID from your confirmation email PDF\n\nYou can modify your appointment date and time and a new PDF confirmation will be sent to your email.",
      es: "Para verificar o modificar tu reserva:\n\n1. Haz clic en Reservar Consulta\n2. Selecciona la pestaña Seguimiento o Modificar\n3. Ingresa tu ID de seguimiento del PDF en tu email\n\nPuedes modificar la fecha y hora y se enviará un nuevo PDF de confirmación.",
      fr: "Pour vérifier ou modifier votre réservation:\n\n1. Cliquez sur Réserver une Consultation\n2. Sélectionnez l'onglet Suivre ou Modifier\n3. Entrez votre ID de suivi depuis le PDF dans votre email\n\nVous pouvez modifier la date et l'heure et un nouveau PDF sera envoyé.",
    },
  },
  {
    triggers: ["contact","email","phone","whatsapp","reach","call","instagram","facebook","linkedin"],
    answer: {
      en: "You can reach ImmiNexus through:\n\nEmail: consultoriamigrante23@gmail.com\nWhatsApp: +52 55 3163-0202\nInstagram: @imminexusconsultants\nFacebook: ImmiNexus Consultants\nLinkedIn: ImmiNexus Consultants\n\nWe respond within 24 hours.",
      es: "Puedes contactar a ImmiNexus a través de:\n\nEmail: consultoriamigrante23@gmail.com\nWhatsApp: +52 55 3163-0202\nInstagram: @imminexusconsultants\nFacebook: ImmiNexus Consultants\nLinkedIn: ImmiNexus Consultants\n\nRespondemos en menos de 24 horas.",
      fr: "Vous pouvez contacter ImmiNexus via:\n\nEmail: consultoriamigrante23@gmail.com\nWhatsApp: +52 55 3163-0202\nInstagram: @imminexusconsultants\nFacebook: ImmiNexus Consultants\nLinkedIn: ImmiNexus Consultants\n\nNous répondons sous 24 heures.",
    },
  },
  {
    triggers: ["privacy","data","personal data","arco","confidential","information"],
    answer: {
      en: "ImmiNexus is responsible for processing your personal data under Mexican law. Your data is used to contact you and carry out agreed-upon immigration processes.\n\nYou have ARCO rights: Access, Rectification, Cancellation, and Objection.\nTo exercise these rights: consultoriamigrante23@gmail.com",
      es: "ImmiNexus es responsable del tratamiento de tus datos personales bajo la ley mexicana. Tus datos se utilizan para contactarte y realizar los trámites acordados.\n\nTienes derechos ARCO: Acceso, Rectificación, Cancelación y Oposición.\nPara ejercerlos: consultoriamigrante23@gmail.com",
      fr: "ImmiNexus est responsable du traitement de vos données personnelles selon la loi mexicaine. Vos données sont utilisées pour vous contacter et effectuer les démarches convenues.\n\nVous avez des droits ARCO: Accès, Rectification, Annulation et Opposition.\nPour les exercer: consultoriamigrante23@gmail.com",
    },
  },
  {
    triggers: ["price","cost","fee","how much","pricing","tariff","charge","payment","refund"],
    answer: {
      en: "Fees at ImmiNexus are established individually for each case based on the type of service and complexity. All fees are agreed upon in a separate service agreement.\n\nFees are generally non-refundable unless otherwise stated.\n\nContact us for a free consultation and personalized quote:\nEmail: consultoriamigrante23@gmail.com\nWhatsApp: +52 55 3163-0202",
      es: "Los honorarios en ImmiNexus se establecen individualmente para cada caso. Se acuerdan en un contrato de servicios por separado.\n\nGeneralmente no son reembolsables a menos que el acuerdo indique lo contrario.\n\nContáctanos:\nEmail: consultoriamigrante23@gmail.com\nWhatsApp: +52 55 3163-0202",
      fr: "Les honoraires chez ImmiNexus sont établis individuellement pour chaque cas. Ils sont convenus dans un contrat de service séparé.\n\nGénéralement non remboursables sauf indication contraire.\n\nContactez-nous:\nEmail: consultoriamigrante23@gmail.com\nWhatsApp: +52 55 3163-0202",
    },
  },
  {
    triggers: ["digital nomad","nomad","remote work","work remotely","work abroad","nómada digital"],
    answer: {
      en: "Mexico offers a Digital Nomad Temporary Residency visa, ideal for remote workers wanting to live and work from Mexico. ImmiNexus can guide you through the full application process.\n\nRequirements typically include proof of income and remote employment. Contact us for details.",
      es: "México ofrece una visa de Residencia Temporal para Nómada Digital, ideal para trabajadores remotos que quieren vivir y trabajar desde México. ImmiNexus te guía en todo el proceso.\n\nLos requisitos incluyen comprobante de ingresos y empleo remoto. Contáctanos.",
      fr: "Le Mexique offre un visa de Résidence Temporaire pour Nomade Digital, idéal pour les travailleurs à distance souhaitant vivre et travailler depuis le Mexique.\n\nContactez-nous pour les détails.",
    },
  },
  {
    triggers: ["guarantee","success rate","approval","will i get","chance","probability"],
    answer: {
      en: "ImmiNexus has a 98% success rate. However, all final decisions are made by government authorities — we cannot legally guarantee approval of any application.\n\nWhat we guarantee is professional guidance, thorough document preparation, and expert support throughout your entire process.",
      es: "ImmiNexus tiene una tasa de éxito del 98%. Sin embargo, todas las decisiones finales son tomadas por las autoridades gubernamentales.\n\nGarantizamos orientación profesional, preparación exhaustiva de documentos y apoyo experto durante todo el proceso.",
      fr: "ImmiNexus a un taux de réussite de 98%. Cependant, toutes les décisions finales sont prises par les autorités gouvernementales.\n\nNous garantissons des conseils professionnels, une préparation minutieuse des documents et un soutien expert.",
    },
  },
];

function getAnswer(input: string, locale: string): string {
  const lower = input.toLowerCase();
  const lang = (["en", "es", "fr"].includes(locale) ? locale : "en") as "en" | "es" | "fr";
  for (const entry of KB) {
    if (entry.triggers.some(t => lower.includes(t))) {
      return entry.answer[lang];
    }
  }
  return {
    en: "I don't have a specific answer for that. Please contact us directly:\n\nEmail: consultoriamigrante23@gmail.com\nWhatsApp: +52 55 3163-0202",
    es: "No tengo una respuesta específica. Por favor contáctanos directamente:\n\nEmail: consultoriamigrante23@gmail.com\nWhatsApp: +52 55 3163-0202",
    fr: "Je n'ai pas de réponse spécifique. Veuillez nous contacter directement:\n\nEmail: consultoriamigrante23@gmail.com\nWhatsApp: +52 55 3163-0202",
  }[lang];
}

const QUICK_QUESTIONS = {
  en: ["Mexico services", "US Visa B1/B2", "Canada eTA", "Book consultation", "Fees & pricing", "Digital Nomad visa"],
  es: ["Servicios México", "Visa EE.UU. B1/B2", "eTA Canadá", "Reservar consulta", "Tarifas", "Visa Nómada Digital"],
  fr: ["Services Mexique", "Visa USA B1/B2", "AVE Canada", "Réserver consultation", "Tarifs", "Visa Nomade Digital"],
};

export default function Chatbot() {
  const t = useTranslations("chatbot");
  const [open,         setOpen]         = useState(false);
  const [msgs,         setMsgs]         = useState<Message[]>([]);
  const [input,        setInput]        = useState("");
  const [locale,       setLocale]       = useState("en");
  const [isTyping,     setIsTyping]     = useState(false);
  const [isListening,  setIsListening]  = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const bottomRef      = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const l = window.location.pathname.split("/")[1];
    if (["en","es","fr"].includes(l)) setLocale(l);
    setVoiceSupported(
      !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    );
  }, []);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: "bot", text: t("greeting") }]);
    }
  }, [open, msgs.length, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isTyping]);

  const send = (text?: string) => {
    const q = (text || input).trim();
    if (!q) return;
    setMsgs(prev => [...prev, { role: "user", text: q }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const answer = getAnswer(q, locale);
      setIsTyping(false);
      setMsgs(prev => [...prev, { role: "bot", text: answer }]);
    }, 600 + Math.random() * 400);
  };

  const startVoice = () => {
    if (!voiceSupported) return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognitionRef.current = recognition;
    const langMap: Record<string, string> = { en: "en-US", es: "es-MX", fr: "fr-FR" };
    recognition.lang            = langMap[locale] || "en-US";
    recognition.interimResults  = false;
    recognition.maxAlternatives = 1;
    recognition.onstart  = () => setIsListening(true);
    recognition.onend    = () => setIsListening(false);
    recognition.onerror  = () => setIsListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      send(transcript);
    };
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const lang   = locale as "en" | "es" | "fr";
  const quickQ = QUICK_QUESTIONS[lang] || QUICK_QUESTIONS.en;

  return (
    <>
      {/* Bubble — bottom-left */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#11999e,#0d7a7e)", boxShadow: "0 6px 24px rgba(17,153,158,0.5)", transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)", animation: "pulse-glow 2s ease-in-out infinite" }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.12)"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}>
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

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 left-6 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{ width: 340, maxHeight: 520, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", border: "1px solid rgba(17,153,158,0.15)", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>

          {/* Header */}
          <div className="px-4 py-3.5 flex items-center gap-3 flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#0d7a7e,#11999e)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.18)" }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/>
                <ellipse cx="10" cy="10" rx="4" ry="8" stroke="white" strokeWidth="1"/>
                <line x1="2" y1="10" x2="18" y2="10" stroke="white" strokeWidth="1"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-body font-semibold text-sm leading-none">{t("title")}</p>
              <p className="text-white/70 text-xs font-body mt-0.5 truncate">{t("subtitle")}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"/>
              <span className="text-white/70 text-xs font-body">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 200, maxHeight: 280 }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "bot" && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 mr-2 flex items-center justify-center self-end"
                    style={{ background: "linear-gradient(135deg,#11999e,#0d7a7e)" }}>
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/>
                    </svg>
                  </div>
                )}
                <div
                  className="max-w-[80%] px-3.5 py-2.5 text-xs font-body leading-relaxed whitespace-pre-line"
                  style={{
                    background: m.role === "user" ? "linear-gradient(135deg,#11999e,#0d7a7e)" : "#f0fafa",
                    color: m.role === "user" ? "white" : "var(--text-primary)",
                    borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}>
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full mr-2 flex items-center justify-center self-end flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#11999e,#0d7a7e)" }}>
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className="px-4 py-3 flex items-center gap-1"
                  style={{ background: "#f0fafa", borderRadius: "18px 18px 18px 4px" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#11999e", animation: `float ${0.6 + i * 0.15}s ease-in-out infinite ${i * 0.15}s` }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Quick chips — only before first user message */}
          {msgs.length <= 1 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <p className="text-xs font-body mb-2" style={{ color: "var(--text-soft)" }}>
                {locale === "fr" ? "Questions rapides:" : locale === "es" ? "Preguntas rápidas:" : "Quick questions:"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickQ.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="text-xs font-body px-3 py-1.5 rounded-full border transition-all hover:-translate-y-0.5"
                    style={{ borderColor: "rgba(17,153,158,0.25)", color: "var(--brand)", background: "rgba(17,153,158,0.05)" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--brand)"; el.style.color = "white"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(17,153,158,0.05)"; el.style.color = "var(--brand)"; }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t flex gap-2 flex-shrink-0" style={{ borderColor: "rgba(17,153,158,0.1)" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder={t("placeholder")}
              className="flex-1 text-xs font-body rounded-xl px-3.5 py-2.5 focus:outline-none transition-all"
              style={{ background: "#f0fafa", border: "1.5px solid rgba(17,153,158,0.15)", color: "var(--text-primary)" }}
            />

            {voiceSupported && (
              <button
                onClick={isListening ? stopVoice : startVoice}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                style={{ background: isListening ? "#ef4444" : "rgba(17,153,158,0.08)", border: `1.5px solid ${isListening ? "#ef4444" : "rgba(17,153,158,0.2)"}`, animation: isListening ? "pulse-glow 1s ease-in-out infinite" : "none" }}
                title={isListening ? "Stop" : "Speak"}>
                {isListening ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                    <rect x="6" y="6" width="12" height="12" rx="2"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                )}
              </button>
            )}

            <button onClick={() => send()}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#11999e,#0d7a7e)", boxShadow: "0 2px 8px rgba(17,153,158,0.3)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>

          {isListening && (
            <div className="px-4 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                <p className="text-xs font-body" style={{ color: "#ef4444" }}>
                  {locale === "fr" ? "Enregistrement..." : locale === "es" ? "Grabando..." : "Recording..."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}