import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/store/GameProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "楽器の山 — Instrument Mountain",
  description:
    "楽器クイズと開拓シミュレーションを組み合わせたブラウザゲーム。山を登り、クイズに正解して村を建設し、山頂のオーケストラ都市を目指そう。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c1220",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col app-bg">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
