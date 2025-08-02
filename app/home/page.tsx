
import Button from "../components/Button";
import { LuSearch } from "react-icons/lu";

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-white text-3xl font-heading">Welcome to CineAI</h1>
        <p className="pt-2 text-body text-sm text-center">
          Search for movies and shows, add to your list, and get recommendations
          based on what you like!
        </p>
        <form
          action=""
          className="flex flex-col w-full pt-4 font-body"
        >
          <label htmlFor="search" className="text-xs font-semibold">
            Type a movie or show name
          </label>
          <section className="flex items-center">
            <input
              type="text"
              id="search"
              placeholder="ex. Inception"
              className="px-4 py-2 font-semibold text-sm rounded-full w-full"
            />

            <Button type="submit" className="ml-2 w-fit">
              Search
              <LuSearch className="ml-2 h-4 w-4" />
            </Button>
          </section>
        </form>
      </div>
    </>
  );
}
