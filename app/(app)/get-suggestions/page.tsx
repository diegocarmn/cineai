import { Metadata } from "next";
import GroqSuggestions from "./GroqSuggestions";

export const metadata: Metadata = {
  title: "Get Suggestions",
};

export default async function RecommendationsPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center md:pt-8">
      <h1
        className="
          text-3xl font-bold font-heading text-transparent text-center
          bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 
          bg-clip-text sm:text-5xl md:text-7xl
        "
      >
        AI Recommendations
      </h1>
      <p className="pt-2 text-body text-white/80 text-base text-center text-balance sm:text-lg md:text-xl md:max-w-3xl">
        {`Try our AI-powered recommendations, based on your favorite movies and whatever mood you're in!`}
      </p>

      {/* AI Recommendations */}
      <GroqSuggestions />
    </div>
  );
}
