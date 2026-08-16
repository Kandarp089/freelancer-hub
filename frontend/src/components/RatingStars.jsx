import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5.0, count }) {
  const numericRating = parseFloat(rating) || 5.0;
  return (
    <div className="flex items-center space-x-1">
      <Star className="w-4 h-4 text-[#F4B860] fill-[#F4B860]" />
      <span className="font-bold text-sm text-[#F4F0E8]">{numericRating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-[#8D8A83]">({count})</span>
      )}
    </div>
  );
}
