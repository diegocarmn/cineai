import Header from "../components/AppHeader";
import "../globals.css";
import { SessionProvider } from "next-auth/react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en" className="custom-scrollbar">
        <body>
          <div className="relative flex min-h-screen flex-col bg-neutral-900 text-white">
            <Header />

            <main className="flex flex-1 flex-col px-4 pt-24">{children}</main>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
