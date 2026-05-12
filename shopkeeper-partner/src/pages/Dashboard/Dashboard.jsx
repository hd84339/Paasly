import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview"); // overview, products, settings
    const navigate = useNavigate();

    // New product form state
    const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", imageUrl: "", category: "" });
    const [addingProduct, setAddingProduct] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/current_user`, { withCredentials: true });
                if (!userRes.data) {
                    navigate("/login");
                    return;
                }
                setUser(userRes.data);

                // Fetch shop details for this user
                const shopRes = await axios.get(`${import.meta.env.VITE_API_URL}/shopkeeper/my-shop?userId=${userRes.data._id}`, { withCredentials: true });
                if (shopRes.data.success) {
                    setShop(shopRes.data.shop);
                    // Fetch products
                    const prodRes = await axios.get(`${import.meta.env.VITE_API_URL}/shopkeeper/products?shopId=${shopRes.data.shop._id}`, { withCredentials: true });
                    if (prodRes.data.success) setProducts(prodRes.data.products);
                } else {
                    navigate("/create-shop");
                }
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 404) {
                    navigate("/create-shop");
                } else {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setAddingProduct(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/shopkeeper/products`, {
                ...newProduct,
                shopId: shop._id
            }, { withCredentials: true });
            
            if (res.data.success) {
                setProducts([res.data.product, ...products]);
                setNewProduct({ name: "", price: "", description: "", imageUrl: "", category: "" });
            }
        } catch (error) {
            alert("Error adding product");
            console.error(error);
        } finally {
            setAddingProduct(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <span className="text-white font-black text-xl">P</span>
                        </div>
                        <span className="text-2xl font-black text-slate-900 tracking-tight">Partner Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{user?.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-md overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff&bold=true`} alt="Profile" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-8">
                {/* Tabs */}
                <div className="flex space-x-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
                    {["overview", "products", "settings"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-colors capitalize ${activeTab === tab ? "bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Shop Info Card (Always visible or responsive) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                                {shop?.imageUrl && (
                                    <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
                                )}
                            </div>
                            <div className="p-6 -mt-12 relative">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-xl border-4 border-white overflow-hidden mb-4">
                                     <img src={shop?.imageUrl || "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=200"} alt="Logo" className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{shop?.name}</h2>
                                <p className="text-indigo-600 font-bold mb-4 capitalize text-sm uppercase tracking-wider">{shop?.category}</p>
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                                        <svg className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        <span>{shop?.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                        <svg className="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        <span>4.8 (120 reviews)</span>
                                    </div>
                                </div>
                                <button onClick={() => setActiveTab('settings')} className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 active:scale-[0.98]">
                                    Edit Shop Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content based on active tab */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* TAB: OVERVIEW */}
                        {activeTab === "overview" && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                                        <p className="text-slate-500 text-sm font-bold mb-1 uppercase tracking-wider">Total Orders</p>
                                        <h4 className="text-4xl font-black text-slate-900 tracking-tight">128</h4>
                                        <div className="mt-3 text-xs font-bold text-emerald-700 bg-emerald-100 py-1.5 px-3 rounded-lg inline-block">
                                            +12% from last week
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                                        <p className="text-slate-500 text-sm font-bold mb-1 uppercase tracking-wider">Revenue</p>
                                        <h4 className="text-4xl font-black text-slate-900 tracking-tight">$2,450</h4>
                                        <div className="mt-3 text-xs font-bold text-emerald-700 bg-emerald-100 py-1.5 px-3 rounded-lg inline-block">
                                            +8% from last week
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                                        <p className="text-slate-500 text-sm font-bold mb-1 uppercase tracking-wider">Store Views</p>
                                        <h4 className="text-4xl font-black text-slate-900 tracking-tight">1.2k</h4>
                                        <div className="mt-3 text-xs font-bold text-rose-700 bg-rose-100 py-1.5 px-3 rounded-lg inline-block">
                                            -3% from last week
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="text-xl font-black text-slate-900">Recent Orders</h3>
                                        <button className="text-indigo-600 text-sm font-bold hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-lg">View All</button>
                                    </div>
                                    <div className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-8 py-4">Order ID</th>
                                                        <th className="px-8 py-4">Customer</th>
                                                        <th className="px-8 py-4">Items</th>
                                                        <th className="px-8 py-4">Status</th>
                                                        <th className="px-8 py-4 text-right">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {[1, 2, 3, 4].map((i) => (
                                                        <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer">
                                                            <td className="px-8 py-4 text-sm font-bold text-slate-900">#ORD-{1024 + i}</td>
                                                            <td className="px-8 py-4 text-sm font-medium text-slate-600">Customer {i}</td>
                                                            <td className="px-8 py-4 text-sm text-slate-600 font-medium">{2 + i} items</td>
                                                            <td className="px-8 py-4">
                                                                <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700">Pending</span>
                                                            </td>
                                                            <td className="px-8 py-4 text-sm font-black text-slate-900 text-right">$45.00</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: PRODUCTS */}
                        {activeTab === "products" && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50">
                                        <h3 className="text-xl font-black text-slate-900">Add New Product</h3>
                                    </div>
                                    <div className="p-8">
                                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                                                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-medium" placeholder="e.g. Fresh Apples" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
                                                <input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-medium" placeholder="4.99" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                                <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-medium resize-none" rows="2" placeholder="Brief description..."></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                                <input type="text" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-medium" placeholder="e.g. Fruits" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                                                <input type="text" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-medium" placeholder="https://..." />
                                            </div>
                                            <div className="md:col-span-2 pt-2">
                                                <button type="submit" disabled={addingProduct} className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                                    {addingProduct ? "Adding..." : "Save Product"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="text-xl font-black text-slate-900">Your Inventory</h3>
                                        <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg text-sm">{products.length} Items</span>
                                    </div>
                                    <div className="p-6">
                                        {products.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-slate-500 font-medium">You haven't added any products yet.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {products.map(p => (
                                                    <div key={p._id} className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all bg-slate-50/50">
                                                        <div className="w-20 h-20 rounded-xl bg-slate-200 shrink-0 overflow-hidden">
                                                            {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-400">No Img</div>}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-bold text-slate-900 truncate">{p.name}</h4>
                                                                <span className="font-black text-emerald-600">${p.price.toFixed(2)}</span>
                                                            </div>
                                                            <p className="text-xs text-indigo-600 font-bold uppercase mt-1">{p.category}</p>
                                                            <p className="text-sm text-slate-500 line-clamp-2 mt-1 font-medium">{p.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: SETTINGS */}
                        {activeTab === "settings" && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-8 text-center">
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">Shop Settings</h3>
                                    <p className="text-slate-500 font-medium mb-6">Update your location, address, and profile details here.</p>
                                    <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all">
                                        Coming Soon in Settings Module
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
