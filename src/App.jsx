import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import WorkoutTracker from './pages/WorkoutTracker';
import NutritionTracker from './pages/NutritionTracker';
import GoalSetting from './pages/GoalSetting';
import Profile from './pages/Profile';
import ExerciseLibrary from './pages/ExerciseLibrary';
import ActivityCalendar from './pages/ActivityCalendar';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Layout/Footer';
import { useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  const { user } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const authPages = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!authPages && <Navbar />}
      
      <div className="flex-grow flex">
        {!authPages && user && <Sidebar />}
        
        <main className={`flex-grow ${!authPages ? 'p-4 md:p-6 lg:p-8' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/workouts" element={
              <PrivateRoute>
                <WorkoutTracker />
              </PrivateRoute>
            } />
            
            <Route path="/nutrition" element={
              <PrivateRoute>
                <NutritionTracker />
              </PrivateRoute>
            } />
            
            <Route path="/goals" element={
              <PrivateRoute>
                <GoalSetting />
              </PrivateRoute>
            } />
            
            <Route path="/exercises" element={
              <PrivateRoute>
                <ExerciseLibrary />
              </PrivateRoute>
            } />
            
            <Route path="/calendar" element={
              <PrivateRoute>
                <ActivityCalendar />
              </PrivateRoute>
            } />
        
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
      
      {!authPages && <Footer />}
    </div>
  );
}

export default App;