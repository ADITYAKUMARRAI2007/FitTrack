import { useState } from 'react';
import { Calendar, Clock, Flame, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

function WorkoutCard({ workout, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get main exercise type
  const getMainCategory = () => {
    if (!workout.exercises || workout.exercises.length === 0) return '';
    
    const categories = workout.exercises.map(ex => ex.exercise.category);
    const categoryCount = {};
    
    categories.forEach(category => {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    return Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b
    );
  };
  
  const mainCategory = getMainCategory();
  
  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Strength':
        return 'bg-blue-100 text-blue-800';
      case 'Cardio':
        return 'bg-red-100 text-red-800';
      case 'Flexibility':
        return 'bg-purple-100 text-purple-800';
      case 'Balance':
        return 'bg-amber-100 text-amber-800';
      case 'Core':
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
            <h3 className="text-lg font-semibold text-gray-900">{workout.title}</h3>
            <span className={`ml-3 text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(mainCategory)}`}>
              {mainCategory}
            </span>
          </div>
          
          <div className="flex flex-wrap mt-2 gap-4">
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar size={16} className="mr-1" />
              {formatDate(workout.date)}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Clock size={16} className="mr-1" />
              {workout.duration} min
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Flame size={16} className="mr-1" />
              {workout.caloriesBurned} kcal
            </div>
          </div>
        </div>
        
        <div className="flex items-center mt-3 sm:mt-0">
          <button 
            onClick={() => onEdit(workout)}
            className="text-sm font-medium text-primary hover:text-primary-dark px-3 py-1 transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(workout.id)}
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
        className={`mt-4 overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-2 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Exercises:</h4>
          <ul className="space-y-3">
            {workout.exercises?.map((exerciseEntry, index) => (
              <li key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{exerciseEntry.exercise.name}</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      {exerciseEntry.exercise.category} • {exerciseEntry.exercise.muscle}
                    </p>
                  </div>
                  
                  <Link 
                    to={`/exercises?id=${exerciseEntry.exercise.id}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View Details
                  </Link>
                </div>
                
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {exerciseEntry.sets.map((set, setIndex) => (
                    <div key={setIndex} className="border border-gray-200 rounded px-3 py-2 text-xs bg-white">
                      {set.type === 'cardio' ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration: {set.duration} min</span>
                          <span className="text-gray-600">Distance: {set.distance} km</span>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight: {set.weight} kg</span>
                          <span className="text-gray-600">Reps: {set.reps}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          
          {workout.notes && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
              <p className="text-sm text-gray-600">{workout.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



export default WorkoutCard;