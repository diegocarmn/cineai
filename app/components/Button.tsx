const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        bg-cinema text-black text-sm  font-semibold font-body
        tracking-tight rounded-full px-6 py-2
        transition-all duration-300 ease-out
        hover:bg-yellow-200 active:bg-yellow-200
        active:scale-95 flex items-center justify-center cursor-pointer
        ${className}
      `}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
