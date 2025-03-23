'use client';

import { Itinerary, DailySchedule } from '@/types/itinerary';

interface ItineraryOverviewProps {
  itinerary: Itinerary;
}

export default function ItineraryOverview({ itinerary }: ItineraryOverviewProps) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{itinerary.title}</h3>
      <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">{itinerary.focus}</p>
      <p className="text-gray-700 dark:text-gray-300 mb-6">{itinerary.summary}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Trip Highlights</h4>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
            {itinerary.dailySchedule.map((day: DailySchedule, index: number) => (
              <li key={index}>
                <span className="font-medium">Day {day.day}:</span> {day.morning.activity}, {day.afternoon.activity}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">At a Glance</h4>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Duration:</span> {itinerary.dailySchedule.length} days
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Estimated Cost:</span> ${itinerary.costBreakdown.totalEstimatedCost}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Budget Assessment:</span> {itinerary.costBreakdown.comparisonToBudget}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
