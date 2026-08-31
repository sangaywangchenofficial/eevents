import React from 'react';
import { Star } from 'lucide-react';

const RatingBadge = ({ averageRating, totalReviews, distribution, size = 'small' }) => {
    const isLarge = size === 'large';
    const starSize = isLarge ? 'w-5 h-5' : 'w-4 h-4';
    const textSize = isLarge ? 'text-base' : 'text-sm';
    const countSize = isLarge ? 'text-sm' : 'text-xs';

    return (
        <div className="inline-flex items-center gap-1.5 mt-1 cursor-default relative">
            <div className="relative group/rating flex items-center justify-center cursor-pointer">
                <Star className={`${starSize} fill-amber-400 text-amber-400`} />

                {/* Hover Tooltip */}
                {totalReviews > 0 && distribution && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white dark:bg-[#1C2B27] rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-[#0F1A17]/80 border border-slate-100 dark:border-[#2A3D38] p-4 opacity-0 invisible group-hover/rating:opacity-100 group-hover/rating:visible transition-all duration-300 z-[60] pointer-events-none group-hover/rating:pointer-events-auto before:content-[''] before:absolute before:inset-x-0 before:-top-2 before:h-2">
                        <h4 className="font-poppins font-semibold text-sm text-slate-800 dark:text-[#E8F5F2] mb-3">
                            Rating Breakdown
                        </h4>
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = distribution[star] || 0;
                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-2 text-xs">
                                        <span className="w-3 font-medium text-slate-600 dark:text-[#A8C4BE]">{star}</span>
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-[#0F1A17] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-400 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="w-6 text-right font-medium text-slate-500 dark:text-[#7AA49D]">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <span className={`${textSize} font-semibold text-slate-700 dark:text-[#E8F5F2]`}>
                {averageRating || 'New'}
            </span>
            {totalReviews > 0 && (
                <span className={`${countSize} text-slate-500 dark:text-[#7AA49D]`}>
                    ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    );
};

export default RatingBadge;
