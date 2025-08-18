"use client";

import { RiMovie2AiLine } from "react-icons/ri";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { FaRegStar } from "react-icons/fa";
import { IoIosStar, IoMdHome } from "react-icons/io";
import { TbSparkles, TbBookmark } from "react-icons/tb";
import HeaderButton from "./HeaderButton";
import Link from "next/link";
import { useState } from "react";
import AuthButton from "./AuthButton";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-4 inset-x-0 z-50 mx-4">
      <div className="mx-auto max-w-5xl backdrop-blur-lg bg-stone-950/50 rounded-full px-2 py-2 flex items-center border border-white/10 justify-between">
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
        <div className="hidden md:flex items-center gap-3 w-full justify-center">
          <HeaderButton href="/home">
            <IoMdHome className="mr-2 h-4 w-4" />
            Home
          </HeaderButton>
          <HeaderButton href="/favorites">
            <FaRegStar className="mr-2 h-4 w-4" />
            Favorites
          </HeaderButton>
          <HeaderButton href="/watchlist">
            <TbBookmark className="mr-2 h-4 w-4" />
            Watchlist
          </HeaderButton>
          <HeaderButton href="/get-suggestions">
            <TbSparkles className="mr-2 h-5 w-5" />
            Get Suggestions
          </HeaderButton>
        </div>
        <div className="hidden md:flex items-center ml-auto">
          <AuthButton />
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
        <div className="md:hidden mt-2 backdrop-blur-lg bg-black/40 rounded-4xl border border-white/10 p-4 mx-0 flex flex-col gap-3 animate-fade-in-down shadow-lg/30 shadow-black">
          <HeaderButton
            href="/home"
            onClick={() => setIsOpen(false)}
            className="py-4"
          >
            <IoMdHome className="mr-2 h-4 w-4" />
            Home
          </HeaderButton>

          <HeaderButton
            href="/favorites"
            onClick={() => setIsOpen(false)}
            className="py-4"
          >
            <IoIosStar className="mr-2 h-4 w-4" />
            Favorites
          </HeaderButton>
          <HeaderButton
            href="/watchlist"
            onClick={() => setIsOpen(false)}
            className="py-4"
          >
            <TbBookmark className="mr-2 h-[0.875rem] aspect-square" />
            Watchlist
          </HeaderButton>

          <HeaderButton
            href="/get-suggestions"
            onClick={() => setIsOpen(false)}
            className="py-4"
          >
            <TbSparkles className="mr-2 h-5 w-5" />
            Get Suggestions
          </HeaderButton>

          <AuthButton className="ml-2 py-4" />
        </div>
      )}
    </header>
  );
};

export default Header;
