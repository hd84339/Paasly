import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, User, Star, LogIn, LogOut } from 'lucide-react';
import { CATEGORIZED_SERVICES } from '../data/services';
import { useAuth } from '../context/AuthContext';

// Flatten services for easier searching
const ALL_SERVICES = CATEGORIZED_SERVICES.flatMap(cat => cat.items);

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const { user, signInWithGoogle, logout } = useAuth();


  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
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

    // Filter logic
    const filtered = ALL_SERVICES.filter(service => {
      // 1. Direct Match: Name or Category
      const nameMatch = service.name.toLowerCase().includes(lowerValue);
      const categoryMatch = service.category.toLowerCase().includes(lowerValue);

      // 2. "Perfect" keyword (Rating >= 4.8)
      if (lowerValue.includes('perfect') && service.rating >= 4.8) return true;

      // 3. "Good" keyword (Rating >= 4.0)
      if (lowerValue.includes('good') && service.rating >= 4.0) return true;

      return nameMatch || categoryMatch;
    });

    setResults(filtered.slice(0, 5)); // Limit to 5 results
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
        {/* Desktop & Mobile Top Bar */}
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
          <div className="hidden md:flex flex-1 items-center justify-center px-8 space-x-8">
            {/* Location */}
            <div className="flex items-center text-sm font-medium font-inter text-[var(--color-secondary)] hover:text-[var(--color-primary)] cursor-pointer transition-colors px-3 py-1.5 rounded-full border border-gray-100">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Borivali</span>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-md" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-white text-[var(--color-secondary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent sm:text-sm shadow-sm font-inter"
                placeholder="Search services, 'good' shops..."
                value={query}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (query) setShowResults(true); }}
              />

              {/* Desktop Search Results Dropdown */}
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
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <p className="font-medium text-sm text-[var(--color-secondary)]">{service.name}</p>
                          <p className="text-xs text-gray-500">{service.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {service.rating}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {showResults && query && results.length === 0 && (
                <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-50 text-center text-sm text-gray-500">
                  No results found.
                </div>
              )}
            </div>
          </div>


          {/* Right Section: Profile / Auth */}
          <div className="flex items-center space-x-4">
            {/* Mobile Location (Top Bar) */}
            <div className="md:hidden flex items-center text-sm font-medium font-inter text-[var(--color-secondary)] px-3 py-1.5 rounded-full border border-gray-100">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span>Borivali</span>
            </div>

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
                    <p className="text-xs font-medium text-gray-700 leading-none">{user.name?.split(' ')[0]}</p>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="hidden sm:flex px-4 py-2 text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#2874f0] hover:bg-blue-600 rounded-full shadow-sm shadow-blue-200 transition-all flex items-center"
                >
                  <LogIn className="w-4 h-4 mr-1.5 sm:hidden" />
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Login</span>
                </Link>
              </div>
            )}

          </div>
        </div>

        {/* Mobile Bottom Bar: Search */}
        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white text-[var(--color-secondary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-base shadow-sm font-inter"
              placeholder="Search services..."
              value={query}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              onFocus={() => { if (query) setShowResults(true); }}
            />
            {/* Mobile Search Results Dropdown */}
            {showResults && results.length > 0 && (
              <div className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
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
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-sm text-[var(--color-secondary)]">{service.name}</p>
                        <p className="text-xs text-gray-500">{service.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {service.rating}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav >
  );
}
