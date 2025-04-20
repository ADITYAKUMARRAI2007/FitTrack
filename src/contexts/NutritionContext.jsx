import { createContext, useContext, useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { useAuth } from './AuthContext';

const NutritionContext = createContext(null);

export function useNutrition() {
  return useContext(NutritionContext);
}

export function NutritionProvider({ children }) {
  const { user } = useAuth();
  const [mealEntries, setMealEntries] = useState([]);
  const [foodDatabase, setFoodDatabase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nutritionGoals, setNutritionGoals] = useState({
    calories: 2000,
    protein: 140,
    carbs: 200,
    fat: 65
  });

  // Generate mock data when user changes
  useEffect(() => {
    if (user) {
      const foods = generateFoodDatabase();
      setFoodDatabase(foods);
      
      const entries = generateMealEntries(foods);
      setMealEntries(entries);
      
      // Set personalized nutrition goals
      setNutritionGoals({
        calories: faker.number.int({ min: 1800, max: 2500 }),
        protein: faker.number.int({ min: 100, max: 180 }),
        carbs: faker.number.int({ min: 150, max: 250 }),
        fat: faker.number.int({ min: 50, max: 80 })
      });
    } else {
      setMealEntries([]);
      setFoodDatabase([]);
    }
    setLoading(false);
  }, [user]);

  // Generate mock food database
  const generateFoodDatabase = () => {
    const categories = ['Protein', 'Carbs', 'Fruits', 'Vegetables', 'Dairy', 'Snacks'];
    const foods = [];
    
    for (let i = 0; i < 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      let name, calories, protein, carbs, fat, imageUrl;
      
      switch (category) {
        case 'Protein':
          name = faker.helpers.arrayElement(['Chicken Breast', 'Salmon', 'Eggs', 'Greek Yogurt', 'Tofu', 'Beef', 'Turkey', 'Tuna']);
          calories = faker.number.int({ min: 100, max: 300 });
          protein = faker.number.int({ min: 20, max: 30 });
          carbs = faker.number.int({ min: 0, max: 10 });
          fat = faker.number.int({ min: 2, max: 15 });
          imageUrl = 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=600';
          break;
        case 'Carbs':
          name = faker.helpers.arrayElement(['Brown Rice', 'Quinoa', 'Sweet Potato', 'Oatmeal', 'Whole Wheat Bread', 'Pasta']);
          calories = faker.number.int({ min: 150, max: 250 });
          protein = faker.number.int({ min: 3, max: 8 });
          carbs = faker.number.int({ min: 30, max: 50 });
          fat = faker.number.int({ min: 1, max: 3 });
          imageUrl = 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=600';
          break;
        case 'Fruits':
          name = faker.helpers.arrayElement(['Apple', 'Banana', 'Orange', 'Berries', 'Mango', 'Pineapple']);
          calories = faker.number.int({ min: 50, max: 120 });
          protein = faker.number.int({ min: 0, max: 2 });
          carbs = faker.number.int({ min: 15, max: 30 });
          fat = faker.number.int({ min: 0, max: 1 });
          imageUrl = 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600';
          break;
        case 'Vegetables':
          name = faker.helpers.arrayElement(['Broccoli', 'Spinach', 'Kale', 'Carrots', 'Bell Peppers', 'Zucchini']);
          calories = faker.number.int({ min: 20, max: 50 });
          protein = faker.number.int({ min: 1, max: 3 });
          carbs = faker.number.int({ min: 3, max: 10 });
          fat = faker.number.int({ min: 0, max: 1 });
          imageUrl = 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=600';
          break;
        case 'Dairy':
          name = faker.helpers.arrayElement(['Milk', 'Cheese', 'Cottage Cheese', 'Yogurt', 'Kefir']);
          calories = faker.number.int({ min: 80, max: 120 });
          protein = faker.number.int({ min: 5, max: 15 });
          carbs = faker.number.int({ min: 4, max: 12 });
          fat = faker.number.int({ min: 2, max: 8 });
          imageUrl = 'https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg?auto=compress&cs=tinysrgb&w=600';
          break;
        default: // Snacks
          name = faker.helpers.arrayElement(['Protein Bar', 'Nuts', 'Dark Chocolate', 'Hummus', 'Popcorn']);
          calories = faker.number.int({ min: 100, max: 200 });
          protein = faker.number.int({ min: 3, max: 10 });
          carbs = faker.number.int({ min: 10, max: 20 });
          fat = faker.number.int({ min: 5, max: 15 });
          imageUrl = 'https://images.pexels.com/photos/1028598/pexels-photo-1028598.jpeg?auto=compress&cs=tinysrgb&w=600';
          break;
      }
      
      foods.push({
        id: faker.string.uuid(),
        name,
        category,
        servingSize: '100g',
        calories,
        protein,
        carbs,
        fat,
        imageUrl,
        fiber: faker.number.int({ min: 0, max: 5 }),
        sugar: faker.number.int({ min: 0, max: 10 })
      });
    }
    
    return foods;
  };

  // Generate mock meal entries
  const generateMealEntries = (foods) => {
    const entries = [];
    const now = new Date();
    
    // Generate entries for the past 14 days
    for (let i = 0; i < 14; i++) {
      const entryDate = new Date(now);
      entryDate.setDate(now.getDate() - i);
      
      // Generate 3-5 meals per day
      const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-workout', 'Post-workout'];
      const numMeals = faker.number.int({ min: 3, max: 5 });
      const selectedMeals = faker.helpers.arrayElements(mealTypes, numMeals);
      
      selectedMeals.forEach(mealType => {
        const entry = {
          id: faker.string.uuid(),
          date: new Date(entryDate),
          mealType,
          foods: [],
          notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 })
        };
        
        // Add 1-4 foods to each meal
        const numFoods = faker.number.int({ min: 1, max: 4 });
        const selectedFoods = faker.helpers.arrayElements(foods, numFoods);
        
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        
        selectedFoods.forEach(food => {
          const servingQty = faker.number.float({ min: 0.5, max: 2, precision: 0.5 });
          
          const calories = Math.round(food.calories * servingQty);
          const protein = Math.round(food.protein * servingQty);
          const carbs = Math.round(food.carbs * servingQty);
          const fat = Math.round(food.fat * servingQty);
          
          totalCalories += calories;
          totalProtein += protein;
          totalCarbs += carbs;
          totalFat += fat;
          
          entry.foods.push({
            food,
            servingQty,
            calories,
            protein,
            carbs,
            fat
          });
        });
        
        entry.totalCalories = totalCalories;
        entry.totalProtein = totalProtein;
        entry.totalCarbs = totalCarbs;
        entry.totalFat = totalFat;
        
        entries.push(entry);
      });
    }
    
    return entries.sort((a, b) => b.date - a.date);
  };

  const addMealEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: entry.id || faker.string.uuid(),
      date: new Date(entry.date || new Date())
    };
  
    setMealEntries(prev => [newEntry, ...prev]);
    console.log("Updated Meal Entries: ", [newEntry, ...mealEntries]);
    return newEntry;
  };

  const updateMealEntry = (id, updatedData) => {
    setMealEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updatedData } : entry
      )
    );
  };

  const deleteMealEntry = (id) => {
    setMealEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const updateNutritionGoals = (goals) => {
    setNutritionGoals(prev => ({ ...prev, ...goals }));
  };

  const getNutritionStats = (date = new Date()) => {
    // Filter entries for the given date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const dailyEntries = mealEntries.filter(entry => 
      entry.date >= startDate && entry.date <= endDate
    );
    
    // Calculate total nutrients
    const totals = dailyEntries.reduce((acc, entry) => {
      acc.calories += entry.totalCalories || 0;
      acc.protein += entry.totalProtein || 0;
      acc.carbs += entry.totalCarbs || 0;
      acc.fat += entry.totalFat || 0;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // Calculate remaining nutrients
    const remaining = {
      calories: nutritionGoals.calories - totals.calories,
      protein: nutritionGoals.protein - totals.protein,
      carbs: nutritionGoals.carbs - totals.carbs,
      fat: nutritionGoals.fat - totals.fat
    };
    
    // Calculate percentages of goals
    const percentages = {
      calories: Math.min(100, Math.round((totals.calories / nutritionGoals.calories) * 100)),
      protein: Math.min(100, Math.round((totals.protein / nutritionGoals.protein) * 100)),
      carbs: Math.min(100, Math.round((totals.carbs / nutritionGoals.carbs) * 100)),
      fat: Math.min(100, Math.round((totals.fat / nutritionGoals.fat) * 100))
    };
    
    return {
      date,
      entries: dailyEntries,
      totals,
      goals: nutritionGoals,
      remaining,
      percentages
    };
  };

  const value = {
    mealEntries,
    foodDatabase,
    loading,
    nutritionGoals,
    addMealEntry,
    updateMealEntry,
    deleteMealEntry,
    updateNutritionGoals,
    getNutritionStats
  };

  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  );
}