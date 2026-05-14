import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateShop() {
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);
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
    
    // Autocomplete states
    const [addressQuery, setAddressQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/current_user`, { withCredentials: true });
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

    const fetchSuggestions = async (query) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`);
            setSuggestions(res.data);
        } catch (err) {
            console.error("Error fetching location data", err);
        }
    };

    const handleAddressChange = (e) => {
        const val = e.target.value;
        setAddressQuery(val);
        setShowSuggestions(true);
        
        // Debounce fetching
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            fetchSuggestions(val);
        }, 500);
    };

    const selectLocation = (location) => {
        setAddressQuery(location.display_name);
        setFormData({
            ...formData,
            address: location.display_name,
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lon),
        });
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        if (!formData.lat || !formData.lng) {
            setError("Please select a valid address from the dropdown suggestions to get coordinates.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/shopkeeper/create-shop`,
                { ...formData, userId: user._id },
                { withCredentials: true }
            );

            console.log(response.data);
            alert("Congratulations! Your shop has been created.");
            navigate("/dashboard");

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
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'}`}>1</div>
                                    <span className={`text-sm font-medium ${step >= 1 ? 'text-white' : 'text-white/60'}`}>Business Info</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'}`}>2</div>
                                    <span className={`text-sm font-medium ${step >= 2 ? 'text-white' : 'text-white/60'}`}>Location</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'}`}>3</div>
                                    <span className={`text-sm font-medium ${step >= 3 ? 'text-white' : 'text-white/60'}`}>Photos</span>
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
                                {step === 1 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Shop Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                                placeholder="e.g. Fresh Mart"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                            <select
                                                name="category"
                                                required
                                                value={formData.category}
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
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="relative">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Shop Address</label>
                                            <input
                                                type="text"
                                                value={addressQuery}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                                placeholder="Start typing your address..."
                                                onChange={handleAddressChange}
                                                onFocus={() => setShowSuggestions(true)}
                                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                            />
                                            {showSuggestions && suggestions.length > 0 && (
                                                <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                                                    {suggestions.map((loc) => (
                                                        <li
                                                            key={loc.place_id}
                                                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-100 last:border-0"
                                                            onMouseDown={() => selectLocation(loc)}
                                                        >
                                                            {loc.display_name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {formData.lat && formData.lng && (
                                                <p className="text-xs text-emerald-600 mt-2 font-medium">
                                                    ✓ Location coordinates locked: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL</label>
                                            <input
                                                type="text"
                                                name="imageUrl"
                                                value={formData.imageUrl}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                                placeholder="https://..."
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 flex gap-4">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setStep(step - 1)}
                                            className="px-6 py-4 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
                                        >
                                            Back
                                        </button>
                                    )}
                                    {step < 3 ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (step === 1 && (!formData.name || !formData.category)) {
                                                    setError("Please fill in all fields.");
                                                    return;
                                                }
                                                if (step === 2 && (!formData.lat || !formData.lng)) {
                                                    setError("Please select a location from the dropdown.");
                                                    return;
                                                }
                                                setError("");
                                                setStep(step + 1);
                                            }}
                                            className="flex-1 py-4 px-6 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                                        >
                                            Continue
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {loading ? (
                                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                "Register Shop"
                                            )}
                                        </button>
                                    )}
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