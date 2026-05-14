import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Landing() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, [navigate]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Navbar */}
            <nav className="fixed w-full z-50 transition-all duration-300 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <span className="text-white font-black text-xl">P</span>
                        </div>
                        <span className="text-xl font-extrabold text-slate-900 tracking-tight">Paasly Partner</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/login" 
                            className="hidden sm:block px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            Log In
                        </Link>
                        <Link 
                            to="/register" 
                            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 active:scale-95 transition-all"
                        >
                            Join Now
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center justify-center min-h-[90vh]">
                <div className="absolute inset-0 z-0">
                    {/* Decorative Background Gradients */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold mb-8 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        New Partner Portal is Live
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
                        Take your local business <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">to the next level</span>
                    </h1>
                    
                    <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join Paasly's growing network of local shops. Reach thousands of nearby customers, manage your inventory, and boost your sales effortlessly with our powerful merchant tools.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            to="/register" 
                            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-600/30 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                        >
                            Start Selling Today
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </Link>
                        <Link 
                            to="/login" 
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-bold text-lg hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center"
                        >
                            Log in to Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Why Partner with Paasly?</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to manage and grow your local business in one unified dashboard.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Boost Your Sales</h3>
                            <p className="text-slate-600 leading-relaxed">Instantly make your products discoverable to thousands of local customers searching nearby.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Management</h3>
                            <p className="text-slate-600 leading-relaxed">Update inventory, accept orders, and track your business performance from a beautiful, simple dashboard.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Same Day Payouts</h3>
                            <p className="text-slate-600 leading-relaxed">Get your money fast. We process payments securely and ensure you get paid without delays.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="bg-slate-900 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-sm">P</span>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">Paasly</span>
                    </div>
                    <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Paasly Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
