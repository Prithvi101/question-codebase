import React from 'react';
import FilterBar from '../components/FilterBar';
import PropertyCard, { Property } from '../components/PropertyCard';
import { ShieldAlert } from 'lucide-react';

interface PropertyListingProps {
  properties: Property[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  minRating?: number;
  setMinRating?: (rating: number) => void;
}

const PropertyListing: React.FC<PropertyListingProps> = ({
  properties,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  favorites,
  toggleFavorite,
  minRating,
  setMinRating,
}) => {
  return (
    <div className="listing-layout">
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        minRating={minRating}
        setMinRating={setMinRating}
      />

      <section className="listings-section">
        <div className="listings-header">
          <h2 className="listings-count" data-testid="listings-count">
            {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Available
          </h2>
        </div>

        {properties.length === 0 ? (
          <div className="empty-state" data-testid="empty-state">
            <ShieldAlert className="empty-icon" />
            <h3 className="empty-title">No Properties Found</h3>
            <p className="empty-desc">
              We couldn't find any properties matching your current filters. Try adjusting your search term or sort options.
            </p>
          </div>
        ) : (
          <div className="listings-grid" data-testid="listings-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorited={favorites.includes(property.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PropertyListing;
