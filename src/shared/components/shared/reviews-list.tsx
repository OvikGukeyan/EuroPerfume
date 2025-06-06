import React, { FC } from 'react';
import { cn } from '@/src/lib/utils';
import { ReviewComponent } from '.';
import { Review, User } from '@prisma/client';

type Props = {
    reviews: (Review & {user: User})[]
  className?: string;
};

export const ReviewsList: FC<Props> = ({ className, reviews }) => {
  return (
    <div id='reviews' className={cn('bg-secondary px-5 md:px-16 py-10 md:py-20 flex flex-col  ', className)}>
        { 
            reviews.map((review) => (
                <ReviewComponent key={review.id} text={review.text} userName={review.user.fullName} rating={review.rating} createdAt={review.createdAt}/>
            ))
        }
        
    </div>
  );
};