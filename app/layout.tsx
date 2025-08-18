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
  description:
    "Discover what to watch next with AI-powered recommendations. Add your favorites and get smart suggestions based on your taste and mood.",
  keywords: [
    "CineAI",
    "movie recommendations",
    "AI for movies",
    "film suggestions",
    "series recommendations",
    "TMDb",
    "smart watchlist",
  ],
  authors: [{ name: "Diego Carmona", url: "https://github.com/diegocarmn" }],
  creator: "Diego Carmona",
  metadataBase: new URL("https://cineai.vercel.app"),
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: "https://cineai.vercel.app",
    title: "CineAI",
    description:
      "Let CineAI recommend your next favorite movie based on your taste.",
    siteName: "CineAI",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
    creator: "@diegocarmn",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome",
        url: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome", 
        url: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#171717" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="CineAI" />
          <meta name="mobile-web-app-capable" content="yes" />
        </head>
        <body className={`${geist.variable} ${inter.variable} antialiased`}>
          {children}
        </body>
      </html>
  );
}
