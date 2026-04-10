export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Passly 🚀
      </h1>

      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Find nearby shops, chat with shopkeepers, and book services easily.
      </p>

      <div className="flex gap-4">
        <button className="px-6 py-3 bg-black text-white rounded-lg">
          Explore Shops
        </button>

        <button className="px-6 py-3 border border-black rounded-lg">
          Become a Partner
        </button>
      </div>
    </div>
  );
}
