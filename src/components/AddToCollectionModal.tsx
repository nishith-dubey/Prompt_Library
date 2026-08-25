import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Collection, Prompt } from '../types';
import { useToast } from '../context/ToastContext';
import { Layers, Plus, Check, X, Loader2 } from 'lucide-react';

interface AddToCollectionModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  prompt,
  isOpen,
  onClose
}) => {
  const { success, error } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [savingCollectionId, setSavingCollectionId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await api.get('/collections');
      if (res.data.success) {
        setCollections(res.data.data);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePrompt = async (col: Collection) => {
    if (!prompt) return;
    const isAlreadyIn = col.promptIds.includes(prompt._id);
    setSavingCollectionId(col._id);

    try {
      if (isAlreadyIn) {
        await api.delete(`/collections/${col._id}/prompts/${prompt._id}`);
        setCollections(prev =>
          prev.map(c =>
            c._id === col._id ? { ...c, promptIds: c.promptIds.filter(id => id !== prompt._id) } : c
          )
        );
        success(`Removed from "${col.name}"`);
      } else {
        await api.post(`/collections/${col._id}/prompts/${prompt._id}`);
        setCollections(prev =>
          prev.map(c =>
            c._id === col._id ? { ...c, promptIds: [...c.promptIds, prompt._id] } : c
          )
        );
        success(`Saved to "${col.name}"`);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to update collection');
    } finally {
      setSavingCollectionId(null);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim() || !prompt) return;

    try {
      setCreating(true);
      const res = await api.post('/collections', {
        name: newCollectionName.trim(),
        promptIds: [prompt._id]
      });

      if (res.data.success) {
        setCollections(prev => [res.data.data, ...prev]);
        setNewCollectionName('');
        success(`Created "${res.data.data.name}" and added prompt!`);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to create collection');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen || !prompt) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-md w-full p-6 text-gray-900 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">Save to Collection</h3>
              <p className="text-xs text-gray-500 truncate max-w-[240px]">{prompt.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Collections */}
        <div className="py-4 space-y-2 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              <span className="text-xs">Loading collections...</span>
            </div>
          ) : collections.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              You don't have any collections yet. Create your first one below!
            </p>
          ) : (
            collections.map((col) => {
              const isIncluded = col.promptIds.includes(prompt._id);
              const isProcessing = savingCollectionId === col._id;

              return (
                <button
                  key={col._id}
                  onClick={() => handleTogglePrompt(col)}
                  disabled={isProcessing}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    isIncluded
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-medium'
                      : 'bg-gray-50/60 border-gray-200/80 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <span className="text-sm truncate">{col.name}</span>
                    <span className="text-[11px] text-gray-400 font-normal shrink-0">
                      ({col.promptIds.length} items)
                    </span>
                  </div>

                  <div className="shrink-0">
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    ) : isIncluded ? (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-indigo-400">
                        <Plus className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Quick Create Collection Form */}
        <form onSubmit={handleCreateCollection} className="pt-3 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            placeholder="New collection name (e.g. Coding Prompts)"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50"
            maxLength={60}
          />
          <button
            type="submit"
            disabled={creating || !newCollectionName.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center gap-1"
          >
            {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Create
          </button>
        </form>
      </div>
    </div>
  );
};
