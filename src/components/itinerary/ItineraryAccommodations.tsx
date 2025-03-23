'use client';

import { Accommodation } from '@/types/itinerary';

interface ItineraryAccommodationsProps {
  accommodations: Accommodation[];
}

export default function ItineraryAccommodations({ accommodations }: ItineraryAccommodationsProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Accommodations</h3>
      
      <div className="space-y-6">
        {accommodations.map((accommodation: Accommodation, index: number) => (
          <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{accommodation.name}</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{accommodation.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {accommodation.amenities.map((amenity: string, amenityIndex: number) => (
                  <span key={amenityIndex} className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <span className="font-medium">Location:</span> {accommodation.proximityToAttractions}
              </p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                <div>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Cost per night:</span> ${accommodation.costPerNight}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Total accommodation cost:</span> ${accommodation.totalAccommodationCost}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
