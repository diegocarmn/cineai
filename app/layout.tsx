import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CineAI",
    template: "CineAI | %s",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={`${geist.variable} ${inter.variable} antialiased`}>
          {children}
        </body>
      </html>
  );
}
