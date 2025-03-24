'use client';

import { DailyScheduleItem, Meal } from '@/types/itinerary';

interface ItineraryScheduleProps {
  dailySchedule: DailyScheduleItem[];
}

export default function ItinerarySchedule({ dailySchedule }: ItineraryScheduleProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Daily Schedule</h3>
      
      {dailySchedule.map((day: DailyScheduleItem, index: number) => (
        <div key={index} className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700 last:border-0 last:mb-0 last:pb-0">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Day {day.day} - {day.date}
          </h4>
          
          <div className="space-y-6">
            {/* Morning */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h5 className="font-medium text-gray-800 dark:text-white">Morning</h5>
              </div>
              <div className="ml-10">
                {day.morning ? (
                  <>
                    <h5 className="font-medium text-gray-800 dark:text-white">{day.morning.activity}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-medium">Location:</span> {day.morning.location}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <p><span className="font-medium">Duration:</span> {day.morning.duration}</p>
                      <p><span className="font-medium">Cost:</span> ${day.morning.cost}</p>
                      <p><span className="font-medium">Distance:</span> {day.morning.distance}</p>
                      <p><span className="font-medium">Transport:</span> {day.morning.transportation}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No morning activities scheduled</p>
                )}
              </div>
            </div>
            
            {/* Afternoon */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-yellow-100 dark:bg-yellow-800 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 dark:text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12A6 6 0 0010 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h5 className="font-medium text-gray-800 dark:text-white">Afternoon</h5>
              </div>
              <div className="ml-10">
                {day.afternoon ? (
                  <>
                    <h5 className="font-medium text-gray-800 dark:text-white">{day.afternoon.activity}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-medium">Location:</span> {day.afternoon.location}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <p><span className="font-medium">Duration:</span> {day.afternoon.duration}</p>
                      <p><span className="font-medium">Cost:</span> ${day.afternoon.cost}</p>
                      <p><span className="font-medium">Distance:</span> {day.afternoon.distance}</p>
                      <p><span className="font-medium">Transport:</span> {day.afternoon.transportation}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No afternoon activities scheduled</p>
                )}
              </div>
            </div>
            
            {/* Meals */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-3">Meals</h5>
              <div className="space-y-4">
                {day.meals && day.meals.length > 0 ? (
                  day.meals.map((meal: Meal, mealIndex: number) => (
                    <div key={mealIndex} className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-800 p-1 rounded-full mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white capitalize">{meal.type}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{meal.suggestion}</p>
                        <div className="flex items-center mt-1 text-sm">
                          <span className="text-gray-600 dark:text-gray-400 mr-3">Cost: ${meal.cost}</span>
                          {meal.accommodatesRestrictions && (
                            <span className="text-green-600 dark:text-green-400 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Accommodates Restrictions
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No meals scheduled</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
