'use client';

import { LocalInsights, PracticalInfo } from '@/types/itinerary';

interface ItineraryInsightsProps {
  localInsights?: LocalInsights;
  practicalInfo?: PracticalInfo;
}

export default function ItineraryInsights({ localInsights, practicalInfo }: ItineraryInsightsProps) {
  if (!localInsights && !practicalInfo) {
    return <div className="text-gray-600 dark:text-gray-400">No insights available.</div>;
  }
  
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Local Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localInsights?.culturalNotes && localInsights.culturalNotes.length > 0 && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Cultural Notes</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              {localInsights.culturalNotes.map((note: string, index: number) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}
        
        {localInsights?.hiddenGems && localInsights.hiddenGems.length > 0 && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Hidden Gems</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              {localInsights.hiddenGems.map((gem: string, index: number) => (
                <li key={index}>{gem}</li>
              ))}
            </ul>
          </div>
        )}
        
        {localInsights?.crowdAvoidanceTips && localInsights.crowdAvoidanceTips.length > 0 && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md md:col-span-2">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Crowd Avoidance Tips</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              {localInsights.crowdAvoidanceTips.map((tip: string, index: number) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        
        {practicalInfo && (
          <>
            {practicalInfo.weatherExpectations && (
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md md:col-span-2">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Weather Expectations</h4>
                <p className="text-gray-600 dark:text-gray-300">{practicalInfo.weatherExpectations}</p>
              </div>
            )}
            
            {practicalInfo.packingSuggestions && practicalInfo.packingSuggestions.length > 0 && (
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md md:col-span-2">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Packing Suggestions</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  {practicalInfo.packingSuggestions.map((suggestion: string, index: number) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
