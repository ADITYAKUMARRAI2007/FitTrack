import { useState } from 'react';
import { Calendar, Target, ChevronDown, ChevronUp, CheckCircle, Clock } from 'lucide-react';

function GoalCard({ goal, onEdit, onDelete, onAddCheckpoint }) {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (goal.progressType === 'decrease') {
      // For goals where lower values are better (e.g., reducing weight, improving time)
      const startValue = goal.checkpoints[0]?.expected * 2 || goal.current * 1.5; // Estimate starting value if not available
      const totalChange = startValue - goal.target;
      const currentChange = startValue - goal.current;
      return Math.min(100, Math.max(0, Math.round((currentChange / totalChange) * 100)));
    } else {
      // For goals where higher values are better (e.g., increasing strength, distance)
      return Math.min(100, Math.max(0, Math.round((goal.current / goal.target) * 100)));
    }
  };
  
  const progress = calculateProgress();
  
  // Get days remaining
  const daysRemaining = Math.max(0, Math.ceil((new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24)));
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'At Risk':
        return 'bg-amber-100 text-amber-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get goal type color
  const getGoalTypeColor = (type) => {
    switch (type) {
      case 'Weight':
        return 'bg-purple-100 text-purple-800';
      case 'Strength':
        return 'bg-blue-100 text-blue-800';
      case 'Cardio':
        return 'bg-red-100 text-red-800';
      case 'Nutrition':
        return 'bg-green-100 text-green-800';
      case 'Habit':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className={`card mb-4 overflow-hidden transition-all duration-300 ${expanded ? 'shadow-md' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between">
        <div className="flex-grow">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getGoalTypeColor(goal.type)}`}>
              {goal.type}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(goal.status)}`}>
              {goal.status}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
          
          <div className="flex flex-wrap mt-3 gap-4">
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar size={16} className="mr-1" />
              {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
            </div>
            {goal.status !== 'Completed' && (
              <div className="flex items-center text-gray-600 text-sm">
                <Clock size={16} className="mr-1" />
                {daysRemaining} days left
              </div>
            )}
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{goal.progressType === 'decrease' ? 'Target:' : 'Progress:'} {goal.current} / {goal.target} {goal.unit}</span>
              <span className="text-gray-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start mt-3 sm:mt-0 sm:ml-4">
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => onEdit(goal)}
              className="text-sm font-medium text-primary hover:text-primary-dark px-3 py-1 transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(goal.id)}
              className="text-sm font-medium text-gray-600 hover:text-error px-3 py-1 transition-colors"
            >
              Delete
            </button>
            {goal.status !== 'Completed' && (
              <button 
                onClick={() => onAddCheckpoint(goal)}
                className="text-sm font-medium text-gray-600 hover:text-success px-3 py-1 transition-colors"
              >
                Log Progress
              </button>
            )}
          </div>
          
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
          <h4 className="text-sm font-medium text-gray-700 mb-2">Checkpoints:</h4>
          <div className="relative pl-6 ml-3">
            {/* Vertical line */}
            <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gray-200"></div>
            
            <ul className="space-y-5">
              {goal.checkpoints?.map((checkpoint, index) => {
                const isPast = new Date(checkpoint.date) < new Date();
                
                return (
                  <li key={index} className="relative">
                    {/* Timeline dot */}
                    <div className={`absolute -left-8 top-1.5 w-3 h-3 rounded-full ${
                      isPast 
                        ? checkpoint.actual !== null
                          ? checkpoint.actual >= checkpoint.expected
                            ? 'bg-success'
                            : 'bg-warning'
                          : 'bg-error'
                        : 'bg-gray-400'
                    }`}></div>
                    
                    <div className={`bg-gray-50 rounded-lg p-3 ${!isPast ? 'border border-dashed border-gray-300' : ''}`}>
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium">{formatDate(checkpoint.date)}</span>
                        {isPast && checkpoint.actual !== null && (
                          <div 
                            className={`flex items-center text-xs px-2 py-0.5 rounded-full ${
                              checkpoint.actual >= checkpoint.expected
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {checkpoint.actual >= checkpoint.expected ? (
                              <>
                                <CheckCircle size={12} className="mr-1" />
                                Achieved
                              </>
                            ) : (
                              <>
                                <Target size={12} className="mr-1" />
                                Partially Met
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Expected</div>
                          <div className="font-medium">{checkpoint.expected} {goal.unit}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Actual</div>
                          <div className="font-medium">{
                            isPast 
                              ? checkpoint.actual !== null
                                ? `${checkpoint.actual} ${goal.unit}`
                                : 'Not recorded'
                              : 'Upcoming'
                          }</div>
                        </div>
                      </div>
                      
                      {checkpoint.notes && (
                        <div className="mt-2 text-xs text-gray-600">
                          <span className="font-medium">Notes:</span> {checkpoint.notes}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalCard;