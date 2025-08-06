import { BeatLoading } from "respinner";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <BeatLoading fill="#FFD900" count={3} size={20} />
    </div>
  );
}
