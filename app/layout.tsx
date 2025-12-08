import type { Metadata } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Chatbot } from "@/components/Chatbot";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Systematic Investments – Your Partner in Wealth Management",
  description:
    "Systematic Investments is dedicated to empowering families with tailored financial solutions, built on trust, expertise, and a client-centric approach. 26+ years of experience, 25 Cr+ AUM, 1000+ happy clients.",
  keywords: [
    "wealth management",
    "financial planning",
    "mutual funds",
    "investment advisory",
    "Thane",
    "financial advisor",
    "retirement planning",
    "portfolio management",
  ],
  authors: [{ name: "Systematic Investments" }],
  openGraph: {
    title: "Systematic Investments – Your Partner in Wealth Management",
    description:
      "Empowering families with tailored financial solutions. 26+ years of experience, 1000+ happy clients.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen bg-background font-sans">
        {children}
        <Chatbot />
      </body>
    </html>
  );
}

