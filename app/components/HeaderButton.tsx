import Link from "next/link";

const HeaderButton: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => {
  return (
    <Link
      href={href}
      className="whitespace-nowrap hover:bg-cinema hover:text-black text-sm font-semibold rounded-full px-4 py-2 active:bg-cinema active:text-black transition-all duration-300 ease-out active:scale-95 flex items-center justify-center"
    >
      {children}
    </Link>
  );
};

export default HeaderButton;
