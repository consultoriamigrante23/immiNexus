import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import Navbar          from "@/components/Navbar";
import FloatingButtons from "@/components/FloatingButtons";
import Chatbot         from "@/components/Chatbot";
import CookieBanner    from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "ImmiNexus Consultants | Your Migration Success Partner",
  description: "Professional immigration consulting for Mexico, USA & Canada. Visas, residency, permits and more.",
  icons: {
    icon: [
      { url: "/logo-icon.png", type: "image/png" },
    ],
    apple: "/logo-icon.png",
    shortcut: "/logo-icon.png",
  },
  openGraph: {
    title: "ImmiNexus Consultants",
    description: "Professional immigration consulting for Mexico, USA & Canada.",
    images: ["/logo-horizontal.png"],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages   = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/logo-icon.png" type="image/png"/>
        <link rel="apple-touch-icon" href="/logo-icon.png"/>
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar />
          {children}
          <FloatingButtons />
          <Chatbot />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}