import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CineAI | Get Suggestions",
};

export default function RecommendationsPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center md:pt-8">
      <h1
        className="
          text-3xl font-bold font-heading text-transparent text-center
          bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 
          bg-clip-text sm:text-5xl md:text-7xl
        "
      >
        Get suggestions <br /> on what to watch
      </h1>
      <p className="pt-2 text-body text-white/80 text-base text-center text-balance sm:text-lg md:text-xl md:max-w-3xl">
        {`Based on your favorite movies, we think you'll love these!`}
      </p>
    </div>
  );
}
