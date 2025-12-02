import React from 'react';
import { LayoutDashboard, BookOpen, Settings, LogOut, Menu, X, BrainCircuit } from 'lucide-react';
import { View, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
  user: User;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${
        currentView === view
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center px-6 h-16 border-b border-gray-100">
          <BrainCircuit className="w-8 h-8 text-indigo-600 mr-2" />
          <span className="text-xl font-bold text-gray-800 tracking-tight">Lumina</span>
        </div>
        
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="mb-6 px-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</h3>
            <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem view={View.COURSES} icon={BookOpen} label="My Courses" />
            <NavItem view={View.SETTINGS} icon={Settings} label="Settings" />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full object-cover" />
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-700">{user.name}</p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 h-16 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="flex items-center">
            <BrainCircuit className="w-7 h-7 text-indigo-600 mr-2" />
            <span className="text-lg font-bold text-gray-800">Lumina</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white z-20 border-b border-gray-200 shadow-lg px-4 py-4 space-y-2">
            <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem view={View.COURSES} icon={BookOpen} label="My Courses" />
            <NavItem view={View.SETTINGS} icon={Settings} label="Settings" />
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center">
               <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full" />
               <span className="ml-3 text-sm font-medium text-gray-700">{user.name}</span>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
