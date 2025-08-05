export default function Loading() {
  return (
    <div className="mt-20 flex items-center justify-center h-full text-white">
      <div className="relative w-12 h-12 mr-4">
        <div className="absolute inset-0 rounded-full border-4 border-cinema border-t-transparent animate-spin" />
      </div>
      <h1
        className="text-2xl font-bold font-heading text-transparent text-center
          bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 
          bg-clip-text "
      >
        Loading...
      </h1>
    </div>
  );
}
