"use client";

import { RiMovie2AiLine } from "react-icons/ri";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { useSession, signIn, signOut } from "next-auth/react";
import HeaderButton from "./HeaderButton";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-4 inset-x-0 z-50 mx-4">
      <div className="mx-auto max-w-5xl backdrop-blur-lg rounded-full px-2 py-2 flex items-center justify-between border border-white/10">
        <Link href="/home">
          <span className="flex items-center py-1 md:py-0 mx-2">
            <RiMovie2AiLine className="w-6 h-6 text-cinema mr-1" />
            <h1
              className="font-bold font-heading text-base whitespace-nowrap text-transparent 
              bg-gradient-to-r from-cinema via-[#ffeb7b] to-[#fff8b8] 
              bg-clip-text"
            >
              CineAI
            </h1>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          <HeaderButton href="/my-list">My List</HeaderButton>
          <HeaderButton href="/recommendations">For You</HeaderButton>
          <HeaderButton href="/home">Search</HeaderButton>
          <button
            onClick={() =>
              isLoggedIn
                ? signOut()
                : signIn("google", { callbackUrl: "/home" })
            }
            className="whitespace-nowrap bg-white text-black text-sm font-semibold rounded-full transition-all duration-300 ease-out active:scale-95 px-4 py-2 cursor-pointer"
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-cinema text-2xl mx-2 relative w-8 h-8"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <span
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isOpen ? "opacity-0 scale-90" : "opacity-100 scale-100"
            }`}
          >
            <HiOutlineMenu />
          </span>
          <span
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <HiX />
          </span>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden mt-2 backdrop-blur-lg rounded-4xl border border-white/10 p-4 mx-0 flex flex-col gap-3 animate-fade-in-down">
          <HeaderButton href="/my-list" onClick={() => setIsOpen(false)}>
            My List
          </HeaderButton>
          <HeaderButton
            href="/recommendations"
            onClick={() => setIsOpen(false)}
          >
            For You
          </HeaderButton>
          <HeaderButton href="/home" onClick={() => setIsOpen(false)}>
            Search
          </HeaderButton>
          <button
            onClick={() =>
              isLoggedIn
                ? signOut()
                : signIn("google", { callbackUrl: "/home" })
            }
            className="whitespace-nowrap bg-white text-black text-sm font-semibold rounded-full transition-all duration-300 ease-out active:scale-95 px-4 py-2"
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
