import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import ClientScene from "@/components/canvas/ClientScene";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Haru-ni Style Web",
  description: "シームレスな遷移と3D体験",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${notoSansJP.variable} antialiased`} suppressHydrationWarning>
        <Navigation />
        <ClientScene />
        {children}
      </body>
    </html>
  );
}
