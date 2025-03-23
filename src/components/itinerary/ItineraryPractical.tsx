'use client';

import { PracticalInfo } from '@/types/itinerary';

interface ItineraryPracticalProps {
  practicalInfo: PracticalInfo;
}

export default function ItineraryPractical({ practicalInfo }: ItineraryPracticalProps) {
  if (!practicalInfo) {
    return <p className="text-gray-500 dark:text-gray-400 text-sm">No practical information available.</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-5">Practical Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {practicalInfo.weatherExpectations && (
          <div className="bg-white dark:bg-gray-700 p-5 border border-gray-200 dark:border-gray-600 rounded-sm">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Weather Expectations</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{practicalInfo.weatherExpectations}</p>
            
            {practicalInfo.packingSuggestions && practicalInfo.packingSuggestions.length > 0 && (
              <>
                <h5 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">Packing Suggestions</h5>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                  {practicalInfo.packingSuggestions.map((suggestion: string, index: number) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
        
        {practicalInfo.transportationTips && practicalInfo.transportationTips.length > 0 && (
          <div className="bg-white dark:bg-gray-700 p-5 border border-gray-200 dark:border-gray-600 rounded-sm">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Transportation Tips</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
              {practicalInfo.transportationTips.map((tip: string, index: number) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        
        {practicalInfo.safetyInfo && practicalInfo.safetyInfo.length > 0 && (
          <div className="bg-white dark:bg-gray-700 p-5 border border-gray-200 dark:border-gray-600 rounded-sm md:col-span-2">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Safety Information</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
              {practicalInfo.safetyInfo.map((info: string, index: number) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
