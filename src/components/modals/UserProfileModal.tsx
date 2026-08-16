import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Shield,
  Clock,
  CheckCircle2,
  Lock,
  Key,
  Award,
  Activity,
  LogOut,
  Save,
  Bell
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
}) => {
  const { profile, updateProfile } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name || 'Naman Kumar');
  const [email, setEmail] = useState(profile.email || 'naman.analyst@fraudguard.bank');
  const [title, setTitle] = useState(profile.title || 'Senior Risk & Fraud Analyst');
  const [department, setDepartment] = useState('Financial Crimes & Biometric Intelligence Unit');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      title,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#101624] border border-slate-200 dark:border-[#1c2638] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Banner */}
        <div className="h-28 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 relative p-4 flex items-start justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 backdrop-blur-xs border border-white/30">
              OFFICIAL INVESTIGATOR PROFILE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Avatar & Identity Card */}
        <div className="px-6 pb-6 pt-0 relative space-y-5">
          <div className="flex items-end justify-between -mt-12">
            <div className="relative">
              <div className="w-22 h-22 rounded-2xl bg-white dark:bg-[#101624] p-1.5 shadow-md">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center text-2xl font-mono font-bold tracking-tight shadow-inner">
                  {name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase() || 'NM'}
                </div>
              </div>
              <span className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#101624] absolute bottom-1 right-1" title="Online" />
            </div>

            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182132] dark:hover:bg-[#202c44] border border-slate-200 dark:border-[#24324a] text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-2xs"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182132] text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Name & Title */}
          {!isEditing ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{name}</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{email}</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-[#1c2638] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-[#1c2638] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">Role / Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-[#1c2638] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold font-mono flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </form>
          )}

          {/* Success Banner */}
          {saveSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile information updated successfully.</span>
            </div>
          )}

          {/* Role Badges & Details Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs font-sans">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-[#1c2638] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-mono">
                <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                CLEARANCE LEVEL
              </div>
              <p className="font-bold text-slate-900 dark:text-white">Level 3 (Senior Lead)</p>
              <p className="text-[10px] text-slate-500">Quarantine & Rule Deploy Access</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-[#1c2638] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-mono">
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                LAST ACTIVE
              </div>
              <p className="font-bold text-slate-900 dark:text-white">Just now (Live session)</p>
              <p className="text-[10px] text-slate-500">Session ID #SES-4921</p>
            </div>
          </div>

          {/* Department Information */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-[#1c2638] space-y-1.5">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Assigned Department & Scope
            </span>
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
              {department}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Responsible for reviewing live transaction alerts, investigating high-risk accounts, and managing automated fraud containment policies.
            </p>
          </div>

          {/* Action Links */}
          <div className="pt-2 border-t border-slate-200 dark:border-[#1c2638] flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" />
              Manage Security & Settings
            </button>

            <button
              onClick={() => {
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182132] text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
