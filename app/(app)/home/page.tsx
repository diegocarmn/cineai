
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import SearchForm from "./SearchForm";

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
      <p className="pt-2 text-body text-base text-center text-balance sm:text-lg md:text-xl md:max-w-3xl">
        Search for movies you love, add to your favorites list, and get recommendations based on your taste!
      </p>
      <SearchForm />
      <div></div>
    </div>
  );
}
