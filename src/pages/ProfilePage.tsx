import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROLES } from '../types';
import { User, Briefcase, Mail, Loader2, Save, Sparkles, RefreshCw } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  const isPredefinedRole = user?.role && (ROLES as readonly string[]).includes(user.role);
  const [name, setName] = useState(user?.name || '');
  const [selectedRole, setSelectedRole] = useState(isPredefinedRole ? user?.role || 'Developer' : 'Other');
  const [customRole, setCustomRole] = useState(!isPredefinedRole ? user?.role || '' : '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [saving, setSaving] = useState(false);

  const handleGenerateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 8);
    const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}_${randomSeed}`;
    setProfileImage(newAvatar);
    success('Generated new avatar style.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Name is required.');
      return;
    }

    const finalRole = selectedRole === 'Other' ? (customRole.trim() || 'Contributor') : selectedRole;

    try {
      setSaving(true);
      const res = await api.put('/auth/profile', {
        name: name.trim(),
        role: finalRole,
        bio: bio.trim(),
        profileImage: profileImage.trim() || undefined
      });

      if (res.data.success) {
        updateUser(res.data.user);
        success('Profile updated successfully.');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 text-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Manage your community contributor persona, credentials, and bio.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xs">
          {/* Avatar Preview */}
          <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
            <img
              src={
                profileImage ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}`
              }
              alt={name}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-indigo-500/30 bg-gray-100 shadow-xs"
            />
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={handleGenerateRandomAvatar}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                Randomize Avatar
              </button>
              <p className="text-[11px] text-gray-400">
                Or paste a custom image URL below
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="pt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email Address (Read-only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Primary Role / Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRole === 'Other' && (
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Enter your custom role..."
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Profile Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Short Bio / Specialty
              </label>
              <textarea
                placeholder="Tell the community about your prompt engineering background..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                maxLength={300}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-xs active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
