'use client';

import { useForm } from 'react-hook-form';
import { FormInputs } from '@/types/itinerary';
import { useState } from 'react';

interface VacationPlannerFormProps {
  onSubmit: (data: FormInputs) => Promise<void>;
  loading: boolean;
}

export default function VacationPlannerForm({ onSubmit, loading }: VacationPlannerFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormInputs>();
  const [excitement, setExcitement] = useState(5);
  const budgetValue = watch('budget') || '';
  
  const getExcitementEmoji = () => {
    const emojis = ['😴', '🙂', '😊', '😃', '🤩', '🎉', '🚀', '🤯', '🔥', '💯', '✨'];
    return emojis[Math.min(excitement, emojis.length - 1)];
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
      <div className="absolute -top-12 right-0 text-sm font-medium text-gray-700 dark:text-gray-300">
        <span className="mr-2">Excitement Level: {getExcitementEmoji()}</span>
        <input 
          type="range" 
          min="0" 
          max="10" 
          value={excitement} 
          onChange={(e) => setExcitement(parseInt(e.target.value))}
          className="accent-blue-600"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Dream Destination 🗺️
          </label>
          <input
            id="destination"
            type="text"
            placeholder="Where are we escaping to? Paris? Mars? Your in-laws?"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            {...register("destination", { required: "We need to know where to send the postcards from!" })}
          />
          {errors.destination && <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>}
        </div>
        
        <div>
          <label htmlFor="dates" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Freedom Dates 📅
          </label>
          <div className="flex space-x-2">
            <input
              id="startDate"
              type="date"
              className="w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              onChange={(e) => {
                const endDate = document.getElementById('endDate') as HTMLInputElement;
                setValue('dates', `${e.target.value} to ${endDate?.value || ''}`);
              }}
            />
            <span className="flex items-center">to</span>
            <input
              id="endDate"
              type="date"
              className="w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              onChange={(e) => {
                const startDate = document.getElementById('startDate') as HTMLInputElement;
                setValue('dates', `${startDate?.value || ''} to ${e.target.value}`);
              }}
            />
          </div>
          <input
            type="hidden"
            {...register("dates", { required: "Time machines are expensive, we need actual dates!" })}
          />
          {errors.dates && <p className="mt-1 text-sm text-red-600">{errors.dates.message}</p>}
        </div>
        
        <div>
          <label htmlFor="people" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Partners in Crime 👯
          </label>
          <input
            id="people"
            type="text"
            placeholder="Who's joining this adventure? (2 adults, 1 tiny human, etc.)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            {...register("people", { required: "Solo traveler or bringing the whole circus?" })}
          />
          {errors.people && <p className="mt-1 text-sm text-red-600">{errors.people.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Money to Burn 💸
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div 
              className={`border rounded-md p-3 text-center cursor-pointer transition-all ${budgetValue === 'Low Budget' ? 'bg-blue-100 border-blue-500 dark:bg-blue-900' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              onClick={() => setValue('budget', 'Low Budget')}
            >
              <span className="block text-xl mb-1">🪙</span>
              <span className="text-sm">Low Budget</span>
            </div>
            <div 
              className={`border rounded-md p-3 text-center cursor-pointer transition-all ${budgetValue === 'Mid Range' ? 'bg-blue-100 border-blue-500 dark:bg-blue-900' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              onClick={() => setValue('budget', 'Mid Range')}
            >
              <span className="block text-xl mb-1">💵</span>
              <span className="text-sm">Mid Range</span>
            </div>
            <div 
              className={`border rounded-md p-3 text-center cursor-pointer transition-all ${budgetValue === 'Rich Kid' ? 'bg-blue-100 border-blue-500 dark:bg-blue-900' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              onClick={() => setValue('budget', 'Rich Kid')}
            >
              <span className="block text-xl mb-1">💎</span>
              <span className="text-sm">Rich Kid</span>
            </div>
          </div>
          <input
            type="hidden"
            {...register("budget", { required: "We need to know if we're planning for street food or Michelin stars!" })}
          />
          {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>}
        </div>
        
        <div>
          <label htmlFor="restrictions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            No-Go Zone 🚫
          </label>
          <input
            id="restrictions"
            type="text"
            placeholder="Any dietary kryptonite or phobias? (e.g., no cilantro, fear of clowns)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            {...register("restrictions")}
          />
        </div>
        
        <div>
          <label htmlFor="transportationMode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            How You Roll 🚗
          </label>
          <input
            id="transportationMode"
            type="text"
            placeholder="Teleportation not available yet. (Walking, Uber, Jetpack?)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            {...register("transportationMode")}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tell Me More ✨
        </label>
        <textarea
          id="additionalInfo"
          placeholder="Any other wishes, dreams, or random thoughts? (e.g., 'I want to see the Northern Lights' or 'No museums please!')"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white h-24"
          {...register("additionalInfo")}
        ></textarea>
      </div>
      
      <div className="flex flex-col items-center space-y-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-all duration-200 disabled:bg-blue-400 transform hover:scale-105"
        >
          {loading ? 'Summoning Travel Wizards... 🧙‍♂️' : 'Plan My Best Vacation Ever! 🏝️'}
        </button>
        {!loading && (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">*No actual wizards were harmed in the planning of this trip</p>
        )}
      </div>
    </form>
  );
}
