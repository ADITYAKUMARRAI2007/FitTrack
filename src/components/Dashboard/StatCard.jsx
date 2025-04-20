import { useEffect, useState } from 'react';

function StatCard({ icon, title, value, prevValue, unit, color = 'primary', growth = true }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [showPercentage, setShowPercentage] = useState(false);
  
  useEffect(() => {
    // Animate the value counting up
    let start = 0;
    const end = parseInt(value);
    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      setAnimatedValue(Math.min(start, end));
      
      if (start >= end) {
        clearInterval(timer);
        setShowPercentage(true);
      }
    }, 16);
    
    return () => {
      clearInterval(timer);
    };
  }, [value]);
  
  // Calculate percentage change
  const percentage = prevValue ? Math.round(((value - prevValue) / prevValue) * 100) : 0;
  const isPositive = percentage > 0;
  const isNegative = percentage < 0;
  
  // Apply color variants
  let colorClasses;
  switch (color) {
    case 'primary':
      colorClasses = 'bg-primary-light text-primary';
      break;
    case 'accent':
      colorClasses = 'bg-accent-light text-accent';
      break;
    case 'success':
      colorClasses = 'bg-green-100 text-green-600';
      break;
    case 'warning':
      colorClasses = 'bg-amber-100 text-amber-600';
      break;
    case 'error':
      colorClasses = 'bg-red-100 text-red-600';
      break;
    default:
      colorClasses = 'bg-primary-light text-primary';
  }
  
  return (
    <div className="card hover:translate-y-[-4px] transition-all">
      <div className="flex items-start justify-between">
        <div>
          <div className={`p-2 rounded-lg ${colorClasses} inline-flex`}>
            {icon}
          </div>
          <h3 className="text-gray-500 text-sm font-medium mt-3">{title}</h3>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold">
              {Math.round(animatedValue)}
              <span className="ml-1 text-sm font-normal text-gray-500">{unit}</span>
            </p>
          </div>
        </div>
        
        {showPercentage && prevValue && (
          <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isPositive 
              ? growth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              : isNegative
                ? growth ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
          }`}>
            <svg 
              className={`-ml-1 mr-0.5 flex-shrink-0 self-center h-3 w-3 ${
                isPositive 
                  ? growth ? 'text-green-500' : 'text-red-500 transform rotate-180'
                  : isNegative
                    ? growth ? 'text-red-500 transform rotate-180' : 'text-green-500'
                    : 'text-gray-500'
              }`}
              fill="currentColor" 
              viewBox="0 0 20 20" 
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d={isPositive === growth || isNegative !== growth
                  ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                }
                clipRule="evenodd"
              />
            </svg>
            {Math.abs(percentage)}%
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;