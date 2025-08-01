const Button = ({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-yellow-400 font-body text-sm text-black font-semibold py-2 px-4 rounded-full transition duration-200 hover:bg-blue-600 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
