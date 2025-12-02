import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flame, Trophy, Clock, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { User, Course, Recommendation } from '../types';
import { getAIRecommendations } from '../services/geminiService';

interface DashboardProps {
  user: User;
  courses: Course[];
  onCourseSelect: (courseId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, courses, onCourseSelect }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Mock data for the chart
  const data = [
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 1.8 },
    { name: 'Wed', hours: 3.2 },
    { name: 'Thu', hours: 4.0 },
    { name: 'Fri', hours: 2.1 },
    { name: 'Sat', hours: 5.5 },
    { name: 'Sun', hours: 1.0 },
  ];

  useEffect(() => {
    // Initial fetch of AI recommendations based on mock interests
    const fetchRecs = async () => {
      setLoadingRecs(true);
      const recs = await getAIRecommendations(['React', 'Java Spring Boot', 'Machine Learning']);
      setRecommendations(recs);
      setLoadingRecs(false);
    };
    fetchRecs();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-500 mt-1">You've learned 80% more this week compared to last week.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
             <div className="bg-orange-100 p-2 rounded-lg">
                <Flame className="w-5 h-5 text-orange-600" />
             </div>
             <div>
               <p className="text-xs text-gray-500 font-medium">Streak</p>
               <p className="text-lg font-bold text-gray-900">{user.streakDays} Days</p>
             </div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
             <div className="bg-yellow-100 p-2 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-600" />
             </div>
             <div>
               <p className="text-xs text-gray-500 font-medium">Points</p>
               <p className="text-lg font-bold text-gray-900">{user.totalPoints}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Progress & Current Course */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-500" />
              Learning Activity
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                  />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]} barSize={40}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? '#4F46E5' : '#E0E7FF'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Current Courses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Continue Learning</h2>
              <button 
                onClick={() => onCourseSelect('all')}
                className="text-sm text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
              >
                View all courses
              </button>
            </div>
            <div className="space-y-4">
              {courses.slice(0, 2).map(course => (
                <div key={course.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onCourseSelect(course.id)}>
                  <div className="w-full sm:w-32 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs text-gray-500">{course.completedLessons}/{course.totalLessons} Lessons</span>
                       <span className="text-xs font-medium text-indigo-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center sm:justify-end">
                     <button className="bg-indigo-50 p-2 rounded-full text-indigo-600 hover:bg-indigo-100">
                       <ArrowRight className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - AI Recommendations */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6 rounded-2xl shadow-lg h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-white/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <h2 className="text-lg font-bold">AI Recommended Path</h2>
            </div>
            
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
              Based on your progress in <strong>Java</strong> and <strong>React</strong>, our AI suggests these next steps to boost your career growth.
            </p>

            {loadingRecs ? (
              <div className="flex flex-col items-center justify-center py-10 text-indigo-200">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-sm">Analyzing your learning patterns...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-semibold text-white">{rec.topic}</h3>
                       <span className={`text-xs px-2 py-1 rounded-full ${
                         rec.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-200' :
                         rec.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-200' :
                         'bg-red-500/20 text-red-200'
                       }`}>
                         {rec.difficulty}
                       </span>
                    </div>
                    <p className="text-xs text-indigo-200">{rec.reason}</p>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              onClick={async () => {
                setLoadingRecs(true);
                const recs = await getAIRecommendations(['System Design', 'Cloud Architecture', 'DevOps']);
                setRecommendations(recs);
                setLoadingRecs(false);
              }}
              className="w-full mt-6 py-3 bg-white text-indigo-900 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-colors"
            >
              Refresh Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
