import { ReactNode } from "react";
import Header from "../components/AppHeader";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Header />
      <main className="mx-4">{children}</main>
    </div>
  );
}
