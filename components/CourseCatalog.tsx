
import React, { useState } from 'react';
import { Play, Clock, Star, User as UserIcon, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Course } from '../types';

interface CourseCatalogProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ courses, onSelectCourse }) => {
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    setExpandedCourseId(expandedCourseId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Explore Courses</h1>
        <div className="flex gap-2">
           <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500">
             <option>All Categories</option>
             <option>Frontend</option>
             <option>Backend</option>
             <option>Data Science</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map(course => {
          const isExpanded = expandedCourseId === course.id;
          return (
            <div 
              key={course.id} 
              onClick={() => handleCardClick(course.id)}
              className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer ${isExpanded ? 'ring-2 ring-indigo-500 shadow-md' : ''}`}
            >
              <div className="relative h-48 overflow-hidden">
                 <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       onSelectCourse(course.id);
                     }}
                     className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                   >
                     <Play className="w-6 h-6 fill-current" />
                   </button>
                 </div>
                 <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-indigo-900 uppercase tracking-wide">
                   {course.category}
                 </span>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg">{course.title}</h3>
                <p className={`text-gray-500 text-sm mb-4 ${isExpanded ? '' : 'line-clamp-2'}`}>
                  {course.description}
                </p>
                
                {/* Always visible stats */}
                <div className="mt-auto flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.lessons.length} Modules</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span className="font-medium text-gray-700">4.8</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center text-sm text-gray-700">
                      <UserIcon className="w-4 h-4 mr-2 text-indigo-500" />
                      <span className="font-medium">Instructor:</span>
                      <span className="ml-1 text-gray-600">{course.instructor}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                      <span className="font-medium">Enrolled:</span>
                      <span className="ml-1 text-gray-900 font-semibold">{course.enrolledAt}</span>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course.id);
                      }}
                      className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 mr-2 fill-current" />
                      Continue Learning
                    </button>
                  </div>
                )}
                
                {course.progress > 0 && !isExpanded && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-indigo-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Expand Hint Icon */}
                <div className="mt-2 flex justify-center text-gray-300">
                   {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
