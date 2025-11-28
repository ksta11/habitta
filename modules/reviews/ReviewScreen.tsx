import React from 'react';
import ReviewFormModule from './ReviewForm';
import ReviewListModule from './ReviewListModule';

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