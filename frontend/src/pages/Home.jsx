import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight } from "lucide-react";
import ServiceCard from "../components/ServiceCard";
import { CATEGORIZED_SERVICES } from "../data/services";

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query')?.toLowerCase() || '';

  const filteredServices = CATEGORIZED_SERVICES.map(section => {
    // If query matches section title, keep all items in that section
    if (section.title.toLowerCase().includes(query)) {
      return section;
    }

    // Otherwise, filter items within the section
    const filteredItems = section.items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );

    return {
      ...section,
      items: filteredItems
    };
  }).filter(section => section.items.length > 0);

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 space-y-8 py-6">

        {query && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Search results for "{query}"
            </h2>
          </div>
        )}

        {filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl text-gray-500">No services found matching your search.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
            {filteredServices.map((section, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                  <Link
                    to="#"
                    className="flex items-center text-sm font-medium text-[#2874f0] hover:text-blue-700 transition-colors"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                {/* Horizontal Grid (3 items max as requested) */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-4">
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
