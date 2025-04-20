import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Utensils, Target, Flag, Calendar, Users, BookOpen } from 'lucide-react';

function Sidebar() {
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <Home size={20} />
    },
    {
      name: 'Workouts',
      path: '/workouts',
      icon: <Dumbbell size={20} />
    },
    {
      name: 'Nutrition',
      path: '/nutrition',
      icon: <Utensils size={20} />
    },
    {
      name: 'Goals',
      path: '/goals',
      icon: <Target size={20} />
    },
    {
      name: 'Exercises',
      path: '/exercises',
      icon: <BookOpen size={20} />
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: <Calendar size={20} />
    },
  ];
  
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen pt-20 z-10">
      <div className="flex-grow px-4 py-6">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive 
                    ? 'text-primary bg-primary-light' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary-light'
                }`
              }
              end={item.path === '/'}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
              
              {/* Active indicator */}
              {({ isActive }) => isActive && (
                <span className="ml-auto w-1.5 h-5 bg-primary rounded-full" />
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-primary-light rounded-lg p-4">
          <h3 className="text-sm font-semibold text-primary mb-2">Premium Feature</h3>
          <p className="text-xs text-gray-600 mb-3">Unlock personalized workout plans and nutrition coaching.</p>
          <button className="w-full px-3 py-2 bg-primary text-white text-xs font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;