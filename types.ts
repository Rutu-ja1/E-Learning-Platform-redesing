
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lessons: Lesson[];
  instructor: string;
  enrolledAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  content?: string;
  isCompleted: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  streakDays: number;
  totalPoints: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface Recommendation {
  topic: string;
  reason: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  COURSES = 'COURSES',
  PLAYER = 'PLAYER',
  SETTINGS = 'SETTINGS',
}
