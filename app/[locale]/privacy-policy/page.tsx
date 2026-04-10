import Footer from "@/components/Footer";

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const content = {
    en: {
      title: "Privacy Policy & Confidentiality",
      updated: "Effective as of 2024",
      back: "← Back to Home",
      intro: "ImmiNexus Consultants is responsible for the processing of the personal data you provide to us. The personal data collected, under the laws in Mexico, will be used for the following purposes: to contact you and, in the event that you engage the services of ImmiNexus Consultants, to carry out the corresponding process agreed upon between the parties.",
      arcoTitle: "Your ARCO Rights",
      arcoText: "You have the right to know what personal data we hold about you, how it is used, and the conditions under which we process it (Access). Likewise, you have the right to request the correction of your personal information if it is outdated, inaccurate, or incomplete (Rectification); to request that we delete it from our records or databases when you believe it is not being used in accordance with the principles, duties, and obligations established by law (Cancellation); and to object to the use of your personal data for specific purposes (Objection). These rights are known as ARCO rights.\n\nTo exercise any of your ARCO rights, you may submit a written request to: consultoriamigrante23@gmail.com",
      changesTitle: "Changes to the Privacy Notice",
      changesText: "We reserve the right to make modifications or updates to this Privacy Notice at any time in order to address legislative changes, internal policies, or new requirements related to the provision or offering of our services.",
      termsTitle: "Terms of Service",
      termsText: "By using the services of ImmiNexus Consultants (\"we,\" \"us\"), you agree to be bound by these Terms of Service. We provide immigration consulting and related services as agreed with each client. While we strive to offer accurate guidance and professional support, we do not guarantee the approval of any application or immigration outcome, as all decisions are made by government authorities.\n\nYou agree to:\n• Provide complete and truthful information\n• Submit required documentation in a timely manner\n• Inform us of any changes that may affect your case\n\nAll fees are established in a separate agreement and are non-refundable unless otherwise stated. Your personal information will be handled in accordance with our Privacy Notice. ImmiNexus Consultants is not liable for delays, denials, or decisions made by third parties, including immigration authorities.\n\nWe reserve the right to suspend or terminate services if these Terms are breached or payments are not made, and to update these Terms at any time.\n\nFor any questions: consultoriamigrante23@gmail.com",
      servicesTitle: "Our Services",
      services: {
        mexico: {
          title: "Mexico",
          items: [
            "Visitor visa / Non-lucrative (tourism, business visitor, transit)",
            "Temporary Visa and Residence (Work, Family, Study, Digital Nomad, etc.)",
            "Permanent Residence",
            "Visa requests outside Mexico",
            "Visa and permits requested at the National Institute of Migration",
            "Passport",
          ]
        },
        usa: {
          title: "United States",
          items: ["Visa B1", "Visa B2"]
        },
        canada: {
          title: "Canada",
          items: [
            "Visitor visa (family, transit, tourism, business)",
            "Electronic Travel Authorization (eTA)",
          ]
        },
        other: {
          title: "Other Countries",
          items: [
            "Visitor visas – short and long term",
            "Transit",
            "Business",
            "And more",
          ]
        }
      },
      teamTitle: "Who We Are",
      team: [
        {
          name: "Marco Rodriguez",
          role: "Main Consultant",
          bio: "Paralegal graduate in Ontario, Canada, and candidate for the P1 License with the Law Society of Ontario. Holds bachelor's degrees in Law and International Relations from Mexico. Brings professional experience as a Paralegal and Senior Case Manager in the United States, as well as experience as a government officer in Mexico and within a Canadian law firm. Demonstrates a strong passion for immigration law and is committed to helping individuals identify and pursue the best legal options available to them.",
        },
        {
          name: "Sidelghali Zouine",
          role: "Legal Assistant",
          bio: "Paralegal graduate in Canada and candidate for the P1 License with the Law Society of Ontario. Holds a Bachelor's Degree in Private Law from Morocco. Experienced as an administrative assistant and paralegal intern, with strong organizational and legal support skills. Committed to providing reliable assistance and dedicated to helping clients navigate their legal needs.",
        },
      ],
    },
    es: {
      title: "Política de Privacidad y Confidencialidad",
      updated: "Vigente desde 2024",
      back: "← Volver al Inicio",
      intro: "ImmiNexus Consultants es responsable del tratamiento de los datos personales que nos proporcione. Los datos personales recopilados, bajo las leyes de México, serán utilizados para los siguientes propósitos: contactarle y, en caso de que contrate los servicios de ImmiNexus Consultants, llevar a cabo el proceso correspondiente acordado entre las partes.",
      arcoTitle: "Sus Derechos ARCO",
      arcoText: "Tiene derecho a conocer qué datos personales tenemos de usted, cómo se utilizan y las condiciones bajo las cuales los procesamos (Acceso). Asimismo, tiene derecho a solicitar la corrección de su información personal si está desactualizada, inexacta o incompleta (Rectificación); a solicitar que la eliminemos de nuestros registros cuando considere que no se está utilizando de acuerdo con los principios establecidos por la ley (Cancelación); y a oponerse al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO.\n\nPara ejercer cualquiera de sus derechos ARCO, puede enviar una solicitud por escrito a: consultoriamigrante23@gmail.com",
      changesTitle: "Cambios al Aviso de Privacidad",
      changesText: "Nos reservamos el derecho de realizar modificaciones o actualizaciones a este Aviso de Privacidad en cualquier momento para atender cambios legislativos, políticas internas o nuevos requisitos relacionados con la prestación de nuestros servicios.",
      termsTitle: "Términos de Servicio",
      termsText: "Al utilizar los servicios de ImmiNexus Consultants (\"nosotros\"), acepta quedar vinculado por estos Términos de Servicio. Brindamos consultoría migratoria y servicios relacionados según lo acordado con cada cliente. Si bien nos esforzamos por ofrecer orientación precisa y apoyo profesional, no garantizamos la aprobación de ninguna solicitud o resultado migratorio, ya que todas las decisiones son tomadas por las autoridades gubernamentales.\n\nUsted acepta:\n• Proporcionar información completa y veraz\n• Presentar la documentación requerida oportunamente\n• Informarnos de cualquier cambio que pueda afectar su caso\n\nTodos los honorarios se establecen en un acuerdo por separado y generalmente no son reembolsables. Su información personal se manejará de acuerdo con nuestro Aviso de Privacidad.\n\nPara cualquier consulta: consultoriamigrante23@gmail.com",
      servicesTitle: "Nuestros Servicios",
      services: {
        mexico: { title:"México", items:["Visa de visitante / No lucrativa (turismo, visitante de negocios, tránsito)","Visa y Residencia Temporal (Trabajo, Familia, Estudios, Nómada Digital, etc.)","Residencia Permanente","Solicitudes de visa fuera de México","Trámites en el Instituto Nacional de Migración","Pasaporte"] },
        usa: { title:"Estados Unidos", items:["Visa B1","Visa B2"] },
        canada: { title:"Canadá", items:["Visa de visitante (familia, tránsito, turismo, negocios)","Autorización Electrónica de Viaje (eTA)"] },
        other: { title:"Otros Países", items:["Visas de visitante – corta y larga estancia","Tránsito","Negocios","Y más"] },
      },
      teamTitle: "Quiénes Somos",
      team: [
        { name:"Marco Rodriguez", role:"Consultor Principal", bio:"Graduado en Paralegal en Ontario, Canadá, y candidato a la Licencia P1 con el Colegio de Abogados de Ontario. Licenciado en Derecho y Relaciones Internacionales de México. Experiencia como Paralegal y Gerente de Casos en EE.UU., funcionario gubernamental en México y en un despacho legal canadiense." },
        { name:"Sidelghali Zouine", role:"Asistente Legal", bio:"Graduado en Paralegal en Canadá y candidato a la Licencia P1 con el Colegio de Abogados de Ontario. Licenciado en Derecho Privado de Marruecos. Con experiencia como asistente administrativo y pasante paralegal." },
      ],
    },
    fr: {
      title: "Politique de Confidentialité",
      updated: "En vigueur depuis 2024",
      back: "← Retour à l'Accueil",
      intro: "ImmiNexus Consultants est responsable du traitement des données personnelles que vous nous fournissez. Les données personnelles collectées, conformément aux lois mexicaines, seront utilisées aux fins suivantes: vous contacter et, si vous engagez les services d'ImmiNexus Consultants, réaliser le processus correspondant convenu entre les parties.",
      arcoTitle: "Vos Droits ARCO",
      arcoText: "Vous avez le droit de savoir quelles données personnelles nous détenons sur vous, comment elles sont utilisées et les conditions dans lesquelles nous les traitons (Accès). Vous avez également le droit de demander la correction de vos informations personnelles si elles sont obsolètes, inexactes ou incomplètes (Rectification); de demander leur suppression de nos registres (Annulation); et de vous opposer à l'utilisation de vos données personnelles à des fins spécifiques (Opposition). Ces droits sont connus sous le nom de droits ARCO.\n\nPour exercer vos droits ARCO: consultoriamigrante23@gmail.com",
      changesTitle: "Modifications de l'Avis de Confidentialité",
      changesText: "Nous nous réservons le droit d'apporter des modifications ou des mises à jour à cet Avis de Confidentialité à tout moment pour répondre aux changements législatifs, aux politiques internes ou aux nouvelles exigences liées à la prestation de nos services.",
      termsTitle: "Conditions d'Utilisation",
      termsText: "En utilisant les services d'ImmiNexus Consultants, vous acceptez d'être lié par ces Conditions. Nous fournissons des services de conseil en immigration selon les accords avec chaque client. Nous ne garantissons pas l'approbation de toute demande, car toutes les décisions sont prises par les autorités gouvernementales.\n\nVous acceptez de:\n• Fournir des informations complètes et véridiques\n• Soumettre les documents requis en temps opportun\n• Nous informer de tout changement pouvant affecter votre dossier\n\nTous les honoraires sont établis dans un accord séparé et sont généralement non remboursables.\n\nPour toute question: consultoriamigrante23@gmail.com",
      servicesTitle: "Nos Services",
      services: {
        mexico: { title:"Mexique", items:["Visa visiteur / Non lucratif (tourisme, visiteur d'affaires, transit)","Résidence Temporaire (Travail, Famille, Études, Nomade Digital, etc.)","Résidence Permanente","Demandes de visa hors du Mexique","Permis à l'Institut National de Migration","Passeport"] },
        usa: { title:"États-Unis", items:["Visa B1","Visa B2"] },
        canada: { title:"Canada", items:["Visa visiteur (famille, transit, tourisme, affaires)","Autorisation de Voyage Électronique (AVE)"] },
        other: { title:"Autres Pays", items:["Visas visiteur – court et long séjour","Transit","Affaires","Et plus"] },
      },
      teamTitle: "Qui Sommes-Nous",
      team: [
        { name:"Marco Rodriguez", role:"Consultant Principal", bio:"Diplômé parajuriste en Ontario, Canada, et candidat à la Licence P1 auprès du Barreau de l'Ontario. Licencié en Droit et Relations Internationales du Mexique. Expérience en tant que Parajuriste et Gestionnaire de Dossiers aux États-Unis, fonctionnaire au Mexique et au sein d'un cabinet juridique canadien." },
        { name:"Sidelghali Zouine", role:"Assistant Juridique", bio:"Diplômé parajuriste au Canada et candidat à la Licence P1. Licence en Droit Privé du Maroc. Expérimenté en tant qu'assistant administratif et stagiaire parajuriste." },
      ],
    },
  };

  const c = content[locale as keyof typeof content] ?? content.en;
  const serviceKeys = ["mexico","usa","canada","other"] as const;
  const accentColors = { mexico:"#22C55E", usa:"#3B82F6", canada:"#EF4444", other:"#F59E0B" };

  return (
    <>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4"
        style={{ background:"rgba(255,255,255,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(17,153,158,0.1)", boxShadow:"0 2px 16px rgba(0,0,0,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href={`/${locale}`} className="flex items-center gap-3" style={{ textDecoration:"none" }}>
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor:"#11999e" }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="#11999e" strokeWidth="1.5"/>
                <ellipse cx="10" cy="10" rx="4" ry="8" stroke="#11999e" strokeWidth="1"/>
                <line x1="2" y1="10" x2="18" y2="10" stroke="#11999e" strokeWidth="1"/>
              </svg>
            </div>
            <div>
              <div className="font-heading text-sm font-bold leading-none" style={{ color:"#293533" }}>ImmiNexus</div>
              <div className="text-[9px] tracking-widest uppercase font-body" style={{ color:"#11999e" }}>Consultants</div>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-5">
            {[
              { label: locale==="fr"?"Services":locale==="es"?"Servicios":"Services", href:`/${locale}#services` },
              { label: locale==="fr"?"Pourquoi Nous":locale==="es"?"Por Qué Nosotros":"Why Us", href:`/${locale}#why-us` },
              { label: locale==="fr"?"Contact":locale==="es"?"Contacto":"Contact", href:`/${locale}#contact` },
            ].map(l => (
              <a key={l.href} href={l.href} className="text-sm font-body font-medium transition-colors hover:text-teal-600"
                style={{ color:"#40514e", textDecoration:"none" }}>{l.label}</a>
            ))}
          </div>
          <a href={`/${locale}`} className="text-sm font-body font-medium transition-colors"
            style={{ color:"#11999e", textDecoration:"none" }}>{c.back}</a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-20">

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3" style={{ color:"#293533" }}>{c.title}</h1>
          <p className="text-sm font-body" style={{ color:"#9ca3af" }}>{c.updated}</p>
          <div className="w-16 h-1 rounded mt-4" style={{ background:"linear-gradient(90deg,#11999e,#16c6cc)" }}/>
        </div>

        {/* Services section */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold mb-6" style={{ color:"#293533" }}>{c.servicesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {serviceKeys.map(key => {
              const svc = c.services[key];
              return (
                <div key={key} className="rounded-2xl p-5 border"
                  style={{ borderColor:`${accentColors[key]}20`, background:`${accentColors[key]}06` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background:accentColors[key] }}/>
                    <h3 className="font-heading text-lg font-bold" style={{ color:"#293533" }}>{svc.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {svc.items.map((item,i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm font-body" style={{ color:"#576d69" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background:accentColors[key] }}/>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Privacy policy content */}
        <div className="space-y-8">
          {[
            { title: "Privacy Policy & Confidentiality", content: c.intro },
            { title: c.arcoTitle, content: c.arcoText },
            { title: c.changesTitle, content: c.changesText },
            { title: c.termsTitle, content: c.termsText },
          ].map(section => (
            <div key={section.title} className="rounded-2xl p-6 border" style={{ borderColor:"rgba(17,153,158,0.1)", background:"rgba(17,153,158,0.02)" }}>
              <h2 className="font-heading text-xl font-bold mb-4" style={{ color:"#293533" }}>{section.title}</h2>
              <div className="font-body text-sm leading-relaxed whitespace-pre-line" style={{ color:"#576d69" }}>
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Team section */}
        <div className="mt-12">
          <h2 className="font-heading text-2xl font-bold mb-6" style={{ color:"#293533" }}>{c.teamTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {c.team.map(member => (
              <div key={member.name} className="rounded-2xl p-6 border" style={{ borderColor:"rgba(17,153,158,0.12)", background:"rgba(17,153,158,0.03)" }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-heading text-xl font-bold"
                    style={{ background:"linear-gradient(135deg,#11999e,#0d7a7e)" }}>
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold" style={{ color:"#293533" }}>{member.name}</h3>
                    <p className="text-sm font-body font-medium" style={{ color:"#11999e" }}>{member.role}</p>
                  </div>
                </div>
                <p className="text-sm font-body leading-relaxed" style={{ color:"#576d69" }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-10 rounded-2xl p-6 text-center" style={{ background:"rgba(17,153,158,0.06)", border:"1px solid rgba(17,153,158,0.15)" }}>
          <p className="font-body text-sm font-medium" style={{ color:"#293533" }}>
            Questions? Contact us:{" "}
            <a href="mailto:consultoriamigrante23@gmail.com" style={{ color:"#11999e", textDecoration:"none" }}>
              consultoriamigrante23@gmail.com
            </a>
          </p>
        </div>
      </main>

      <Footer/>
    </>
  );
}