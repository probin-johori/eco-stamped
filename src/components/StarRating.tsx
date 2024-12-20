import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
}

const StarRating = ({ rating, totalStars = 5 }: StarRatingProps) => {
  const getStarRender = (position: number) => {
    const isFullStar = position < Math.floor(rating);
    const isHalfStar = position === Math.floor(rating) && rating % 1 >= 0.3 && rating % 1 <= 0.7;
    const isFilledMoreThanHalf = position === Math.floor(rating) && rating % 1 > 0.7;
    
    if (isFullStar || isFilledMoreThanHalf) {
      return <Star key={position} className="w-4 h-4 text-primary fill-primary" />;
    } else if (isHalfStar) {
      return (
        <div key={position} className="relative">
          <Star className="w-4 h-4 text-primary" />
          <div className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="w-4 h-4 text-primary fill-primary" />
          </div>
        </div>
      );
    } else {
      return <Star key={position} className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => getStarRender(index))}
    </div>
  );
};

export default StarRating;
