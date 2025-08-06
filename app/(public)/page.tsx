"use client";

import Header from "../components/PublicHeader";
import LightRays from "../components/LightraysBackground";
import Button from "../components/Button";
import { GoArrowRight } from "react-icons/go";
import { signIn } from "next-auth/react";

export default function LandingPage() {
  return (
    <>
      <Header />
      <div className="absolute inset-0 z-0 h-screen w-full pointer-events-none">
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

      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4 sm:px-15 text-white md:max-w-5xl mx-auto">
        <h1 className="text-center text-3xl sm:text-4xl md:text-7xl font-heading text-balance">
          Discover a smarter way to find what to watch
        </h1>
        <p className="text-center mt-4 md:mt-8 text-sm font-body text-white/80 sm:text-base md:text-xl text-balance">
          Tired of scrolling forever? Let CineAI do the digging, so you can
          enjoy the best movies faster. Less browsing, more watching.
        </p>
        <Button
          onClick={() => signIn("google", { callbackUrl: "/home" })}
          className="mt-6 md:mt-10 shadow-xl/20 shadow-cinema hover:scale-105 transition-transform duration-100 ease-in-out md:px-6"
        >
          <span className="mr-2 md:text-lg">Get started</span>
          <GoArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
