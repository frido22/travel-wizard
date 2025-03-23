import { DailyScheduleItem, Meal } from '@/types/itinerary';

interface DailyScheduleProps {
  day: DailyScheduleItem;
}

export default function DailySchedule({ day }: DailyScheduleProps) {
  if (!day) {
    return <div className="text-gray-600 dark:text-gray-400">No schedule information available.</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        Day {day.day}: {day.date}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Morning Activities */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Morning</h4>
          {day.morning ? (
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">{day.morning.activity}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <div><span className="font-medium">Location:</span> {day.morning.location}</div>
                <div><span className="font-medium">Duration:</span> {day.morning.duration}</div>
                {day.morning.cost > 0 && (
                  <div><span className="font-medium">Cost:</span> ${day.morning.cost}</div>
                )}
                <div><span className="font-medium">Transportation:</span> {day.morning.transportation}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400">No activities scheduled</div>
          )}
        </div>

        {/* Afternoon Activities */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Afternoon</h4>
          {day.afternoon ? (
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">{day.afternoon.activity}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <div><span className="font-medium">Location:</span> {day.afternoon.location}</div>
                <div><span className="font-medium">Duration:</span> {day.afternoon.duration}</div>
                {day.afternoon.cost > 0 && (
                  <div><span className="font-medium">Cost:</span> ${day.afternoon.cost}</div>
                )}
                <div><span className="font-medium">Transportation:</span> {day.afternoon.transportation}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400">No activities scheduled</div>
          )}
        </div>

        {/* Evening Activities */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Evening</h4>
          {day.evening ? (
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">{day.evening.activity}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <div><span className="font-medium">Location:</span> {day.evening.location}</div>
                <div><span className="font-medium">Duration:</span> {day.evening.duration}</div>
                {day.evening.cost > 0 && (
                  <div><span className="font-medium">Cost:</span> ${day.evening.cost}</div>
                )}
                <div><span className="font-medium">Transportation:</span> {day.evening.transportation}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400">No activities scheduled</div>
          )}
        </div>
      </div>

      {/* Meals */}
      {day.meals && day.meals.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Meals</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {day.meals.map((meal: Meal, index: number) => (
              <div key={index} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="font-medium text-gray-800 dark:text-gray-200">{meal.type}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <div>{meal.suggestion}</div>
                  {meal.cost > 0 && (
                    <div className="mt-1"><span className="font-medium">Cost:</span> ${meal.cost}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
