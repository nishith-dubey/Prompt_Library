import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { uploadMediaFile } from '../services/api';
import { CATEGORIES, MediaItem, AIValidationResult, Prompt } from '../types';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Link as LinkIcon,
  Tag,
  Upload,
  Video,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export const EditPromptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [loadingPrompt, setLoadingPrompt] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    promptText: '',
    description: '',
    category: 'Coding',
    prototypeUrl: ''
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaTypeInput, setMediaTypeInput] = useState<'image' | 'video'>('image');

  const [validatingAI, setValidatingAI] = useState(false);
  const [aiValidationResult, setAiValidationResult] = useState<AIValidationResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id) return;
      try {
        setLoadingPrompt(true);
        const res = await api.get(`/prompts/${id}`);
        if (res.data.success) {
          const p: Prompt = res.data.data;
          // Check ownership
          if (user && p.userId !== user._id) {
            error('You can only edit your own prompts.');
            navigate('/my-prompts');
            return;
          }
          setFormData({
            title: p.title,
            promptText: p.promptText,
            description: p.description || '',
            category: p.category,
            prototypeUrl: p.prototypeUrl || ''
          });
          setTags(p.tags || []);
          setMediaList(p.media || []);
        }
      } catch (err: any) {
        error(err.response?.data?.message || 'Failed to load prompt for editing.');
        navigate('/my-prompts');
      } finally {
        setLoadingPrompt(false);
      }
    };

    fetchPrompt();
  }, [id, user, error, navigate]);

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    if ('key' in e) e.preventDefault();

    const clean = tagInput.replace(',', '').trim().toLowerCase();
    if (clean && !tags.includes(clean) && tags.length < 10) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddMediaUrl = () => {
    if (!mediaUrlInput.trim()) return;
    try {
      new URL(mediaUrlInput.trim());
      setMediaList([
        ...mediaList,
        {
          type: mediaTypeInput,
          url: mediaUrlInput.trim()
        }
      ]);
      setMediaUrlInput('');
      success('Media attachment added.');
    } catch {
      error('Please enter a valid HTTP/HTTPS URL.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(async (file: File) => {
      if (file.size > 15 * 1024 * 1024) {
        error(`File ${file.name} exceeds 15MB limit.`);
        return;
      }

      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        error(`File ${file.name} is not a supported image or video.`);
        return;
      }
      try {
        const uploaded = await uploadMediaFile(file);
        setMediaList((prev) => [
          ...prev,
          uploaded
        ]);
        success(`Uploaded ${file.name}`);
      } catch (err: any) {
        error(err.response?.data?.message || `Failed to upload ${file.name}.`);
      }
    });

    e.target.value = '';
  };

  const handleRemoveMedia = (index: number) => {
    setMediaList(mediaList.filter((_, i) => i !== index));
  };

  const handlePreValidateAI = async () => {
    if (!formData.title.trim() || !formData.promptText.trim()) {
      error('Please enter Title and Prompt Text before validating.');
      return;
    }

    try {
      setValidatingAI(true);
      setAiValidationResult(null);
      const res = await api.post('/prompts/validate', {
        title: formData.title,
        promptText: formData.promptText,
        category: formData.category,
        media: mediaList
      });

      if (res.data.success) {
        setAiValidationResult(res.data.data);
        if (res.data.data.allowed) {
          success('AI Validation Passed!');
        }
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'AI Validation check failed.');
    } finally {
      setValidatingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.promptText.trim()) {
      error('Title and Prompt Text are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        promptText: formData.promptText.trim(),
        description: formData.description.trim(),
        category: formData.category,
        tags,
        media: mediaList,
        prototypeUrl: formData.prototypeUrl.trim() || undefined
      };

      const res = await api.put(`/prompts/${id}`, payload);
      if (res.data.success) {
        success('Prompt updated successfully.');
        navigate(`/prompts/${id}`);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to update prompt.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPrompt) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Loading prompt for editing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 space-y-1">
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Edit AI Prompt
          </h1>
          <p className="text-gray-600 text-sm">
            Modify instructions, update media attachments, or adjust categorization.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Prompt Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 text-sm font-medium focus:outline-none"
                >
                  {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Prompt Instruction / Template <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={formData.promptText}
                onChange={(e) => setFormData({ ...formData, promptText: e.target.value })}
                rows={8}
                className="w-full px-3.5 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                required
              />
            </div>

            {/* AI Re-verification Option */}
            <div className="rounded-xl border border-gray-200/80 bg-gray-50 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      AI Quality & Safety Re-Verification
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Check updated text against safety and instruction quality benchmarks.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePreValidateAI}
                  disabled={validatingAI}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-100 text-xs font-semibold transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1.5"
                >
                  {validatingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                  Check AI Status
                </button>
              </div>

              {aiValidationResult && (
                <div
                  className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                    aiValidationResult.allowed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {aiValidationResult.allowed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className="font-semibold">
                      {aiValidationResult.allowed ? 'Quality Passed' : 'Warning'}
                    </p>
                    <p className="leading-relaxed opacity-90">{aiValidationResult.reason}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Summary & Best Practices (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Tags
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Add tags..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3.5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
                >
                  Add
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-900 border border-indigo-200"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Working Prototype or Live Demo URL
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.prototypeUrl}
                  onChange={(e) => setFormData({ ...formData, prototypeUrl: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Media Attachments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-gray-900 text-lg">Screenshots & Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50/50 transition-all">
                <Upload className="w-6 h-6 text-indigo-600 mb-1.5" />
                <span className="text-xs font-semibold text-gray-800">Upload Files</span>
                <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <div className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between bg-gray-50/30 space-y-2">
                <span className="text-xs font-semibold text-gray-800">Attach via URL</span>
                <div className="flex gap-2">
                  <select
                    value={mediaTypeInput}
                    onChange={(e) => setMediaTypeInput(e.target.value as 'image' | 'video')}
                    className="px-2 py-1.5 rounded-md border border-gray-200 text-xs bg-white"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-md border border-gray-200 text-xs bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddMediaUrl}
                  className="self-end px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold"
                >
                  Add URL
                </button>
              </div>
            </div>

            {mediaList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {mediaList.map((item, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200 bg-slate-950 aspect-video group">
                    {item.type === 'video' ? (
                      <video src={item.url} className="w-full h-full object-cover opacity-80" />
                    ) : (
                      <img src={item.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/prompts/${id}`)}
              className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
