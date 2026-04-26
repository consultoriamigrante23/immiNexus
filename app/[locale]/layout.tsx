import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Navbar          from "@/components/Navbar";
import FloatingButtons from "@/components/FloatingButtons";
import Chatbot         from "@/components/Chatbot";
import CookieBanner    from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "ImmiNexus Consultants | Your Migration Success Partner",
  description: "Professional immigration consulting for Mexico, USA & Canada.",
  icons: {
    icon:    "/logo-icon.png",
    apple:   "/logo-icon.png",
    shortcut:"/logo-icon.png",
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
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Navbar />
      {children}
      <FloatingButtons />
      <Chatbot />
      <CookieBanner />
    </NextIntlClientProvider>
  );
}