import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import Image from 'next/image';

interface ServiceCardProps {
    id: number;
    name: string;
    category: string;
    rating: number;
    reviews: number;
    distance: string;
    isOpen: boolean;
    imageUrl: string;
    source?: 'internal' | 'external';
}

export default function ServiceCard({
    id,
    name,
    category,
    rating,
    reviews,
    distance,
    isOpen,
    imageUrl,
    source = 'internal',
}: ServiceCardProps) {
    const isInternal = source === 'internal';

    return (
        <div className="flex flex-col bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full">
            {/* 1. Fixed Image Height - Compact for 3-col mobile */}
            <div className="relative h-[100px] md:h-[150px] lg:h-[160px] w-full bg-gray-100">
                {/* Using standard img tag for now to avoid next/image setup complexity with external URLs, 
             but typically would use Next.js Image */}
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                />
                {/* Availability Badge */}
                <div className="absolute top-2 left-2">
                    {/* Internal: Open/Closed. External: Google Info badge */}
                    {isInternal ? (
                        <span className={`px-2 py-0.5 text-[10px] md:text-xs font-medium rounded-full ${isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {isOpen ? 'Open' : 'Closed'}
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 text-[10px] md:text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            Google Info
                        </span>
                    )}
                </div>
            </div>

            {/* Card Content */}
            <div className="flex flex-col flex-1 p-2 md:p-3">
                {/* Category */}
                <p className="text-[10px] md:text-xs text-gray-500 font-inter mb-1 truncate">
                    {category}
                </p>

                {/* Name (Max 1 line) */}
                <h3 className="font-poppins font-semibold text-[var(--color-secondary)] text-xs md:text-base leading-tight truncate mb-1" title={name}>
                    {name}
                </h3>

                {/* Rating & Distance */}
                <div className="flex items-center text-[10px] md:text-xs text-gray-600 mb-2 md:mb-3 space-x-1.5 md:space-x-3">
                    <div className="flex items-center bg-green-50 px-1 py-0.5 md:px-1.5 rounded text-green-700 font-medium">
                        <span className="mr-0.5 md:mr-1">{rating}</span>
                        <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                    </div>
                    <span className="text-gray-400 hidden sm:inline">({reviews})</span>
                    <div className="flex items-center truncate">
                        <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 text-gray-400" />
                        <span className="truncate max-w-[60px] sm:max-w-none">{distance}</span>
                    </div>
                </div>

                {/* Spacer to push button to bottom */}
                <div className="flex-1"></div>

                {/* Button (Pinned Bottom) */}
                {/* Button (Pinned Bottom) */}
                {isInternal ? (
                    <Link href={`/shop/${id}`} className="w-full mt-1 md:mt-2">
                        <button className="w-full py-1.5 md:py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white text-xs md:text-sm font-medium rounded-md transition-colors font-inter">
                            View Shop
                        </button>
                    </Link>
                ) : (
                    <Link href={`/shop/${id}`} className="w-full mt-1 md:mt-2">
                        <button className="w-full py-1.5 md:py-2 border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-gray-50 text-xs md:text-sm font-medium rounded-md transition-colors font-inter">
                            View on Maps
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}
