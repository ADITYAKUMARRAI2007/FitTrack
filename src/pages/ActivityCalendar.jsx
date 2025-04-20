import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useWorkout } from '../contexts/WorkoutContext';
import { useNutrition } from '../contexts/NutritionContext';

function ActivityCalendar() {
  const { workouts } = useWorkout();
  const { mealEntries } = useNutrition();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [activities, setActivities] = useState([]);
  
  // Generate calendar days for the current month
  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, workouts, mealEntries]);
  
  // Get activities for selected date
  useEffect(() => {
    getActivitiesForDate(selectedDate);
  }, [selectedDate, workouts, mealEntries]);
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayIndex = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();
    
    // Get days from previous month to fill the calendar
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, selectedDate),
        hasWorkout: workouts.some(workout => isSameDay(new Date(workout.date), date)),
        hasMeal: mealEntries.some(meal => isSameDay(new Date(meal.date), date))
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, selectedDate),
        hasWorkout: workouts.some(workout => isSameDay(new Date(workout.date), date)),
        hasMeal: mealEntries.some(meal => isSameDay(new Date(meal.date), date))
      });
    }
    
    // Next month days to fill remaining cells (6 rows x 7 days = 42 cells)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, selectedDate),
        hasWorkout: workouts.some(workout => isSameDay(new Date(workout.date), date)),
        hasMeal: mealEntries.some(meal => isSameDay(new Date(meal.date), date))
      });
    }
    
    setCalendarDays(days);
  };
  
  // Get activities for a specific date
  const getActivitiesForDate = (date) => {
    // Get workouts for the date
    const dateWorkouts = workouts.filter(workout => 
      isSameDay(new Date(workout.date), date)
    );
    
    // Get meals for the date
    const dateMeals = mealEntries.filter(meal => 
      isSameDay(new Date(meal.date), date)
    );
    
    // Combine and sort by time
    const combinedActivities = [
      ...dateWorkouts.map(workout => ({
        type: 'workout',
        data: workout,
        time: new Date(workout.date)
      })),
      ...dateMeals.map(meal => ({
        type: 'meal',
        data: meal,
        time: new Date(meal.date)
      }))
    ];
    
    // Sort by time (earliest first)
    combinedActivities.sort((a, b) => a.time - b.time);
    
    setActivities(combinedActivities);
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Go to today
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };
  
  // Select a date
  const selectDate = (date) => {
    setSelectedDate(date);
  };
  
  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  };
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  return (
    <div className="pt-20 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Activity Calendar</h2>
          <p className="text-gray-600 mt-1">View and track your workouts and meals over time</p>
        </div>
        
        {/* Calendar section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Calendar header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="ml-6 flex space-x-2">
                  <button 
                    onClick={prevMonth}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                  <button 
                    onClick={nextMonth}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
              
              <button
                onClick={goToToday}
                className="text-primary text-sm font-medium hover:text-primary-dark"
              >
                Today
              </button>
            </div>
          </div>
          
          {/* Calendar grid */}
          <div className="p-2 md:p-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-px mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={index} className="text-center py-2 text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`relative bg-white p-1 h-24 md:h-32 ${
                    !day.isCurrentMonth ? 'text-gray-400' : 
                    day.isToday ? 'bg-primary-light' : 
                    day.isSelected ? 'ring-2 ring-primary ring-inset' : ''
                  }`}
                  onClick={() => selectDate(day.date)}
                >
                  <div className="flex justify-between">
                    <span className={`text-sm ${day.isToday ? 'font-bold text-primary' : ''}`}>
                      {day.date.getDate()}
                    </span>
                    
                    <div className="flex space-x-1">
                      {day.hasWorkout && (
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                      {day.hasMeal && (
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      )}
                    </div>
                  </div>
                  
                  {/* Activity indicators */}
                  <div className="mt-1 overflow-hidden text-xs">
                    {workouts
                      .filter(workout => isSameDay(new Date(workout.date), day.date))
                      .slice(0, 1)
                      .map((workout, i) => (
                        <div key={i} className="truncate px-1 py-0.5 rounded bg-blue-100 text-blue-800 mb-0.5">
                          {workout.title}
                        </div>
                      ))
                    }
                    {mealEntries
                      .filter(meal => isSameDay(new Date(meal.date), day.date))
                      .slice(0, 1)
                      .map((meal, i) => (
                        <div key={i} className="truncate px-1 py-0.5 rounded bg-green-100 text-green-800 mb-0.5">
                          {meal.mealType}
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex space-x-6">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            <span className="text-sm text-gray-600">Workout</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm text-gray-600">Meal</span>
          </div>
        </div>
        
        {/* Selected date activities */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Activities for {formatDate(selectedDate)}
          </h3>
          
          {activities.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
              {activities.map((activity, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 rounded-full p-2 ${
                      activity.type === 'workout' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {activity.type === 'workout' ? (
                        <Dumbbell size={20} className="text-blue-600" />
                      ) : (
                        <Utensils size={20} className="text-green-600" />
                      )}
                    </div>
                    
                    <div className="ml-3 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.type === 'workout' ? activity.data.title : activity.data.mealType}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {activity.type === 'workout' 
                              ? `${activity.data.duration} min, ${activity.data.caloriesBurned} kcal`
                              : `${activity.data.totalCalories} kcal, ${activity.data.totalProtein}g protein`
                            }
                          </p>
                        </div>
                        
                        <p className="text-sm text-gray-500">{formatTime(activity.time)}</p>
                      </div>
                      
                      {activity.type === 'workout' && activity.data.exercises && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600">
                            {activity.data.exercises.length} exercises including{' '}
                            {activity.data.exercises.slice(0, 2).map(ex => ex.exercise.name).join(', ')}
                            {activity.data.exercises.length > 2 ? ' and more' : ''}
                          </p>
                        </div>
                      )}
                      
                      {activity.type === 'meal' && activity.data.foods && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600">
                            {activity.data.foods.length} foods including{' '}
                            {activity.data.foods.slice(0, 2).map(food => food.food.name).join(', ')}
                            {activity.data.foods.length > 2 ? ' and more' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No activities for this day</h3>
              <p className="text-gray-600">
                You haven't logged any workouts or meals for this day yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Temporary components to resolve missing imports
function Dumbbell(props) {
  return <span className="mr-1" {...props}>🏋️</span>;
}

function Utensils(props) {
  return <span className="mr-1" {...props}>🍴</span>;
}

export default ActivityCalendar;