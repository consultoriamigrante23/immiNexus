import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";

const locales = ["en", "es", "fr"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: { default: "ImmiNexus Consultants", template: "%s | ImmiNexus Consultants" },
  description: "Specialized immigration consultants for USA, Canada, and Mexico.",
  keywords: ["immigration consultant", "visa USA", "Canada immigration", "Mexico residency", "Express Entry", "green card"],
  metadataBase: new URL("https://www.imminexusconsultants.com"),
  openGraph: {
    type: "website",
    siteName: "ImmiNexus Consultants",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}