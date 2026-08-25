import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Collection, Prompt } from '../types';
import { PromptCard } from '../components/PromptCard';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useToast } from '../context/ToastContext';
import {
  Layers,
  ArrowLeft,
  Trash2,
  Edit2,
  Compass,
  Loader2,
  Calendar,
  X
} from 'lucide-react';

export const CollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Collection state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Collection modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCollection = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.get(`/collections/${id}`);
      if (res.data.success) {
        setCollection(res.data.data);
        setPrompts(res.data.data.prompts || []);
        setEditName(res.data.data.name);
        setEditDescription(res.data.data.description || '');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Collection not found.');
      navigate('/collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [id]);

  const handleUpdateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      setSavingEdit(true);
      const res = await api.put(`/collections/${id}`, {
        name: editName.trim(),
        description: editDescription.trim()
      });
      if (res.data.success) {
        setCollection(res.data.data);
        setIsEditing(false);
        success('Collection details updated.');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to update collection.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleRemovePromptFromCollection = async (promptId: string) => {
    if (!collection) return;
    try {
      const res = await api.delete(`/collections/${collection._id}/prompts/${promptId}`);
      if (res.data.success) {
        setPrompts(prev => prev.filter(p => p._id !== promptId));
        setCollection(prev =>
          prev ? { ...prev, promptIds: prev.promptIds.filter(pid => pid !== promptId) } : null
        );
        success('Prompt removed from collection.');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to remove prompt.');
    }
  };

  const handleDeleteCollection = async () => {
    if (!collection) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/collections/${collection._id}`);
      if (res.data.success) {
        success('Collection deleted.');
        navigate('/collections');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to delete collection.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Loading collection...</p>
      </div>
    );
  }

  if (!collection) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/collections')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collections
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isEditing ? 'Cancel Edit' : 'Edit Details'}
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors"
              title="Delete collection"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collection Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs">
          {isEditing ? (
            <form onSubmit={handleUpdateCollection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
                <Layers className="w-4 h-4" />
                <span>Custom Collection</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 font-normal">
                  {prompts.length} {prompts.length === 1 ? 'prompt organized' : 'prompts organized'}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                {collection.name}
              </h1>

              {collection.description && (
                <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
                  {collection.description}
                </p>
              )}

              <div className="pt-2 flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Created on {new Date(collection.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Collection Prompts List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-gray-900">Prompts in this Collection</h2>
            <Link
              to="/"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
            >
              <Compass className="w-3.5 h-3.5" />
              Discover more prompts to add
            </Link>
          </div>

          {prompts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-gray-900">This collection is empty</h3>
                <p className="text-xs text-gray-500">
                  Explore the community library and click the bookmark button on any prompt card to add it here.
                </p>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700"
              >
                <Compass className="w-4 h-4" />
                Explore Community Prompts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt) => (
                <div key={prompt._id} className="relative group/item">
                  <PromptCard prompt={prompt} />
                  {/* Remove from Collection quick button */}
                  <button
                    onClick={() => handleRemovePromptFromCollection(prompt._id)}
                    className="absolute top-2 right-2 z-20 p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-600 text-white opacity-0 group-hover/item:opacity-100 transition-all shadow-md"
                    title="Remove from this collection"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Collection Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Collection"
        message={`Are you sure you want to delete "${collection.name}"? The prompts themselves will remain in the library.`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteCollection}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
