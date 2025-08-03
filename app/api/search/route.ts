import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) return NextResponse.json({ results: [] });

  const apiKey = process.env.TMDB_KEY;
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query
      )}&api_key=${apiKey}&language=en-US&page=1&include_adult=false`
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return NextResponse.json({ results: [] });
  }
}
