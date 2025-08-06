import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  const apiKey = process.env.TMDB_KEY;
  if (!apiKey) {
    console.error("TMDB_KEY not set in environment variables");
    return NextResponse.json({ results: [] }, { status: 500 });
  }

  const url =
    `https://api.themoviedb.org/3/trending/movie/week` +
    `?language=en-US&api_key=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 } }); // cache 1h

    if (!res.ok) {
      console.error("TMDb trending error:", res.status);
      return NextResponse.json({ results: [] }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json({ results: (data.results ?? []).slice(0, 12) });
  } catch (error) {
    console.error("Erro ao buscar trending:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
