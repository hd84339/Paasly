import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

export default function AuthForm({ type }) {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="w-full max-w-md p-10 bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-white/60 relative overflow-hidden group">
            {/* Elegant Inner Rim Highlight */}
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/40 pointer-events-none"></div>
            
            <div className="text-center mb-10 relative z-10">
                <div className="mx-auto w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-inner"></div>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                    {type === "login" ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                    {type === "login"
                        ? "Securely sign in to your Paasly account"
                        : "Join Paasly to find the best services"}
                </p>
            </div>

            <div className="relative z-10">
                <button
                    onClick={signInWithGoogle}
                    className="group relative w-full h-14 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center gap-3 text-slate-700 font-semibold hover:border-blue-500/30 hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-[0_8px_20px_-6px_rgba(59,130,246,0.2)] hover:-translate-y-0.5 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-3">
                        <GoogleIcon />
                        <span>{type === "login" ? "Sign in with Google" : "Sign up with Google"}</span>
                    </div>
                </button>
            </div>

            <p className="mt-10 text-center text-sm text-slate-500 relative z-10 font-medium tracking-wide">
                {type === "login" ? (
                    <>
                        New to Paasly?{" "}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-700 transition-colors font-semibold">
                            Create an account
                        </Link>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors font-semibold">
                            Sign in
                        </Link>
                    </>
                )}
            </p>
        </div>
    );
}
