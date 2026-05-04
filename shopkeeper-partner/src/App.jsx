import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4 animate-pulse">
          Tailwind <span className="text-cyan-400">v4</span> + Vite
        </h1>
        <p className="text-slate-400 text-xl">
          Your shopkeeper-partner dashboard is ready.
        </p>
        <div className="mt-8">
          <button className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

