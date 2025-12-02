
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Circle, PlayCircle, FileText, BrainCircuit, Loader2, Clock, CheckSquare, Square } from 'lucide-react';
import { Course, Lesson, QuizQuestion } from '../types';
import { generateQuizForTopic } from '../services/geminiService';

interface CoursePlayerProps {
  course: Course;
  onBack: () => void;
  onToggleLesson: (lessonId: string) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onBack, onToggleLesson }) => {
  // Use ID to track active lesson so it syncs with parent updates
  const [activeLessonId, setActiveLessonId] = useState<string>(course.lessons[0]?.id);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  // Derive active lesson from props
  const activeLesson = course.lessons.find(l => l.id === activeLessonId) || course.lessons[0];

  // Reset quiz when lesson changes
  useEffect(() => {
    setShowQuiz(false);
    setQuizScore(null);
    setQuizQuestions([]);
    setSelectedAnswers({});
  }, [activeLessonId]);

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setShowQuiz(true);
    setQuizScore(null);
    setSelectedAnswers({});
    
    // In a real app, you might send the full lesson transcript to the AI.
    // Here we use the title and content summary.
    const questions = await generateQuizForTopic(activeLesson.title, "Intermediate");
    setQuizQuestions(questions);
    setQuizLoading(false);
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    setQuizScore(score);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
           <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
           <p className="text-sm text-gray-500">{activeLesson.title}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* Video Player Placeholder */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-lg group">
             {activeLesson.videoUrl ? (
               <div className="w-full h-full flex items-center justify-center text-white bg-slate-900">
                  {/* Simulate a video player */}
                  <PlayCircle className="w-16 h-16 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  <p className="absolute bottom-4 left-4 text-sm font-medium bg-black/50 px-2 py-1 rounded">Simulated Video Player</p>
               </div>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
                 No video available
               </div>
             )}
          </div>

          {/* Lesson Actions */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Lesson Materials</h2>
            <button 
              onClick={handleGenerateQuiz}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 font-medium"
            >
              <BrainCircuit className="w-5 h-5" />
              Test Knowledge with AI
            </button>
          </div>

          {/* AI Quiz Section */}
          {showQuiz && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 scroll-mt-4" id="quiz-section">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-indigo-900">AI Generated Quiz</h3>
                 <button onClick={() => setShowQuiz(false)} className="text-gray-400 hover:text-gray-600 text-sm">Close</button>
              </div>

              {quizLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                  <p>Generating adaptive questions for "{activeLesson.title}"...</p>
                </div>
              ) : quizQuestions.length > 0 ? (
                <div className="space-y-8">
                  {quizQuestions.map((q, idx) => (
                    <div key={q.id} className="space-y-3">
                      <p className="font-semibold text-gray-800 text-lg">
                        <span className="text-indigo-600 mr-2">{idx + 1}.</span>
                        {q.question}
                      </p>
                      <div className="space-y-2 pl-4">
                        {q.options.map((option, optIdx) => (
                          <label key={optIdx} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                            quizScore !== null 
                              ? optIdx === q.correctAnswer 
                                ? 'bg-green-50 border-green-200' 
                                : selectedAnswers[q.id] === optIdx 
                                  ? 'bg-red-50 border-red-200'
                                  : 'bg-gray-50 border-gray-100 opacity-60'
                              : selectedAnswers[q.id] === optIdx 
                                ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300' 
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}>
                            <input 
                              type="radio" 
                              name={`question-${q.id}`} 
                              disabled={quizScore !== null}
                              className="hidden"
                              onChange={() => setSelectedAnswers(prev => ({...prev, [q.id]: optIdx}))}
                            />
                            <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                              selectedAnswers[q.id] === optIdx ? 'border-indigo-600' : 'border-gray-400'
                            }`}>
                              {selectedAnswers[q.id] === optIdx && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
                            </div>
                            <span className="text-gray-700">{option}</span>
                            
                            {/* Result Icons */}
                            {quizScore !== null && optIdx === q.correctAnswer && (
                              <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                            )}
                          </label>
                        ))}
                      </div>
                      {/* Explanation */}
                      {quizScore !== null && (
                         <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-md mt-2 ml-4">
                           <strong>Explanation:</strong> {q.explanation}
                         </div>
                      )}
                    </div>
                  ))}

                  {quizScore === null ? (
                    <button 
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Answers
                    </button>
                  ) : (
                    <div className="bg-gray-900 text-white p-6 rounded-xl text-center">
                      <p className="text-2xl font-bold mb-2">You scored {quizScore} / {quizQuestions.length}</p>
                      <p className="text-gray-400 mb-4">{quizScore === quizQuestions.length ? 'Perfect score! Knowledge mastered.' : 'Good effort! Review the explanations above.'}</p>
                      <button 
                        onClick={() => {
                           setShowQuiz(false);
                           setQuizScore(null);
                        }}
                        className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100"
                      >
                        Continue Lesson
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-red-500 py-4">Failed to load quiz. Please try again.</div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">About this Lesson</h3>
            <p className="text-gray-600 leading-relaxed">{activeLesson.content}</p>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Ready to move on?</span>
              <button
                onClick={() => onToggleLesson(activeLesson.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeLesson.isCompleted 
                    ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {activeLesson.isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Playlist */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-900">Course Content</h3>
            <p className="text-xs text-gray-500 mt-1">{course.completedLessons} / {course.totalLessons} completed</p>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {course.lessons.map((lesson, idx) => (
              <div 
                key={lesson.id}
                className={`w-full flex items-start text-left hover:bg-gray-50 transition-colors ${
                  activeLessonId === lesson.id ? 'bg-indigo-50/50' : ''
                }`}
              >
                {/* Completion Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLesson(lesson.id);
                  }}
                  className="p-4 pr-2 text-gray-400 hover:text-indigo-600 focus:outline-none"
                  title={lesson.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                >
                  {lesson.isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                {/* Lesson Selection */}
                <button
                   onClick={() => setActiveLessonId(lesson.id)}
                   className="flex-1 py-4 pr-4 pl-1"
                >
                  <p className={`text-sm font-medium ${activeLessonId === lesson.id ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {idx + 1}. {lesson.title}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {lesson.duration}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
