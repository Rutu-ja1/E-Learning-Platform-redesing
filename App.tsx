
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CourseCatalog } from './components/CourseCatalog';
import { CoursePlayer } from './components/CoursePlayer';
import { Settings } from './components/Settings';
import { View, User, Course } from './types';

// Mock Data (In a real app, this comes from your Java Spring Boot API)
const mockUser: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  streakDays: 12,
  totalPoints: 2450
};

const initialCourses: Course[] = [
  {
    id: 'c1',
    title: 'Full Stack Java Development with Spring Boot',
    description: 'Master enterprise application development using Java, Spring Boot, and React. Learn to build scalable microservices.',
    category: 'Backend',
    thumbnail: 'https://picsum.photos/seed/java/800/600',
    progress: 45,
    totalLessons: 3,
    completedLessons: 1,
    instructor: 'Dr. Sarah Smith',
    enrolledAt: 'Aug 15, 2024',
    lessons: [
      { id: 'l1', title: 'Introduction to Spring Boot', duration: '15:30', isCompleted: true, videoUrl: 'mock', content: 'Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run".' },
      { id: 'l2', title: 'Building RESTful APIs', duration: '22:15', isCompleted: false, videoUrl: 'mock', content: 'Learn how to design and implement RESTful APIs using Spring MVC, handling HTTP methods and status codes.' },
      { id: 'l3', title: 'Connecting to MySQL Database', duration: '18:45', isCompleted: false, videoUrl: 'mock', content: 'Integrate JPA and Hibernate to perform CRUD operations on a MySQL database.' },
    ]
  },
  {
    id: 'c2',
    title: 'Advanced React Patterns & Performance',
    description: 'Take your React skills to the next level. Learn hooks, context, higher-order components, and performance optimization.',
    category: 'Frontend',
    thumbnail: 'https://picsum.photos/seed/react/800/600',
    progress: 12,
    totalLessons: 18,
    completedLessons: 2,
    instructor: 'Prof. John Doe',
    enrolledAt: 'Sep 1, 2024',
    lessons: [
      { id: 'l1', title: 'React Hooks Deep Dive', duration: '20:00', isCompleted: true, videoUrl: 'mock', content: 'Understanding the lifecycle of hooks and how to build custom hooks.' },
      { id: 'l2', title: 'Context API vs Redux', duration: '25:10', isCompleted: false, videoUrl: 'mock', content: 'When to use Context API for state management and when to reach for Redux.' },
    ]
  },
  {
    id: 'c3',
    title: 'Machine Learning with Python',
    description: 'A comprehensive guide to ML algorithms, data preprocessing, and model deployment.',
    category: 'Data Science',
    thumbnail: 'https://picsum.photos/seed/ml/800/600',
    progress: 0,
    totalLessons: 30,
    completedLessons: 0,
    instructor: 'Dr. Alan Turing',
    enrolledAt: 'Sep 10, 2024',
    lessons: [
       { id: 'l1', title: 'Intro to Neural Networks', duration: '12:00', isCompleted: false, videoUrl: 'mock', content: 'Basics of how neural networks function.' }
    ]
  },
  {
    id: 'c4',
    title: 'DevOps & CI/CD Pipelines',
    description: 'Automate your deployment workflow with Jenkins, Docker, and Kubernetes.',
    category: 'DevOps',
    thumbnail: 'https://picsum.photos/seed/devops/800/600',
    progress: 80,
    totalLessons: 12,
    completedLessons: 9,
    instructor: 'Jane Engineer',
    enrolledAt: 'July 20, 2024',
    lessons: []
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    if (view !== View.PLAYER) {
      setSelectedCourseId(null);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    if (courseId === 'all') {
      setCurrentView(View.COURSES);
    } else {
      setSelectedCourseId(courseId);
      setCurrentView(View.PLAYER);
    }
  };

  const handleToggleLesson = (lessonId: string) => {
    if (!selectedCourseId) return;

    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id === selectedCourseId) {
        const updatedLessons = course.lessons.map(lesson => 
          lesson.id === lessonId 
            ? { ...lesson, isCompleted: !lesson.isCompleted }
            : lesson
        );
        
        // Recalculate progress
        const completedCount = updatedLessons.filter(l => l.isCompleted).length;
        const totalLessons = updatedLessons.length;
        const newProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        return {
          ...course,
          lessons: updatedLessons,
          completedLessons: completedCount,
          progress: newProgress
        };
      }
      return course;
    }));
  };

  const handleLogout = () => {
    // In a real app, this would clear tokens and redirect to login
    const confirm = window.confirm("Are you sure you want to log out?");
    if (confirm) {
      // For this demo, just go back to dashboard
      alert("Logged out successfully");
      setCurrentView(View.DASHBOARD);
    }
  };

  const getActiveCourse = () => courses.find(c => c.id === selectedCourseId) || courses[0];

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard user={mockUser} courses={courses} onCourseSelect={handleCourseSelect} />;
      case View.COURSES:
        return <CourseCatalog courses={courses} onSelectCourse={handleCourseSelect} />;
      case View.PLAYER:
        return selectedCourseId ? (
          <CoursePlayer 
            course={getActiveCourse()} 
            onBack={() => setCurrentView(View.COURSES)} 
            onToggleLesson={handleToggleLesson}
          />
        ) : (
          <div>Course not found</div>
        );
      case View.SETTINGS:
        return <Settings user={mockUser} onLogout={handleLogout} />;
      default:
        return <Dashboard user={mockUser} courses={courses} onCourseSelect={handleCourseSelect} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={handleNavigate} user={mockUser}>
      {renderContent()}
    </Layout>
  );
};

export default App;
