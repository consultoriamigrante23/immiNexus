import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImmiNexus Consultants",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-icon.png" type="image/png"/>
      </head>
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}