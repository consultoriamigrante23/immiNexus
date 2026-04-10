"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

type Message = { role:"bot"|"user"; text:string; };

// ── Full knowledge base with real ImmiNexus services ──
const KB: { triggers: string[]; answer: Record<"en"|"es"|"fr", string> }[] = [
  {
    triggers:["hello","hi","hola","bonjour","hey","good morning","good evening","greetings","salut"],
    answer:{
      en:"Hello! Welcome to ImmiNexus Consultants. I can help you with immigration services for Mexico, the United States, and Canada. What would you like to know?",
      es:"¡Hola! Bienvenido a ImmiNexus Consultants. Puedo ayudarte con servicios de inmigración para México, Estados Unidos y Canadá. ¿En qué puedo ayudarte?",
      fr:"Bonjour! Bienvenue chez ImmiNexus Consultants. Je peux vous aider avec les services d'immigration pour le Mexique, les États-Unis et le Canada. Comment puis-je vous aider?",
    }
  },
  {
    triggers:["mexico","mexican","mexican visa","visitor visa mexico","non-lucrative","temporary residence","permanent residence mexico","digital nomad","digital nomad mexico","passport","immigration mexico","work permit mexico","study mexico","family visa mexico","migration institute","INM","residencia","residencia temporal","residencia permanente"],
    answer:{
      en:"For Mexico, ImmiNexus offers:\n• Visitor visa / Non-lucrative (tourism, business visitor, transit)\n• Temporary Residence (Work, Family, Study, Digital Nomad, and more)\n• Permanent Residence\n• Visa requests outside Mexico\n• Permits at the National Institute of Migration (INM)\n• Passport services\n\nWould you like to book a free consultation?",
      es:"Para México, ImmiNexus ofrece:\n• Visa de visitante / No lucrativa (turismo, visitante de negocios, tránsito)\n• Residencia Temporal (Trabajo, Familia, Estudios, Nómada Digital, etc.)\n• Residencia Permanente\n• Solicitudes de visa fuera de México\n• Trámites en el Instituto Nacional de Migración (INM)\n• Servicios de Pasaporte\n\n¿Desea reservar una consulta gratuita?",
      fr:"Pour le Mexique, ImmiNexus propose:\n• Visa visiteur / Non lucratif (tourisme, visiteur d'affaires, transit)\n• Résidence Temporaire (Travail, Famille, Études, Nomade Digital, etc.)\n• Résidence Permanente\n• Demandes de visa hors du Mexique\n• Permis à l'Institut National de Migration (INM)\n• Services de passeport\n\nSouhaitez-vous réserver une consultation gratuite?",
    }
  },
  {
    triggers:["usa","united states","b1","b2","visa b1","visa b2","business visa usa","tourist visa usa","american visa","us visa"],
    answer:{
      en:"For the United States, ImmiNexus handles:\n• Visa B1 – Business visitor (meetings, conferences, negotiations)\n• Visa B2 – Tourism, leisure, and medical treatment\n\nThese are nonimmigrant visas for temporary stays. Book a consultation for personalized guidance.",
      es:"Para Estados Unidos, ImmiNexus tramita:\n• Visa B1 – Visitante de negocios (reuniones, conferencias, negociaciones)\n• Visa B2 – Turismo, ocio y tratamiento médico\n\nSon visas de no inmigrante para estancias temporales. Reserve una consulta para orientación personalizada.",
      fr:"Pour les États-Unis, ImmiNexus traite:\n• Visa B1 – Visiteur d'affaires (réunions, conférences, négociations)\n• Visa B2 – Tourisme, loisirs et traitement médical\n\nCe sont des visas de non-immigrant pour des séjours temporaires. Réservez une consultation pour des conseils personnalisés.",
    }
  },
  {
    triggers:["canada","canadian","visitor visa canada","eta","electronic travel","super visa","canada tourism","canada business","transit canada"],
    answer:{
      en:"For Canada, ImmiNexus offers:\n• Visitor Visa (family visits, transit, tourism, business)\n• Electronic Travel Authorization (eTA) – required for visa-exempt nationals flying to Canada\n\nNot sure which one you need? Book a free consultation and we'll assess your situation.",
      es:"Para Canadá, ImmiNexus ofrece:\n• Visa de visitante (visitas familiares, tránsito, turismo, negocios)\n• Autorización Electrónica de Viaje (eTA) – requerida para nacionales exentos de visa que vuelan a Canadá\n\n¿No sabes cuál necesitas? Reserva una consulta gratuita.",
      fr:"Pour le Canada, ImmiNexus propose:\n• Visa visiteur (visites familiales, transit, tourisme, affaires)\n• Autorisation de Voyage Électronique (AVE) – requise pour les ressortissants exemptés de visa voyageant au Canada\n\nNe savez pas lequel vous avez besoin? Réservez une consultation gratuite.",
    }
  },
  {
    triggers:["other countries","other","other visa","schengen","europe","uk","india","short term","long term","transit visa","business visa other"],
    answer:{
      en:"For other countries, ImmiNexus assists with:\n• Visitor visas – short and long term\n• Transit visas\n• Business visas\n• And more based on your destination\n\nContact us to discuss your specific situation.",
      es:"Para otros países, ImmiNexus ayuda con:\n• Visas de visitante – corta y larga estancia\n• Visas de tránsito\n• Visas de negocios\n• Y más según tu destino\n\nContáctanos para discutir tu situación específica.",
      fr:"Pour d'autres pays, ImmiNexus aide avec:\n• Visas visiteur – court et long séjour\n• Visas de transit\n• Visas d'affaires\n• Et plus selon votre destination\n\nContactez-nous pour discuter de votre situation spécifique.",
    }
  },
  {
    triggers:["consultant","who","marco","marco rodriguez","sidelghali","team","about","paralegal","law society","ontario"],
    answer:{
      en:"ImmiNexus is led by:\n\n👤 Marco Rodriguez – Main Consultant\nParalegal graduate in Ontario, Canada and P1 License candidate with the Law Society of Ontario. Holds degrees in Law and International Relations from Mexico. Experience as Paralegal and Senior Case Manager in the US, government officer in Mexico, and within a Canadian law firm.\n\n👤 Sidelghali Zouine – Legal Assistant\nParalegal graduate in Canada and P1 License candidate with the Law Society of Ontario. Bachelor's in Private Law from Morocco. Experienced in administrative and paralegal support.",
      es:"ImmiNexus está liderado por:\n\n👤 Marco Rodriguez – Consultor Principal\nGraduado en Paralegal en Ontario, Canadá y candidato a la Licencia P1 con el Colegio de Abogados de Ontario. Licenciado en Derecho y Relaciones Internacionales de México. Experiencia como Paralegal y Gerente de Casos en EE.UU.\n\n👤 Sidelghali Zouine – Asistente Legal\nGraduado en Paralegal en Canadá y candidato a la Licencia P1. Licenciado en Derecho Privado de Marruecos.",
      fr:"ImmiNexus est dirigé par:\n\n👤 Marco Rodriguez – Consultant Principal\nDiplômé parajuriste en Ontario, Canada et candidat à la Licence P1 auprès du Barreau de l'Ontario. Diplômé en Droit et Relations Internationales du Mexique.\n\n👤 Sidelghali Zouine – Assistant Juridique\nDiplômé parajuriste au Canada et candidat à la Licence P1. Licence en Droit Privé du Maroc.",
    }
  },
  {
    triggers:["book","consultation","appointment","schedule","meeting","reservar","réserver","free","free consultation","consulta"],
    answer:{
      en:"To book a free consultation:\n1. Click the 'Book Consultation' button in the top navigation bar\n2. Select your preferred date and time (Ottawa EST, Mon–Sat, 9AM–9PM)\n3. Fill in your details and service needed\n4. You'll receive a confirmation email with a PDF receipt and your Tracking ID\n\nYou can also reach us on WhatsApp: +52 55 3163-0202",
      es:"Para reservar una consulta gratuita:\n1. Haz clic en 'Reservar Consulta' en la barra de navegación\n2. Selecciona tu fecha y hora preferida (Ottawa EST, Lun–Sáb, 9AM–9PM)\n3. Completa tus datos y el servicio requerido\n4. Recibirás un email de confirmación con PDF y tu ID de seguimiento\n\nTambién puedes contactarnos por WhatsApp: +52 55 3163-0202",
      fr:"Pour réserver une consultation gratuite:\n1. Cliquez sur 'Réserver une Consultation' dans la barre de navigation\n2. Sélectionnez votre date et heure préférées (Ottawa EST, Lun–Sam, 9h–21h)\n3. Remplissez vos coordonnées et le service souhaité\n4. Vous recevrez un email de confirmation avec un PDF et votre ID de suivi\n\nVous pouvez aussi nous contacter sur WhatsApp: +52 55 3163-0202",
    }
  },
  {
    triggers:["tracking","track","check booking","modify booking","booking status","id","tracking id"],
    answer:{
      en:"To check or modify your booking:\n1. Click 'Book Consultation' button\n2. Select the 'Track' or 'Modify' tab\n3. Enter your Tracking ID (from your confirmation email PDF)\n\nYou can modify your appointment date/time and a new PDF confirmation will be sent to your email.",
      es:"Para verificar o modificar tu reserva:\n1. Haz clic en 'Reservar Consulta'\n2. Selecciona la pestaña 'Seguimiento' o 'Modificar'\n3. Ingresa tu ID de seguimiento (del PDF en tu email de confirmación)\n\nPuedes modificar la fecha/hora y se enviará un nuevo PDF de confirmación.",
      fr:"Pour vérifier ou modifier votre réservation:\n1. Cliquez sur 'Réserver une Consultation'\n2. Sélectionnez l'onglet 'Suivre' ou 'Modifier'\n3. Entrez votre ID de suivi (depuis le PDF dans votre email de confirmation)\n\nVous pouvez modifier la date/heure et un nouveau PDF sera envoyé.",
    }
  },
  {
    triggers:["contact","email","phone","whatsapp","reach","call","instagram","facebook","linkedin"],
    answer:{
      en:"You can reach ImmiNexus through:\n📧 Email: consultoriamigrante23@gmail.com\n📱 WhatsApp: +52 55 3163-0202\n📸 Instagram: @imminexusconsultants\n👥 Facebook: ImmiNexus Consultants\n💼 LinkedIn: ImmiNexus Consultants\n\nWe respond within 24 hours.",
      es:"Puedes contactar a ImmiNexus a través de:\n📧 Email: consultoriamigrante23@gmail.com\n📱 WhatsApp: +52 55 3163-0202\n📸 Instagram: @imminexusconsultants\n👥 Facebook: ImmiNexus Consultants\n💼 LinkedIn: ImmiNexus Consultants\n\nRespondemos en menos de 24 horas.",
      fr:"Vous pouvez contacter ImmiNexus via:\n📧 Email: consultoriamigrante23@gmail.com\n📱 WhatsApp: +52 55 3163-0202\n📸 Instagram: @imminexusconsultants\n👥 Facebook: ImmiNexus Consultants\n💼 LinkedIn: ImmiNexus Consultants\n\nNous répondons sous 24 heures.",
    }
  },
  {
    triggers:["privacy","data","personal data","arco","confidential","gdpr","information"],
    answer:{
      en:"ImmiNexus is responsible for processing your personal data under Mexican law. Your data is used to contact you and carry out agreed-upon immigration processes.\n\nYou have ARCO rights: Access, Rectification, Cancellation, and Objection. To exercise these rights, email: consultoriamigrante23@gmail.com",
      es:"ImmiNexus es responsable del tratamiento de tus datos personales bajo la ley mexicana. Tus datos se utilizan para contactarte y realizar los trámites acordados.\n\nTienes derechos ARCO: Acceso, Rectificación, Cancelación y Oposición. Para ejercerlos: consultoriamigrante23@gmail.com",
      fr:"ImmiNexus est responsable du traitement de vos données personnelles selon la loi mexicaine. Vos données sont utilisées pour vous contacter et effectuer les démarches convenues.\n\nVous avez des droits ARCO: Accès, Rectification, Annulation et Opposition. Pour les exercer: consultoriamigrante23@gmail.com",
    }
  },
  {
    triggers:["price","cost","fee","how much","pricing","tariff","charge","payment","refund"],
    answer:{
      en:"Fees at ImmiNexus are established individually for each case based on the type of service and complexity. All fees are agreed upon in a separate service agreement.\n\nNote: Fees are generally non-refundable unless otherwise stated in the agreement.\n\nContact us for a free consultation and personalized quote: consultoriamigrante23@gmail.com or WhatsApp: +52 55 3163-0202",
      es:"Los honorarios en ImmiNexus se establecen individualmente para cada caso según el tipo de servicio y complejidad. Todos los honorarios se acuerdan en un contrato de servicios por separado.\n\nNota: Los honorarios generalmente no son reembolsables a menos que el acuerdo indique lo contrario.\n\nContáctanos para una consulta gratuita: consultoriamigrante23@gmail.com",
      fr:"Les honoraires chez ImmiNexus sont établis individuellement pour chaque cas selon le type de service et la complexité. Tous les honoraires sont convenus dans un contrat de service séparé.\n\nNote: Les honoraires sont généralement non remboursables sauf indication contraire dans l'accord.\n\nContactez-nous pour une consultation gratuite: consultoriamigrante23@gmail.com",
    }
  },
  {
    triggers:["digital nomad","nomad","remote work","work remotely","work abroad","nómada digital"],
    answer:{
      en:"Mexico offers a Digital Nomad Temporary Residency visa, perfect for remote workers wanting to live and work from Mexico. ImmiNexus can guide you through the full application process.\n\nRequirements typically include proof of income and remote employment. Book a free consultation for details.",
      es:"México ofrece una visa de Residencia Temporal para Nómada Digital, perfecta para trabajadores remotos que quieren vivir y trabajar desde México. ImmiNexus te guía en todo el proceso.\n\nLos requisitos generalmente incluyen comprobante de ingresos y empleo remoto. Reserva una consulta gratuita.",
      fr:"Le Mexique offre un visa de Résidence Temporaire pour Nomade Digital, parfait pour les travailleurs à distance souhaitant vivre et travailler depuis le Mexique. ImmiNexus vous guide tout au long du processus.\n\nRéservez une consultation gratuite pour les détails.",
    }
  },
  {
    triggers:["guarantee","success rate","approval","will i get","chance","probability"],
    answer:{
      en:"ImmiNexus has a 98% success rate across cases. However, all final decisions are made by government authorities — we cannot legally guarantee approval of any application.\n\nWhat we do guarantee is professional guidance, thorough document preparation, and expert support throughout your entire process.",
      es:"ImmiNexus tiene una tasa de éxito del 98% en sus casos. Sin embargo, todas las decisiones finales son tomadas por las autoridades gubernamentales — no podemos garantizar legalmente la aprobación de ninguna solicitud.\n\nLo que sí garantizamos es orientación profesional, preparación exhaustiva de documentos y apoyo experto durante todo el proceso.",
      fr:"ImmiNexus a un taux de réussite de 98% sur ses dossiers. Cependant, toutes les décisions finales sont prises par les autorités gouvernementales — nous ne pouvons légalement garantir l'approbation d'aucune demande.\n\nCe que nous garantissons: des conseils professionnels, une préparation minutieuse des documents et un soutien expert tout au long de votre processus.",
    }
  },
];

