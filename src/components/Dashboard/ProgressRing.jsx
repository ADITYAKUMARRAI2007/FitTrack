import { useEffect, useState } from 'react';

function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 10, 
  label, 
  value, 
  unit,
  color = 'primary'
}) {
  const [dashArray, setDashArray] = useState(0);
  const [dashOffset, setDashOffset] = useState(0);
  
  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  useEffect(() => {
    // Set initial dash array (circumference of the circle)
    setDashArray(circumference);
    
    // Animate the progress
    const offset = circumference - (progress / 100) * circumference;
    const timer = setTimeout(() => {
      setDashOffset(offset);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [circumference, progress]);
  
  // Determine color based on prop
  let ringColor;
  switch (color) {
    case 'primary':
      ringColor = 'rgb(var(--color-primary))';
      break;
    case 'accent':
      ringColor = 'rgb(var(--color-accent))';
      break;
    case 'success':
      ringColor = 'rgb(var(--color-success))';
      break;
    case 'warning':
      ringColor = 'rgb(var(--color-warning))';
      break;
    case 'error':
      ringColor = 'rgb(var(--color-error))';
      break;
    default:
      ringColor = 'rgb(var(--color-primary))';
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
      
      {label && (
        <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
      )}
    </div>
  );
}

export default ProgressRing;