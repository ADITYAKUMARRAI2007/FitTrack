import { useState, useEffect } from 'react';
import { Plus, Filter, Search, Calendar, Utensils, X, ChevronLeft, ChevronRight, } from 'lucide-react';
import { useNutrition } from '../contexts/NutritionContext';
import MealCard from '../components/Nutrition/MealCard';

function NutritionTracker() {
  const { mealEntries, addMealEntry, updateMealEntry, deleteMealEntry, getNutritionStats } = useNutrition();
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [nutritionStats, setNutritionStats] = useState({
    totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    goals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    remaining: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    percentages: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    entries: []
  });
  const [foodInput, setFoodInput] = useState({
    name: '',
    category: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const handleAddFood = () => {
  if (!foodInput.name || !foodInput.calories) return;

  const newFood = {
    food: { ...foodInput },
    quantity: 1 // default for now
  };

  setSelectedFoods(prev => [...prev, newFood]);
  setFoodInput({});
};

const handleRemoveFood = (index) => {
  setSelectedFoods(prev => prev.filter((_, i) => i !== index));
};

  useEffect(() => {
    const stats = getNutritionStats(selectedDate);
    setNutritionStats(stats);
  }, [selectedDate, mealEntries]);

  useEffect(() => {
    applyFilters();
  }, [mealEntries, searchQuery, mealTypeFilter, selectedDate]);

  
  
  const applyFilters = () => {
    console.log("Applying filters...");
    console.log("Meal entries before filter:", mealEntries);
  
    // Get today's date (ignoring time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log("Today's date (normalized):", today);
  
    // Filter meals that were added today
    const filtered = mealEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      console.log("Entry date:", entryDate, "Original date string:", entry.date);
      
      // Compare dates
      const isToday = entryDate.getTime() === today.getTime();
      console.log("Is today?", isToday);
      return isToday;
    });
  
    console.log("Filtered entries (added today):", filtered);
  
    // Apply other filters if needed (like search or meal type)
    let result = [...filtered]; // Create a copy to avoid const reassignment
    
    if (searchQuery) {
      result = result.filter(entry =>
        entry.foods?.some(food =>
          food.food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.food.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      console.log("After search query filter:", result);
    }
  
    if (mealTypeFilter) {
      result = result.filter(entry => entry.mealType === mealTypeFilter);
      console.log("After meal type filter:", result);
    }
  
    // Sort entries by date (newest first)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    // Set the filtered entries
    setFilteredEntries(result);
    console.log("Final filtered entries:", result);
};


  const resetFilters = () => {
    setSearchQuery('');
    setMealTypeFilter('');
  };

  const openAddModal = () => {
    setCurrentMeal(null);
    setSelectedFoods([]);
    setShowModal(true);
  };

  const openEditModal = (meal) => {
    setCurrentMeal(meal);
    setSelectedFoods(meal.foods || []);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentMeal(null);
    setSelectedFoods([]);
  };

  const handleDeleteMeal = (id) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      deleteMealEntry(id);
    }
  };

  const getMealTypes = () => {
    const types = new Set();
    mealEntries.forEach(entry => types.add(entry.mealType));
    return Array.from(types);
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  };
  const handleSaveMeal = (e) => {
    e.preventDefault();
  
    // If there is no food selected, show an alert
    if (selectedFoods.length === 0) {
      alert("Please select at least one food!");
      return;
    }
  
    const form = e.target;
    const mealType = form['meal-type'].value;  // Using meal-type from form
    const date = new Date(form['meal-date'].value);
  
    // Normalize to noon so that it always matches date filters
    date.setHours(12, 0, 0, 0);
  
    const notes = form['meal-notes'].value;
  
    const newMeal = {
      id: currentMeal?.id || Date.now(),
      mealType,  // This will be the correct mealType
      date,
      notes,
      foods: selectedFoods
    };
  
    if (currentMeal) {
      updateMealEntry(currentMeal.id, newMeal); // ✅ Pass ID and updatedData separately
    } else {
      addMealEntry(newMeal);
    }
  
    // Reset inputs and close modal
    setFoodInput({ name: '', category: '', calories: '', protein: '', carbs: '', fat: '' });
    setSelectedFoods([]);
    closeModal();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="pt-20 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nutrition Tracker</h2>
            <p className="text-gray-600 mt-1">Track your daily meals and nutrition intake</p>
          </div>
          
          <button 
            onClick={openAddModal}
            className="mt-3 sm:mt-0 btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add Meal
          </button>
        </div>
        
        {/* Date selector and nutrition summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <button 
                onClick={() => changeDate(-1)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              
              <div className="mx-2 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {formatDate(selectedDate)}
                </h3>
                <p className="text-sm text-gray-500">
                  {isToday(selectedDate) ? 'Today' : ''}
                </p>
              </div>
              
              <button 
                onClick={() => changeDate(1)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>
            </div>
            
            <button
              onClick={() => setSelectedDate(new Date())}
              className="text-primary text-sm font-medium hover:text-primary-dark"
            >
              Today
            </button>
          </div>
          
          {/* Nutrition summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Calories</h4>
              <div className="flex justify-between items-baseline">
                <p className="text-2xl font-semibold">{nutritionStats.totals.calories}</p>
                <p className="text-sm text-gray-500">/ {nutritionStats.goals.calories}</p>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${nutritionStats.percentages.calories}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {nutritionStats.remaining.calories > 0 
                  ? `${nutritionStats.remaining.calories} kcal remaining` 
                  : 'Goal reached'}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Protein</h4>
              <div className="flex justify-between items-baseline">
                <p className="text-2xl font-semibold">{nutritionStats.totals.protein}g</p>
                <p className="text-sm text-gray-500">/ {nutritionStats.goals.protein}g</p>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${nutritionStats.percentages.protein}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {nutritionStats.remaining.protein > 0 
                  ? `${nutritionStats.remaining.protein}g remaining` 
                  : 'Goal reached'}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Carbs</h4>
              <div className="flex justify-between items-baseline">
                <p className="text-2xl font-semibold">{nutritionStats.totals.carbs}g</p>
                <p className="text-sm text-gray-500">/ {nutritionStats.goals.carbs}g</p>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${nutritionStats.percentages.carbs}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {nutritionStats.remaining.carbs > 0 
                  ? `${nutritionStats.remaining.carbs}g remaining` 
                  : 'Goal reached'}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Fat</h4>
              <div className="flex justify-between items-baseline">
                <p className="text-2xl font-semibold">{nutritionStats.totals.fat}g</p>
                <p className="text-sm text-gray-500">/ {nutritionStats.goals.fat}g</p>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${nutritionStats.percentages.fat}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {nutritionStats.remaining.fat > 0 
                  ? `${nutritionStats.remaining.fat}g remaining` 
                  : 'Goal reached'}
              </p>
            </div>
          </div>
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
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 py-2"
              />
            </div>
            
            <div className="flex items-center space-x-2 w-full md:w-auto">
              {/* Meal type filter */}
              <div className="relative flex-grow md:flex-grow-0">
                <select
                  value={mealTypeFilter}
                  onChange={(e) => setMealTypeFilter(e.target.value)}
                  className="input-field py-2 pl-9 appearance-none pr-8"
                >
                  <option value="">All Meal Types</option>
                  {getMealTypes().map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
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
          {(searchQuery || mealTypeFilter) && (
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
              
              {mealTypeFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Meal Type: {mealTypeFilter}
                  <button onClick={() => setMealTypeFilter('')} className="ml-1 text-gray-500 hover:text-gray-700">
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Meal entries list */}
        <div>
          {filteredEntries.length > 0 ? (
            <div>
              {filteredEntries.map((meal) => (
                <MealCard 
                  key={meal.id} 
                  meal={meal} 
                  onEdit={openEditModal}
                  onDelete={handleDeleteMeal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              {Array.isArray(nutritionStats.entries) && nutritionStats.entries.length > 0 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No matching meals found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
                  <button onClick={resetFilters} className="btn-primary">
                    Reset filters
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No meals logged for this day</h3>
                  <p className="text-gray-600 mb-4">Start tracking your nutrition by adding meals</p>
                  <button onClick={openAddModal} className="btn-primary">
                    Add meal
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Add/Edit Meal Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
              
              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSaveMeal}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                        {currentMeal ? 'Edit Meal' : 'Add Meal'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {currentMeal ? 'Update your meal details' : 'Log your food intake'}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="meal-type" className="form-label">
                            Meal Type
                          </label>
                          <select
                            id="meal-type"
                            className="input-field"
                            defaultValue={currentMeal?.mealType || ''}
                          >
                            <option value="" disabled>Select meal type</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Snack">Snack</option>
                            <option value="Pre-workout">Pre-workout</option>
                            <option value="Post-workout">Post-workout</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="meal-date" className="form-label">
                            Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            id="meal-date"
                            className="input-field"
                            defaultValue={currentMeal?.date 
                              ? new Date(currentMeal.date).toISOString().slice(0, 16)
                              : new Date().toISOString().slice(0, 16)
                            }
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="form-label">Foods</label>
                        <p className="text-xs text-gray-500 mb-2">Add foods to your meal</p>
                        
{/* Food Input Form */}
<div className="bg-gray-50 p-4 rounded-lg space-y-3">
  <div className="grid grid-cols-2 gap-3">
    <input
      type="text"
      placeholder="Food name"
      className="input-field"
      value={foodInput.name || ''}
      onChange={(e) => setFoodInput({ ...foodInput, name: e.target.value })}
    />
    <input
      type="text"
      placeholder="Category (e.g., Fruit)"
      className="input-field"
      value={foodInput.category || ''}
      onChange={(e) => setFoodInput({ ...foodInput, category: e.target.value })}
    />
    <input
      type="number"
      placeholder="Calories"
      className="input-field"
      value={foodInput.calories || ''}
      onChange={(e) => setFoodInput({ ...foodInput, calories: Number(e.target.value) })}
    />
    <input
      type="number"
      placeholder="Protein (g)"
      className="input-field"
      value={foodInput.protein || ''}
      onChange={(e) => setFoodInput({ ...foodInput, protein: Number(e.target.value) })}
    />
    <input
      type="number"
      placeholder="Carbs (g)"
      className="input-field"
      value={foodInput.carbs || ''}
      onChange={(e) => setFoodInput({ ...foodInput, carbs: Number(e.target.value) })}
    />
    <input
      type="number"
      placeholder="Fat (g)"
      className="input-field"
      value={foodInput.fat || ''}
      onChange={(e) => setFoodInput({ ...foodInput, fat: Number(e.target.value) })}
    />
  </div>

  <button
    type="button"
    onClick={handleAddFood}
    className="btn-primary w-full"
  >
    Add Food
  </button>
</div>

{/* Selected Foods List */}
{selectedFoods.length > 0 && (
  <ul className="mt-4 space-y-2">
    {selectedFoods.map((item, index) => (
      <li key={index} className="flex justify-between items-center text-sm bg-white p-2 rounded-lg shadow-sm">
        <div>
          <p className="font-medium">{item.food.name}</p>
          <p className="text-xs text-gray-500">{item.food.category} • {item.food.calories} kcal</p>
        </div>
        <button
          type="button"
          onClick={() => handleRemoveFood(index)}
          className="text-xs text-red-600 hover:underline"
        >
          Remove
        </button>
      </li>
    ))}
  </ul>
)}
                      </div>
                      
                      <div>
                        <label htmlFor="meal-notes" className="form-label">
                          Notes (optional)
                        </label>
                        <textarea
                          id="meal-notes"
                          rows="2"
                          className="input-field"
                          placeholder="How did you feel after eating? Any observations?"
                          defaultValue={currentMeal?.notes || ''}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {currentMeal ? 'Update Meal' : 'Save Meal'}
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

export default NutritionTracker;
