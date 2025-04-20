import { useState, useEffect } from 'react';
import { Plus, Filter, Search, Clock, Calendar, Dumbbell, X } from 'lucide-react';
import { useWorkout } from '../contexts/WorkoutContext';
import WorkoutCard from '../components/Workouts/WorkoutCard';

function WorkoutTracker() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout } = useWorkout();
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [exerciseInput, setExerciseInput] = useState({
  name: '',
  category: '',
  muscle: ''
});
  
  // Apply filters whenever workouts, search query, or filters change
  useEffect(() => {
    applyFilters();
  }, [workouts, searchQuery, categoryFilter, dateFilter]);
  
  // Apply all filters to workouts
  const applyFilters = () => {
    let filtered = [...workouts];
    
    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(workout => 
        workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.exercises?.some(ex => 
          ex.exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.exercise.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(workout => 
        workout.exercises?.some(ex => ex.exercise.category === categoryFilter)
      );
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      if (dateFilter === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (dateFilter === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (dateFilter === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      }
      
      filtered = filtered.filter(workout => new Date(workout.date) >= startDate);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredWorkouts(filtered);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setDateFilter('all');
  };
  
  // Open modal to add new workout
  const openAddModal = () => {
    setCurrentWorkout(null);
    setShowModal(true);
  };
  
  // Open modal to edit existing workout
  const openEditModal = (workout) => {
    setCurrentWorkout(workout);
    setShowModal(true);
  };
  
  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setCurrentWorkout(null);
  };
  
  // Handle workout deletion
  const handleDeleteWorkout = (id) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      deleteWorkout(id);
    }
  };
  
  // Extract unique categories from workouts
  const getCategories = () => {
    const categories = new Set();
    
    workouts.forEach(workout => {
      workout.exercises?.forEach(ex => {
        categories.add(ex.exercise.category);
      });
    });
    
    return Array.from(categories);
  };
  
  // Mock function for adding/editing workouts (would be expanded in a real app)
  const handleSaveWorkout = (e) => {
    e.preventDefault();
  
    const workoutData = {
      title: document.getElementById('workout-title').value,
      date: document.getElementById('workout-date').value,
      duration: parseInt(document.getElementById('workout-duration').value),
      caloriesBurned: parseInt(document.getElementById('workout-calories').value),
      notes: document.getElementById('workout-notes').value,
      exercises: exercises
    };
  
    if (currentWorkout) {
      updateWorkout(currentWorkout.id, workoutData);
    } else {
      addWorkout(workoutData);
    }
  
    setExercises([]);
    closeModal();
  };
  
  return (
    <div className="pt-20 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Workout Tracker</h2>
            <p className="text-gray-600 mt-1">Log and monitor your workouts to track your progress</p>
          </div>
          
          <button 
            onClick={openAddModal}
            className="mt-3 sm:mt-0 btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Log Workout
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative w-full md:w-auto md:flex-grow md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 py-2"
              />
            </div>
            
            <div className="flex items-center space-x-2 w-full md:w-auto">
              {/* Category filter */}
              <div className="relative flex-grow md:flex-grow-0">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="input-field py-2 pl-9 appearance-none pr-8"
                >
                  <option value="">All Categories</option>
                  {getCategories().map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
              </div>
              
              {/* Date filter */}
              <div className="relative flex-grow md:flex-grow-0">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="input-field py-2 pl-9 appearance-none pr-8"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
              </div>
              
              {/* Reset filters */}
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Applied filters */}
          {(searchQuery || categoryFilter || dateFilter !== 'all') && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-600">Filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="ml-1 text-gray-500 hover:text-gray-700">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {categoryFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter('')} className="ml-1 text-gray-500 hover:text-gray-700">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {dateFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Date: {dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
                  <button onClick={() => setDateFilter('all')} className="ml-1 text-gray-500 hover:text-gray-700">
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Workout list */}
        <div>
          {filteredWorkouts.length > 0 ? (
            <div>
              {filteredWorkouts.map((workout) => (
                <WorkoutCard 
                  key={workout.id} 
                  workout={workout} 
                  onEdit={openEditModal}
                  onDelete={handleDeleteWorkout}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              {workouts.length > 0 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No matching workouts found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
                  <button onClick={resetFilters} className="btn-primary">
                    Reset filters
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No workouts yet</h3>
                  <p className="text-gray-600 mb-4">Log your first workout to start tracking your fitness journey</p>
                  <button onClick={openAddModal} className="btn-primary">
                    Log workout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Add/Edit Workout Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
              
              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSaveWorkout}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                        {currentWorkout ? 'Edit Workout' : 'Log Workout'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {currentWorkout ? 'Update your workout details' : 'Record your workout session'}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="workout-title" className="form-label">
                          Workout Title
                        </label>
                        <input
                          type="text"
                          id="workout-title"
                          className="input-field"
                          placeholder="e.g., Morning Run, Leg Day, etc."
                          defaultValue={currentWorkout?.title || ''}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="workout-date" className="form-label">
                            Date
                          </label>
                          <input
                            type="date"
                            id="workout-date"
                            className="input-field"
                            defaultValue={currentWorkout?.date 
                              ? new Date(currentWorkout.date).toISOString().split('T')[0]
                              : new Date().toISOString().split('T')[0]
                            }
                          />
                        </div>
                        <div>
                          <label htmlFor="workout-duration" className="form-label">
                            Duration (minutes)
                          </label>
                          <input
                            type="number"
                            id="workout-duration"
                            className="input-field"
                            min="1"
                            placeholder="60"
                            defaultValue={currentWorkout?.duration || ''}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="workout-calories" className="form-label">
                          Calories Burned
                        </label>
                        <input
                          type="number"
                          id="workout-calories"
                          className="input-field"
                          min="0"
                          placeholder="300"
                          defaultValue={currentWorkout?.caloriesBurned || ''}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="workout-notes" className="form-label">
                          Notes (optional)
                        </label>
                        <textarea
                          id="workout-notes"
                          rows="3"
                          className="input-field"
                          placeholder="How did you feel? Any achievements?"
                          defaultValue={currentWorkout?.notes || ''}
                        ></textarea>
                      </div>
                      
                      <div>
  <label className="form-label">Exercises</label>
  <p className="text-xs text-gray-500 mb-2">Add exercises to your workout</p>

  <div className="space-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <input
        type="text"
        placeholder="Exercise name"
        value={exerciseInput.name}
        onChange={(e) => setExerciseInput({ ...exerciseInput, name: e.target.value })}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Category (e.g. Strength)"
        value={exerciseInput.category}
        onChange={(e) => setExerciseInput({ ...exerciseInput, category: e.target.value })}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Muscle (e.g. Chest)"
        value={exerciseInput.muscle}
        onChange={(e) => setExerciseInput({ ...exerciseInput, muscle: e.target.value })}
        className="input-field"
      />
    </div>

    <button
      type="button"
      onClick={() => {
        if (exerciseInput.name && exerciseInput.category && exerciseInput.muscle) {
          setExercises([...exercises, {
            exercise: { ...exerciseInput },
            sets: [] // no sets for now
          }]);
          setExerciseInput({ name: '', category: '', muscle: '' });
        }
      }}
      className="btn-primary"
    >
      Add Exercise
    </button>

    <div className="mt-3 space-y-2">
      {exercises.length > 0 ? (
        exercises.map((ex, i) => (
          <div key={i} className="text-sm bg-gray-100 p-2 rounded-md">
            {ex.exercise.name} — {ex.exercise.category} ({ex.exercise.muscle})
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No exercises added yet</p>
      )}
    </div>
  </div>
</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {currentWorkout ? 'Update Workout' : 'Save Workout'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutTracker;