"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderButton: React.FC<{
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ href, children, onClick, className }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-semibold rounded-full px-4 py-2 transition-all duration-300 ease-out active:scale-95 flex items-center justify-center
        ${isActive ? "text-white" : "text-white/70"}
        hover:bg-white hover:text-black hover:shadow-xl/10 shadow-white active:bg-white active:text-black ${className}
      `}
    >
      {children}
    </Link>
  );
};

export default HeaderButton;
