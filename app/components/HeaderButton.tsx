const HeaderButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="rounded bg-yellow-500 px-4 py-2 text-black transition duration-300 hover:bg-yellow-600"
    >
      Get started
    </button>
  );
};

export default HeaderButton;
