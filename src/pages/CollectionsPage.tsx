import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Collection } from '../types';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useToast } from '../context/ToastContext';
import {
  Layers,
  Plus,
  ArrowRight,
  Trash2,
  Edit2,
  FolderPlus,
  Loader2,
  X
} from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  const { success, error } = useToast();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // New / Edit Collection Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await api.get('/collections');
      if (res.data.success) {
        setCollections(res.data.data);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to load collections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openCreateModal = () => {
    setEditingCollection(null);
    setCollectionName('');
    setCollectionDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (col: Collection, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingCollection(col);
    setCollectionName(col.name);
    setCollectionDescription(col.description || '');
    setIsModalOpen(true);
  };

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionName.trim()) {
      error('Collection name is required.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingCollection) {
        const res = await api.put(`/collections/${editingCollection._id}`, {
          name: collectionName.trim(),
          description: collectionDescription.trim()
        });
        if (res.data.success) {
          setCollections(prev =>
            prev.map(c => (c._id === editingCollection._id ? res.data.data : c))
          );
          success('Collection updated successfully.');
          setIsModalOpen(false);
        }
      } else {
        const res = await api.post('/collections', {
          name: collectionName.trim(),
          description: collectionDescription.trim()
        });
        if (res.data.success) {
          setCollections(prev => [res.data.data, ...prev]);
          success('Collection created!');
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save collection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!collectionToDelete) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/collections/${collectionToDelete._id}`);
      if (res.data.success) {
        setCollections(prev => prev.filter(c => c._id !== collectionToDelete._id));
        success(`Collection "${collectionToDelete.name}" deleted.`);
        setCollectionToDelete(null);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to delete collection.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">My Collections</h1>
              <p className="text-xs text-gray-500">
                Organize your prompt library into custom stacks and project workflows.
              </p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </button>
        </div>

        {/* Collections Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-xs">Loading collections...</span>
          </div>
        ) : collections.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center mx-auto">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-gray-900">No collections yet</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Create a collection to group prompts by project, client, or topic (e.g. "Software Architecture", "Marketing Hooks").
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              Create First Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((col) => (
              <div
                key={col._id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {col.promptIds.length} {col.promptIds.length === 1 ? 'Prompt' : 'Prompts'}
                      </span>

                      <button
                        onClick={(e) => openEditModal(col, e)}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                        title="Edit collection"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCollectionToDelete(col);
                        }}
                        className="p-1 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                    {col.name}
                  </h3>

                  <p className="text-gray-500 text-xs leading-relaxed mt-2 line-clamp-3">
                    {col.description || 'No description added yet.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    Updated {new Date(col.updatedAt).toLocaleDateString()}
                  </span>

                  <Link
                    to={`/collections/${col._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 group-hover:translate-x-0.5 transition-transform"
                  >
                    View Prompts <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-md w-full p-6 text-gray-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-base">
                {editingCollection ? 'Edit Collection' : 'Create New Collection'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="py-4 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Collection Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Daily Coding Prompts"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  required
                  maxLength={60}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Brief summary of what this collection is for..."
                  value={collectionDescription}
                  onChange={(e) => setCollectionDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  maxLength={300}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingCollection ? 'Update' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(collectionToDelete)}
        title="Delete Collection"
        message={`Are you sure you want to delete the collection "${collectionToDelete?.name}"? The prompts themselves will not be deleted.`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCollectionToDelete(null)}
      />
    </div>
  );
};
