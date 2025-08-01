import Header from "./components/Header";

export default function LandingPage() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="px-2 text-white text-center text-3xl font-heading font-extrabold tracking-tight">
          Tired of scrolling forever? <br></br>Discover a smarter way to find
          what to watch.
        </h1>
        <p className="text-white text-center pt-4 text-lg font-body px-2">
          Let CineAI do the digging, so you can enjoy the best shows and movies
          faster. Less browsing, more watching.
        </p>
      </div>
      <div className="bg-white">
        aaaa
      </div>
    </>
  );
}
