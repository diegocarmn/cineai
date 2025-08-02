export default function MyListPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1
        className="
          text-3xl font-bold font-heading text-transparent 
          bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 
          bg-clip-text md:text-7xl
        "
      >
        My Taste
      </h1>
      <p className="pt-2 text-body text-base text-balance md:text-xl">
        {`Here you can find all the movies and shows you've added to your favorites list.`}
      </p>
    </div>
  );
}
