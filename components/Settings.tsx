import React, { useState } from 'react';
import { User, Bell, Shield, Globe, HelpCircle, LogOut, ChevronRight, ChevronDown, Mail, Smartphone, Lock, Moon, Laptop } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsProps {
  user: UserType;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Mock state for interactive elements
  const [toggles, setToggles] = useState({
    emailNotifs: true,
    pushNotifs: false,
    marketing: true,
    twoFactor: false,
    darkMode: false
  });

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="relative group cursor-pointer">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-50 group-hover:border-indigo-100 transition-colors"
          />
          <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-sm">
            <User className="w-4 h-4" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
              Student
            </span>
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
              Pro Member
            </span>
          </div>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors hover:shadow-sm">
          Edit Profile
        </button>
      </div>

      {/* Settings Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          
          {/* Notifications */}
          <SettingItem 
            icon={Bell} 
            title="Notifications" 
            description="Manage your email and push notifications"
            isActive={activeSection === 'notifications'}
            onClick={() => toggleSection('notifications')}
          >
            <div className="space-y-4">
              <ToggleRow 
                icon={Mail}
                label="Email Notifications" 
                desc="Receive updates about your course progress"
                isEnabled={toggles.emailNotifs}
                onToggle={() => handleToggle('emailNotifs')}
              />
              <ToggleRow 
                icon={Smartphone}
                label="Push Notifications" 
                desc="Get real-time alerts on your mobile device"
                isEnabled={toggles.pushNotifs}
                onToggle={() => handleToggle('pushNotifs')}
              />
              <ToggleRow 
                icon={Laptop}
                label="Weekly Digest" 
                desc="A weekly summary of your learning stats"
                isEnabled={toggles.marketing}
                onToggle={() => handleToggle('marketing')}
              />
            </div>
          </SettingItem>

          {/* Security */}
          <SettingItem 
            icon={Shield} 
            title="Security & Password" 
            description="Update your password and secure your account"
            isActive={activeSection === 'security'}
            onClick={() => toggleSection('security')}
          >
            <div className="space-y-6">
              <div className="grid gap-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" placeholder="Enter new password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button className="w-fit px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                  Update Password
                </button>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <ToggleRow 
                  icon={Lock}
                  label="Two-Factor Authentication" 
                  desc="Add an extra layer of security to your account"
                  isEnabled={toggles.twoFactor}
                  onToggle={() => handleToggle('twoFactor')}
                />
              </div>
            </div>
          </SettingItem>

          {/* Language & Region */}
          <SettingItem 
            icon={Globe} 
            title="Language & Region" 
            description="English (US), Timezone: UTC-5"
            isActive={activeSection === 'language'}
            onClick={() => toggleSection('language')}
          >
             <div className="grid gap-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Language</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                    <option>English (United States)</option>
                    <option>Spanish (Español)</option>
                    <option>French (Français)</option>
                    <option>German (Deutsch)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                    <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                    <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                    <option>(UTC+00:00) London</option>
                    <option>(UTC+01:00) Paris</option>
                  </select>
                </div>
             </div>
          </SettingItem>

          {/* Help & Support */}
           <SettingItem 
            icon={HelpCircle} 
            title="Help & Support" 
            description="FAQ and customer support contacts"
            isActive={activeSection === 'help'}
            onClick={() => toggleSection('help')}
          >
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium transition-colors">
                Visit Help Center
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium transition-colors">
                Report a Technical Issue
              </button>
              <button className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100 text-indigo-700 text-sm font-medium transition-colors">
                Contact Customer Support
              </button>
            </div>
          </SettingItem>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-200 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Log Out</p>
              <p className="text-xs text-red-500/70">Sign out of your account session</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
        </button>
      </div>
      
      <p className="text-center text-xs text-gray-400 pt-4">Lumina Learning Platform v1.0.0</p>
    </div>
  );
};

const SettingItem = ({ 
  icon: Icon, 
  title, 
  description, 
  isActive, 
  onClick, 
  children 
}: { 
  icon: any, 
  title: string, 
  description: string, 
  isActive: boolean, 
  onClick: () => void,
  children?: React.ReactNode
}) => (
  <div className="transition-all duration-200">
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 transition-colors group text-left ${isActive ? 'bg-gray-50' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className={`font-semibold transition-colors ${isActive ? 'text-indigo-700' : 'text-gray-900 group-hover:text-indigo-700'}`}>{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {isActive ? (
        <ChevronDown className="w-5 h-5 text-indigo-600" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400" />
      )}
    </button>
    
    {isActive && (
      <div className="px-4 pb-6 md:px-6 md:pb-6 bg-gray-50 border-t border-gray-100 animate-in slide-in-from-top-1 duration-200">
        <div className="pt-4 ml-0 md:ml-16">
          {children}
        </div>
      </div>
    )}
  </div>
);

const ToggleRow = ({ icon: Icon, label, desc, isEnabled, onToggle }: { icon: any, label: string, desc: string, isEnabled: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-3">
       <div className="hidden md:flex p-2 bg-white rounded-lg border border-gray-200 text-gray-500">
         <Icon className="w-4 h-4" />
       </div>
       <div>
         <p className="text-sm font-medium text-gray-900">{label}</p>
         <p className="text-xs text-gray-500">{desc}</p>
       </div>
    </div>
    <button 
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  </div>
);
