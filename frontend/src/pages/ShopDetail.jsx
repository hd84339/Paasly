import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Share2, Heart } from 'lucide-react';
import { getServiceById } from '../data/services';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

export default function ShopDetail() {
    const { id } = useParams();
    const serviceId = parseInt(id);
    const service = getServiceById(serviceId);
    const navigate = useNavigate();

    const { user } = useAuth();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [heartAnim, setHeartAnim] = useState(false);

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-6">Shop not found.</p>
                    <Link to="/" className="text-[#2874f0] hover:underline">Back to Home</Link>
                </div>
            </div>
        );
    }

    const isInternal = service.source === 'internal';
    const saved = isFavorite(serviceId);

    const handleToggleFavorite = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setHeartAnim(true);
        await toggleFavorite(serviceId);
        setTimeout(() => setHeartAnim(false), 400);
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Header Image */}
            <div className="relative h-48 md:h-64 lg:h-80 bg-gray-200">
                <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                    <Link to="/" className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                        ← Back
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
                <div className="bg-white rounded-xl shadow-md p-4 md:p-6">

                    {/* Header Info */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md mb-2">
                                {service.category}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                                {service.name}
                            </h1>
                            <div className="flex items-center text-gray-600 text-sm md:text-base">
                                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                {service.distance} • Borivali West, Mumbai
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg text-green-700 font-bold mb-1">
                                <span className="text-lg mr-1">{service.rating}</span>
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <span className="text-xs text-gray-500">{service.reviews} Reviews</span>
                        </div>
                    </div>

                    <hr className="border-gray-100 my-4" />

                    {/* Status & Actions */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 space-y-3">
                            <div className={`flex items-center ${service.isOpen ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                <Clock className="w-5 h-5 mr-2" />
                                {service.isOpen ? 'Open Now • Closes 10 PM' : 'Closed • Opens 9 AM'}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                                <Share2 className="w-4 h-4" /> Share
                            </button>

                            {/* ✅ Working Save / Unsave Button */}
                            <button
                                onClick={handleToggleFavorite}
                                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all border ${
                                    saved
                                        ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                                title={!user ? 'Login to save shops' : saved ? 'Remove from favorites' : 'Save to favorites'}
                            >
                                <Heart
                                    className={`w-4 h-4 transition-all duration-300 ${
                                        saved ? 'fill-red-500 text-red-500' : 'text-gray-500'
                                    } ${heartAnim ? 'scale-150' : 'scale-100'}`}
                                />
                                {saved ? 'Saved' : 'Save'}
                            </button>
                        </div>
                    </div>

                    {/* Save prompt for logged-out users */}
                    {!user && (
                        <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-blue-400" />
                            <span><Link to="/login" className="font-semibold underline">Log in</Link> to save this shop to your favorites.</span>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-2">About</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Welcome to {service.name}, your trusted local destination for quality {service.category.toLowerCase()} services.
                            We have been serving the Borivali community for years, ensuring top-notch customer satisfaction.
                            {isInternal ? 'Book directly with us for exclusive offers.' : 'Find us easily on Google Maps for directions.'}
                        </p>
                    </div>

                    {/* Primary Action */}
                    <div className="sticky bottom-0 bg-white pt-2 border-t border-gray-100 md:static md:border-t-0 md:pt-0">
                        {isInternal ? (
                            <button className="w-full md:w-auto md:px-8 py-3 bg-[#2874f0] hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-transform active:scale-95">
                                Book Service / Order Now
                            </button>
                        ) : (
                            <button className="w-full md:w-auto md:px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                                View Direction on Google Maps
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}
