import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apex Badges — Pro Dynamic SVG Badges for GitHub & Vercel",
  description:
    "Generador de badges dinámicos vectoriales de nivel Pro, ultra-rápidos (< 5ms), 100% compatibles con GitHub Camo, soporte para Simple Icons, contador de visitas y API Edge.",
  keywords: ["github badges", "shields", "dynamic badges", "vercel edge", "svg generator", "visitor counter"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
