'use client';

import { useState } from 'react';
import { Itinerary } from '@/types/itinerary';
import { Tab } from '@headlessui/react';
import ItineraryDetails from './ItineraryDetails';
import DailySchedule from './itinerary/DailySchedule';
import ItineraryInsights from './itinerary/ItineraryInsights';
import ItineraryCosts from './itinerary/ItineraryCosts';

interface ItineraryDisplayProps {
  itineraries: Itinerary[];
}

export default function ItineraryDisplay({ itineraries }: ItineraryDisplayProps) {
  const [selectedItinerary, setSelectedItinerary] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  
  // If there's only a text response, display it directly
  if (itineraries[0]?.textResponse && !itineraries[0]?.dailySchedule?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{itineraries[0].title}</h3>
        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
          {itineraries[0].textResponse}
        </div>
      </div>
    );
  }
  
  const currentItinerary = itineraries[selectedItinerary];
  const dailySchedule = currentItinerary?.dailySchedule || [];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {itineraries.length > 1 && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            {itineraries.map((itinerary, index) => (
              <button
                key={index}
                className={`px-4 py-3 text-sm font-medium ${
                  selectedItinerary === index
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setSelectedItinerary(index)}
              >
                {itinerary.title || `Itinerary ${index + 1}`}
              </button>
            ))}
          </nav>
        </div>
      )}
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {currentItinerary?.title || 'Your Custom Itinerary'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {currentItinerary?.summary || 'A personalized travel plan based on your preferences.'}
          </p>
          
          {currentItinerary?.focus && (
            <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full mb-4">
              {currentItinerary.focus}
            </div>
          )}
        </div>
        
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 dark:bg-gray-700 p-1 mb-6">
            <Tab 
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${selected 
                  ? 'bg-white dark:bg-gray-800 shadow text-blue-700 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-700 dark:hover:text-blue-400'
                }`
              }
            >
              Overview
            </Tab>
            <Tab 
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${selected 
                  ? 'bg-white dark:bg-gray-800 shadow text-blue-700 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-700 dark:hover:text-blue-400'
                }`
              }
            >
              Daily Schedule
            </Tab>
            <Tab 
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${selected 
                  ? 'bg-white dark:bg-gray-800 shadow text-blue-700 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-700 dark:hover:text-blue-400'
                }`
              }
            >
              Costs
            </Tab>
            <Tab 
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                ${selected 
                  ? 'bg-white dark:bg-gray-800 shadow text-blue-700 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-700 dark:hover:text-blue-400'
                }`
              }
            >
              Insights
            </Tab>
          </Tab.List>
          
          <Tab.Panels className="mt-2">
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3">
              <ItineraryDetails itinerary={currentItinerary} />
            </Tab.Panel>
            
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3">
              {dailySchedule.length > 0 ? (
                <div>
                  <div className="flex overflow-x-auto mb-4 pb-2">
                    {dailySchedule.map((day, index) => (
                      <button
                        key={index}
                        className={`px-4 py-2 text-sm font-medium rounded-full mr-2 whitespace-nowrap ${
                          selectedDay === index
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setSelectedDay(index)}
                      >
                        Day {day.day}: {day.date}
                      </button>
                    ))}
                  </div>
                  
                  <DailySchedule day={dailySchedule[selectedDay]} />
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No daily schedule information available.</p>
              )}
            </Tab.Panel>
            
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3">
              <ItineraryCosts costBreakdown={currentItinerary?.costBreakdown} />
            </Tab.Panel>
            
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-800 p-3">
              <ItineraryInsights 
                localInsights={currentItinerary?.localInsights} 
                practicalInfo={currentItinerary?.practicalInfo} 
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
