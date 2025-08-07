const TrailerButton = ({
  trailerUrl,
  children,
  className,
}: {
  trailerUrl: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      className={`drop-shadow-lg p-2 bg-white rounded-full hover:transform hover:scale-110 ease-in-out duration-200 cursor-pointer ${
        className || ""
      }`}
      onClick={() => {
        if (trailerUrl) {
          window.open(trailerUrl, "_blank");
        }
      }}
    >
      {children}
    </button>
  );
};

export default TrailerButton;
