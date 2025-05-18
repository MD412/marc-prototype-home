"use client";

import React from 'react';
import { BookFiltersProps } from '../types';
import styles from '../styles.module.css';

const BookFilters: React.FC<BookFiltersProps> = ({
  genres,
  activeGenre,
  onGenreChange,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className={styles.filters}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search by title or author..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className={styles.genreFilters}>
        <button
          className={`${styles.genreButton} ${activeGenre === null ? styles.genreButtonActive : ''}`}
          onClick={() => onGenreChange(null)}
        >
          All
        </button>
        
        {genres.map((genre) => (
          <button
            key={genre}
            className={`${styles.genreButton} ${activeGenre === genre ? styles.genreButtonActive : ''}`}
            onClick={() => onGenreChange(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookFilters; 