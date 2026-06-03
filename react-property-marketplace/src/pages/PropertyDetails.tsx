import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Calendar, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import rawProperties from '../data/properties.json';
import { Property } from '../components/PropertyCard';

interface PropertyDetailsProps {
  favorites: number[];
  toggleFavorite: (id: number) => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  favorites,
  toggleFavorite,
}) => {
  const { id } = useParams<{ id: string }>();
  const properties = rawProperties as Property[];
  const property = properties.find((p) => p.id === Number(id));

  if (!property) {
    return (
      <div className="empty-state" style={{ marginTop: '3rem' }}>
        <h3 className="empty-title">Property Not Found</h3>
        <p className="empty-desc">The property you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', marginTop: '1rem' }}>
          Back to Listings
        </Link>
      </div>
    );
  }

  const isFavorited = favorites.includes(property.id);

  return (
    <div style={{ padding: '1rem 0' }}>
      <Link to="/" className="details-back-link">
        <ArrowLeft size={18} />
        <span>Back to Listings</span>
      </Link>

      <div className="details-container">
        <div className="details-main">
          <div className="details-image-hero">
            <span className="card-type-tag" style={{ top: '1.5rem', left: '1.5rem' }}>{property.type}</span>
            <img src={property.image} alt={property.title} className="details-image" />
          </div>

          <div className="details-header-section">
            <div className="details-title-row">
              <h1 className="details-title">{property.title}</h1>
            </div>
            
            <div className="details-sub-row">
              <div className="details-rating" data-testid="details-rating">
                <Star size={16} fill="currentColor" />
                <span>{property.rating.toFixed(1)} Rating</span>
              </div>
              <div className="details-meta-item">
                <MapPin size={16} />
                <span>{property.location}</span>
              </div>
            </div>
          </div>

          <div className="details-info-card">
            <h2 className="details-section-title">About this property</h2>
            <p className="details-desc">{property.description}</p>
          </div>

          <div className="details-info-card">
            <h2 className="details-section-title">Amenities & Features</h2>
            <div className="details-features-grid">
              {property.features.map((feature, idx) => (
                <div key={idx} className="details-feature-item">
                  <span className="details-feature-label">Amenity</span>
                  <span className="details-feature-val">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="details-pricing-card">
          <div className="pricing-header">
            <span className="pricing-label">Monthly Rent</span>
            <div className="pricing-value" data-testid="details-price">
              {property.price}
              <span>/mo</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => alert('Tour booking is not implemented yet!')}
              className="details-action-btn btn-primary"
            >
              <Calendar size={18} />
              <span>Schedule a Tour</span>
            </button>

            <button
              onClick={() => toggleFavorite(property.id)}
              className={`details-action-btn btn-secondary ${isFavorited ? 'is-favorited' : ''}`}
              style={{ color: isFavorited ? 'var(--color-favorite)' : 'inherit' }}
              data-testid="details-fav-btn"
            >
              <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
              <span>{isFavorited ? 'Remove Favorite' : 'Save to Favorites'}</span>
            </button>
          </div>

          <div className="pricing-meta">
            <div className="pricing-meta-item">
              <ShieldCheck size={16} className="pricing-meta-icon" />
              <span>Verified landlord and property listing</span>
            </div>
            <div className="pricing-meta-item">
              <Sparkles size={16} className="pricing-meta-icon" />
              <span>Highly rated in the neighborhood</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PropertyDetails;
