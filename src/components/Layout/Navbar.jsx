import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, Bell, BarChart2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Generate mock notifications
    if (user) {
      setNotifications([
        { id: 1, text: 'You reached your daily step goal!', isNew: true },
        { id: 2, text: 'New workout plan available', isNew: false },
        { id: 3, text: 'Your friend John completed a challenge', isNew: true }
      ]);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [user]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/workouts':
        return 'Workout Tracker';
      case '/nutrition':
        return 'Nutrition Tracker';
      case '/goals':
        return 'Goals';
      case '/exercises':
        return 'Exercise Library';
      case '/calendar':
        return 'Activity Calendar';
      case '/profile':
        return 'Profile';
      default:
        return 'FitTrack';
    }
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and page title */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <BarChart2 className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">FitTrack</span>
            </Link>
            <div className="hidden md:block ml-6">
              <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
            </div>
          </div>
          
          {/* Navigation links - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <button className="p-2 rounded-full text-gray-600 hover:text-primary hover:bg-primary-light transition-colors">
                <Bell size={20} />
                {notifications.filter(n => n.isNew).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                {notifications.length > 0 ? (
                  <div>
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${notification.isNew ? 'bg-blue-50' : ''}`}>
                        <p className="text-sm text-gray-800">{notification.text}</p>
                        {notification.isNew && (
                          <span className="inline-block mt-1 text-xs font-medium text-primary">New</span>
                        )}
                      </div>
                    ))}
                    <div className="px-4 py-2 text-center border-t border-gray-100">
                      <button className="text-xs text-primary font-medium hover:underline">View all notifications</button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-600">No new notifications</div>
                )}
              </div>
            </div>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 rounded-full group">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-primary" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                  {user?.name || 'User'}
                </span>
              </button>
              
              {/* User dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Profile
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Log out
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={toggleMobileMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-md">
          <h1 className="text-lg font-semibold text-gray-900 px-3 py-2">{getPageTitle()}</h1>
          
          <div className="border-t border-gray-200 my-2"></div>
          
          <div className="flex items-center px-3 py-2">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="text-primary" />
                )}
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">{user?.name || 'User'}</div>
              <div className="text-sm font-medium text-gray-500">{user?.email || 'user@example.com'}</div>
            </div>
            <div className="ml-auto flex items-center">
              <button className="p-2 rounded-full text-gray-600 hover:text-primary hover:bg-primary-light transition-colors relative">
                <Bell size={20} />
                {notifications.filter(n => n.isNew).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                )}
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 my-2"></div>
          
          <Link to="/profile" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-primary-light transition-colors">
            Profile
          </Link>
          
          <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-primary-light transition-colors">
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;