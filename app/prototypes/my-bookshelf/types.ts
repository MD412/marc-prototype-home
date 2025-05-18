export interface NotionBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverImage: string;
  rating: number;
  review: string;
  createdTime: string;
  lastEditedTime: string;
}

export interface BookFiltersProps {
  genres: string[];
  activeGenre: string | null;
  onGenreChange: (genre: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface BookCardProps {
  book: NotionBook;
} 