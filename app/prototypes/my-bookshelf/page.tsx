"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './styles.module.css';
import BookCard from './components/BookCard';
import BookFilters from './components/BookFilters';
import { NotionBook } from './types';

export default function MyBookshelf() {
  const [books, setBooks] = useState<NotionBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch books: ${response.statusText}`);
        }
        
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on active genre and search query
  const filteredBooks = books.filter(book => {
    // Filter by genre if activeGenre is set
    const genreMatch = !activeGenre || book.genre === activeGenre;
    
    // Filter by search query (match title or author)
    const searchMatch = !searchQuery || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    return genreMatch && searchMatch;
  });

  // Extract unique genres from books
  const genres = Array.from(new Set(books.map(book => book.genre))).filter(Boolean);

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <Link href="/" className={styles.backButton}>← Back</Link>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>My Bookshelf</h1>
        <p className={styles.subtitle}>Powered by Notion</p>
      </header>

      <BookFilters 
        genres={genres}
        activeGenre={activeGenre}
        onGenreChange={setActiveGenre}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className={styles.main}>
        {loading && <div className={styles.loading}>Loading your bookshelf...</div>}
        
        {error && (
          <div className={styles.error}>
            <p>Error: {error}</p>
            <p>Make sure your Notion integration is properly configured.</p>
          </div>
        )}
        
        {!loading && !error && filteredBooks.length === 0 && (
          <div className={styles.noBooks}>
            <p>No books found. Try adjusting your filters or add books to your Notion database.</p>
          </div>
        )}
        
        <div className={styles.grid}>
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </main>
    </div>
  );
} 