function getAnswer(input: string, locale: string): string {
  const lower = input.toLowerCase();
  const lang = (["en","es","fr"].includes(locale) ? locale : "en") as "en"|"es"|"fr";
  for (const entry of KB) {
    if (entry.triggers.some(t => lower.includes(t))) {
      return entry.answer[lang];
    }
  }
  return {
    en: "I don't have a specific answer for that. Please contact us directly:\n📧 consultoriamigrante23@gmail.com\n📱 WhatsApp: +52 55 3163-0202\n\nOr book a free consultation — our experts will be happy to help!",
    es: "No tengo una respuesta específica para eso. Por favor contáctanos directamente:\n📧 consultoriamigrante23@gmail.com\n📱 WhatsApp: +52 55 3163-0202\n\n¡O reserva una consulta gratuita!",
    fr: "Je n'ai pas de réponse spécifique à cela. Veuillez nous contacter directement:\n📧 consultoriamigrante23@gmail.com\n📱 WhatsApp: +52 55 3163-0202\n\nOu réservez une consultation gratuite!",
  }[lang];
}

const QUICK_QUESTIONS = {
  en: ["Mexico services", "US Visa B1/B2", "Canada eTA", "Book consultation", "Fees & pricing", "Digital Nomad visa"],
  es: ["Servicios México", "Visa EE.UU. B1/B2", "eTA Canadá", "Reservar consulta", "Tarifas", "Visa Nómada Digital"],
  fr: ["Services Mexique", "Visa USA B1/B2", "AVE Canada", "Réserver consultation", "Tarifs", "Visa Nomade Digital"],
};

