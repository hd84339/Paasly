import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/current_user`, { withCredentials: true });
                if (response.data) {
                    if (response.data.role === "shop_owner") {
                        navigate("/dashboard");
                    } else {
                        navigate("/create-shop");
                    }
                }
            } catch (err) {
                // Not logged in
            }
        };
        checkUser();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/signup`,
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: "shop_owner"
                },
                { withCredentials: true }
            );

            console.log(response.data);
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side: Brand/Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-br from-indigo-500 to-transparent transform -skew-x-12"></div>
                    <div className="absolute bottom-0 -right-1/4 w-full h-full bg-gradient-to-tl from-indigo-500 to-transparent transform skew-x-12"></div>
                </div>
                <div className="relative z-10 p-12 text-center text-white max-w-lg">
                    <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-indigo-400">
                        <span className="text-white font-black text-4xl">P</span>
                    </div>
                    <h1 className="text-4xl font-extrabold mb-6 tracking-tight">Join Paasly Partner</h1>
                    <p className="text-lg text-indigo-200 leading-relaxed">
                        Start growing your business with us today. Get access to thousands of local customers and manage your shop with ease.
                    </p>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 overflow-y-auto">
                <div className="w-full max-w-md space-y-8 my-auto">
                    <div className="text-left">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Apply as Partner</h2>
                        <p className="mt-2 text-sm text-slate-500 font-medium">Create your partner account to get started.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none font-medium"
                                placeholder="John Doe"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none font-medium"
                                placeholder="vendor@example.com"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none font-medium"
                                placeholder="••••••••"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none font-medium"
                                placeholder="••••••••"
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Create Partner Account"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600 font-medium pt-4 border-t border-slate-100">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
