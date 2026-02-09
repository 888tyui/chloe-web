import type { Metadata } from "next";
import Script from "next/script";
import { jetbrainsMono, aotLostContact, aotLostContactRound, retroByte } from "@/lib/fonts";
import { AppProviders } from "@/components/providers/app-providers";
import { SplashScreen } from "@/components/splash-screen";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHLOE ✝ AI Agent",
  description:
    "AI Waifu Agent with Live2D, Solana DeFi, and Code Generation",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="/lib/live2dcubismcore.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${aotLostContact.variable} ${aotLostContactRound.variable} ${retroByte.variable} font-mono antialiased`}
      >
        <AppProviders>
          <SplashScreen>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              {/* CRT Scanline overlay */}
              <div className="crt-overlay" />
            </div>
          </SplashScreen>
        </AppProviders>
      </body>
    </html>
  );
}
