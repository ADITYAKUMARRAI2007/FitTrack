import { createContext, useContext, useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { useAuth } from './AuthContext';

const GoalsContext = createContext(null);

export function useGoals() {
  return useContext(GoalsContext);
}

export function GoalsProvider({ children }) {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate mock data when user changes
  useEffect(() => {
    if (user) {
      setGoals(generateGoals());
    } else {
      setGoals([]);
    }
    setLoading(false);
  }, [user]);

  // Generate mock goals
  const generateGoals = () => {
    const goalTypes = [
      'Weight', 'Strength', 'Cardio', 'Nutrition', 'Habit'
    ];
    
    const goals = [];
    
    // Generate a variety of goals
    for (let i = 0; i < 6; i++) {
      const goalType = goalTypes[i % goalTypes.length];
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - faker.number.int({ min: 10, max: 30 }));
      
      const endDate = new Date(now);
      endDate.setDate(now.getDate() + faker.number.int({ min: 30, max: 90 }));
      
      let title, target, current, unit, description, progressType;
      
      switch (goalType) {
        case 'Weight':
          if (faker.helpers.arrayElement([true, false])) {
            // Weight loss
            title = 'Lose Weight';
            const startWeight = faker.number.int({ min: 70, max: 100 });
            const targetWeight = startWeight - faker.number.int({ min: 5, max: 15 });
            target = targetWeight;
            // Current is somewhere between start and target
            current = startWeight - faker.number.float({ 
              min: 0, 
              max: startWeight - targetWeight,
              precision: 0.1
            });
            unit = 'kg';
            description = 'Achieve a healthier weight through balanced nutrition and regular exercise.';
            progressType = 'decrease';
          } else {
            // Muscle gain
            title = 'Gain Muscle Mass';
            const startWeight = faker.number.int({ min: 60, max: 80 });
            const targetWeight = startWeight + faker.number.int({ min: 3, max: 10 });
            target = targetWeight;
            // Current is somewhere between start and target
            current = startWeight + faker.number.float({ 
              min: 0, 
              max: targetWeight - startWeight,
              precision: 0.1
            });
            unit = 'kg';
            description = 'Build lean muscle mass through strength training and proper protein intake.';
            progressType = 'increase';
          }
          break;
          
        case 'Strength':
          title = faker.helpers.arrayElement([
            'Bench Press PR', 'Squat PR', 'Deadlift PR', '10 Pull-ups', 'Handstand'
          ]);
          target = faker.number.int({ min: 60, max: 150 });
          current = faker.number.int({ min: Math.floor(target * 0.7), max: target });
          unit = title.includes('Pull-ups') ? 'reps' : 'kg';
          description = `Increase ${title.toLowerCase()} through progressive overload training.`;
          progressType = 'increase';
          break;
          
        case 'Cardio':
          title = faker.helpers.arrayElement([
            '5K Run', '10K Run', 'Half Marathon', 'Cycling 100km', 'Swimming 1500m'
          ]);
          if (title.includes('5K')) {
            // Time goal (lower is better)
            target = 25 * 60; // 25 minutes in seconds
            current = faker.number.int({ min: target, max: target + 600 }); // 0-10 minutes slower
            unit = 'seconds';
            description = 'Improve 5K run time through interval training and consistent running.';
            progressType = 'decrease';
          } else {
            // Distance goal
            target = title.includes('10K') ? 10 : 
                    title.includes('Half') ? 21.1 : 
                    title.includes('Cycling') ? 100 : 1.5;
            current = faker.number.float({ 
              min: target * 0.5, 
              max: target,
              precision: 0.1 
            });
            unit = title.includes('Swimming') ? 'km' : 'km';
            description = `Complete a ${title} through gradual distance building and endurance training.`;
            progressType = 'increase';
          }
          break;
          
        case 'Nutrition':
          title = faker.helpers.arrayElement([
            'Daily Protein Goal', 'Reduced Sugar Intake', 'Water Consumption', 'Meal Prep Days'
          ]);
          if (title === 'Daily Protein Goal') {
            target = faker.number.int({ min: 120, max: 180 });
            current = faker.number.int({ min: 90, max: target });
            unit = 'g';
          } else if (title === 'Reduced Sugar Intake') {
            target = faker.number.int({ min: 20, max: 30 });
            current = faker.number.int({ min: target, max: 60 });
            unit = 'g';
            progressType = 'decrease';
          } else if (title === 'Water Consumption') {
            target = faker.number.int({ min: 2500, max: 4000 });
            current = faker.number.int({ min: 1500, max: target });
            unit = 'ml';
          } else {
            target = faker.number.int({ min: 3, max: 5 });
            current = faker.number.int({ min: 1, max: target });
            unit = 'days';
          }
          description = `Maintain ${title.toLowerCase()} for better overall health and fitness performance.`;
          progressType = progressType || 'increase';
          break;
          
        default: // Habit
          title = faker.helpers.arrayElement([
            'Weekly Workout Sessions', 'Meditation Sessions', 'Steps Per Day', 'Sleep Hours'
          ]);
          if (title === 'Weekly Workout Sessions') {
            target = faker.number.int({ min: 4, max: 6 });
            current = faker.number.int({ min: 1, max: target });
            unit = 'sessions';
          } else if (title === 'Meditation Sessions') {
            target = faker.number.int({ min: 10, max: 30 });
            current = faker.number.int({ min: 3, max: target });
            unit = 'minutes';
          } else if (title === 'Steps Per Day') {
            target = faker.number.int({ min: 8000, max: 12000 });
            current = faker.number.int({ min: 5000, max: target });
            unit = 'steps';
          } else {
            target = faker.number.int({ min: 7, max: 9 });
            current = faker.number.int({ min: 5, max: target });
            unit = 'hours';
          }
          description = `Build a consistent ${title.toLowerCase()} habit for long-term health benefits.`;
          progressType = 'increase';
          break;
      }
      
      goals.push({
        id: faker.string.uuid(),
        title,
        type: goalType,
        description,
        startDate,
        endDate,
        target,
        current,
        unit,
        progressType: progressType || 'increase',
        status: current >= target ? 'Completed' : 'In Progress',
        checkpoints: generateCheckpoints(startDate, endDate, current, target)
      });
    }
    
    return goals;
  };

  // Generate checkpoint data for a goal
  const generateCheckpoints = (startDate, endDate, current, target) => {
    const checkpoints = [];
    const timeSpan = endDate.getTime() - startDate.getTime();
    const now = new Date().getTime();
    
    // Generate 3-5 checkpoints
    const numCheckpoints = faker.number.int({ min: 3, max: 5 });
    
    for (let i = 0; i < numCheckpoints; i++) {
      const checkpointDate = new Date(startDate.getTime() + (timeSpan * ((i + 1) / (numCheckpoints + 1))));
      const isPast = checkpointDate.getTime() < now;
      
      // Calculate expected progress based on time elapsed
      const expectedProgress = target * ((i + 1) / (numCheckpoints + 1));
      
      // For past checkpoints, add some variance to the actual value
      const actualValue = isPast 
        ? expectedProgress * faker.number.float({ min: 0.8, max: 1.2, precision: 0.01 })
        : null;
      
      checkpoints.push({
        id: faker.string.uuid(),
        date: checkpointDate,
        expected: Math.round(expectedProgress * 10) / 10,
        actual: actualValue ? Math.round(actualValue * 10) / 10 : null,
        notes: isPast ? faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.7 }) : null
      });
    }
    
    return checkpoints.sort((a, b) => a.date - b.date);
  };

  const addGoal = (goal) => {
    const newGoal = {
      id: faker.string.uuid(),
      ...goal,
      startDate: new Date(goal.startDate || new Date()),
      endDate: new Date(goal.endDate),
      status: goal.current >= goal.target ? 'Completed' : 'In Progress',
      checkpoints: []
    };
    
    setGoals(prev => [newGoal, ...prev]);
    return newGoal;
  };

  const updateGoal = (id, updatedData) => {
    setGoals(prev => 
      prev.map(goal => {
        if (goal.id === id) {
          const updated = { ...goal, ...updatedData };
          // Update status
          updated.status = updated.current >= updated.target ? 'Completed' : 'In Progress';
          return updated;
        }
        return goal;
      })
    );
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const addCheckpoint = (goalId, checkpoint) => {
    setGoals(prev => 
      prev.map(goal => {
        if (goal.id === goalId) {
          const newCheckpoint = {
            id: faker.string.uuid(),
            ...checkpoint,
            date: new Date(checkpoint.date)
          };
          return {
            ...goal,
            checkpoints: [...goal.checkpoints, newCheckpoint].sort((a, b) => a.date - b.date)
          };
        }
        return goal;
      })
    );
  };

  const value = {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    addCheckpoint
  };

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
}