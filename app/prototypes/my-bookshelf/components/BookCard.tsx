"use client";

import React from 'react';
import { BookCardProps } from '../types';
import styles from './BookCard.module.css';

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { title, author, genre, coverImage, rating, review } = book;
  
  // Create an array of stars for the rating
  const stars = [];
  const maxRating = 5;
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <span 
        key={i} 
        className={`${styles.star} ${i <= rating ? styles.filled : styles.empty}`}
      >
        ★
      </span>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.coverWrapper}>
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={`Cover of ${title}`} 
            className={styles.cover}
          />
        ) : (
          <div className={styles.placeholderCover}>
            <span>{title.substring(0, 1)}</span>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.author}>by {author}</p>
        
        {genre && (
          <span className={styles.genre}>{genre}</span>
        )}
        
        <div className={styles.rating}>
          {stars}
          <span className={styles.ratingText}>{rating}/5</span>
        </div>
        
        {review && (
          <div className={styles.review}>
            <h4>Review:</h4>
            <p>{review.length > 120 ? `${review.substring(0, 120)}...` : review}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard; 