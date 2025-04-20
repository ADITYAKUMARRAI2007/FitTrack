import React , { useState, useEffect } from 'react';
import { ThumbsUp, MessageSquare, Share2, User, Award, Users, TrendingUp, Filter } from 'lucide-react';
import { faker } from '@faker-js/faker';
import { useAuth } from '../contexts/AuthContext';

function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [contentType, setContentType] = useState('feed');
  const [sortType, setSortType] = useState('recent');
  
  // Generate mock data on component mount
  useEffect(() => {
    generateMockPosts();
    generateMockChallenges();
    generateMockLeaderboard();
  }, []);
  
  // Generate mock posts
  const generateMockPosts = () => {
    const mockPosts = [];
    
    for (let i = 0; i < 6; i++) {
      const postDate = new Date(Date.now() - faker.number.int({ min: 1, max: 1000000000 }));
      
      mockPosts.push({
        id: faker.string.uuid(),
        user: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          avatar: `https://i.pravatar.cc/150?u=${faker.internet.email()}`,
        },
        date: postDate,
        content: faker.lorem.paragraph(),
        likes: faker.number.int({ min: 0, max: 50 }),
        comments: faker.number.int({ min: 0, max: 20 }),
        shares: faker.number.int({ min: 0, max: 10 }),
        hasImage: faker.datatype.boolean(),
        image: faker.datatype.boolean() ? 
          `https://images.pexels.com/photos/${faker.number.int({ min: 1000000, max: 5000000 })}/pexels-photo-${faker.number.int({ min: 1000000, max: 5000000 })}.jpeg?auto=compress&cs=tinysrgb&w=600` : null,
        hasWorkout: faker.datatype.boolean(),
        workout: faker.datatype.boolean() ? {
          title: faker.helpers.arrayElement(['Morning Run', 'Upper Body', 'HIIT Session', 'Leg Day', 'Yoga Flow']),
          duration: faker.number.int({ min: 15, max: 90 }),
          calories: faker.number.int({ min: 100, max: 800 })
        } : null,
      });
    }
    
    // Sort by date (newest first)
    mockPosts.sort((a, b) => b.date - a.date);
    
    setPosts(mockPosts);
  };
  
  // Generate mock challenges
  const generateMockChallenges = () => {
    const challengeTypes = [
      {
        name: '10K Steps Daily',
        description: 'Walk 10,000 steps every day for a week',
        category: 'Walking',
        icon: '🚶‍♂️',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      {
        name: '30-Day Plank Challenge',
        description: 'Increase your plank time day by day',
        category: 'Strength',
        icon: '💪',
        color: 'bg-amber-100 text-amber-800 border-amber-200'
      },
      {
        name: 'Hydration Challenge',
        description: 'Drink 3 liters of water daily for 14 days',
        category: 'Wellness',
        icon: '💧',
        color: 'bg-cyan-100 text-cyan-800 border-cyan-200'
      },
      {
        name: '100 Push-ups Challenge',
        description: 'Complete 100 push-ups daily for 7 days',
        category: 'Strength',
        icon: '🏋️‍♂️',
        color: 'bg-green-100 text-green-800 border-green-200'
      },
      {
        name: '5K Running Challenge',
        description: 'Run 5K three times a week for a month',
        category: 'Running',
        icon: '🏃‍♂️',
        color: 'bg-red-100 text-red-800 border-red-200'
      }
    ];
    
    const mockChallenges = [];
    
    for (let i = 0; i < 5; i++) {
      const challengeType = challengeTypes[i];
      const startDate = faker.date.recent();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + faker.number.int({ min: 7, max: 30 }));
      
      mockChallenges.push({
        id: faker.string.uuid(),
        name: challengeType.name,
        description: challengeType.description,
        category: challengeType.category,
        icon: challengeType.icon,
        color: challengeType.color,
        participants: faker.number.int({ min: 10, max: 500 }),
        startDate,
        endDate,
        difficulty: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced'])
      });
    }
    
    setChallenges(mockChallenges);
  };
  
  // Generate mock leaderboard
  const generateMockLeaderboard = () => {
    const mockLeaderboard = [];
    
    // Add current user
    mockLeaderboard.push({
      id: user?.id || faker.string.uuid(),
      name: user?.name || 'You',
      avatar: user?.avatar || `https://i.pravatar.cc/150?u=${faker.internet.email()}`,
      points: faker.number.int({ min: 1000, max: 5000 }),
      rank: faker.number.int({ min: 5, max: 20 }),
      isCurrentUser: true
    });
    
    // Add other users
    for (let i = 0; i < 9; i++) {
      mockLeaderboard.push({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        avatar: `https://i.pravatar.cc/150?u=${faker.internet.email()}`,
        points: faker.number.int({ min: 1000, max: 10000 }),
        rank: i + 1,
        isCurrentUser: false
      });
    }
    
    // Sort by points (highest first)
    mockLeaderboard.sort((a, b) => b.points - a.points);
    
    // Update ranks after sorting
    mockLeaderboard.forEach((user, index) => {
      user.rank = index + 1;
    });
    
    setLeaderboard(mockLeaderboard);
  };
  
  // Format date for display
  const formatDate = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Sort posts based on selected sort type
  const getSortedPosts = () => {
    if (sortType === 'recent') {
      return [...posts].sort((a, b) => b.date - a.date);
    } else if (sortType === 'popular') {
      return [...posts].sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
    }
    return posts;
  };
  
  return (
    <div className="pt-20 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Community</h2>
          <p className="text-gray-600 mt-1">Connect, share, and motivate each other on your fitness journey</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="lg:w-8/12 space-y-6">
            {/* Content type tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  className={`flex-1 py-3 text-center font-medium text-sm ${
                    contentType === 'feed' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setContentType('feed')}
                >
                  Community Feed
                </button>
                <button
                  className={`flex-1 py-3 text-center font-medium text-sm ${
                    contentType === 'challenges' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setContentType('challenges')}
                >
                  Challenges
                </button>
                <button
                  className={`flex-1 py-3 text-center font-medium text-sm ${
                    contentType === 'leaderboard' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setContentType('leaderboard')}
                >
                  Leaderboard
                </button>
              </div>
            </div>
            
            {/* Content based on selected type */}
            {contentType === 'feed' && (
              <>
                {/* Create post */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-light overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-primary m-2" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <input
                        type="text"
                        placeholder="Share your fitness journey..."
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-3">
                    <div className="flex space-x-2">
                      <button className="flex items-center text-gray-600 text-sm hover:text-primary transition-colors">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Photo
                      </button>
                      <button className="flex items-center text-gray-600 text-sm hover:text-primary transition-colors">
                        <DumbbellIcon size={18} className="mr-1" />
                        Workout
                      </button>
                    </div>
                    <button className="px-4 py-1 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
                      Post
                    </button>
                  </div>
                </div>
                
                {/* Sort options */}
                <div className="bg-white rounded-xl shadow-sm p-3 flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-600 flex items-center">
                    <Filter size={16} className="mr-1" />
                    Sort by:
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        sortType === 'recent' 
                          ? 'bg-primary-light text-primary' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setSortType('recent')}
                    >
                      Recent
                    </button>
                    <button
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        sortType === 'popular' 
                          ? 'bg-primary-light text-primary' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setSortType('popular')}
                    >
                      Popular
                    </button>
                  </div>
                </div>
                
                {/* Posts */}
                {getSortedPosts().map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Post header */}
                    <div className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary-light overflow-hidden">
                          <img src={post.user.avatar} alt={post.user.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{post.user.name}</h3>
                          <p className="text-xs text-gray-500">{formatDate(post.date)}</p>
                        </div>
                      </div>
                      
                      {/* Post content */}
                      <div className="mt-3">
                        <p className="text-sm text-gray-800">{post.content}</p>
                      </div>
                      
                      {/* Workout card */}
                      {post.hasWorkout && post.workout && (
                        <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center">
                            <DumbbellIcon size={18} className="text-primary" />
                            <h3 className="ml-2 text-sm font-medium text-gray-900">{post.workout.title}</h3>
                          </div>
                          <div className="mt-2 flex space-x-4 text-xs text-gray-600">
                            <span>Duration: {post.workout.duration} min</span>
                            <span>Calories: {post.workout.calories} kcal</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Image */}
                      {post.hasImage && post.image && (
                        <div className="mt-3 rounded-lg overflow-hidden">
                          <img src={post.image} alt="Post image" className="w-full h-64 object-cover" />
                        </div>
                      )}
                      
                      {/* Post actions */}
                      <div className="mt-4 flex space-x-6">
                        <button className="flex items-center text-gray-600 text-sm hover:text-primary transition-colors">
                          <ThumbsUp size={16} className="mr-1" />
                          {post.likes > 0 && post.likes}
                        </button>
                        <button className="flex items-center text-gray-600 text-sm hover:text-primary transition-colors">
                          <MessageSquare size={16} className="mr-1" />
                          {post.comments > 0 && post.comments}
                        </button>
                        <button className="flex items-center text-gray-600 text-sm hover:text-primary transition-colors">
                          <Share2 size={16} className="mr-1" />
                          {post.shares > 0 && post.shares}
                        </button>
                      </div>
                    </div>
                    
                    {/* Comments preview */}
                    {post.comments > 0 && (
                      <div className="bg-gray-50 p-4 border-t border-gray-100">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary-light overflow-hidden flex-shrink-0">
                            <img src={`https://i.pravatar.cc/150?u=${faker.internet.email()}`} alt="Commenter" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="bg-white p-2 rounded-lg text-sm">
                              <p className="font-medium text-gray-900">{faker.person.firstName()}</p>
                              <p className="text-gray-800">{faker.lorem.sentence()}</p>
                            </div>
                            <div className="flex space-x-4 mt-1 text-xs text-gray-500">
                              <span>{formatDate(faker.date.recent())}</span>
                              <button className="font-medium hover:text-primary">Like</button>
                              <button className="font-medium hover:text-primary">Reply</button>
                            </div>
                          </div>
                        </div>
                        
                        {post.comments > 1 && (
                          <button className="text-primary text-sm font-medium mt-3 hover:text-primary-dark">
                            View all {post.comments} comments
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
            
            {contentType === 'challenges' && (
              <>
                {/* Challenge categories */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                  <div className="flex overflow-x-auto space-x-3 pb-2">
                    <button className="px-4 py-2 bg-primary-light text-primary rounded-lg text-sm font-medium flex-shrink-0">
                      All Challenges
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium flex-shrink-0">
                      Running
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium flex-shrink-0">
                      Strength
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium flex-shrink-0">
                      Walking
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium flex-shrink-0">
                      Wellness
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium flex-shrink-0">
                      Nutrition
                    </button>
                  </div>
                </div>
                
                {/* Featured challenge */}
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl shadow-sm p-6">
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">Featured Challenge</span>
                  <h3 className="text-2xl font-bold mt-2">Summer Fitness Challenge</h3>
                  <p className="mt-1 text-white/80">Complete 20 workouts in 30 days and win exciting prizes!</p>
                  
                  <div className="mt-4 flex items-center space-x-2 text-sm">
                    <span className="flex items-center">
                      <Users size={16} className="mr-1" />
                      1,245 participants
                    </span>
                    <span>•</span>
                    <span>Ends in 15 days</span>
                  </div>
                  
                  <button className="mt-4 px-4 py-2 bg-white text-primary rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                    Join Challenge
                  </button>
                </div>
                
                {/* Challenge list */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Active Challenges</h3>
                  
                  <div className="grid gap-4">
                    {challenges.map((challenge) => (
                      <div key={challenge.id} className={`border rounded-lg p-4 ${challenge.color}`}>
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className="text-xl mr-2">{challenge.icon}</span>
                              <h4 className="font-semibold">{challenge.name}</h4>
                            </div>
                            <p className="text-sm mt-1">{challenge.description}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium bg-white/50`}>
                            {challenge.category}
                          </span>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <Users size={16} className="mr-1" />
                            {challenge.participants} participants
                          </span>
                          <span className="px-2 py-0.5 bg-white/50 rounded-full text-xs">
                            {challenge.difficulty}
                          </span>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs">Ends {new Date(challenge.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <button className="px-3 py-1 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                            Join
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <button className="text-primary font-medium hover:text-primary-dark">
                      View All Challenges
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {contentType === 'leaderboard' && (
              <>
                {/* Leaderboard header */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Community Leaderboard</h3>
                    <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary">
                      <option>This Month</option>
                      <option>Last Month</option>
                      <option>All Time</option>
                    </select>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">Compete with community members and earn points for your activities</p>
                  
                  {/* User stats */}
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="bg-primary-light rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Your Rank</p>
                      <p className="text-xl font-bold text-primary">
                        {leaderboard.find(user => user.isCurrentUser)?.rank || '-'}
                      </p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Your Points</p>
                      <p className="text-xl font-bold text-green-600">
                        {leaderboard.find(user => user.isCurrentUser)?.points.toLocaleString() || '-'}
                      </p>
                    </div>
                    <div className="bg-amber-100 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">To Next Rank</p>
                      <p className="text-xl font-bold text-amber-600">
                        {leaderboard.find(user => user.isCurrentUser)?.rank > 1 
                          ? (leaderboard[leaderboard.findIndex(user => user.isCurrentUser) - 1].points - 
                             leaderboard.find(user => user.isCurrentUser).points).toLocaleString()
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Leaderboard table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {leaderboard.map((user) => (
                        <tr key={user.id} className={user.isCurrentUser ? 'bg-primary-light' : 'hover:bg-gray-50'}>
                          <td className="py-4 px-4 whitespace-nowrap">
                            {user.rank <= 3 ? (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                user.rank === 1 ? 'bg-amber-100 text-amber-600' :
                                user.rank === 2 ? 'bg-gray-200 text-gray-600' :
                                'bg-orange-100 text-orange-600'
                              }`}>
                                {user.rank}
                              </div>
                            ) : (
                              <span className="text-gray-600">{user.rank}</span>
                            )}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-light overflow-hidden">
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name} {user.isCurrentUser && <span className="text-primary">(You)</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                            {user.points.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-1">
                              <TrendingUp size={16} className="text-green-500" />
                              <span className="text-green-500">+{faker.number.int({ min: 50, max: 500 })}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* How to earn points */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Earn Points</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <DumbbellIcon size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Complete Workouts</p>
                        <p className="text-sm text-gray-600">10 points per minute of exercise</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Award size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Achieve Goals</p>
                        <p className="text-sm text-gray-600">500 points per completed goal</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <Users size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Join Challenges</p>
                        <p className="text-sm text-gray-600">100 points for joining, bonus for completion</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-4/12 space-y-6">
            {/* Profile card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full bg-primary-light overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-primary m-3" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{user?.name || 'Guest User'}</h3>
                  <p className="text-sm text-gray-600">Fitness Enthusiast</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 divide-x divide-gray-200">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{faker.number.int({ min: 5, max: 50 })}</p>
                  <p className="text-xs text-gray-600">Workouts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{faker.number.int({ min: 1, max: 10 })}</p>
                  <p className="text-xs text-gray-600">Goals</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{faker.number.int({ min: 2, max: 20 })}</p>
                  <p className="text-xs text-gray-600">Badges</p>
                </div>
              </div>
              
              <div className="mt-4">
                <button className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                  View Profile
                </button>
              </div>
            </div>
            
            {/* Top challenges */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Popular Challenges</h3>
                <a href="#" className="text-primary text-sm hover:text-primary-dark">View All</a>
              </div>
              
              <div className="space-y-4">
                {challenges.slice(0, 3).map((challenge) => (
                  <div key={challenge.id} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${challenge.color}`}>
                      <span className="text-xl">{challenge.icon}</span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium text-gray-900">{challenge.name}</h4>
                      <p className="text-xs text-gray-600">{challenge.participants} participants</p>
                    </div>
                    <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Suggested friends */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">People You May Know</h3>
                <a href="#" className="text-primary text-sm hover:text-primary-dark">See More</a>
              </div>
              
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-light overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${faker.internet.email()}`} alt="Person" className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-3 flex-grow">
                      <h4 className="text-sm font-medium text-gray-900">{faker.person.fullName()}</h4>
                      <p className="text-xs text-gray-600">{faker.helpers.arrayElement(['Running Enthusiast', 'Yoga Lover', 'Gym Rat', 'Fitness Coach'])}</p>
                    </div>
                    <button className="px-3 py-1 border border-primary text-primary rounded-lg text-xs font-medium hover:bg-primary-light transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent achievements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <span className="text-2xl">🏅</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Early Bird</h4>
                    <p className="text-xs text-gray-600">Completed 5 workouts before 8 AM</p>
                    <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-2xl">💪</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Strength Master</h4>
                    <p className="text-xs text-gray-600">Lifted 1000kg total in a single workout</p>
                    <p className="text-xs text-gray-400 mt-1">1 week ago</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-2xl">🏃‍♂️</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Marathon Prep</h4>
                    <p className="text-xs text-gray-600">Ran 50km in a single week</p>
                    <p className="text-xs text-gray-400 mt-1">2 weeks ago</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-primary text-sm font-medium hover:text-primary-dark">
                  View All Achievements
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create a custom DumbbellIcon component since we're using icons from lucide-react
function DumbbellIcon(props) {
  const { size = 24, className = "", ...rest } = props;
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`lucide lucide-dumbbell ${className}`}
      {...rest}
    >
      <path d="m6.5 6.5 11 11"></path>
      <path d="m21 21-1-1"></path>
      <path d="m3 3 1 1"></path>
      <path d="m18 22 4-4"></path>
      <path d="m2 6 4-4"></path>
      <path d="m3 10 7-7"></path>
      <path d="m14 21 7-7"></path>
    </svg>
  );
}

export default Community;