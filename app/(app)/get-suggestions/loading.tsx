import { BeatLoading } from "respinner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "CineAI",
    template: "%s | CineAI",
  },
  icons: { icon: "/favicon.png" },
};

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <BeatLoading fill="#FFD900" count={3} size={20} />
    </div>
  );
}
