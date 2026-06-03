import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  // Note: For the bonus task, candidates will need to pass minRating and setMinRating props here.
  minRating?: number;
  setMinRating?: (rating: number) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  minRating = 0,
  setMinRating,
}) => {
  return (
    <aside className="filter-panel" data-testid="filter-bar">
      <div className="filter-section">
        <label className="filter-label" htmlFor="search-input">
          Search Properties
        </label>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            id="search-input"
            type="text"
            placeholder="Search by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            data-testid="search-input"
          />
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label" htmlFor="sort-select">
          Sort By
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
          data-testid="sort-select"
        >
          <option value="default">Select Option...</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {/* 
        TODO (Bonus Task): Add the Minimum Rating filter UI here.
        Hint: Use a dropdown select or a set of buttons/pills.
        Options should be: 1+, 2+, 3+, 4+, 5+
      */}
      {setMinRating && (
        <div className="filter-section" data-testid="rating-filter-section">
          <label className="filter-label" htmlFor="rating-select">
            Minimum Rating
          </label>
          <select
            id="rating-select"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="filter-select"
            data-testid="rating-select"
          >
            <option value={0}>Any Rating</option>
            <option value={1}>1+ Stars</option>
            <option value={2}>2+ Stars</option>
            <option value={3}>3+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>
      )}
    </aside>
  );
};

export default FilterBar;
