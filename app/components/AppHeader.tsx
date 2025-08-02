'use client';

import { RiMovie2AiLine } from "react-icons/ri";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  return (
    <header className="fixed top-4 inset-x-0 z-50 mx-4 sm:mx-15">
      <div className="mx-auto max-w-5xl  backdrop-blur-lg rounded-full px-2  py-2 flex items-center justify-between border border-white/10">
        <span className="flex items-center px-4">
          <RiMovie2AiLine className="w-6 h-6 text-white mr-1" />
          <h1 className="text-white font-bold font-heading text-base whitespace-nowrap">
            CineAI
          </h1>
        </span>

        <button
          onClick={() =>
            isLoggedIn ? signOut() : signIn("google", { callbackUrl: "/home" })
          }
          className="whitespace-nowrap bg-white text-black text-sm font-semibold rounded-full px-4 py-2"
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </header>
  );
};
export default Header;
