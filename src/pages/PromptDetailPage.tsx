import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Prompt } from '../types';
import { StarRating } from '../components/StarRating';
import { MediaGallery } from '../components/MediaGallery';
import { AddToCollectionModal } from '../components/AddToCollectionModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Copy,
  Check,
  BookmarkPlus,
  ExternalLink,
  Edit2,
  Trash2,
  ArrowLeft,
  Share2,
  Calendar,
  Sparkles,
  Loader2,
  ShieldCheck
} from 'lucide-react';

export const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Modals
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPromptAndRating = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(`/prompts/${id}`);
        if (res.data.success) {
          setPrompt(res.data.data);
          if (res.data.data.userRating) {
            setUserRating(res.data.data.userRating);
          }
        }
      } catch (err: any) {
        error(err.response?.data?.message || 'Prompt not found.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPromptAndRating();
  }, [id, error, navigate]);

  const handleCopyPrompt = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      success('Prompt text copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = prompt.promptText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      success('Prompt text copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt?.title,
          text: prompt?.description || 'Check out this AI prompt on Prompt Library',
          url: window.location.href
        });
      } catch {
        // Ignored if dismissed
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      success('Page link copied to clipboard!');
    }
  };

  const handleRate = async (newRating: number) => {
    if (!user) {
      error('Please sign in to rate this prompt.');
      navigate('/login');
      return;
    }

    if (!prompt || prompt.userId === user._id) {
      error('You cannot rate your own prompt.');
      return;
    }

    try {
      setIsSubmittingRating(true);
      const res = await api.post(`/prompts/${prompt._id}/rating`, {
        rating: newRating
      });

      if (res.data.success) {
        setUserRating(newRating);
        setPrompt(prev => prev ? {
          ...prev,
          averageRating: res.data.data.averageRating,
          ratingCount: res.data.data.ratingCount
        } : null);
        success(`You rated this prompt ${newRating} star${newRating > 1 ? 's' : ''}!`);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!prompt) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/prompts/${prompt._id}`);
      if (res.data.success) {
        success('Prompt deleted successfully.');
        navigate('/my-prompts');
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to delete prompt.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Loading prompt details...</p>
      </div>
    );
  }

  if (!prompt) return null;

  const isOwner = Boolean(user && user._id === prompt.userId);
  const formattedDate = new Date(prompt.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Navigation Breadcrumb & Action Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Share prompt"
            >
              <Share2 className="w-4 h-4 text-gray-500" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {user && (
              <button
                onClick={() => setIsCollectionModalOpen(true)}
                className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <BookmarkPlus className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Save to Collection</span>
              </button>
            )}

            {isOwner && (
              <>
                <Link
                  to={`/edit-prompt/${prompt._id}`}
                  className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </Link>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors"
                  title="Delete prompt"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200/80">
                {prompt.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Average Rating Display */}
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="text-xs font-medium text-gray-500">Community Score:</span>
              <StarRating
                rating={prompt.averageRating}
                ratingCount={prompt.ratingCount}
                size="md"
              />
            </div>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            {prompt.title}
          </h1>

          {/* Description */}
          {prompt.description && (
            <p className="text-gray-600 text-base leading-relaxed">
              {prompt.description}
            </p>
          )}

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {prompt.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 border border-gray-200/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Working Prototype Link CTA */}
          {prompt.prototypeUrl && (
            <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    Interactive Working Prototype
                  </h4>
                  <p className="text-xs text-indigo-800 truncate max-w-md">
                    {prompt.prototypeUrl}
                  </p>
                </div>
              </div>

              <a
                href={prompt.prototypeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs"
              >
                Launch Prototype
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Prompt Instruction Body Card */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden text-slate-100">
          <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-400 font-medium ml-2">
                Prompt Blueprint / System Instructions
              </span>
            </div>

            <button
              onClick={handleCopyPrompt}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          <div className="p-6 sm:p-8 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap select-all text-indigo-100/95">
              {prompt.promptText}
            </pre>
          </div>

          <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified & AI Screened
            </span>
            <span>{prompt.promptText.length} characters</span>
          </div>
        </div>

        {/* Media Attachments Gallery */}
        {prompt.media && prompt.media.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <MediaGallery media={prompt.media} title={prompt.title} />
          </div>
        )}

        {/* Bottom Split Row: Creator Bio Card & Peer Rating Widget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Creator Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Author & Contributor
              </span>

              <div className="flex items-start gap-3.5">
                <img
                  src={
                    prompt.creator.profileImage ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(prompt.creator.name)}`
                  }
                  alt={prompt.creator.name}
                  className="w-12 h-12 rounded-xl object-cover bg-gray-200 ring-2 ring-indigo-500/20"
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{prompt.creator.name}</h3>
                  <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200/80">
                    {prompt.creator.role}
                  </span>
                </div>
              </div>

              {prompt.creator.bio && (
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{prompt.creator.bio}"
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Community Contributor</span>
              <Link
                to={`/?userId=${prompt.userId}`}
                className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                More from {prompt.creator.name} →
              </Link>
            </div>
          </div>

          {/* Peer Rating Widget */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Community Feedback & Rating
              </span>
              <h3 className="font-serif font-bold text-gray-900 text-lg">
                How effective was this prompt?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {isOwner
                  ? "As the creator, you cannot rate your own prompt."
                  : user
                  ? "Click the stars below to share your experience with this prompt."
                  : "Sign in to submit your 1-5 star peer rating."}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-gray-500 block">
                  {userRating ? 'Your submitted rating:' : 'Rate this prompt:'}
                </span>
                <StarRating
                  rating={userRating || 0}
                  userRating={userRating}
                  interactive={!isOwner && Boolean(user)}
                  onRate={handleRate}
                  isOwner={isOwner}
                  size="lg"
                />
              </div>

              {isSubmittingRating && (
                <div className="flex items-center gap-1.5 text-xs text-indigo-700">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </div>
              )}

              {!user && (
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors self-start sm:self-auto"
                >
                  Sign in to Rate
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add to Collection Modal */}
      <AddToCollectionModal
        isOpen={isCollectionModalOpen}
        prompt={prompt}
        onClose={() => setIsCollectionModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Prompt"
        message={`Are you sure you want to permanently delete "${prompt.title}"?`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
