import Header from "../components/AppHeader";
import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "../globals.css";
import { SessionProvider } from "next-auth/react";
import Noise from "../components/Noise";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "CineAI - Home",
  description: "Find and explore movies with CineAI",
  icons: {
    icon: "/favicon.png",
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body
          className={`${geist.variable} ${inter.variable} antialiased`}
        >
          <div className="relative flex min-h-screen flex-col bg-neutral-950 text-white">
            <Noise />
            <Header />

            <main className="flex flex-1 flex-col px-4 pt-24">{children}</main>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
