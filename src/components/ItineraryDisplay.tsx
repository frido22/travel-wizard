'use client';

import { useState } from 'react';
import { Itinerary } from '@/types/itinerary';
import { Tab } from '@headlessui/react';
import ItineraryOverview from './itinerary/ItineraryOverview';
import DailySchedule from './itinerary/DailySchedule';
import ItineraryInsights from './itinerary/ItineraryInsights';
import ItineraryCosts from './itinerary/ItineraryCosts';
import ItineraryPractical from './itinerary/ItineraryPractical';
import ItineraryAccommodations from './itinerary/ItineraryAccommodations';

interface ItineraryDisplayProps {
  itineraries: Itinerary[];
}

export default function ItineraryDisplay({ itineraries }: ItineraryDisplayProps) {
  const [selectedItinerary, setSelectedItinerary] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  
  // If there's only a text response, display it directly
  if (itineraries[0]?.textResponse && !itineraries[0]?.dailySchedule?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">{itineraries[0].title}</h3>
        <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-400 text-sm">
          {itineraries[0].textResponse}
        </div>
      </div>
    );
  }
  
  const currentItinerary = itineraries[selectedItinerary];
  const dailySchedule = currentItinerary?.dailySchedule || [];
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm">
      {itineraries.length > 1 && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            {itineraries.map((itinerary, index) => (
              <button
                key={index}
                className={`px-4 py-2 text-sm ${
                  selectedItinerary === index
                    ? 'border-b-2 border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-200'
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
      
      <div className="p-5">
        <div className="mb-5">
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
            {currentItinerary?.title || 'Your Custom Itinerary'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {currentItinerary?.summary || 'A personalized travel plan based on your preferences.'}
          </p>
          
          {currentItinerary?.focus && (
            <div className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-sm mb-3">
              {currentItinerary.focus}
            </div>
          )}
        </div>
        
        <Tab.Group>
          <Tab.List className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 mb-5">
            <Tab 
              className={({ selected }) =>
                `py-2 px-4 text-sm font-medium 
                ${selected 
                  ? 'border-b-2 border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-200' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`
              }
            >
              Overview
            </Tab>
            <Tab 
              className={({ selected }) =>
                `py-2 px-4 text-sm font-medium 
                ${selected 
                  ? 'border-b-2 border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-200' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`
              }
            >
              Daily Schedule
            </Tab>
            <Tab 
              className={({ selected }) =>
                `py-2 px-4 text-sm font-medium 
                ${selected 
                  ? 'border-b-2 border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-200' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`
              }
            >
              Accommodations
            </Tab>
            <Tab 
              className={({ selected }) =>
                `py-2 px-4 text-sm font-medium 
                ${selected 
                  ? 'border-b-2 border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-200' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`
              }
            >
              Costs
            </Tab>
            <Tab 
              className={({ selected }) =>
                `py-2 px-4 text-sm font-medium 
                ${selected 
                  ? 'border-b-2 border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-200' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`
              }
            >
              Insights
            </Tab>
            <Tab 
              className={({ selected }) =>
                `py-2 px-4 text-sm font-medium 
                ${selected 
                  ? 'border-b-2 border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-200' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`
              }
            >
              Practical
            </Tab>
          </Tab.List>
          
          <Tab.Panels>
            <Tab.Panel>
              <ItineraryOverview itinerary={currentItinerary} />
            </Tab.Panel>
            
            <Tab.Panel>
              {dailySchedule.length > 0 ? (
                <div>
                  <div className="flex overflow-x-auto mb-4 pb-2">
                    {dailySchedule.map((day, index) => (
                      <button
                        key={index}
                        className={`px-3 py-1.5 text-xs rounded-sm mr-2 whitespace-nowrap ${
                          selectedDay === index
                            ? 'bg-gray-800 dark:bg-gray-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                <p className="text-gray-500 dark:text-gray-400 text-sm">No daily schedule information available.</p>
              )}
            </Tab.Panel>
            
            <Tab.Panel>
              {currentItinerary?.accommodations && currentItinerary.accommodations.length > 0 ? (
                <ItineraryAccommodations accommodations={currentItinerary.accommodations} />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No accommodation information available.</p>
              )}
            </Tab.Panel>
            
            <Tab.Panel>
              <ItineraryCosts costBreakdown={currentItinerary?.costBreakdown} />
            </Tab.Panel>
            
            <Tab.Panel>
              <ItineraryInsights 
                localInsights={currentItinerary?.localInsights} 
                practicalInfo={undefined} 
              />
            </Tab.Panel>
            
            <Tab.Panel>
              <ItineraryPractical practicalInfo={currentItinerary?.practicalInfo} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
