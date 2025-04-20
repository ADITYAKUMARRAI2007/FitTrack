import { useState, useEffect } from 'react';
import { Dumbbell, Utensils, Target, TrendingUp, Calendar, Award, Activity, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWorkout } from '../contexts/WorkoutContext';
import { useNutrition } from '../contexts/NutritionContext';
import { useGoals } from '../contexts/GoalsContext';
import StatCard from '../components/Dashboard/StatCard';
import ActivityChart from '../components/Dashboard/ActivityChart';
import ProgressRing from '../components/Dashboard/ProgressRing';

function Dashboard() {
  const { user } = useAuth();
  const { workouts, getWorkoutStats } = useWorkout();
  const { getNutritionStats } = useNutrition();
  const { goals } = useGoals();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [activityData, setActivityData] = useState([]);
  const [workoutStats, setWorkoutStats] = useState({ 
    totalWorkouts: 0, 
    totalDuration: 0, 
    totalCalories: 0 
  });
  const [nutritionData, setNutritionData] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    percentages: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  });
  
  // Get workout statistics
  useEffect(() => {
    if (workouts.length > 0) {
      const stats = getWorkoutStats();
      setWorkoutStats(stats);
      
      // Generate activity data based on selected timeframe
      generateActivityData(selectedTimeframe);
    }
  }, [workouts, selectedTimeframe]);
  
  // Get nutrition data for today
  useEffect(() => {
    const today = new Date();
    const stats = getNutritionStats(today);
    
    setNutritionData({
      calories: stats.totals.calories,
      protein: stats.totals.protein,
      carbs: stats.totals.carbs,
      fat: stats.totals.fat,
      percentages: stats.percentages
    });
  }, []);
  
  // Generate activity data for chart based on timeframe
  const generateActivityData = (timeframe) => {
    // Group workouts by date
    const grouped = workouts.reduce((acc, workout) => {
      const date = new Date(workout.date);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date,
          workouts: [],
          duration: 0,
          calories: 0
        };
      }
      
      acc[dateKey].workouts.push(workout);
      acc[dateKey].duration += workout.duration || 0;
      acc[dateKey].calories += workout.caloriesBurned || 0;
      
      return acc;
    }, {});
    
    // Determine date range based on timeframe
    const now = new Date();
    let startDate;
    let interval;
    let format;
    
    if (timeframe === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      interval = 'day';
      format = 'day';
    } else if (timeframe === 'month') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 29);
      interval = 'day';
      format = 'short';
    } else { // year
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 11);
      interval = 'month';
      format = 'month';
    }
    
    // Generate chart data
    const data = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dayData = grouped[dateKey] || { duration: 0, calories: 0 };
      
      let name;
      if (format === 'day') {
        name = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (format === 'short') {
        name = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else { // month
        name = currentDate.toLocaleDateString('en-US', { month: 'short' });
      }
      
      data.push({
        name,
        duration: dayData.duration,
        calories: dayData.calories,
        date: new Date(currentDate)
      });
      
      // Increment date based on interval
      if (interval === 'day') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else { // month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    
    setActivityData(data);
  };
  
  // Get in-progress goals
  const activeGoals = goals.filter(goal => goal.status === 'In Progress');
  
  // Calculate goal completion percentage
  const getGoalCompletion = () => {
    if (goals.length === 0) return 0;
    const completed = goals.filter(goal => goal.status === 'Completed').length;
    return Math.round((completed / goals.length) * 100);
  };
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  return (
    <div className="pt-20 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.name.split(' ')[0]}!
          </h2>
          <p className="text-gray-600 mt-1">Here's an overview of your fitness journey.</p>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={<Dumbbell size={20} />}
            title="Workouts"
            value={workoutStats.totalWorkouts}
            prevValue={workoutStats.totalWorkouts - 3}
            unit="total"
            color="primary"
          />
          <StatCard 
            icon={<Clock size={20} />}
            title="Active Time"
            value={workoutStats.totalDuration}
            prevValue={workoutStats.totalDuration - 60}
            unit="min"
            color="accent"
          />
          <StatCard 
            icon={<Flame size={20} />}
            title="Calories Burned"
            value={workoutStats.totalCalories}
            prevValue={workoutStats.totalCalories - 200}
            unit="kcal"
            color="success"
          />
          <StatCard 
            icon={<Target size={20} />}
            title="Goal Completion"
            value={getGoalCompletion()}
            prevValue={getGoalCompletion() - 5}
            unit="%"
            color="warning"
          />
        </div>
        
        {/* Activity chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Workout Activity</h3>
              <p className="text-sm text-gray-600">Track your workout frequency and duration</p>
            </div>
            
            <div className="mt-3 sm:mt-0 bg-gray-100 rounded-lg p-1 inline-flex">
              <button 
                onClick={() => setSelectedTimeframe('week')} 
                className={`px-3 py-1 text-sm font-medium rounded ${selectedTimeframe === 'week' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setSelectedTimeframe('month')} 
                className={`px-3 py-1 text-sm font-medium rounded ${selectedTimeframe === 'month' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setSelectedTimeframe('year')} 
                className={`px-3 py-1 text-sm font-medium rounded ${selectedTimeframe === 'year' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Year
              </button>
            </div>
          </div>
          
          <ActivityChart data={activityData} dataKey="duration" barColor="rgba(var(--color-primary))" />
        </div>
        
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nutrition section */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Today's Nutrition</h3>
                <p className="text-sm text-gray-600">Daily intake progress</p>
              </div>
              <Link to="/nutrition" className="text-primary text-sm font-medium hover:text-primary-dark">
                Details
              </Link>
            </div>
            
            <div className="flex justify-center my-6">
              <ProgressRing 
                progress={nutritionData.percentages.calories} 
                size={160} 
                label="Daily Calories" 
                value={nutritionData.calories} 
                unit="kcal"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <ProgressRing 
                  progress={nutritionData.percentages.protein} 
                  size={80} 
                  label="Protein" 
                  value={nutritionData.protein} 
                  unit="g"
                  color="success"
                />
              </div>
              <div className="text-center">
                <ProgressRing 
                  progress={nutritionData.percentages.carbs} 
                  size={80} 
                  label="Carbs" 
                  value={nutritionData.carbs} 
                  unit="g"
                  color="warning"
                />
              </div>
              <div className="text-center">
                <ProgressRing 
                  progress={nutritionData.percentages.fat} 
                  size={80} 
                  label="Fat" 
                  value={nutritionData.fat} 
                  unit="g"
                  color="error"
                />
              </div>
            </div>
          </div>
          
          {/* Goals section */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
                <p className="text-sm text-gray-600">Your ongoing fitness targets</p>
              </div>
              <Link to="/goals" className="text-primary text-sm font-medium hover:text-primary-dark">
                View all
              </Link>
            </div>
            
            {activeGoals.length > 0 ? (
              <div className="space-y-4">
                {activeGoals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{goal.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{goal.description.substring(0, 60)}...</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        goal.type === 'Weight' ? 'bg-purple-100 text-purple-800' :
                        goal.type === 'Strength' ? 'bg-blue-100 text-blue-800' :
                        goal.type === 'Cardio' ? 'bg-red-100 text-red-800' :
                        goal.type === 'Nutrition' ? 'bg-green-100 text-green-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {goal.type}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress: {goal.current} / {goal.target} {goal.unit}</span>
                        <span className="text-gray-600">
                          {Math.min(100, Math.max(0, Math.round((goal.current / goal.target) * 100)))}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${Math.min(100, Math.max(0, Math.round((goal.current / goal.target) * 100)))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No active goals</h3>
                <p className="text-gray-600 mb-4">Set your first fitness goal to track your progress</p>
                <Link to="/goals" className="btn-primary">
                  Create a goal
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick actions */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/workouts" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="bg-primary-light p-3 rounded-full">
              <Dumbbell size={24} className="text-primary" />
            </div>
            <h3 className="font-medium mt-3">Log Workout</h3>
          </Link>
          <Link to="/nutrition" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Utensils size={24} className="text-green-600" />
            </div>
            <h3 className="font-medium mt-3">Track Meal</h3>
          </Link>
          <Link to="/goals" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="bg-amber-100 p-3 rounded-full">
              <Target size={24} className="text-amber-600" />
            </div>
            <h3 className="font-medium mt-3">Set Goal</h3>
          </Link>
          <Link to="/exercises" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Activity size={24} className="text-blue-600" />
            </div>
            <h3 className="font-medium mt-3">Find Exercise</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Temporary Clock component to resolve missing import
function Clock(props) {
  return <span className="mr-1" {...props}>🕒</span>;
}

export default Dashboard;