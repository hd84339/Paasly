import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axios.get("http://localhost:5000/api/auth/current_user", { withCredentials: true });
                if (!userRes.data) {
                    navigate("/login");
                    return;
                }
                setUser(userRes.data);

                // Fetch shop details for this user
                const shopRes = await axios.get(`http://localhost:5000/shopkeeper/my-shop?userId=${userRes.data._id}`, { withCredentials: true });
                if (shopRes.data.success) {
                    setShop(shopRes.data.shop);
                } else {
                    navigate("/create-shop");
                }
            } catch (err) {
                console.error(err);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Paasly Partner</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">{user?.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`} alt="Profile" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Shop Info Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="h-32 bg-indigo-600 relative">
                                {shop?.imageUrl && (
                                    <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover opacity-60" />
                                )}
                            </div>
                            <div className="p-6 -mt-12 relative">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-md border-4 border-white overflow-hidden mb-4">
                                     <img src={shop?.imageUrl || "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=200"} alt="Logo" className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">{shop?.name}</h2>
                                <p className="text-indigo-600 font-medium mb-4 capitalize">{shop?.category}</p>
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        <span>{shop?.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                                        <span>{shop?.rating} ({shop?.reviews} reviews)</span>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats and Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                                <p className="text-slate-500 text-sm font-medium mb-1">Total Orders</p>
                                <h4 className="text-3xl font-bold text-slate-900">128</h4>
                                <div className="mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 py-1 px-2 rounded-lg inline-block">
                                    +12% from last week
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                                <p className="text-slate-500 text-sm font-medium mb-1">Revenue</p>
                                <h4 className="text-3xl font-bold text-slate-900">$2,450</h4>
                                <div className="mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 py-1 px-2 rounded-lg inline-block">
                                    +8% from last week
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                                <p className="text-slate-500 text-sm font-medium mb-1">Store Views</p>
                                <h4 className="text-3xl font-bold text-slate-900">1.2k</h4>
                                <div className="mt-2 text-xs font-semibold text-rose-600 bg-rose-50 py-1 px-2 rounded-lg inline-block">
                                    -3% from last week
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-900">Recent Orders</h3>
                                <button className="text-indigo-600 text-sm font-bold hover:text-indigo-700 transition-colors">View All</button>
                            </div>
                            <div className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                                <th className="px-8 py-4 font-semibold">Order ID</th>
                                                <th className="px-8 py-4 font-semibold">Customer</th>
                                                <th className="px-8 py-4 font-semibold">Items</th>
                                                <th className="px-8 py-4 font-semibold">Status</th>
                                                <th className="px-8 py-4 font-semibold text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {[1, 2, 3, 4].map((i) => (
                                                <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer">
                                                    <td className="px-8 py-4 text-sm font-medium text-slate-900">#ORD-{1024 + i}</td>
                                                    <td className="px-8 py-4 text-sm text-slate-600">Customer {i}</td>
                                                    <td className="px-8 py-4 text-sm text-slate-600">{2 + i} items</td>
                                                    <td className="px-8 py-4">
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">Pending</span>
                                                    </td>
                                                    <td className="px-8 py-4 text-sm font-bold text-slate-900 text-right">$45.00</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
