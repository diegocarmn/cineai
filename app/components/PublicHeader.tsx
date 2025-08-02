"use client";

import { RiMovie2AiLine } from "react-icons/ri";
import Link from "next/link";
import AuthButton from "./AuthButton";

const Header = () => {
  return (
    <header className="fixed top-4 inset-x-0 z-50 mx-4 sm:mx-15">
      <div className="mx-auto max-w-5xl  backdrop-blur-lg rounded-full px-2  py-2 flex items-center justify-between border border-white/10">
        <Link className="flex items-center px-4" href="/home">
          <RiMovie2AiLine className="w-6 h-6 text-cinema mr-1" />
          <h1
            className="font-bold font-heading text-base whitespace-nowrap text-transparent 
            bg-gradient-to-r from-cinema via-[#ffeb7b] to-[#fff8b8] 
            bg-clip-text"
          >
            CineAI
          </h1>
        </Link>
        <AuthButton className="ml-2" />
      </div>
    </header>
  );
};
export default Header;
