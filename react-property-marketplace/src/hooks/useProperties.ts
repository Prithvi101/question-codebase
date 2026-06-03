import { useState, useMemo } from 'react';
import rawProperties from '../data/properties.json';
import { Property } from '../components/PropertyCard';

// Cast the JSON import to Property array
const initialProperties = rawProperties as Property[];

export const useProperties = () => {
  const [properties] = useState<Property[]>(initialProperties);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [favorites, setFavorites] = useState<number[]>([]);
  // Bonus Task state (already provided for convenience, but filtering logic is missing)
  const [minRating, setMinRating] = useState<number>(0);

  // Toggle favorite status of a property
  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let result = [...properties];

    // BUG 3: Search is case-sensitive, exact match on title only, partial matches fail
    if (searchQuery) {
      result = result.filter((p) => p.title === searchQuery);
    }

    // TODO (Bonus Task): Add Minimum Rating filtering logic here.
    // The filter should only show properties with a rating greater than or equal to minRating.

    // Sorting logic
    if (sortBy === 'price-asc') {
      // BUG 1: String-based comparison instead of numeric comparison
      result.sort((a, b) => a.price.localeCompare(b.price));
    } else if (sortBy === 'price-desc') {
      // BUG 1: String-based comparison instead of numeric comparison
      result.sort((a, b) => b.price.localeCompare(a.price));
    } else if (sortBy === 'rating') {
      // BUG 2: 'Sort by Rating' dropdown option is available but does nothing
      // TODO: Implement sorting by rating in descending order (highest rating first)
    }

    return result;
  }, [properties, searchQuery, sortBy]);

  return {
    properties: filteredAndSortedProperties,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    favorites,
    toggleFavorite,
    minRating,
    setMinRating,
  };
};
