import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

export default function AuthForm({ type }) {
    const { signInWithGoogle, login, signup } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            let result;
            if (type === "login") {
                result = await login(formData.email, formData.password);
            } else {
                result = await signup(formData.name, formData.email, formData.password);
            }

            if (result.success) {
                navigate("/dashboard");
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-10 bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-white/60 relative overflow-hidden group">
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/40 pointer-events-none"></div>
            
            <div className="text-center mb-8 relative z-10">
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

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl animate-shake">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {type === "signup" && (
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full h-12 px-4 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                    <input
                        type="email"
                        required
                        className="w-full h-12 px-4 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full h-12 px-4 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10"
                >
                    {loading ? "Processing..." : type === "login" ? "Sign In" : "Create Account"}
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white/70 backdrop-blur-md text-slate-500 font-medium italic">or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="group relative w-full h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-slate-700 font-semibold hover:border-blue-500/30 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <GoogleIcon />
                    <span>Google</span>
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500 relative z-10 font-medium">
                {type === "login" ? (
                    <>
                        New to Paasly?{" "}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-700 transition-colors font-bold">
                            Create an account
                        </Link>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors font-bold">
                            Sign in
                        </Link>
                    </>
                )}
            </p>
        </div>
    );
}
