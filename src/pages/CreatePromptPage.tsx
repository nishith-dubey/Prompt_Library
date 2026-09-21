import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { uploadMediaFile } from '../services/api';
import { CATEGORIES, MediaItem, AIValidationResult } from '../types';
import { useToast } from '../context/ToastContext';
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
  ShieldCheck,
  FileText
} from 'lucide-react';

export const CreatePromptPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error, info } = useToast();

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

  // AI Validation State
  const [validatingAI, setValidatingAI] = useState(false);
  const [aiValidationResult, setAiValidationResult] = useState<AIValidationResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      error('Please enter a valid HTTP/HTTPS image or video URL.');
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
      error('Please enter both a Title and Prompt Text before validating.');
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
          success('AI Validation Passed! Ready to publish.');
        } else {
          info('AI Feedback received: Prompt requires adjustments.');
        }
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to complete AI validation.');
    } finally {
      setValidatingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      error('Title is required');
      return;
    }
    if (!formData.promptText.trim() || formData.promptText.trim().length < 10) {
      error('Prompt text must be at least 10 characters long.');
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

      const res = await api.post('/prompts', payload);
      if (res.data.success) {
        success('Prompt created and published to the library!');
        navigate(`/prompts/${res.data.data._id}`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create prompt';
      if (err.response?.data?.aiValidation) {
        setAiValidationResult(err.response.data.aiValidation);
      }
      error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = formData.promptText.length;
  const wordCount = formData.promptText.trim() ? formData.promptText.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-800 text-xs font-semibold border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            AI Prompt Workshop
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Create & Validate AI Prompt
          </h1>
          <p className="text-gray-600 text-sm">
            Publish structured prompts, attach screenshots or demo videos, and verify prompt quality with AI safety checks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Card: Prompt Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5">
            {/* Title & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Prompt Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ATS-Optimized Executive Resume Builder"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setAiValidationResult(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  required
                  maxLength={150}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prompt Text Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Prompt Instruction / Template <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400 font-mono">
                  {wordCount} words | {charCount} chars
                </span>
              </div>
              <textarea
                placeholder="Act as a senior software architect... Provide step-by-step guidance on..."
                value={formData.promptText}
                onChange={(e) => {
                  setFormData({ ...formData, promptText: e.target.value });
                  setAiValidationResult(null);
                }}
                rows={8}
                className="w-full px-3.5 py-3 rounded-lg border border-gray-200 bg-gray-50/30 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                required
              />
              <p className="text-[11px] text-gray-500">
                Tip: Use placeholders like <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-900">[TOPIC]</code> or <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-900">[PASTE_CODE_HERE]</code> for adaptable user templates.
              </p>
            </div>

            {/* AI Validation Pre-Check Bar */}
            <div className="rounded-xl border border-gray-200/80 bg-gray-50 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      AI Quality & Safety Verification
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Evaluates instruction clarity, spam detection, and content safety guidelines before publishing.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePreValidateAI}
                  disabled={validatingAI || !formData.promptText.trim()}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-100 text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
                >
                  {validatingAI ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Run AI Pre-Check
                    </>
                  )}
                </button>
              </div>

              {/* AI Validation Result Alert */}
              {aiValidationResult && (
                <div
                  className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 animate-in fade-in duration-200 ${
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
                      {aiValidationResult.allowed ? 'Approved for Prompt Library' : 'Revision Suggested by AI Validator'}
                    </p>
                    <p className="leading-relaxed opacity-90">{aiValidationResult.reason}</p>
                    {aiValidationResult.categorySuggestion && (
                      <p className="text-[11px] font-medium text-indigo-800">
                        Suggested Category: <strong>{aiValidationResult.categorySuggestion}</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Summary & Best Practices (Optional)
              </label>
              <textarea
                placeholder="Explain what models work best (e.g. Gemini, GPT-4, Claude), output format, or usage tips..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                maxLength={1000}
              />
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Tags (Press Enter or Comma to add)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. typescript, resume, interview, system design"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3.5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
                >
                  Add Tag
                </button>
              </div>

              {/* Tag Pills */}
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

            {/* Prototype / Demo Link */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Working Prototype or Live Demo URL (Optional)
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="url"
                  placeholder="https://your-demo.vercel.app, https://github.com/..., https://figma.com/..."
                  value={formData.prototypeUrl}
                  onChange={(e) => setFormData({ ...formData, prototypeUrl: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-gray-500">
                Provide a link to a live app, GitHub repo, Figma wireframe, or video demo showing this prompt in action.
              </p>
            </div>
          </div>

          {/* Media Attachments Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-lg">
                Screenshots & Demo Media (Optional)
              </h3>
              <p className="text-gray-500 text-xs">
                Attach visual workflow proofs, prompt output screenshots, or video walkthroughs.
              </p>
            </div>

            {/* Upload Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* File Dropzone */}
              <label className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50/50 hover:bg-indigo-50/30 transition-all">
                <Upload className="w-6 h-6 text-indigo-600 mb-1.5" />
                <span className="text-xs font-semibold text-gray-800">Upload Image / Video</span>
                <span className="text-[11px] text-gray-400">PNG, JPG, WebP, MP4 (max 15MB)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Direct Media URL Input */}
              <div className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between bg-gray-50/30 space-y-2">
                <span className="text-xs font-semibold text-gray-800">Or Attach by Web URL</span>
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
                    placeholder="https://images.unsplash.com/..."
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-md border border-gray-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddMediaUrl}
                  className="self-end px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Media Preview Grid */}
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
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                      title="Remove attachment"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white flex items-center gap-1">
                      {item.type === 'video' ? <Video className="w-3 h-3 text-indigo-400" /> : <ImageIcon className="w-3 h-3 text-indigo-400" />}
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-xs active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validating & Publishing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Publish Prompt
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
