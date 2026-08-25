import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Prompt } from '../types';
import { StarRating } from './StarRating';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  Copy,
  Check,
  BookmarkPlus,
  ExternalLink,
  ImageIcon,
  Video as VideoIcon,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  onAddToCollection?: (prompt: Prompt) => void;
  onDeleteRequest?: (prompt: Prompt) => void;
  compact?: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onAddToCollection,
  onDeleteRequest,
  compact = false
}) => {
  const { user } = useAuth();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwner = Boolean(user && user._id === prompt.userId);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = prompt.promptText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasMedia = prompt.media && prompt.media.length > 0;
  const hasVideo = prompt.media?.some(m => m.type === 'video');

  const categoryColors: Record<string, string> = {
    Career: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    Coding: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
    Marketing: 'bg-purple-50 text-purple-700 border-purple-200/70',
    Education: 'bg-blue-50 text-blue-700 border-blue-200/70',
    Design: 'bg-pink-50 text-pink-700 border-pink-200/70',
    Writing: 'bg-amber-50 text-amber-800 border-amber-200/70',
    Productivity: 'bg-teal-50 text-teal-700 border-teal-200/70',
    Business: 'bg-cyan-50 text-cyan-700 border-cyan-200/70',
    Other: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const badgeClass = categoryColors[prompt.category] || categoryColors.Other;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between overflow-hidden">
      {/* Top Media Bar Preview (if image exists) */}
      {hasMedia && !compact && (
        <div className="relative h-36 w-full bg-gray-100 overflow-hidden border-b border-gray-100">
          <img
            src={prompt.media[0].url}
            alt={prompt.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md font-medium text-[11px]">
              {hasVideo ? <VideoIcon className="w-3 h-3 text-amber-400" /> : <ImageIcon className="w-3 h-3 text-amber-400" />}
              {prompt.media.length} {prompt.media.length === 1 ? 'Preview' : 'Previews'}
            </span>

            {prompt.prototypeUrl && (
              <span className="flex items-center gap-1 bg-indigo-600 text-white px-2 py-0.5 rounded-md font-medium text-[11px]">
                <ExternalLink className="w-3 h-3" />
                Prototype Demo
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category & Rating Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${badgeClass}`}>
            {prompt.category}
          </span>

          <StarRating rating={prompt.averageRating} ratingCount={prompt.ratingCount} size="sm" />
        </div>

        {/* Title */}
        <Link
          to={`/prompts/${prompt._id}`}
          className="font-serif font-bold text-gray-900 text-lg leading-snug group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2"
        >
          {prompt.title}
        </Link>

        {/* Description or Snippet */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
          {prompt.description || prompt.promptText}
        </p>

        {/* Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {prompt.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200"
              >
                #{tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-[11px] text-gray-400 px-1 py-0.5">
                +{prompt.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Prototype Link Chip if no top banner */}
        {!hasMedia && prompt.prototypeUrl && (
          <div className="mb-4">
            <a
              href={prompt.prototypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg border border-indigo-200/60 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Working Prototype
            </a>
          </div>
        )}
      </div>

      {/* Footer / Creator & Action Bar */}
      <div className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-3">
        {/* Creator Info */}
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={
              prompt.creator.profileImage ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(prompt.creator.name)}`
            }
            alt={prompt.creator.name}
            className="w-7 h-7 rounded-full object-cover bg-gray-200 ring-1 ring-gray-300/50 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate leading-tight">
              {prompt.creator.name}
            </p>
            <p className="text-[11px] text-gray-500 font-medium truncate leading-tight">
              {prompt.creator.role}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Add to Collection Button */}
          {user && onAddToCollection && (
            <button
              onClick={() => onAddToCollection(prompt)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Save to collection"
              aria-label="Save to collection"
            >
              <BookmarkPlus className="w-4 h-4" />
            </button>
          )}

          {/* Quick Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-900 hover:bg-gray-800 text-white shadow-xs'
            }`}
            title="Copy prompt text"
            aria-label="Copy prompt text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Owner Menu Dropdown */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                aria-label="Prompt options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 bottom-full mb-1 w-32 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-30 text-xs divide-y divide-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    to={`/edit-prompt/${prompt._id}`}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                    Edit
                  </Link>
                  {onDeleteRequest && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDeleteRequest(prompt);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
