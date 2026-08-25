import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  ratingCount?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  userRating?: number | null;
  isOwner?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  ratingCount,
  interactive = false,
  onRate,
  size = 'md',
  userRating = null,
  isOwner = false
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleRate = (val: number) => {
    if (interactive && !isOwner && onRate) {
      onRate(val);
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5" title={isOwner ? "Creators cannot rate their own prompts" : undefined}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const displayScore = hoverRating !== null ? hoverRating : (userRating || rating);
          const isFilled = displayScore >= starValue;
          const isPartiallyFilled = !isFilled && displayScore > starValue - 1;

          return (
            <button
              key={starValue}
              type="button"
              disabled={!interactive || isOwner}
              onClick={() => handleRate(starValue)}
              onMouseEnter={() => interactive && !isOwner && setHoverRating(starValue)}
              onMouseLeave={() => interactive && !isOwner && setHoverRating(null)}
              className={`relative p-0.5 transition-transform ${
                interactive && !isOwner
                  ? 'cursor-pointer hover:scale-110 active:scale-95 focus:outline-none'
                  : 'cursor-default'
              }`}
              aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star
                className={`${starSizes[size]} transition-colors ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400'
                    : isPartiallyFilled
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-stone-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1 text-xs font-semibold text-stone-700">
        <span>{rating > 0 ? rating.toFixed(1) : 'New'}</span>
        {typeof ratingCount === 'number' && (
          <span className="font-normal text-stone-400 text-[11px]">
            ({ratingCount})
          </span>
        )}
      </div>
    </div>
  );
};
