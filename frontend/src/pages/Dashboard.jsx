import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, User, Mail, Shield, Calendar, Settings, Bell, Heart, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { getServiceById } from "../data/services";

export default function Dashboard() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const { favorites, isFavorite, toggleFavorite } = useFavorites();
    const [activeTab, setActiveTab] = useState("activity");
    const [heartAnim, setHeartAnim] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) return null;

    const handleToggleFavorite = async (shopId) => {
        setHeartAnim(shopId);
        await toggleFavorite(shopId);
        setTimeout(() => setHeartAnim(null), 400);
    };

    const favoriteShops = favorites.map(id => getServiceById(id)).filter(Boolean);

    return (
        <main className="min-h-screen bg-gray-50 pb-20 pt-10">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                    
                    <div className="relative">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 md:w-16 md:h-16 text-blue-500" />
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest rounded-full">
                                {user.role}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 font-medium">
                            <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-1">
                                <Shield className="w-4 h-4" />
                                Verified Profile
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={logout}
                            className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 transition-all border border-red-100"
                        >
                            <LogOut className="w-5 h-5" />
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-500" />
                                My Statistics
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className="w-5 h-5 text-purple-500" />
                                        <span className="text-gray-600 font-medium">Orders</span>
                                    </div>
                                    <span className="text-2xl font-black text-gray-900">0</span>
                                </div>

                                {/* ✅ Real favorites count — clicking switches to Favorites tab */}
                                <button
                                    onClick={() => setActiveTab("favorites")}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-red-200 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <Heart className="w-5 h-5 text-red-500" />
                                        <span className="text-gray-600 font-medium group-hover:text-red-600 transition-colors">Saved Shops</span>
                                    </div>
                                    <span className="text-2xl font-black text-gray-900">{favorites.length}</span>
                                </button>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-blue-500" />
                                        <span className="text-gray-600 font-medium">Bookings</span>
                                    </div>
                                    <span className="text-2xl font-black text-gray-900">0</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mb-12 -mr-12"></div>
                            <h4 className="text-xl font-bold mb-2 relative z-10">Premium Member</h4>
                            <p className="text-indigo-100 text-sm mb-6 relative z-10">Unlock exclusive deals and priority support by upgrading today.</p>
                            <button className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg relative z-10 hover:scale-105 active:scale-95 transition-all">
                                Upgrade Plan
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tab Headers */}
                        <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit">
                            {["activity", "favorites", "security"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-3 rounded-xl font-bold capitalize transition-all text-sm md:text-base ${
                                        activeTab === tab
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {tab === "favorites" ? (
                                        <span className="flex items-center gap-1.5">
                                            <Heart className={`w-4 h-4 ${activeTab === "favorites" ? "fill-red-500 text-red-500" : ""}`} />
                                            Saved
                                            {favorites.length > 0 && (
                                                <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-black">
                                                    {favorites.length}
                                                </span>
                                            )}
                                        </span>
                                    ) : (
                                        tab
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* ── Activity Tab ── */}
                        {activeTab === "activity" && (
                            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                                    <Bell className="w-10 h-10" />
                                </div>
                                <h2 className="text-2xl font-extrabold text-gray-900">No recent activity</h2>
                                <p className="text-gray-500 max-w-sm font-medium">
                                    Once you start using the platform to book services, your activity history will appear here.
                                </p>
                                <button 
                                    onClick={() => navigate("/")}
                                    className="mt-4 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    Browse Services
                                </button>
                            </div>
                        )}

                        {/* ── Favorites Tab ── */}
                        {activeTab === "favorites" && (
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
                                <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                    Your Saved Shops
                                </h2>

                                {favoriteShops.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                                            <Heart className="w-10 h-10 text-red-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-700">No saved shops yet</h3>
                                        <p className="text-gray-500 text-sm max-w-xs">
                                            Tap the heart icon on any shop page to save it here for quick access.
                                        </p>
                                        <button
                                            onClick={() => navigate("/")}
                                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm"
                                        >
                                            Explore Shops
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {favoriteShops.map((shop) => {
                                            if (!shop) return null;
                                            const saved = isFavorite(shop.id);
                                            return (
                                                <div
                                                    key={shop.id}
                                                    className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group"
                                                >
                                                    <img
                                                        src={shop.imageUrl}
                                                        alt={shop.name}
                                                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-gray-400 mb-0.5">{shop.category}</p>
                                                        <h4 className="font-bold text-gray-900 truncate text-sm">{shop.name}</h4>
                                                        <p className="text-xs text-gray-500">{shop.distance} away</p>
                                                        <div className="mt-2 flex gap-2">
                                                            <Link
                                                                to={`/shop/${shop.id}`}
                                                                className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                                            >
                                                                View Shop
                                                            </Link>
                                                            <button
                                                                onClick={() => handleToggleFavorite(shop.id)}
                                                                className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center gap-1"
                                                            >
                                                                <Heart
                                                                    className={`w-3 h-3 transition-all duration-300 ${
                                                                        saved ? "fill-red-500" : ""
                                                                    } ${heartAnim === shop.id ? "scale-150" : "scale-100"}`}
                                                                />
                                                                {saved ? "Unsave" : "Save"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Security Tab ── */}
                        {activeTab === "security" && (
                            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                                    <Shield className="w-10 h-10 text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-extrabold text-gray-900">Account Security</h2>
                                <p className="text-gray-500 max-w-sm font-medium">
                                    Your account is secured with a verified email. Password change and 2FA coming soon.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
