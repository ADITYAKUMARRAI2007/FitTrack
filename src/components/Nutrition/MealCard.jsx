import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';

function MealCard({ meal, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get meal type color
  const getMealTypeColor = (mealType) => {
    switch (mealType) {
      case 'Breakfast':
        return 'bg-amber-100 text-amber-800';
      case 'Lunch':
        return 'bg-green-100 text-green-800';
      case 'Dinner':
        return 'bg-blue-100 text-blue-800';
      case 'Snack':
        return 'bg-purple-100 text-purple-800';
      case 'Pre-workout':
        return 'bg-red-100 text-red-800';
      case 'Post-workout':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`card mb-4 overflow-hidden transition-all duration-300 ${expanded ? 'shadow-md' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex-grow">
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getMealTypeColor(meal.mealType)}`}>
              {meal.mealType}
            </span>
            <div className="flex items-center text-gray-600 text-sm ml-3">
              <Clock size={16} className="mr-1" />
              {formatTime(meal.date)}
            </div>
          </div>

          <div className="mt-3">
            <div className="grid grid-cols-4 gap-2 mb-1">
              <div className="col-span-2">
                <span className="text-xs text-gray-500">Calories</span>
                <p className="text-base font-medium">{meal.totalCalories} kcal</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Protein</span>
                <p className="text-base font-medium">{meal.totalProtein}g</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Carbs</span>
                <p className="text-base font-medium">{meal.totalCarbs}g</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center mt-3 sm:mt-0">
          <button 
            onClick={() => onEdit(meal)}
            className="text-sm font-medium text-primary hover:text-primary-dark px-3 py-1 transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(meal.id)}
            className="text-sm font-medium text-gray-600 hover:text-error px-3 py-1 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={toggleExpanded}
            className="ml-2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={expanded ? 'Collapse details' : 'Show details'}
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      <div 
        className={`mt-4 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pt-2 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Foods:</h4>
          <ul className="space-y-3">
            {meal.foods?.map((foodEntry, index) => (
              <li key={index} className="bg-gray-50 rounded-lg p-3 flex items-center">
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    src={foodEntry.food.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                    alt={foodEntry.food.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h5 className="font-medium text-gray-900">{foodEntry.food.name}</h5>
                    <span className="text-xs text-gray-600 inline-block px-2 py-0.5 bg-gray-200 rounded-full">
                      {foodEntry.food.category}
                    </span>
                  </div>

                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-600">
                      {foodEntry.servingQty} x {foodEntry.food.servingSize}
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-xs text-gray-600">{foodEntry.calories} kcal</span>
                  </div>
                </div>

                <div className="ml-4 flex-shrink-0 grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="bg-red-50 px-2 py-1 rounded">
                    <span className="font-medium text-red-700">{foodEntry.protein}g</span>
                    <div className="text-gray-500">P</div>
                  </div>
                  <div className="bg-amber-50 px-2 py-1 rounded">
                    <span className="font-medium text-amber-700">{foodEntry.carbs}g</span>
                    <div className="text-gray-500">C</div>
                  </div>
                  <div className="bg-blue-50 px-2 py-1 rounded">
                    <span className="font-medium text-blue-700">{foodEntry.fat}g</span>
                    <div className="text-gray-500">F</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {meal.notes && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
              <p className="text-sm text-gray-600">{meal.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MealCard;