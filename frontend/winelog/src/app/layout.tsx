import type { Metadata } from "next";
import { Geist, Geist_Mono, Coustard, Roboto, Rhodium_Libre } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const coustard = Coustard({
  weight: ['400', '900'],
  subsets: ['latin'],
  variable: '--font-coustard',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const rhodiumLibre = Rhodium_Libre({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-rhodium-libre',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Wine Log",
  description: "와인 로그 모바일 웹 애플리케이션",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} ${coustard.variable} ${roboto.variable} ${rhodiumLibre.variable}`}>
      <body>
        <div className="flex flex-col h-screen">
          <Topbar />
          <main className="h-[calc(100vh-8.5rem)] overflow-y-auto">
            {children}
          </main>
          <Navbar />
        </div>
      </body>
    </html>
  );
}
