import { RiMovie2AiLine } from "react-icons/ri";

const Header = () => {
  return (
    <header className="fixed top-4 inset-x-0 z-50 mx-4">
      <div className="mx-auto max-w-5xl bg-white/10 backdrop-blur-lg rounded-full px-2  py-2 flex items-center justify-between">
        <span className="flex items-center px-4">
          <RiMovie2AiLine className="w-6 h-6 text-white mr-1" />
          <h1 className="text-white font-bold font-heading text-base whitespace-nowrap">
            CineAI
          </h1>
        </span>

        <p className="whitespace-nowrap bg-white text-black text-sm font-semibold rounded-full px-4 py-2">
          Login
        </p>
      </div>
    </header>
  );
};
export default Header;
