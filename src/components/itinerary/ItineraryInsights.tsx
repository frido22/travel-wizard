'use client';

import { LocalInsights, PracticalInfo } from '@/types/itinerary';

interface ItineraryInsightsProps {
  localInsights?: LocalInsights;
  practicalInfo?: PracticalInfo;
}

export default function ItineraryInsights({ localInsights, practicalInfo }: ItineraryInsightsProps) {
  if (!localInsights && !practicalInfo) {
    return <div className="text-gray-500 dark:text-gray-400 text-sm">No insights available.</div>;
  }
  
  return (
    <div>
      <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-5">Local Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {localInsights?.culturalNotes && localInsights.culturalNotes.length > 0 && (
          <div className="bg-white dark:bg-gray-700 p-5 border border-gray-200 dark:border-gray-600 rounded-sm">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Cultural Notes</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
              {localInsights.culturalNotes.map((note: string, index: number) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}
        
        {localInsights?.hiddenGems && localInsights.hiddenGems.length > 0 && (
          <div className="bg-white dark:bg-gray-700 p-5 border border-gray-200 dark:border-gray-600 rounded-sm">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Hidden Gems</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
              {localInsights.hiddenGems.map((gem: string, index: number) => (
                <li key={index}>{gem}</li>
              ))}
            </ul>
          </div>
        )}
        
        {localInsights?.crowdAvoidanceTips && localInsights.crowdAvoidanceTips.length > 0 && (
          <div className="bg-white dark:bg-gray-700 p-5 border border-gray-200 dark:border-gray-600 rounded-sm md:col-span-2">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Crowd Avoidance Tips</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
              {localInsights.crowdAvoidanceTips.map((tip: string, index: number) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        
        {practicalInfo && (
          <>
            {practicalInfo.weatherExpectations && (
              <div className="bg-white dark:bg-gray-700 p-5 border border-gray-200 dark:border-gray-600 rounded-sm md:col-span-2">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Weather Expectations</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{practicalInfo.weatherExpectations}</p>
              </div>
            )}
            
            {practicalInfo.packingSuggestions && practicalInfo.packingSuggestions.length > 0 && (
              <div className="bg-white dark:bg-gray-700 p-5 border border-gray-200 dark:border-gray-600 rounded-sm md:col-span-2">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Packing Suggestions</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
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
