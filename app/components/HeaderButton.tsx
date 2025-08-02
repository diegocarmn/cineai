"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderButton: React.FC<{
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-semibold rounded-full px-4 py-2 transition-all duration-300 ease-out active:scale-95 flex items-center justify-center
        ${isActive ? "text-white" : "text-white/50"}
        hover:bg-cinema hover:text-black hover:shadow-xl/10 shadow-cinema active:bg-cinema active:text-black
      `}
    >
      {children}
    </Link>
  );
};

export default HeaderButton;
