export default function RecommendationsPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1
        className="
          text-3xl font-bold font-heading text-transparent 
          bg-gradient-to-r from-cinema via-[#fde870] to-[#fff8b8] 
          bg-clip-text md:text-7xl
        "
      >
        Your Recommendations
      </h1>
      <p className="pt-2 text-body text-base text-center text-balance md:text-xl">
        {`Based on your viewing history, we think you'll love these!`}
      </p>
    </div>
  );
}
