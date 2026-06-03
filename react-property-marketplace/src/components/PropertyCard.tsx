import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Heart } from 'lucide-react';

export interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  rating: number;
  type: string;
  image: string;
  description: string;
  features: string[];
}

interface PropertyCardProps {
  property: Property;
  isFavorited: boolean;
  onToggleFavorite: (id: number) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorited,
  onToggleFavorite,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(property.id);
  };

  return (
    <div className="property-card" data-testid={`property-card-${property.id}`}>
      <div className="property-img-wrapper">
        <span className="card-type-tag">{property.type}</span>
        <button
          onClick={handleFavoriteClick}
          className={`card-fav-btn ${isFavorited ? 'is-favorited' : ''}`}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          data-testid={`fav-btn-${property.id}`}
        >
          <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
        <img src={property.image} alt={property.title} className="property-img" loading="lazy" />
      </div>

      <Link to={`/property/${property.id}`} className="property-details-link">
        <div className="property-info">
          <div className="property-header">
            <h3 className="property-title" title={property.title}>
              {property.title}
            </h3>
            <div className="property-rating-badge" data-testid="property-rating">
              <Star size={12} fill="currentColor" />
              <span>{property.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="property-location">
            <MapPin size={14} />
            <span>{property.location}</span>
          </div>

          <div className="property-features">
            {property.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} className="feature-pill">
                {feature}
              </span>
            ))}
          </div>

          <div className="property-footer">
            <div className="property-price" data-testid="property-price">
              {property.price}
              <span>/mo</span>
            </div>
            <div className="view-details-btn">
              <span>View</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
