'use client';

import { CostBreakdown } from '@/types/itinerary';

interface ItineraryCostsProps {
  costBreakdown: CostBreakdown;
}

export default function ItineraryCosts({ costBreakdown }: ItineraryCostsProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Cost Breakdown</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Expense Categories</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Activities</span>
              <span className="font-medium text-gray-800 dark:text-white">${costBreakdown.activities}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Meals</span>
              <span className="font-medium text-gray-800 dark:text-white">${costBreakdown.meals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Accommodation</span>
              <span className="font-medium text-gray-800 dark:text-white">${costBreakdown.accommodation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Transportation</span>
              <span className="font-medium text-gray-800 dark:text-white">${costBreakdown.transportation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Miscellaneous</span>
              <span className="font-medium text-gray-800 dark:text-white">${costBreakdown.miscellaneous}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between">
              <span className="font-medium text-gray-800 dark:text-white">Total Estimated Cost</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">${costBreakdown.totalEstimatedCost}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Budget Analysis</h4>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{costBreakdown.comparisonToBudget}</p>
          
          <h5 className="font-medium text-gray-800 dark:text-white mt-6 mb-3">Savings Suggestions</h5>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            {costBreakdown.savingsSuggestions.map((tip: string, index: number) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
