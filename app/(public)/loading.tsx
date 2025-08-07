import { BeatLoading } from "respinner";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center h-screen w-screen">
      <BeatLoading fill="#FFD900" count={3} size={20} />
    </div>
  );
}
