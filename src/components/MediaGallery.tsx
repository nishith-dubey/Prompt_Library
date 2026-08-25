import React, { useState } from 'react';
import { MediaItem } from '../types';
import { Play, Eye, X, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

interface MediaGalleryProps {
  media: MediaItem[];
  title: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ media, title }) => {
  const [activeLightbox, setActiveLightbox] = useState<MediaItem | null>(null);

  if (!media || media.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 uppercase tracking-wider">
        <ImageIcon className="w-3.5 h-3.5" />
        Media & Workflow Previews ({media.length})
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {media.map((item, index) => (
          <div
            key={index}
            className="group relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 shadow-sm aspect-video flex items-center justify-center cursor-pointer hover:border-amber-500/50 transition-all"
            onClick={() => setActiveLightbox(item)}
          >
            {item.type === 'video' ? (
              <>
                <video
                  src={item.url}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                  <div className="w-11 h-11 rounded-full bg-amber-500/90 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[11px] font-medium text-white flex items-center gap-1">
                  <VideoIcon className="w-3 h-3 text-amber-400" />
                  Video Demo
                </div>
              </>
            ) : (
              <>
                <img
                  src={item.url}
                  alt={`${title} attachment ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="p-2 rounded-full bg-white/90 text-stone-900 shadow-md">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[11px] font-medium text-white flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-amber-400" />
                  Screenshot
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox / Video Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-stone-950 rounded-2xl border border-stone-800 p-2 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-200 hover:text-white transition-colors"
              aria-label="Close media preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[80vh] flex items-center justify-center overflow-auto rounded-xl">
              {activeLightbox.type === 'video' ? (
                <video
                  src={activeLightbox.url}
                  controls
                  autoPlay
                  className="max-h-[75vh] w-full rounded-xl"
                />
              ) : (
                <img
                  src={activeLightbox.url}
                  alt={title}
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
