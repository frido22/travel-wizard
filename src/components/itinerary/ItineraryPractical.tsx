'use client';

import { PracticalInfo } from '@/types/itinerary';

interface ItineraryPracticalProps {
  practicalInfo: PracticalInfo;
}

export default function ItineraryPractical({ practicalInfo }: ItineraryPracticalProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Practical Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Weather Expectations</h4>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{practicalInfo.weatherExpectations}</p>
          
          <h5 className="font-medium text-gray-800 dark:text-white mt-6 mb-3">Packing Suggestions</h5>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            {practicalInfo.packingSuggestions.map((suggestion: string, index: number) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Transportation Tips</h4>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            {practicalInfo.transportationTips.map((tip: string, index: number) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md md:col-span-2">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Safety Information</h4>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            {practicalInfo.safetyInfo.map((info: string, index: number) => (
              <li key={index}>{info}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
