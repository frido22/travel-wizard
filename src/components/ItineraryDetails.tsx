'use client';

import { useState } from 'react';
import { Itinerary } from '@/types/itinerary';
import ItineraryTabs from './itinerary/ItineraryTabs';
import ItineraryOverview from './itinerary/ItineraryOverview';
import ItinerarySchedule from './itinerary/ItinerarySchedule';
import ItineraryAccommodations from './itinerary/ItineraryAccommodations';
import ItineraryCosts from './itinerary/ItineraryCosts';
import ItineraryInsights from './itinerary/ItineraryInsights';
import ItineraryPractical from './itinerary/ItineraryPractical';

interface ItineraryDetailsProps {
  itinerary: Itinerary;
}

export default function ItineraryDetails({ itinerary }: ItineraryDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Check if we have a text-based response
  const isTextResponse = !!itinerary.textResponse;
  
  // If it's a text response, just display it directly
  if (isTextResponse) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {itinerary.title}
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            {/* Format the text response with proper line breaks */}
            {itinerary.textResponse?.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Otherwise, display the structured itinerary with tabs
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Tabs */}
      <ItineraryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && <ItineraryOverview itinerary={itinerary} />}
        {activeTab === 'schedule' && <ItinerarySchedule dailySchedule={itinerary.dailySchedule} />}
        {activeTab === 'accommodations' && <ItineraryAccommodations accommodations={itinerary.accommodations} />}
        {activeTab === 'costs' && <ItineraryCosts costBreakdown={itinerary.costBreakdown} />}
        {activeTab === 'insights' && <ItineraryInsights localInsights={itinerary.localInsights} />}
        {activeTab === 'practical' && <ItineraryPractical practicalInfo={itinerary.practicalInfo} />}
      </div>
    </div>
  );
}
