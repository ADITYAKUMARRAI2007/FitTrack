import { createContext, useContext, useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { useAuth } from './AuthContext';

const WorkoutContext = createContext(null);

export function useWorkout() {
  return useContext(WorkoutContext);
}

export function WorkoutProvider({ children }) {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exerciseLibrary, setExerciseLibrary] = useState([]);

  // Generate mock workout data when user changes
  useEffect(() => {
    if (user) {
      // Generate exercise library
      const exercises = generateExerciseLibrary();
      setExerciseLibrary(exercises);
      
      // Generate past workouts
      const pastWorkouts = generatePastWorkouts(exercises);
      setWorkouts(pastWorkouts);
    } else {
      setWorkouts([]);
    }
    setLoading(false);
  }, [user]);

  // Generate mock exercise library
  const generateExerciseLibrary = () => {
    const categories = [
      'Strength', 'Cardio', 'Flexibility', 'Balance', 'Core'
    ];
    
    const exercises = [];
    
    for (let i = 0; i < 40; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      // Generate dynamic exercise based on category
      let name, muscle, description, imageUrl;
      
      if (category === 'Strength') {
        const muscles = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'];
        muscle = muscles[Math.floor(Math.random() * muscles.length)];
        
        if (muscle === 'Chest') {
          name = faker.helpers.arrayElement(['Bench Press', 'Push-ups', 'Chest Fly', 'Incline Press', 'Dips']);
          imageUrl = 'https://images.pexels.com/photos/4162452/pexels-photo-4162452.jpeg?auto=compress&cs=tinysrgb&w=600';
        } else if (muscle === 'Back') {
          name = faker.helpers.arrayElement(['Pull-ups', 'Rows', 'Lat Pulldown', 'Deadlift', 'Back Extension']);
          imageUrl = 'https://images.pexels.com/photos/4162577/pexels-photo-4162577.jpeg?auto=compress&cs=tinysrgb&w=600';
        } else if (muscle === 'Legs') {
          name = faker.helpers.arrayElement(['Squats', 'Lunges', 'Leg Press', 'Leg Extension', 'Hamstring Curl']);
          imageUrl = 'https://images.pexels.com/photos/4164511/pexels-photo-4164511.jpeg?auto=compress&cs=tinysrgb&w=600';
        } else if (muscle === 'Shoulders') {
          name = faker.helpers.arrayElement(['Shoulder Press', 'Lateral Raise', 'Front Raise', 'Face Pull', 'Shrugs']);
          imageUrl = 'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=600';
        } else {
          name = faker.helpers.arrayElement(['Bicep Curl', 'Tricep Extension', 'Hammer Curl', 'Skull Crusher', 'Chin-up']);
          imageUrl = 'https://images.pexels.com/photos/4162584/pexels-photo-4162584.jpeg?auto=compress&cs=tinysrgb&w=600';
        }
      } else if (category === 'Cardio') {
        name = faker.helpers.arrayElement(['Running', 'Cycling', 'Swimming', 'Rowing', 'Jump Rope', 'Elliptical', 'Stair Climber']);
        muscle = 'Full Body';
        imageUrl = 'https://images.pexels.com/photos/4162579/pexels-photo-4162579.jpeg?auto=compress&cs=tinysrgb&w=600';
      } else if (category === 'Flexibility') {
        name = faker.helpers.arrayElement(['Hamstring Stretch', 'Quad Stretch', 'Shoulder Stretch', 'Hip Flexor Stretch', 'Yoga Flow']);
        muscle = 'Multiple';
        imageUrl = 'https://images.pexels.com/photos/4056538/pexels-photo-4056538.jpeg?auto=compress&cs=tinysrgb&w=600';
      } else if (category === 'Balance') {
        name = faker.helpers.arrayElement(['Single-Leg Stand', 'Bosu Ball Squat', 'Stability Ball Exercise', 'Balance Board', 'Yoga Poses']);
        muscle = 'Core and Stabilizers';
        imageUrl = 'https://images.pexels.com/photos/4325484/pexels-photo-4325484.jpeg?auto=compress&cs=tinysrgb&w=600';
      } else {
        name = faker.helpers.arrayElement(['Plank', 'Crunch', 'Russian Twist', 'Leg Raise', 'Mountain Climber']);
        muscle = 'Core';
        imageUrl = 'https://images.pexels.com/photos/4162450/pexels-photo-4162450.jpeg?auto=compress&cs=tinysrgb&w=600';
      }
      
      description = faker.lorem.paragraph();
      
      exercises.push({
        id: faker.string.uuid(),
        name,
        category,
        muscle,
        description,
        imageUrl,
        difficulty: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced']),
        equipment: faker.helpers.arrayElement(['None', 'Dumbbells', 'Barbell', 'Machine', 'Bodyweight', 'Resistance Band']),
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder URL
      });
    }
    
    return exercises;
  };

  // Generate mock past workouts
  const generatePastWorkouts = (exercises) => {
    const workouts = [];
    const now = new Date();
    
    // Generate workouts for the past 30 days
    for (let i = 0; i < 15; i++) {
      const workoutDate = new Date(now);
      workoutDate.setDate(now.getDate() - faker.number.int({ min: 0, max: 30 }));
      
      // Create a workout
      const workout = {
        id: faker.string.uuid(),
        date: workoutDate,
        title: faker.helpers.arrayElement([
          'Morning Workout', 'Evening Session', 'Leg Day', 'Push Day', 
          'Pull Day', 'Cardio Session', 'Full Body Workout', 'Quick HIIT'
        ]),
        duration: faker.number.int({ min: 15, max: 120 }),
        caloriesBurned: faker.number.int({ min: 100, max: 800 }),
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.7 }),
        completed: true,
        exercises: []
      };
      
      // Add 3-8 exercises to the workout
      const numExercises = faker.number.int({ min: 3, max: 8 });
      const selectedExercises = faker.helpers.arrayElements(exercises, numExercises);
      
      selectedExercises.forEach(exercise => {
        const exerciseEntry = {
          exercise: exercise,
          sets: []
        };
        
        // Add 3-5 sets for each exercise
        const numSets = faker.number.int({ min: 3, max: 5 });
        for (let j = 0; j < numSets; j++) {
          if (exercise.category === 'Cardio') {
            exerciseEntry.sets.push({
              type: 'cardio',
              duration: faker.number.int({ min: 5, max: 30 }),
              distance: faker.number.float({ min: 0.5, max: 5, precision: 0.1 }),
              completed: true
            });
          } else {
            exerciseEntry.sets.push({
              type: 'strength',
              reps: faker.number.int({ min: 5, max: 15 }),
              weight: faker.number.int({ min: 5, max: 100 }),
              completed: true
            });
          }
        }
        
        workout.exercises.push(exerciseEntry);
      });
      
      workouts.push(workout);
    }
    
    return workouts;
  };

  const addWorkout = (workout) => {
    const newWorkout = {
      id: faker.string.uuid(),
      ...workout,
      date: new Date(workout.date || new Date())
    };
    
    setWorkouts(prev => [newWorkout, ...prev]);
    return newWorkout;
  };

  const updateWorkout = (id, updatedData) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === id ? { ...workout, ...updatedData } : workout
      )
    );
  };

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  };

  const getWorkoutStats = () => {
    if (workouts.length === 0) return {
      totalWorkouts: 0,
      totalDuration: 0,
      totalCalories: 0,
      averageDuration: 0,
      workoutsByCategory: {}
    };

    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    
    // Group workouts by category
    const workoutsByCategory = workouts.reduce((acc, workout) => {
      // Get the primary category from the first exercise
      const primaryCategory = workout.exercises?.[0]?.exercise?.category || 'Other';
      
      acc[primaryCategory] = (acc[primaryCategory] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      averageDuration: totalWorkouts > 0 ? totalDuration / totalWorkouts : 0,
      workoutsByCategory
    };
  };

  const value = {
    workouts,
    loading,
    exerciseLibrary,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutStats
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}