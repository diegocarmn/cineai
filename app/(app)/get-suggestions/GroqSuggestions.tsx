"use client";

import { useEffect, useState } from "react";
import MediaCard from "@/app/components/MediaCard";
import { BeatLoading } from "respinner";
import type { Movie } from "@/app/types";
import { IoMdArrowDropdown } from "react-icons/io";


export default function GroqSuggestionsClient() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>("");

  const moods = [
    { value: "", label: "Any mood" },
    { value: "happy", label: "Happy" },
    { value: "cheerful", label: "Cheerful" },
    { value: "excited", label: "Excited" },
    { value: "hopeful", label: "Hopeful" },
    { value: "inspired", label: "Inspired" },
    { value: "romantic", label: "Romantic" },
    { value: "playful", label: "Playful" },
    { value: "curious", label: "Curious" },
    { value: "adventurous", label: "Adventurous" },
    { value: "empowered", label: "Empowered" },
    { value: "calm", label: "Calm" },
    { value: "relaxed", label: "Relaxed" },
    { value: "cozy", label: "Cozy" },
    { value: "peaceful", label: "Peaceful" },
    { value: "nostalgic", label: "Nostalgic" },
    { value: "bittersweet", label: "Bittersweet" },
    { value: "thoughtful", label: "Thoughtful" },
    { value: "intrigued", label: "Intrigued" },
    { value: "melancholic", label: "Melancholic" },
    { value: "sad", label: "Sad" },
    { value: "heartbroken", label: "Heartbroken" },
    { value: "lonely", label: "Lonely" },
    { value: "anxious", label: "Anxious" },
    { value: "nervous", label: "Nervous" },
    { value: "tense", label: "Tense" },
    { value: "scared", label: "Scared" },
    { value: "thrilled", label: "Thrilled" },
  ];

  useEffect(() => {
    (async () => {
      try {
        // Fetch user favorites first
        const favRes = await fetch("/api/user-favorites", {
          cache: "no-store",
        });
        const favData = await favRes.json();
        setFavoriteIds(favData.favorites ?? []);

        // Then fetch AI suggestions with mood
        const url = selectedMood
          ? `/api/ai?mood=${encodeURIComponent(selectedMood)}`
          : "/api/ai";
        const res = await fetch(url, { cache: "no-store" });

        if (res.status === 401) {
          setMessage("You must be signed in to see AI recommendations.");
          return;
        }

        const data = await res.json();
        if (data.results.length === 0) {
          setMessage("No favourites found to generate AI recommendations.");
        } else {
          setMovies(data.results);
        }
      } catch (err) {
        console.error("AI suggestions fetch failed:", err);
        setMessage(
          "Something went wrong while fetching AI recommendations. Try refreshing the page."
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedMood]);

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    setIsLoading(true);
    setMovies([]);
  };

  // Handle favorite change to update local state
  const handleFavoriteChange = (id: number, isFav: boolean) => {
    setFavoriteIds((prev) =>
      isFav ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  /* UI ----------------------------------------------------------------- */
  if (isLoading)
    return (
      <div className="flex-1 flex mt-8 items-center justify-center">
        <BeatLoading fill="#ffffff" count={3} size={10} />
      </div>
    );

  if (message)
    return (
      <p className="pt-10 text-center text-neutral-500 font-semibold">
        {message}
      </p>
    );

  return (
    <div className="mt-4 pt-5 md:pt-6 mb-5">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
        <h2 className="text-center font-heading text-xl md:text-2xl bg-gradient-to-r from-green-50 via-green-200 to-green-50 text-transparent bg-clip-text bg-[length:200%_200%] animate-[gradient-x_6s_ease-in-out_infinite]">
          AI Recommendations for Your Mood
        </h2>

        <div className="relative">
          <select
            value={selectedMood}
            onChange={(e) => handleMoodChange(e.target.value)}
            className="px-4 py-2 pr-10 text-sm bg-black/30 font-body backdrop-blur-lg border border-white/10 rounded-full text-white focus:outline-none focus:border-cinema transition-colors appearance-none cursor-pointer hover:border-cinema custom-scrollbar"
          >
            {moods.map((mood) => (
              <option
                key={mood.value}
                value={mood.value}
                className="bg-neutral-900 py-4"
              >
                {mood.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-white/70">
            <IoMdArrowDropdown className="h-6 w-6 my-auto" />
          </div>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap justify-center gap-4 md:gap-8 pt-5 md:pt-6 md:px-20 mb-5">
        {movies.map((m) => (
          <li key={m.id}>
            <MediaCard
              movie={m}
              isFavorite={favoriteIds.includes(m.id)}
              onFavoriteChange={handleFavoriteChange}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
