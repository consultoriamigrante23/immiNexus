import Footer from "@/components/Footer";

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const content = {
    en: {
      title: "Privacy Policy",
      updated: "Last updated: April 2026",
      back: "← Back to Home",
      sections: [
        { title: "1. Information We Collect", text: "We collect information you provide directly to us, including your name, email address, phone number, country of origin, and details about your immigration needs when you submit our consultation or contact forms." },
        { title: "2. How We Use Your Information", text: "We use the information collected to: respond to your inquiries, schedule consultations, provide immigration consulting services, send you relevant communications, and improve our services. We do not sell your personal information to third parties." },
        { title: "3. Data Storage & Security", text: "Your data is stored in a secured MongoDB Atlas database with encryption at rest and in transit. We implement industry-standard security measures including HTTPS encryption, rate limiting, and input sanitization to protect your personal information." },
        { title: "4. Cookies", id: "cookies", text: "We use essential cookies to ensure the website functions correctly, and optional analytics cookies (only with your consent) to understand how visitors use our website. You may decline non-essential cookies at any time via our cookie banner." },
        { title: "5. Third-Party Services", text: "We use Resend for email communications. Your email may be processed by their servers in accordance with their privacy policy. We do not share your data with any other third parties." },
        { title: "6. Your Rights", text: "You have the right to access, correct, or delete your personal information at any time. To exercise these rights, please contact us at consultoriamigrante23@gmail.com." },
        { title: "7. Contact", text: "For any privacy-related questions, contact us at: consultoriamigrante23@gmail.com or +52 55 3163-0202." },
      ],
    },
    es: {
      title: "Política de Privacidad",
      updated: "Última actualización: Abril 2026",
      back: "← Volver al Inicio",
      sections: [
        { title: "1. Información que Recopilamos", text: "Recopilamos la información que nos proporcionas directamente, incluyendo tu nombre, correo electrónico, número de teléfono, país de origen y detalles sobre tus necesidades migratorias cuando envías nuestros formularios de consulta o contacto." },
        { title: "2. Cómo Usamos tu Información", text: "Usamos la información recopilada para: responder a tus consultas, programar citas, brindar servicios de consultoría migratoria, enviarte comunicaciones relevantes y mejorar nuestros servicios. No vendemos tu información personal a terceros." },
        { title: "3. Almacenamiento y Seguridad de Datos", text: "Tus datos se almacenan en una base de datos MongoDB Atlas segura con cifrado en reposo y en tránsito. Implementamos medidas de seguridad estándar de la industria para proteger tu información personal." },
        { title: "4. Cookies", id: "cookies", text: "Usamos cookies esenciales para garantizar el funcionamiento correcto del sitio web, y cookies analíticas opcionales (solo con tu consentimiento) para entender cómo los visitantes usan nuestro sitio. Puedes rechazar las cookies no esenciales en cualquier momento." },
        { title: "5. Servicios de Terceros", text: "Usamos Resend para comunicaciones por correo electrónico. Tu correo puede ser procesado por sus servidores de acuerdo con su política de privacidad. No compartimos tus datos con ningún otro tercero." },
        { title: "6. Tus Derechos", text: "Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento. Para ejercer estos derechos, contáctanos en consultoriamigrante23@gmail.com." },
        { title: "7. Contacto", text: "Para cualquier pregunta relacionada con la privacidad, contáctanos en: consultoriamigrante23@gmail.com o +52 55 3163-0202." },
      ],
    },
    fr: {
      title: "Politique de Confidentialité",
      updated: "Dernière mise à jour : Avril 2026",
      back: "← Retour à l'Accueil",
      sections: [
        { title: "1. Informations que Nous Collectons", text: "Nous collectons les informations que vous nous fournissez directement, notamment votre nom, adresse e-mail, numéro de téléphone, pays d'origine et détails sur vos besoins en immigration lorsque vous soumettez nos formulaires." },
        { title: "2. Comment Nous Utilisons Vos Informations", text: "Nous utilisons les informations collectées pour : répondre à vos demandes, planifier des consultations, fournir des services de conseil en immigration, vous envoyer des communications pertinentes et améliorer nos services. Nous ne vendons pas vos informations personnelles à des tiers." },
        { title: "3. Stockage et Sécurité des Données", text: "Vos données sont stockées dans une base de données MongoDB Atlas sécurisée avec chiffrement au repos et en transit. Nous mettons en œuvre des mesures de sécurité conformes aux normes de l'industrie pour protéger vos informations." },
        { title: "4. Cookies", id: "cookies", text: "Nous utilisons des cookies essentiels pour assurer le bon fonctionnement du site, et des cookies analytiques optionnels (uniquement avec votre consentement) pour comprendre comment les visiteurs utilisent notre site." },
        { title: "5. Services Tiers", text: "Nous utilisons Resend pour les communications par e-mail. Vos e-mails peuvent être traités par leurs serveurs conformément à leur politique de confidentialité. Nous ne partageons pas vos données avec d'autres tiers." },
        { title: "6. Vos Droits", text: "Vous avez le droit d'accéder, de corriger ou de supprimer vos informations personnelles à tout moment. Pour exercer ces droits, contactez-nous à consultoriamigrante23@gmail.com." },
        { title: "7. Contact", text: "Pour toute question liée à la confidentialité, contactez-nous à : consultoriamigrante23@gmail.com ou +52 55 3163-0202." },
      ],
    },
  };

  const c = content[locale as keyof typeof content] ?? content.en;

  return (
    <>
      {/* Minimal nav with back link — uses locale-aware anchor links */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-100 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href={`/${locale}`} className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 rounded-full border-2 border-brand-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="#2A9D9A" strokeWidth="1.5"/>
                <ellipse cx="10" cy="10" rx="4" ry="8" stroke="#2A9D9A" strokeWidth="1"/>
                <line x1="2" y1="10" x2="18" y2="10" stroke="#2A9D9A" strokeWidth="1"/>
              </svg>
            </div>
            <div>
              <div className="font-heading text-base font-bold text-gray-900 leading-none">ImmiNexus</div>
              <div className="text-brand-500 text-[9px] tracking-widest uppercase font-body">Consultants</div>
            </div>
          </a>

          {/* Nav links that go back to homepage sections */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: locale === "fr" ? "Services" : locale === "es" ? "Servicios" : "Services",   href: `/${locale}#services`  },
              { label: locale === "fr" ? "Pourquoi Nous" : locale === "es" ? "Por Qué Nosotros" : "Why Us", href: `/${locale}#why-us`   },
              { label: locale === "fr" ? "Processus" : locale === "es" ? "Proceso" : "Process",      href: `/${locale}#process`   },
              { label: locale === "fr" ? "Contact" : locale === "es" ? "Contacto" : "Contact",       href: `/${locale}#contact`   },
            ].map(l => (
              <a key={l.href} href={l.href}
                className="text-gray-600 hover:text-brand-500 text-sm font-body font-medium transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <a href={`/${locale}`}
            className="text-brand-500 hover:text-brand-600 text-sm font-body font-medium transition-colors">
            {c.back}
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">{c.title}</h1>
        <p className="text-gray-400 text-sm font-body mb-10">{c.updated}</p>

        {c.sections.map(section => (
          <div key={section.title} id={(section as any).id} className="mb-8">
            <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
            <p className="text-gray-600 font-body leading-relaxed">{section.text}</p>
          </div>
        ))}
      </main>

      <Footer />
    </>
  );
}