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
  title: "BST株式会社",
  description: "Web制作に強い会社",
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
