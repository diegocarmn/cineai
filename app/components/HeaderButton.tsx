import Link from "next/link";

const HeaderButton: React.FC<{
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ href, children, onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="whitespace-nowrap hover:bg-cinema hover:text-black text-sm font-semibold rounded-full px-4 py-2 active:bg-cinema active:text-black transition-all duration-300 ease-out active:scale-95 flex items-center justify-center"
    >
      {children}
    </Link>
  );
};

export default HeaderButton;
