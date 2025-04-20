import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, X, Flag } from 'lucide-react';
import { useWorkout } from '../contexts/WorkoutContext';
import ExerciseCard from '../components/Workouts/ExerciseCard';

function ExerciseLibrary() {
  const { exerciseLibrary } = useWorkout();
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  // Apply filters whenever exercises or filters change
  useEffect(() => {
    applyFilters();
  }, [exerciseLibrary, searchQuery, categoryFilter, muscleFilter, difficultyFilter, equipmentFilter]);
  
  // Apply all filters to exercises
  const applyFilters = () => {
    let filtered = [...exerciseLibrary];
    
    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(exercise => exercise.category === categoryFilter);
    }
    
    // Apply muscle filter
    if (muscleFilter) {
      filtered = filtered.filter(exercise => exercise.muscle.includes(muscleFilter));
    }
    
    // Apply difficulty filter
    if (difficultyFilter) {
      filtered = filtered.filter(exercise => exercise.difficulty === difficultyFilter);
    }
    
    // Apply equipment filter
    if (equipmentFilter) {
      filtered = filtered.filter(exercise => exercise.equipment === equipmentFilter);
    }
    
    // Sort alphabetically by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    
    setFilteredExercises(filtered);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setMuscleFilter('');
    setDifficultyFilter('');
    setEquipmentFilter('');
  };
  
  // Handle exercise selection for detailed view
  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
    setShowModal(true);
  };
  
  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };
  
  // Extract unique values for filter dropdowns
  const getUniqueValues = (property) => {
    const values = new Set();
    
    exerciseLibrary.forEach(exercise => {
      values.add(exercise[property]);
    });
    
    return Array.from(values).sort();
  };
  
  // Extract unique muscles (needs special handling as muscle isn't a direct category)
  const getUniqueMuscles = () => {
    const muscles = new Set();
    
    exerciseLibrary.forEach(exercise => {
      // Some exercises target multiple muscles
      const muscleParts = exercise.muscle.split(' and ');
      muscleParts.forEach(part => {
        const muscleNames = part.split(', ');
        muscleNames.forEach(muscle => {
          muscles.add(muscle.trim());
        });
      });
    });
    
    return Array.from(muscles).sort();
  };
  
  return (
    <div className="pt-20 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Exercise Library</h2>
          <p className="text-gray-600 mt-1">Browse and learn about different exercises for your workouts</p>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col space-y-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search exercises by name, muscle, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 py-2 w-full"
              />
            </div>
            
            {/* Filter dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="input-field py-2 pl-9 appearance-none pr-8 w-full"
                >
                  <option value="">All Categories</option>
                  {getUniqueValues('category').map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
              
              {/* Muscle filter */}
              <div className="relative">
                <select
                  value={muscleFilter}
                  onChange={(e) => setMuscleFilter(e.target.value)}
                  className="input-field py-2 pl-9 appearance-none pr-8 w-full"
                >
                  <option value="">All Muscles</option>
                  {getUniqueMuscles().map((muscle, index) => (
                    <option key={index} value={muscle}>{muscle}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                    <path d="M7 4V20M17 4V20M7 4H17M7 20H17M7 12H17M13.5 8C13.5 8 14.5 7 16 7C17.5 7 18.5 8 18.5 9.5C18.5 11 17.5 12 16 12C14.5 12 13.5 11 13.5 11M13.5 11V8M10.5 16C10.5 16 9.5 15 8 15C6.5 15 5.5 16 5.5 17.5C5.5 19 6.5 20 8 20C9.5 20 10.5 19 10.5 19M10.5 19V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
              
              {/* Difficulty filter */}
              <div className="relative">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="input-field py-2 pl-9 appearance-none pr-8 w-full"
                >
                  <option value="">All Difficulties</option>
                  {getUniqueValues('difficulty').map((difficulty, index) => (
                    <option key={index} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Flag size={18} className="text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
              
              {/* Equipment filter */}
              <div className="relative">
                <select
                  value={equipmentFilter}
                  onChange={(e) => setEquipmentFilter(e.target.value)}
                  className="input-field py-2 pl-9 appearance-none pr-8 w-full"
                >
                  <option value="">All Equipment</option>
                  {getUniqueValues('equipment').map((equipment, index) => (
                    <option key={index} value={equipment}>{equipment}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                    <path d="M18 8H17V7C17 6.45 16.55 6 16 6C15.45 6 15 6.45 15 7V8H14C13.45 8 13 8.45 13 9C13 9.55 13.45 10 14 10H15V11C15 11.55 15.45 12 16 12C16.55 12 17 11.55 17 11V10H18C18.55 10 19 9.55 19 9C19 8.45 18.55 8 18 8Z" fill="currentColor"/>
                    <path d="M18 13H6C5.33 13 4.78 13.4 4.5 13.96L2.31 18.84C2.14 19.22 2.31 19.66 2.69 19.83C3.07 20.01 3.51 19.83 3.69 19.45L4.5 17.64V20C4.5 20.55 4.95 21 5.5 21H18.5C19.05 21 19.5 20.55 19.5 20V17.64L20.31 19.45C20.49 19.83 20.93 20.01 21.31 19.83C21.69 19.66 21.86 19.22 21.69 18.84L19.5 13.96C19.22 13.4 18.67 13 18 13ZM17.5 19H6.5V16H17.5V19Z" fill="currentColor"/>
                    <path d="M11.25 5.5C11.45 5.5 11.64 5.52 11.82 5.56C11.93 5.28 12.07 5.02 12.24 4.78C11.92 4.6 11.58 4.5 11.25 4.5C10.01 4.5 9 5.51 9 6.75C9 7.99 10.01 9 11.25 9C11.58 9 11.9 8.9 12.19 8.73C12.02 8.5 11.87 8.24 11.77 7.96C11.6 8 11.43 8 11.25 8C10.56 8 10 7.44 10 6.75C10 6.06 10.56 5.5 11.25 5.5Z" fill="currentColor"/>
                    <path d="M6 4.5C4.76 4.5 3.75 5.51 3.75 6.75C3.75 7.99 4.76 9 6 9C7.24 9 8.25 7.99 8.25 6.75C8.25 5.51 7.24 4.5 6 4.5ZM6 8C5.31 8 4.75 7.44 4.75 6.75C4.75 6.06 5.31 5.5 6 5.5C6.69 5.5 7.25 6.06 7.25 6.75C7.25 7.44 6.69 8 6 8Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Reset filters button */}
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Reset filters
              </button>
            </div>
          </div>
          
          {/* Applied filters */}
          {(searchQuery || categoryFilter || muscleFilter || difficultyFilter || equipmentFilter) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-600">Active filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="ml-1 text-gray-500 hover:text-gray-700">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {categoryFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter('')} className="ml-1 text-blue-700 hover:text-blue-900">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {muscleFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Muscle: {muscleFilter}
                  <button onClick={() => setMuscleFilter('')} className="ml-1 text-purple-700 hover:text-purple-900">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {difficultyFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Difficulty: {difficultyFilter}
                  <button onClick={() => setDifficultyFilter('')} className="ml-1 text-green-700 hover:text-green-900">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {equipmentFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Equipment: {equipmentFilter}
                  <button onClick={() => setEquipmentFilter('')} className="ml-1 text-amber-700 hover:text-amber-900">
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Exercise grid */}
        <div>
          {filteredExercises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise) => (
                <ExerciseCard 
                  key={exercise.id} 
                  exercise={exercise} 
                  onSelect={handleSelectExercise}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No exercises found</h3>
              <p className="mt-1 text-gray-600 mb-4">Try adjusting your filters or search query</p>
              <button onClick={resetFilters} className="btn-primary">
                Reset filters
              </button>
            </div>
          )}
        </div>
        
        {/* Exercise Detail Modal */}
        {showModal && selectedExercise && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
              
              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                    {selectedExercise.name}
                  </h3>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500"
                    onClick={closeModal}
                  >
                    <span className="sr-only">Close</span>
                    <X size={20} />
                  </button>
                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={selectedExercise.imageUrl || 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                          alt={selectedExercise.name}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {selectedExercise.category}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedExercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          selectedExercise.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {selectedExercise.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                          {selectedExercise.equipment}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Target Muscles</h4>
                        <p className="text-sm text-gray-600">{selectedExercise.muscle}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                        <p className="text-sm text-gray-600">{selectedExercise.description}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Instructions</h4>
                        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2 pl-1">
                          <li>Start in a proper position with your back straight</li>
                          <li>Engage your core for stability throughout the movement</li>
                          <li>Perform the movement with controlled form</li>
                          <li>Focus on the muscle contraction during the exercise</li>
                          <li>Return to starting position in a controlled manner</li>
                        </ol>
                      </div>
                      
                      {selectedExercise.videoUrl && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Demonstration</h4>
                          <div className="aspect-w-16 aspect-h-9 mt-2 rounded-lg overflow-hidden">
                            <iframe 
                              width="560" 
                              height="315" 
                              src={selectedExercise.videoUrl} 
                              title={`${selectedExercise.name} demonstration`}
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                              className="w-full h-48"
                            ></iframe>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                  >
                    Add to Workout
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExerciseLibrary;