import { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Edit2, Lock, LogOut, Target, Dumbbell, Weight } from 'lucide-react'; // Add Target here
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    height: user?.height || '',
    weight: user?.weight || '',
    birthday: user?.birthday || '',
    address: user?.address || '',
  });
  const navigate = useNavigate();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setEditing(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="pt-20 pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Profile sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-primary-light flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={64} className="text-primary" />
                  )}
                </div>
                
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500">Member since {formatDate(user?.joinDate)}</p>
                
                <div className="w-full mt-6 space-y-3">
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 size={16} />
                    <span>Edit Profile</span>
                  </button>
                  
                  <button
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Lock size={16} />
                    <span>Change Password</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Height</span>
                  <span className="font-medium">{user?.height || '-'} cm</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium">{user?.weight || '-'} kg</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">BMI</span>
                  <span className="font-medium">
                    {user?.height && user?.weight
                      ? Math.round((user.weight / Math.pow(user.height / 100, 2)) * 10) / 10
                      : '-'}
                  </span>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Goals</h4>
                  <ul className="space-y-2">
                    {user?.goals && user.goals.length > 0 ? (
                      user.goals.map((goal, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                          <span className="text-sm">{goal}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">No goals set</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile content */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-primary text-sm font-medium hover:text-primary-dark flex items-center"
                  >
                    <Edit2 size={16} className="mr-1" />
                    Edit
                  </button>
                )}
              </div>
              
              {editing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="form-label">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="input-field pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="form-label">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="input-field pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="form-label">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="input-field pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="birthday" className="form-label">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="date"
                            id="birthday"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleInputChange}
                            className="input-field pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="height" className="form-label">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          id="height"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="input-field"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="weight" className="form-label">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          id="weight"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="input-field"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                      <p className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <span>{user?.name || '-'}</span>
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                      <p className="flex items-center">
                        <Mail size={16} className="text-gray-400 mr-2" />
                        <span>{user?.email || '-'}</span>
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                      <p className="flex items-center">
                        <Phone size={16} className="text-gray-400 mr-2" />
                        <span>{user?.phone || '-'}</span>
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Date of Birth</h4>
                      <p className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span>{user?.birthday ? formatDate(user.birthday) : '-'}</span>
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Height</h4>
                      <p>{user?.height ? `${user.height} cm` : '-'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Weight</h4>
                      <p>{user?.weight ? `${user.weight} kg` : '-'}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                    <p className="flex items-start">
                      <MapPin size={16} className="text-gray-400 mr-2 mt-0.5" />
                      <span>{user?.address || '-'}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Activity history */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                    <Dumbbell size={20} className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Completed a workout</p>
                    <p className="text-xs text-gray-500">Morning Workout - 45 minutes</p>
                    <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                    <Target size={20} className="text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Reached a goal</p>
                    <p className="text-xs text-gray-500">Run 5K in 25 minutes</p>
                    <p className="text-xs text-gray-400 mt-1">4 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
                    <Weight size={20} className="text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Updated weight</p>
                    <p className="text-xs text-gray-500">74.5 kg (-0.5 kg)</p>
                    <p className="text-xs text-gray-400 mt-1">1 week ago</p>
                  </div>
                </div>
                
                <div className="text-center pt-2">
                  <button className="text-sm text-primary font-medium hover:text-primary-dark">
                    View all activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;