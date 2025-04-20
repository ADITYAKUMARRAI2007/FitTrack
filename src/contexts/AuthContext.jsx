import { createContext, useContext, useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('fittrack_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock successful login
        if (email && password) {
          const user = {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email,
            avatar: `https://i.pravatar.cc/150?u=${email}`,
            joinDate: faker.date.past(),
            height: faker.number.int({ min: 150, max: 200 }),
            weight: faker.number.int({ min: 50, max: 100 }),
            goals: ['Lose weight', 'Build muscle', 'Stay active'],
          };
          
          setUser(user);
          localStorage.setItem('fittrack_user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const register = (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          const user = {
            id: faker.string.uuid(),
            name,
            email,
            avatar: `https://i.pravatar.cc/150?u=${email}`,
            joinDate: new Date(),
            height: 175,
            weight: 70,
            goals: ['Stay active'],
          };
          
          setUser(user);
          localStorage.setItem('fittrack_user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid information'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fittrack_user');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('fittrack_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}