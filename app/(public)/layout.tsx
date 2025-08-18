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

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={`${geist.variable} ${inter.variable} antialiased`}>
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
