import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Prompt, CATEGORIES } from '../types';
import { PromptCard } from '../components/PromptCard';
import { AddToCollectionModal } from '../components/AddToCollectionModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useToast } from '../context/ToastContext';
import {
  BookmarkCheck,
  PlusCircle,
  Search,
  SlidersHorizontal,
  X,
  Loader2
} from 'lucide-react';

export const MyPromptsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [selectedPromptForCollection, setSelectedPromptForCollection] = useState<Prompt | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyPrompts = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('userId', user._id);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);

      const res = await api.get(`/prompts?${params.toString()}`);
      if (res.data.success) {
        setPrompts(res.data.data);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to load your prompts');
    } finally {
      setLoading(false);
    }
  }, [user, searchQuery, selectedCategory, error]);

  useEffect(() => {
    fetchMyPrompts();
  }, [fetchMyPrompts]);

  const handleDeleteConfirm = async () => {
    if (!promptToDelete) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/prompts/${promptToDelete._id}`);
      if (res.data.success) {
        setPrompts(prev => prev.filter(p => p._id !== promptToDelete._id));
        success('Prompt deleted successfully.');
        setPromptToDelete(null);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to delete prompt.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">My Prompts</h1>
              <p className="text-xs text-gray-500">
                You have published <strong className="text-gray-800">{prompts.length}</strong> prompts to the community library.
              </p>
            </div>
          </div>

          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Prompt
          </Link>
        </div>

        {/* Filter / Search Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter your prompts by keyword or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-xs font-semibold text-gray-600 shrink-0">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prompts Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-xs">Loading your prompts...</span>
          </div>
        ) : prompts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center mx-auto">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-gray-900">No prompts created yet</h3>
              <p className="text-xs text-gray-500">
                Share your best AI prompts with instructions, media attachments, and prototype demo links.
              </p>
            </div>
            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700"
            >
              <PlusCircle className="w-4 h-4" />
              Create Prompt Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt._id}
                prompt={prompt}
                onAddToCollection={(p) => setSelectedPromptForCollection(p)}
                onDeleteRequest={(p) => setPromptToDelete(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add To Collection Modal */}
      <AddToCollectionModal
        isOpen={Boolean(selectedPromptForCollection)}
        prompt={selectedPromptForCollection}
        onClose={() => setSelectedPromptForCollection(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(promptToDelete)}
        title="Delete Prompt"
        message={`Are you sure you want to permanently delete "${promptToDelete?.title}"?`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPromptToDelete(null)}
      />
    </div>
  );
};
