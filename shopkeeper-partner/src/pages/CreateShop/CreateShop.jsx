import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateShop() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        address: "",
        imageUrl: "",
        lat: "",
        lng: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/auth/current_user", { withCredentials: true });
                if (response.data) {
                    setUser(response.data);
                } else {
                    navigate("/login");
                }
            } catch (err) {
                navigate("/login");
            }
        };
        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:5000/shopkeeper/create-shop",
                { ...formData, userId: user._id },
                { withCredentials: true }
            );

            console.log(response.data);
            alert("Congratulations! Your shop has been created.");
            navigate("/dashboard"); // Assuming a dashboard exists

        } catch (error) {
            console.error(error);
            setError(error.response?.data?.error || "Failed to create shop. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Register Your Shop</h1>
                    <p className="text-slate-600 text-lg">Tell us about your business to get started on Paasly</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-indigo-600 p-8 text-white flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-4">Shop Details</h3>
                                <p className="text-indigo-100 text-sm leading-relaxed">
                                    Provide accurate information about your shop so customers can find you easily.
                                </p>
                            </div>
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">1</div>
                                    <span className="text-sm font-medium">Business Info</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">2</div>
                                    <span className="text-sm font-medium text-white/60">Location</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">3</div>
                                    <span className="text-sm font-medium text-white/60">Photos</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-2/3 p-8 md:p-12">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Shop Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                            placeholder="e.g. Fresh Mart"
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                        <select
                                            name="category"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="kirana">Kirana / Grocery</option>
                                            <option value="pharmacy">Pharmacy</option>
                                            <option value="restaurant">Restaurant</option>
                                            <option value="electronics">Electronics</option>
                                            <option value="fashion">Fashion</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL</label>
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                            placeholder="https://..."
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Shop Address</label>
                                        <textarea
                                            name="address"
                                            required
                                            rows="2"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                                            placeholder="Enter full address"
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Latitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            name="lat"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                            placeholder="12.9716"
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Longitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            name="lng"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                            placeholder="77.5946"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-4 px-6 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            "Register Shop"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateShop;