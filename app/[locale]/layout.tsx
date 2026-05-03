import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Navbar          from "@/components/Navbar";
import FloatingButtons from "@/components/FloatingButtons";
import Chatbot         from "@/components/Chatbot";
import CookieBanner    from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "ImmiNexus Consultants | Your Migration Success Partner",
  description: "Professional immigration consulting for Mexico, USA & Canada.",
  icons: { icon: "/logonobackground.png", apple: "/logonobackground.png" },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages   = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Navbar />
      {children}
      <FloatingButtons />
      <Chatbot />
      <CookieBanner />
    </NextIntlClientProvider>
  );
}