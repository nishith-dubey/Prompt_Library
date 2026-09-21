import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Prompt, CATEGORIES, ROLES } from '../types';
import { PromptCard } from '../components/PromptCard';
import { AddToCollectionModal } from '../components/AddToCollectionModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  LayoutGrid,
  ListFilter,
  X,
  Loader2,
  PlusCircle,
  Star,
  RefreshCw
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States initialized from URL params if available
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [activeRole, setActiveRole] = useState(searchParams.get('role') || 'All');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '0');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [selectedPromptForCollection, setSelectedPromptForCollection] = useState<Prompt | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPrompts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (activeCategory !== 'All') params.append('category', activeCategory);
      if (activeRole !== 'All') params.append('role', activeRole);
      if (Number(minRating) > 0) params.append('minRating', minRating);
      if (sortBy) params.append('sort', sortBy);

      const res = await api.get(`/prompts?${params.toString()}`);
      if (res.data.success) {
        setPrompts(res.data.data);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to load prompts.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory, activeRole, minRating, sortBy, error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrompts();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchPrompts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrompts();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setActiveRole('All');
    setMinRating('0');
    setSortBy('newest');
  };

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

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    activeCategory !== 'All' ||
    activeRole !== 'All' ||
    Number(minRating) > 0 ||
    sortBy !== 'newest';

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16 text-gray-900">
      {/* Hero Exploration Banner */}
      <section className="bg-slate-900 text-slate-100 border-b border-slate-800 pt-10 pb-12 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Community Curated & AI Validated
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Discover Verified AI Prompts
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Explore production-ready prompts with visual workflow attachments, prototype demos, and peer ratings from developers, researchers, and AI practitioners.
              </p>
            </div>

            {/* <div className="flex items-center gap-3">
              {user ? (
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-xs active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit New Prompt
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-xs active:scale-[0.98]"
                >
                  Join to Share & Rate
                </Link>
              )}
            </div> */}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-3xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by keywords (e.g. 'resume ATS', 'TypeScript backend', 'system design', 'marketing')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-slate-800/90 text-white placeholder-slate-400 text-sm sm:text-base border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-md"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-20 text-slate-400 hover:text-slate-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-semibold transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category Quick Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-semibold">Creator Role:</span>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Roles</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Rating Filter */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-semibold">Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="0">Any Rating</option>
                <option value="4.5">★ 4.5 & Above</option>
                <option value="4.0">★ 4.0 & Above</option>
                <option value="3.0">★ 3.0 & Above</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <ListFilter className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="highest_rated">Highest Rated</option>
                <option value="most_popular">Most Popular</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-gray-500">
            <span>
              Showing <strong className="text-gray-900 font-semibold">{prompts.length}</strong> {prompts.length === 1 ? 'prompt' : 'prompts'}
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-gray-400 hover:text-gray-700'
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-xs text-indigo-600' : 'text-gray-400 hover:text-gray-700'
                }`}
                title="List view"
                aria-label="List view"
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Prompts List Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-medium text-gray-600">Discovering prompts...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-gray-900">No matching prompts found</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We couldn't find any prompts matching your current search and filter combination.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs hover:bg-gray-50"
              >
                Reset Search Filters
              </button>
              {user && (
                <Link
                  to="/create"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700"
                >
                  Create This Prompt
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt._id}
                prompt={prompt}
                onAddToCollection={(p) => setSelectedPromptForCollection(p)}
                onDeleteRequest={(p) => setPromptToDelete(p)}
                compact={viewMode === 'list'}
              />
            ))}
          </div>
        )}
      </main>

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
        message={`Are you sure you want to permanently delete "${promptToDelete?.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPromptToDelete(null)}
      />
    </div>
  );
};
