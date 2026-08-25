import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Prompt, Collection } from '../types';
import { PromptCard } from '../components/PromptCard';
import { AddToCollectionModal } from '../components/AddToCollectionModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useToast } from '../context/ToastContext';
import {
  BookmarkCheck,
  Layers,
  Compass,
  PlusCircle,
  Search,
  Sparkles,
  Star,
  ArrowRight,
  Loader2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [myPrompts, setMyPrompts] = useState<Prompt[]>([]);
  const [myCollections, setMyCollections] = useState<Collection[]>([]);
  const [recentCommunityPrompts, setRecentCommunityPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedPromptForCollection, setSelectedPromptForCollection] = useState<Prompt | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [promptsRes, collectionsRes, exploreRes] = await Promise.all([
          api.get(`/prompts?userId=${user._id}`),
          api.get('/collections'),
          api.get('/prompts?sort=highest_rated')
        ]);

        if (promptsRes.data.success) setMyPrompts(promptsRes.data.data);
        if (collectionsRes.data.success) setMyCollections(collectionsRes.data.data);
        if (exploreRes.data.success) setRecentCommunityPrompts(exploreRes.data.data.slice(0, 3));
      } catch (err: any) {
        error(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, error]);

  const handleDeleteConfirm = async () => {
    if (!promptToDelete) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/prompts/${promptToDelete._id}`);
      if (res.data.success) {
        setMyPrompts(prev => prev.filter(p => p._id !== promptToDelete._id));
        success('Prompt deleted successfully.');
        setPromptToDelete(null);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to delete prompt.');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalRatingsReceived = myPrompts.reduce((acc, curr) => acc + curr.ratingCount, 0);
  const avgRatingReceived = myPrompts.length > 0
    ? (myPrompts.reduce((acc, curr) => acc + (curr.averageRating * curr.ratingCount), 0) / (totalRatingsReceived || 1)).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16 text-gray-900">
      {/* Top Welcome Header */}
      <section className="bg-slate-900 text-slate-100 border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                <span>{user?.role}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Welcome back, {user?.name}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Manage your prompt blueprints, organize curated collections, and explore community additions.
              </p>
            </div>

            {/* Quick Action Links */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4" />
                Create Prompt
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
              >
                <Compass className="w-4 h-4" />
                Explore Prompts
              </Link>
            </div>
          </div>

          {/* Quick Search Redirect Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
            className="relative max-w-2xl"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Quick search across all community prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-24 py-2.5 rounded-xl bg-slate-800/80 text-white placeholder-slate-400 text-xs sm:text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-medium"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Prompts</p>
              <h3 className="text-2xl font-bold text-gray-900">{myPrompts.length}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Collections</p>
              <h3 className="text-2xl font-bold text-gray-900">{myCollections.length}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <Star className="w-5 h-5 fill-emerald-700 text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Rating</p>
              <h3 className="text-2xl font-bold text-gray-900">★ {avgRatingReceived}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ratings Given</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalRatingsReceived}</h3>
            </div>
          </div>
        </div>

        {/* Section: My Prompts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900">My Created Prompts</h2>
              <p className="text-xs text-gray-500">Prompts you have created, validated, and published.</p>
            </div>
            <Link
              to="/my-prompts"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
            >
              View All ({myPrompts.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : myPrompts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
              <p className="text-sm text-gray-600">You haven't created any prompts yet.</p>
              <Link
                to="/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700"
              >
                <PlusCircle className="w-4 h-4" />
                Create Your First Prompt
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPrompts.slice(0, 3).map((prompt) => (
                <PromptCard
                  key={prompt._id}
                  prompt={prompt}
                  onAddToCollection={(p) => setSelectedPromptForCollection(p)}
                  onDeleteRequest={(p) => setPromptToDelete(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section: My Collections Overview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900">My Collections</h2>
              <p className="text-xs text-gray-500">Personal folders organizing your favorite prompt workflows.</p>
            </div>
            <Link
              to="/collections"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
            >
              Manage Collections ({myCollections.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myCollections.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
              <p className="text-sm text-gray-600">Organize prompts into collections like 'Coding', 'Interview', or 'Marketing'.</p>
              <Link
                to="/collections"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold text-xs hover:bg-gray-800"
              >
                <Layers className="w-4 h-4" />
                Create a Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCollections.slice(0, 3).map((col) => (
                <Link
                  key={col._id}
                  to={`/collections/${col._id}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {col.promptIds.length} {col.promptIds.length === 1 ? 'prompt' : 'prompts'}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-gray-900 text-base group-hover:text-indigo-600 transition-colors truncate">
                      {col.name}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mt-1">
                      {col.description || 'No description provided.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                    <span>Open Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Section: Community Top Rated Prompts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900">Trending in Community</h2>
              <p className="text-xs text-gray-500">Highest rated prompts from community members.</p>
            </div>
            <Link
              to="/"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
            >
              Explore All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCommunityPrompts.map((prompt) => (
              <PromptCard
                key={prompt._id}
                prompt={prompt}
                onAddToCollection={(p) => setSelectedPromptForCollection(p)}
                onDeleteRequest={(p) => setPromptToDelete(p)}
              />
            ))}
          </div>
        </section>
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
        message={`Are you sure you want to permanently delete "${promptToDelete?.title}"?`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPromptToDelete(null)}
      />
    </div>
  );
};
