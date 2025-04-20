import { useState } from 'react';
import { Plus, Filter, CheckCircle, Clock, Calendar, Target, X } from 'lucide-react';
import { useGoals } from '../contexts/GoalsContext';
import GoalCard from '../components/Goals/GoalCard';

function GoalSetting() {
  const { goals, addGoal, updateGoal, deleteGoal, addCheckpoint } = useGoals();
  const [filteredGoals, setFilteredGoals] = useState(goals);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('date');
  const [showModal, setShowModal] = useState(false);
  const [showCheckpointModal, setShowCheckpointModal] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  

  
  // Apply all filters to goals
  const applyFilters = () => {
    let filtered = [...goals];
    
    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(goal => goal.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(goal => goal.status === statusFilter);
    }
    
    // Apply sorting
    if (sortOrder === 'date') {
      // Sort by end date (closest first)
      filtered.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    } else if (sortOrder === 'progress') {
      // Sort by progress percentage (highest first)
      filtered.sort((a, b) => {
        const calcProgress = (goal) => {
          if (goal.progressType === 'decrease') {
            const startValue = goal.checkpoints[0]?.expected * 2 || goal.current * 1.5;
            const totalChange = startValue - goal.target;
            const currentChange = startValue - goal.current;
            return Math.min(100, Math.max(0, (currentChange / totalChange) * 100));
          } else {
            return Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
          }
        };
        
        return calcProgress(b) - calcProgress(a);
      });
    } else if (sortOrder === 'name') {
      // Sort alphabetically by title
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredGoals(filtered);
  };

    // Apply filters whenever goals or filters change
    useState(() => {
      applyFilters();
    }, [goals, typeFilter, statusFilter, sortOrder]);
    
  
  // Reset all filters
  const resetFilters = () => {
    setTypeFilter('');
    setStatusFilter('');
    setSortOrder('date');
  };
  
  // Open modal to add new goal
  const openAddModal = () => {
    setCurrentGoal(null);
    setShowModal(true);
    setShowCheckpointModal(false);
  };
  
  // Open modal to edit existing goal
  const openEditModal = (goal) => {
    setCurrentGoal(goal);
    setShowModal(true);
    setShowCheckpointModal(false);
  };
  
  // Open modal to add checkpoint to goal
  const openCheckpointModal = (goal) => {
    setCurrentGoal(goal);
    setShowCheckpointModal(true);
    setShowModal(false);
  };
  
  // Close all modals
  const closeModals = () => {
    setShowModal(false);
    setShowCheckpointModal(false);
    setCurrentGoal(null);
  };
  
  // Handle goal deletion
  const handleDeleteGoal = (id) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };
  
  // Mock function for adding/editing goals (would be expanded in a real app)
  const handleSaveGoal = (e) => {
    e.preventDefault();
    // In a real implementation, we would gather all the form data here
    // For this demo, we'll just close the modal
    closeModals();
  };
  
  // Mock function for adding checkpoint (would be expanded in a real app)
  const handleAddCheckpoint = (e) => {
    e.preventDefault();
    // In a real implementation, we would gather checkpoint data here
    // For this demo, we'll just close the modal
    closeModals();
  };
  
  return (
    <div className="pt-20 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Goal Setting</h2>
            <p className="text-gray-600 mt-1">Set, track, and achieve your fitness goals</p>
          </div>
          
          <button 
            onClick={openAddModal}
            className="mt-3 sm:mt-0 btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Create Goal
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 w-full sm:w-auto sm:mr-4">
              {/* Goal type filter */}
              <div className="relative flex-grow sm:flex-grow-0">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="input-field py-2 pl-9 appearance-none pr-8"
                >
                  <option value="">All Types</option>
                  <option value="Weight">Weight</option>
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Habit">Habit</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Target size={18} className="text-gray-400" />
                </div>
              </div>
              
              {/* Goal status filter */}
              <div className="relative flex-grow sm:flex-grow-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field py-2 pl-9 appearance-none pr-8"
                >
                  <option value="">All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="At Risk">At Risk</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckCircle size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              {/* Sort order */}
              <div className="relative flex-grow sm:flex-grow-0">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="input-field py-2 pl-9 appearance-none pr-8"
                >
                  <option value="date">Sort by End Date</option>
                  <option value="progress">Sort by Progress</option>
                  <option value="name">Sort by Name</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
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
          {(typeFilter || statusFilter) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-600">Filters:</span>
              
              {typeFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Type: {typeFilter}
                  <button onClick={() => setTypeFilter('')} className="ml-1 text-blue-700 hover:text-blue-900">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {statusFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter('')} className="ml-1 text-green-700 hover:text-green-900">
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Goal list */}
        <div>
          {filteredGoals.length > 0 ? (
            <div>
              {filteredGoals.map((goal) => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal} 
                  onEdit={openEditModal}
                  onDelete={handleDeleteGoal}
                  onAddCheckpoint={openCheckpointModal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              {goals.length > 0 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No matching goals found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters</p>
                  <button onClick={resetFilters} className="btn-primary">
                    Reset filters
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No goals yet</h3>
                  <p className="text-gray-600 mb-4">Create your first fitness goal to start tracking your progress</p>
                  <button onClick={openAddModal} className="btn-primary">
                    Create goal
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Add/Edit Goal Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModals}></div>
              
              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSaveGoal}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                        {currentGoal ? 'Edit Goal' : 'Create New Goal'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {currentGoal ? 'Update your fitness goal details' : 'Set a new target for your fitness journey'}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="goal-title" className="form-label">
                          Goal Title
                        </label>
                        <input
                          type="text"
                          id="goal-title"
                          className="input-field"
                          placeholder="e.g., Lose 10 kg, Run 5K, etc."
                          defaultValue={currentGoal?.title || ''}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="goal-type" className="form-label">
                          Goal Type
                        </label>
                        <select
                          id="goal-type"
                          className="input-field"
                          defaultValue={currentGoal?.type || ''}
                        >
                          <option value="" disabled>Select goal type</option>
                          <option value="Weight">Weight</option>
                          <option value="Strength">Strength</option>
                          <option value="Cardio">Cardio</option>
                          <option value="Nutrition">Nutrition</option>
                          <option value="Habit">Habit</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="goal-start-date" className="form-label">
                            Start Date
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar size={16} className="text-gray-400" />
                            </div>
                            <input
                              type="date"
                              id="goal-start-date"
                              className="input-field pl-10"
                              defaultValue={currentGoal?.startDate 
                                ? new Date(currentGoal.startDate).toISOString().split('T')[0]
                                : new Date().toISOString().split('T')[0]
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="goal-end-date" className="form-label">
                            End Date
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar size={16} className="text-gray-400" />
                            </div>
                            <input
                              type="date"
                              id="goal-end-date"
                              className="input-field pl-10"
                              defaultValue={currentGoal?.endDate 
                                ? new Date(currentGoal.endDate).toISOString().split('T')[0]
                                : new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
                              }
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="goal-current" className="form-label">
                            Current Value
                          </label>
                          <input
                            type="number"
                            id="goal-current"
                            step="0.1"
                            className="input-field"
                            placeholder="Current value"
                            defaultValue={currentGoal?.current || ''}
                          />
                        </div>
                        <div>
                          <label htmlFor="goal-target" className="form-label">
                            Target Value
                          </label>
                          <input
                            type="number"
                            id="goal-target"
                            step="0.1"
                            className="input-field"
                            placeholder="Target to achieve"
                            defaultValue={currentGoal?.target || ''}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="goal-unit" className="form-label">
                            Unit
                          </label>
                          <input
                            type="text"
                            id="goal-unit"
                            className="input-field"
                            placeholder="e.g., kg, km, etc."
                            defaultValue={currentGoal?.unit || ''}
                          />
                        </div>
                        <div>
                          <label htmlFor="goal-progress-type" className="form-label">
                            Progress Type
                          </label>
                          <select
                            id="goal-progress-type"
                            className="input-field"
                            defaultValue={currentGoal?.progressType || 'increase'}
                          >
                            <option value="increase">Increase (higher is better)</option>
                            <option value="decrease">Decrease (lower is better)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="goal-description" className="form-label">
                          Description
                        </label>
                        <textarea
                          id="goal-description"
                          rows="3"
                          className="input-field"
                          placeholder="Describe your goal and motivation"
                          defaultValue={currentGoal?.description || ''}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {currentGoal ? 'Update Goal' : 'Create Goal'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModals}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Add Checkpoint Modal */}
        {showCheckpointModal && currentGoal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModals}></div>
              
              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleAddCheckpoint}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                        Log Progress
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Record your current progress for: <span className="font-medium">{currentGoal.title}</span>
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="checkpoint-date" className="form-label">
                          Date
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="date"
                            id="checkpoint-date"
                            className="input-field pl-10"
                            defaultValue={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="current-value" className="form-label">
                            Current Value
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="current-value"
                              step="0.1"
                              className="input-field pr-12"
                              placeholder="Enter current value"
                              defaultValue={currentGoal.current}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">{currentGoal.unit}</span>
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Your previous value: {currentGoal.current} {currentGoal.unit}
                          </p>
                        </div>
                        <div>
                          <label className="form-label">
                            Target
                          </label>
                          <div className="h-10 flex items-center bg-gray-50 rounded-lg px-3 text-gray-700 border border-gray-200">
                            {currentGoal.target} {currentGoal.unit}
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {currentGoal.progressType === 'decrease' ? 'Lower' : 'Higher'} value is better
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="checkpoint-notes" className="form-label">
                          Notes (optional)
                        </label>
                        <textarea
                          id="checkpoint-notes"
                          rows="2"
                          className="input-field"
                          placeholder="Any observations or challenges?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Save Progress
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModals}
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

export default GoalSetting;