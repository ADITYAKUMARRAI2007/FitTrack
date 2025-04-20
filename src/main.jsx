import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { NutritionProvider } from './contexts/NutritionContext';
import { GoalsProvider } from './contexts/GoalsContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WorkoutProvider>
          <NutritionProvider>
            <GoalsProvider>
              <App />
            </GoalsProvider>
          </NutritionProvider>
        </WorkoutProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);