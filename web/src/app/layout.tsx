import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProgressDrawer } from "@/components/ProgressDrawer";
import { SessionProvider } from "@/contexts/SessionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KI-Kompass | PH FHNW",
  description: "Strukturierte KI-Weiterbildung für Lehrpersonen – Entdecken Sie praxisnah, wie Sie Künstliche Intelligenz gewinnbringend in Ihren Unterricht integrieren können.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
          <ProgressDrawer />
        </SessionProvider>
      </body>
    </html>
  );
}
