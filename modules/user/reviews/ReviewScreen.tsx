import React from 'react';
import ReviewListModule from './ReviewListModule';
import ReviewFormModule from '../../modules/user/ReviewForm';

interface ReviewScreenProps {
  view: 'list' | 'form';
  reviewId?: string;
  reviewData?: string;
}

export default function ReviewScreen({ view, reviewId, reviewData }: ReviewScreenProps) {
  switch (view) {
    case 'form':
      return <ReviewFormModule />;
    case 'list':
    default:
      return <ReviewListModule />;
  }
}