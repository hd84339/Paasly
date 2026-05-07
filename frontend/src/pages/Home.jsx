import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, MapPin, Loader2, Search } from "lucide-react";
import ServiceCard from "../components/ServiceCard";
import { CATEGORIZED_SERVICES } from "../data/services";
import { useLocation } from "../context/LocationContext";

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query')?.toLowerCase() || '';
  
  const { location, locationName, loading: locationLoading } = useLocation();
  const [nearbyShops, setNearbyShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(false);

  // Fetch Nearby Shops from Backend whenever location or query changes
  useEffect(() => {
    const fetchShops = async () => {
      if (!location) return;

      setLoadingShops(true);
      try {
        const response = await fetch(`/api/shops/nearby`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: location.lat,
            lng: location.lng,
            type: query
          })
        });

        if (response.ok) {
          const data = await response.json();
          setNearbyShops(data);
        }
      } catch (err) {
        console.error("Fetch Shops Error:", err);
      } finally {
        setLoadingShops(false);
      }
    };

    fetchShops();
  }, [location, query]);

  const hasNearby = nearbyShops.length > 0;
  
  const filteredStatic = CATEGORIZED_SERVICES.map(section => {
    const filteredItems = section.items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
    return { ...section, items: filteredItems };
  }).filter(section => section.items.length > 0);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-6">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* --- Location Status Bar --- */}
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing services in</p>
              <h3 className="text-sm font-bold text-gray-900">{locationName || 'Detecting Location...'}</h3>
            </div>
          </div>
          {(locationLoading || loadingShops) && (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          )}
        </div>

        {/* --- Search Results Header --- */}
        {query && (
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Shops matching "{query}"
            </h2>
          </div>
        )}

        {/* --- 1. Real Nearby & Partner Shops --- */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
                Nearby Services
              </h2>
              <p className="text-gray-500 text-sm font-medium">Verified partners and top local shops near you</p>
            </div>
          </div>

          {loadingShops ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-[250px] bg-white rounded-3xl animate-pulse border border-gray-100 shadow-sm"></div>
              ))}
            </div>
          ) : hasNearby ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {nearbyShops.map((shop) => (
                <ServiceCard
                  key={shop.id}
                  id={shop.id}
                  name={shop.name}
                  category={shop.category}
                  rating={shop.rating}
                  reviews={shop.reviews}
                  distance={`${shop.distance} km`}
                  isOpen={shop.isOpen}
                  imageUrl={shop.imageUrl}
                  source={shop.source}
                  isPartner={shop.isPartner}
                />
              ))}
            </div>
          ) : location ? (
            <div className="bg-white p-12 rounded-[2rem] border border-gray-100 text-center space-y-4 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-inner">
                <MapPin className="w-8 h-8 text-gray-300" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">No partner shops here yet</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto mt-2">
                  We haven't launched our partner network in {locationName} yet, but we're coming soon!
                </p>
              </div>
            </div>
          ) : null}
        </section>

        {/* --- 2. Fallback / Static Categorized Sections --- */}
        {!query && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filteredStatic.map((section, index) => (
              <div key={index} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all group">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">
                    {section.title}
                  </h2>
                  <Link to="#" className="flex items-center text-xs font-black text-blue-600 hover:bg-blue-600 hover:text-white transition-all bg-blue-50 px-4 py-2 rounded-xl uppercase tracking-wider">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {section.items.map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      name={service.name}
                      category={service.category}
                      rating={service.rating}
                      reviews={service.reviews}
                      distance={service.distance}
                      isOpen={service.isOpen}
                      imageUrl={service.imageUrl}
                      source={service.source}
                      isPartner={service.source === 'internal'}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
