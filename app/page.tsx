import Header from "./components/Header";
import LightRays from "./components/Lightrays";
import Button from "./components/Button"; // Assuming you have a Button component

export default function LandingPage() {
  return (
    <>
      <Header />
      <div className="absolute inset-0 z-0 h-screen w-full">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffd900"
          raysSpeed={0.5}
          lightSpread={0.8}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0}
          className="custom-rays"
        />
      </div>

      <div className="flex flex-col items-center justify-center h-screen px-4 text-white">
        <h1 className="text-center text-3xl font-heading font-extrabold tracking-tight">
          Discover a smarter way to find what to watch
        </h1>
        <p className=" text-center mt-4 text-sm font-body">
          Tired of scrolling forever? Let CineAI do the digging, so you can
          enjoy the best shows and movies faster. Less browsing, more watching.
        </p>
        <Button className="mt-6 shadow-lg/20 shadow-yellow-400">Get Started</Button>
      </div>
      <div className="bg-white">aaaa</div>
    </>
  );
}
