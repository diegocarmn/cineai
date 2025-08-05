import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "../globals.css";
import { SessionProvider } from "next-auth/react";

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
    template: "%s | CineAI",
  },
  description:
    "Discover what to watch next with AI-powered recommendations. Add your favorites and get smart suggestions based on your taste.",
  keywords: [
    "CineAI",
    "movie recommendations",
    "AI for movies",
    "film suggestions",
    "series recommendations",
    "TMDb",
    "smart watchlist",
  ],
  authors: [{ name: "CineAI Team", url: "https://cineai.vercel.app" }],
  creator: "CineAI",
  metadataBase: new URL("https://cineai.vercel.app"),
  openGraph: {
    type: "website",
    url: "https://cineai.vercel.app",
    title: "CineAI",
    description:
      "Let CineAI recommend your next favorite movie or series based on your taste.",
    siteName: "CineAI",
    images: [
      {
        url: "./og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CineAI – Smart Movie Recommendations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CineAI",
    description: "Smarter movie & series recommendations using AI.",
    images: ["./og-image.jpg"],
    creator: "@cineaiapp", // se tiver, senão pode remover
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
    <SessionProvider>
      <html lang="en">
        <body
          className={`${geist.variable} ${inter.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
