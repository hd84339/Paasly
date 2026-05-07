import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, User, Star, LogIn, LogOut, Navigation, ChevronDown, Loader2 } from 'lucide-react';
import { CATEGORIZED_SERVICES } from '../data/services';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

// Flatten services for easier searching
const ALL_SERVICES = CATEGORIZED_SERVICES.flatMap(cat => cat.items);

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const locationRef = useRef(null);
  
  const { user, logout } = useAuth();
  const { locationName, useCurrentLocation, loading: locationLoading } = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setResults([]);
      setShowResults(false);
      return;
    }

    const lowerValue = value.toLowerCase();
    const filtered = ALL_SERVICES.filter(service => 
      service.name.toLowerCase().includes(lowerValue) || 
      service.category.toLowerCase().includes(lowerValue)
    );

    setResults(filtered.slice(0, 5));
    setShowResults(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/?query=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const handleSelectResult = (id) => {
    navigate(`/shop/${id}`);
    setShowResults(false);
    setQuery('');
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-0">
              <img src="/logo.png" alt="Paasly Logo" className="h-16 w-auto object-contain" />
              <span className="text-3xl font-bold italic tracking-tight font-sans text-[#2874f0] pt-1.0 -ml-4">
                aasly
              </span>
            </Link>
          </div>

          {/* Desktop Center Section: Location & Search */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8 space-x-4">
            
            {/* --- Location Selector --- */}
            <div className="relative" ref={locationRef}>
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center text-sm font-bold text-gray-700 hover:text-[#2874f0] transition-all px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 min-w-[140px] max-w-[200px]"
              >
                <MapPin className="w-4 h-4 mr-2 text-[#2874f0]" />
                <span className="truncate flex-1 text-left">{locationName}</span>
                {locationLoading ? (
                  <Loader2 className="w-3 h-3 ml-2 animate-spin text-gray-400" />
                ) : (
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showLocationMenu ? 'rotate-180' : ''}`} />
                )}
              </button>

              {showLocationMenu && (
                <div className="absolute top-12 left-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      useCurrentLocation();
                      setShowLocationMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-[#2874f0] hover:bg-blue-50 flex items-center gap-3 transition-colors border-b border-gray-50"
                  >
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Navigation className="w-4 h-4" />
                    </div>
                    Use Current Location
                  </button>
                  <div className="px-4 py-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Manual Search</p>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Enter area or city..." 
                        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full max-w-md" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent sm:text-sm shadow-sm"
                placeholder="Search services, shops..."
                value={query}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (query) setShowResults(true); }}
              />

              {showResults && results.length > 0 && (
                <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  {results.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleSelectResult(service.id)}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none"
                    >
                      <div className="flex items-center">
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <p className="font-bold text-sm text-gray-900">{service.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{service.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {service.rating}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section: Profile / Auth */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-1 pl-2 pr-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}`}
                    alt="User"
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <div className="hidden lg:block text-left mr-1">
                    <p className="text-xs font-bold text-gray-700 leading-none">{user.name?.split(' ')[0]}</p>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-gray-500 truncate font-medium">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4 text-blue-500" />
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="hidden sm:flex px-4 py-2 text-sm font-bold text-gray-600 hover:text-[#2874f0] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-[#2874f0] hover:bg-blue-600 rounded-xl shadow-md shadow-blue-100 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
