import Button from "../../components/Button";
import { LuSearch } from "react-icons/lu";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1
        className="
          text-3xl font-bold font-heading text-transparent 
          bg-gradient-to-r from-cinema via-[#fde870] to-[#fff8b8] 
          bg-clip-text md:text-7xl
        "
      >
        Welcome to CineAI
      </h1>
      <p className="pt-2 text-body text-base text-center text-balance">
        Search for movies and shows, add to your list, and get recommendations
        based on what you like!
      </p>
      <form action="" className="flex flex-col w-full pt-6 font-body">
        <label htmlFor="search" className="sr-only">
          Type a movie or show name
        </label>
        <section className="flex items-center">
          <input
            type="text"
            id="search"
            placeholder="ex. Inception"
            className="
              px-4 py-2 w-full text-sm font-normal 
              rounded-full bg-white/10 
              border border-transparent 
              focus:outline-none focus:bg-white
              focus:border-cinema
            "
          />

          <Button type="submit" className="ml-2 w-fit">
            Search
            <LuSearch className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </form>
    </div>
  );
}
