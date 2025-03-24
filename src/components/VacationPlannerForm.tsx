'use client';

import { useForm } from 'react-hook-form';
import { FormInputs } from '@/types/itinerary';

interface VacationPlannerFormProps {
  onSubmit: (data: FormInputs) => Promise<void>;
  loading: boolean;
}

export default function VacationPlannerForm({ onSubmit, loading }: VacationPlannerFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormInputs>();
  const budgetValue = watch('budget') || '';
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="destination" className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
            Destination
          </label>
          <input
            id="destination"
            type="text"
            placeholder="Where are you going?"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-sm focus:outline-none focus:border-gray-400 dark:bg-gray-800 dark:text-gray-100 text-sm"
            {...register("destination", { required: "Destination is required" })}
          />
          {errors.destination && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{errors.destination.message}</p>}
        </div>
        
        <div>
          <label htmlFor="dates" className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
            Dates
          </label>
          <div className="flex space-x-2">
            <input
              id="startDate"
              type="date"
              className="w-1/2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-sm focus:outline-none focus:border-gray-400 dark:bg-gray-800 dark:text-gray-100 text-sm"
              onChange={(e) => {
                const endDate = document.getElementById('endDate') as HTMLInputElement;
                setValue('dates', `${e.target.value} to ${endDate?.value || ''}`);
              }}
            />
            <span className="flex items-center text-gray-400 dark:text-gray-500 text-sm">to</span>
            <input
              id="endDate"
              type="date"
              className="w-1/2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-sm focus:outline-none focus:border-gray-400 dark:bg-gray-800 dark:text-gray-100 text-sm"
              onChange={(e) => {
                const startDate = document.getElementById('startDate') as HTMLInputElement;
                setValue('dates', `${startDate?.value || ''} to ${e.target.value}`);
              }}
            />
          </div>
          <input
            type="hidden"
            {...register("dates", { required: "Travel dates are required" })}
          />
          {errors.dates && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{errors.dates.message}</p>}
        </div>
        
        <div>
          <label htmlFor="people" className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
            Travelers
          </label>
          <input
            id="people"
            type="text"
            placeholder="Number of travelers"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-sm focus:outline-none focus:border-gray-400 dark:bg-gray-800 dark:text-gray-100 text-sm"
            {...register("people", { required: "Number of travelers is required" })}
          />
          {errors.people && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{errors.people.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
            Budget
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div 
              className={`border rounded-sm p-2 text-center cursor-pointer transition-all ${budgetValue === 'Low Budget' ? 'bg-gray-100 border-gray-400 dark:bg-gray-700 dark:border-gray-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
              onClick={() => setValue('budget', 'Low Budget')}
            >
              <span className="text-xs text-gray-600 dark:text-gray-300">Low Budget</span>
            </div>
            <div 
              className={`border rounded-sm p-2 text-center cursor-pointer transition-all ${budgetValue === 'Mid Range' ? 'bg-gray-100 border-gray-400 dark:bg-gray-700 dark:border-gray-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
              onClick={() => setValue('budget', 'Mid Range')}
            >
              <span className="text-xs text-gray-600 dark:text-gray-300">Mid Range</span>
            </div>
            <div 
              className={`border rounded-sm p-2 text-center cursor-pointer transition-all ${budgetValue === 'Rich Kid' ? 'bg-gray-100 border-gray-400 dark:bg-gray-700 dark:border-gray-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
              onClick={() => setValue('budget', 'Rich Kid')}
            >
              <span className="text-xs text-gray-600 dark:text-gray-300">Rich Kid</span>
            </div>
          </div>
          <input
            type="hidden"
            {...register("budget", { required: "Budget is required" })}
          />
          {errors.budget && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{errors.budget.message}</p>}
        </div>
        
        <div>
          <label htmlFor="restrictions" className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
            Restrictions
          </label>
          <input
            id="restrictions"
            type="text"
            placeholder="Dietary or other restrictions"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-sm focus:outline-none focus:border-gray-400 dark:bg-gray-800 dark:text-gray-100 text-sm"
            {...register("restrictions")}
          />
        </div>
        
        <div>
          <label htmlFor="transportationMode" className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
            Transportation
          </label>
          <input
            id="transportationMode"
            type="text"
            placeholder="Preferred transportation"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-sm focus:outline-none focus:border-gray-400 dark:bg-gray-800 dark:text-gray-100 text-sm"
            {...register("transportationMode")}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="additionalInfo" className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
          Additional Info
        </label>
        <textarea
          id="additionalInfo"
          placeholder="Any other information"
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-sm focus:outline-none focus:border-gray-400 dark:bg-gray-800 dark:text-gray-100 text-sm h-24"
          {...register("additionalInfo")}
        ></textarea>
      </div>
      
      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm rounded-sm transition-all duration-200 disabled:bg-gray-400"
        >
          {loading ? 'Creating itinerary...' : 'Plan My Vacation'}
        </button>
      </div>
    </form>
  );
}
