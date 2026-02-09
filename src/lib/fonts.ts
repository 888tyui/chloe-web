import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const aotLostContact = localFont({
  src: [
    {
      path: "../fonts/AOTLostContact.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/AOTLostContact.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-lost-contact",
  display: "swap",
});

export const aotLostContactRound = localFont({
  src: [
    {
      path: "../fonts/AOTLostContactRound.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/AOTLostContactRound.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-lost-contact-round",
  display: "swap",
});

export const retroByte = localFont({
  src: [
    {
      path: "../fonts/RetroByte.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-retro-byte",
  display: "swap",
});
