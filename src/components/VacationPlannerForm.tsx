'use client';

import { useForm } from 'react-hook-form';
import { FormInputs } from '@/types/itinerary';

interface VacationPlannerFormProps {
  onSubmit: (data: FormInputs) => Promise<void>;
  loading: boolean;
}

export default function VacationPlannerForm({ onSubmit, loading }: VacationPlannerFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Destination
          </label>
          <input
            id="destination"
            type="text"
            placeholder="e.g., Paris, Tokyo, New York"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            {...register("destination", { required: "Destination is required" })}
          />
          {errors.destination && <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>}
        </div>
        
        <div>
          <label htmlFor="dates" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Travel Dates
          </label>
          <input
            id="dates"
            type="text"
            placeholder="e.g., April 1-7, 2025"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            {...register("dates", { required: "Travel dates are required" })}
          />
          {errors.dates && <p className="mt-1 text-sm text-red-600">{errors.dates.message}</p>}
        </div>
        
        <div>
          <label htmlFor="people" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Travelers
          </label>
          <input
            id="people"
            type="text"
            placeholder="e.g., 2 adults, 1 teenager"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            {...register("people", { required: "Traveler information is required" })}
          />
          {errors.people && <p className="mt-1 text-sm text-red-600">{errors.people.message}</p>}
        </div>
        
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Budget
          </label>
          <input
            id="budget"
            type="text"
            placeholder="e.g., $3000, €2500"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            {...register("budget", { required: "Budget is required" })}
          />
          {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>}
        </div>
        
        <div>
          <label htmlFor="restrictions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Dietary/Other Restrictions
          </label>
          <input
            id="restrictions"
            type="text"
            placeholder="e.g., vegetarian, no heights, accessibility needs"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            {...register("restrictions")}
          />
        </div>
        
        <div>
          <label htmlFor="transportationMode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Preferred Transportation
          </label>
          <input
            id="transportationMode"
            type="text"
            placeholder="e.g., public transit, rental car, walking"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            {...register("transportationMode")}
          />
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 disabled:bg-blue-400"
        >
          {loading ? 'Planning Your Adventure...' : 'Create My Itinerary'}
        </button>
      </div>
    </form>
  );
}
