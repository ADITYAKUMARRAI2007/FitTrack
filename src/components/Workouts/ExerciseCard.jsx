import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

function ExerciseCard({ exercise, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div 
      className="card overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-md group"
      onClick={() => onSelect(exercise)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={exercise.imageUrl || 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=600'} 
          alt={exercise.name}
          className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
        
        <div className="absolute top-3 right-3 flex space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{exercise.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{exercise.muscle}</p>
          </div>
          
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {exercise.category}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 line-clamp-2">
          {exercise.description}
        </p>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Equipment: <span className="font-medium">{exercise.equipment}</span>
          </span>
          
          <button 
            className={`flex items-center text-xs font-medium ${isHovered ? 'text-primary' : 'text-gray-700'} transition-colors`}
          >
            View Details
            <ArrowRight size={14} className={`ml-1 transform transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExerciseCard;