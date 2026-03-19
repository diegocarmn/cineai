"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { TbLogout2 } from "react-icons/tb";
import { FaGoogle } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

interface AuthButtonProps {
  className?: string;
  callbackUrl?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  className = "",
  callbackUrl = "/home",
}) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button
        disabled
        className={`flex items-center justify-center whitespace-nowrap bg-white text-black text-sm font-semibold rounded-full px-4 py-2 opacity-75 ${className}`}
      >
        <CgSpinner className="h-4 w-4 mr-2 animate-spin" />
        Loading...
      </button>
    );
  }

  const isLoggedIn = !!session;

  const handleClick = () => {
    if (isLoggedIn) {
      signOut();
    } else {
      signIn("google", { callbackUrl });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group/button flex items-center justify-center whitespace-nowrap cursor-pointer bg-white text-black text-sm font-semibold rounded-full transition-all duration-150 ease-out active:scale-95 px-4 py-2 hover:shadow-xl/10 shadow-white ${className}`}
    >
      {isLoggedIn ? (
        <TbLogout2 className="h-4 w-4 mr-2 inline group-hover/button:-translate-x-0.5 group-active/button:-translate-x-0.5 transition-transform duration-250 ease-in-out" />
      ) : (
        <FaGoogle className="h-[0.875rem] w-[0.875rem] mr-2 inline" />
      )}
      {isLoggedIn ? "Logout" : "Login with Google"}
    </button>
  );
};

export default AuthButton;
