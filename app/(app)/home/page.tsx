
import Button from "../../components/Button";
import { IoSearch } from "react-icons/io5";
import { auth } from "@/app/api/auth/[...nextauth]/auth";

export default async function HomePage() {
  const session = await auth();
  return (
    <div className="flex flex-col items-center justify-center">
      <h1
        className="
          text-3xl font-bold font-heading text-transparent text-center
          bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 
          bg-clip-text sm:text-5xl md:text-7xl
        "
      >
        Welcome to CineAI, <br /> {session.user.name}
      </h1>
      <p className="pt-2 text-body text-base text-center text-balance sm:text-lg md:text-xl md:w-auto">
        Search for movies and tv shows you love, add to your favorites list, and get recommendations based on your taste!
      </p>
      <form
        action=""
        className="flex flex-col w-full md:w-2xl pt-10 md:pt-15 font-body"
      >
        <label htmlFor="search" className="sr-only">
          Type a movie or show name
        </label>
        <section className="flex items-center">
          <input
            type="text"
            id="search"
            placeholder="ex. Inception"
            className="
              px-4 py-2 md:py-3 md:px-5 w-full text-sm font-normal 
              rounded-full bg-white/10 backdrop-blur-lg
              border border-transparent 
              focus:outline-none
              focus:border-cinema
            "
          />

          <Button type="submit" className="ml-2 md:ml-4 w-fit md:py-3 md:px-8 hover:shadow-xl/10 shadow-cinema">
            <IoSearch className="mr-2 h-4 w-4" />
            Search
          </Button>
        </section>
      </form>
    </div>
  );
}