export default function Chatbot() {
  const t = useTranslations("chatbot");
  const [open,    setOpen]    = useState(false);
  const [msgs,    setMsgs]    = useState<Message[]>([]);
  const [input,   setInput]   = useState("");
  const [locale,  setLocale]  = useState("en");
  const [isTyping,setIsTyping]= useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const l = window.location.pathname.split("/")[1];
    if (["en","es","fr"].includes(l)) setLocale(l);
    // Check voice support — cast to any to avoid TS DOM type mismatch
    setVoiceSupported(!!(( window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
  }, []);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role:"bot", text:t("greeting") }]);
    }
  }, [open, msgs.length, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs, isTyping]);

  const send = (text?: string) => {
    const q = (text || input).trim();
    if (!q) return;
    const newMsgs: Message[] = [...msgs, { role:"user", text:q }];
    setMsgs(newMsgs);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const answer = getAnswer(q, locale);
      setIsTyping(false);
      setMsgs(prev => [...prev, { role:"bot", text:answer }]);
    }, 700 + Math.random() * 400);
  };

  const startVoice = () => {
    if (!voiceSupported) return;
    // Cast to any to avoid TS DOM type mismatch for SpeechRecognition
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognitionRef.current = recognition;
    const langMap: Record<string,string> = { en:"en-US", es:"es-MX", fr:"fr-FR" };
    recognition.lang = langMap[locale] || "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onend   = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
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

  const lang = locale as "en"|"es"|"fr";
  const quickQ = QUICK_QUESTIONS[lang] || QUICK_QUESTIONS.en;

  return (
    <>
      {/* Bubble button — bottom LEFT */}
      <button onClick={()=>setOpen(!open)} aria-label="Open chat"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
        style={{ background:"linear-gradient(135deg,#11999e,#0d7a7e)", boxShadow:"0 6px 24px rgba(17,153,158,0.5)", transition:"transform 0.35s cubic-bezier(0.34,1.56,0.64,1)", animation:"pulse-glow 2s ease-in-out infinite" }}
        onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform="scale(1.12)"}
        onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform="scale(1)"}>
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
        <div className="fixed bottom-24 left-6 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{ width:340, maxHeight:520, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(20px)", border:"1px solid rgba(17,153,158,0.15)", boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>

          {/* Header */}
          <div className="px-4 py-3.5 flex items-center gap-3 flex-shrink-0"
            style={{ background:"linear-gradient(135deg,#0d7a7e,#11999e)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background:"rgba(255,255,255,0.2)" }}>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight:200, maxHeight:280 }}>
            {msgs.map((m,i) => (
              <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                {m.role==="bot" && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 mr-2 flex items-center justify-center self-end"
                    style={{ background:"linear-gradient(135deg,#11999e,#0d7a7e)", flexShrink:0 }}>
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/>
                    </svg>
                  </div>
                )}
                <div
                  className="max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs font-body leading-relaxed whitespace-pre-line"
                  style={{
                    background: m.role==="user" ? "linear-gradient(135deg,#11999e,#0d7a7e)" : "#f0fafa",
                    color: m.role==="user" ? "white" : "var(--text-primary)",
                    borderRadius: m.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full mr-2 flex items-center justify-center self-end"
                  style={{ background:"linear-gradient(135deg,#11999e,#0d7a7e)", flexShrink:0 }}>
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className="px-4 py-3 rounded-2xl flex items-center gap-1" style={{ background:"#f0fafa", borderRadius:"18px 18px 18px 4px" }}>
                  {[0,1,2].map(i=>(
                    <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background:"#11999e", animation:`float ${0.6+i*0.15}s ease-in-out infinite ${i*0.15}s` }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Quick question chips */}
          {msgs.length <= 1 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <p className="text-xs font-body mb-2" style={{ color:"var(--text-soft)" }}>Quick questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickQ.map(q => (
                  <button key={q} onClick={()=>send(q)}
                    className="text-xs font-body px-3 py-1.5 rounded-full border transition-all hover:-translate-y-0.5"
                    style={{ borderColor:"rgba(17,153,158,0.25)", color:"var(--brand)", background:"rgba(17,153,158,0.05)" }}
                    onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background="var(--brand)";el.style.color="white";}}
                    onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background="rgba(17,153,158,0.05)";el.style.color="var(--brand)";}}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="p-3 border-t flex gap-2 flex-shrink-0" style={{ borderColor:"rgba(17,153,158,0.1)" }}>
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && send()}
              placeholder={t("placeholder")}
              className="flex-1 text-xs font-body rounded-xl px-3.5 py-2.5 focus:outline-none transition-all"
              style={{ background:"#f0fafa", border:"1.5px solid rgba(17,153,158,0.15)", color:"var(--text-primary)" }}
            />

            {/* Voice button */}
            {voiceSupported && (
              <button
                onClick={isListening ? stopVoice : startVoice}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                style={{
                  background: isListening ? "#ef4444" : "rgba(17,153,158,0.08)",
                  border: `1.5px solid ${isListening ? "#ef4444" : "rgba(17,153,158,0.2)"}`,
                  animation: isListening ? "pulse-glow 1s ease-in-out infinite" : "none",
                }}
                title={isListening ? "Stop recording" : "Speak your question"}>
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

            {/* Send button */}
            <button onClick={()=>send()}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              style={{ background:"linear-gradient(135deg,#11999e,#0d7a7e)", boxShadow:"0 2px 8px rgba(17,153,158,0.3)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>

          {/* Voice indicator */}
          {isListening && (
            <div className="px-4 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)" }}>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                <p className="text-xs font-body" style={{ color:"#ef4444" }}>
                  {locale==="fr" ? "Enregistrement... parlez maintenant" : locale==="es" ? "Grabando... hable ahora" : "Recording... speak now"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}