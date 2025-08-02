export default function RecommendationsPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1
        className="
          text-3xl font-bold font-heading text-transparent 
          bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 
          bg-clip-text md:text-7xl
        "
      >
        What to Watch
      </h1>
      <p className="pt-2 text-body text-base text-balance md:text-xl">
        {`Based on your favorite movies, we think you'll love these!`}
      </p>
    </div>
  );
}
