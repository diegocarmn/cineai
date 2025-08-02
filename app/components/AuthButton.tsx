"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { TbLogout2, TbLogout } from "react-icons/tb";

interface AuthButtonProps {
  className?: string;
  callbackUrl?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  className = "",
  callbackUrl = "/home",
}) => {
  const { data: session } = useSession();
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
      className={`flex items-center justify-center whitespace-nowrap cursor-pointer bg-white text-black text-sm font-semibold rounded-full transition-all duration-300 ease-out active:scale-95 px-4 py-2 hover:shadow-xl/10 shadow-white ${className}`}
    >
      {isLoggedIn ? (
        <TbLogout2 className="h-4 w-4 mr-2 inline" />
      ) : (
        <TbLogout className="h-4 w-4 mr-2 inline" />
      )}
      {isLoggedIn ? "Logout" : "Login"}
    </button>
  );
};

export default AuthButton;
