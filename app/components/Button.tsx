const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
  secondary = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  secondary?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        ${
          secondary
            ? "bg-red-800 text-white active:bg-red-600 hover:shadow-xl/10 shadow-red-500 hover:bg-red-700"
            : "bg-cinema text-black active:bg-yellow-200 hover:shadow-xl/10 shadow-cinema hover:bg-yellow-200"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        text-sm font-semibold font-body
        tracking-tight rounded-full px-4 py-2
        transition-all duration-300 ease-out
        active:scale-95 flex items-center justify-center cursor-pointer
        ${className}
      `}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
