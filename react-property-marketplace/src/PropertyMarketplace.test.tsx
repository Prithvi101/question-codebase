import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

describe('Property Marketplace Assessment Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test to guarantee isolation
    window.localStorage.clear();
  });

  test('Task 1: Correct numeric sorting (Price: Low to High & High to Low)', () => {
    render(<App />);
    const sortSelect = screen.getByTestId('sort-select');

    // 1. Test Price: Low to High
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });
    
    // Get all displayed price elements
    let priceElements = screen.getAllByTestId('property-price');
    let prices = priceElements.map((el) => {
      // Extract numeric value from strings like "$1,200/mo"
      const text = el.textContent || '';
      return parseInt(text.replace(/[^0-9]/g, ''), 10);
    });

    // Check if prices are sorted ascending numerically
    // Correct numeric order: 350, 700, 850, 950, 1100, 1200, 1800, 4500, 8500
    // Incorrect string order would sort "$1,100" and "$1,200" before "$350"
    expect(prices).toEqual([350, 700, 850, 950, 1100, 1200, 1800, 4500, 8500]);

    // 2. Test Price: High to Low
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
    
    priceElements = screen.getAllByTestId('property-price');
    prices = priceElements.map((el) => {
      const text = el.textContent || '';
      return parseInt(text.replace(/[^0-9]/g, ''), 10);
    });

    // Check if prices are sorted descending numerically
    expect(prices).toEqual([8500, 4500, 1800, 1200, 1100, 950, 850, 700, 350]);
  });

  test('Task 2: Sort by Rating (highest first)', () => {
    render(<App />);
    const sortSelect = screen.getByTestId('sort-select');

    // Select Sort by Rating
    fireEvent.change(sortSelect, { target: { value: 'rating' } });

    // Get all displayed rating elements
    const ratingElements = screen.getAllByTestId('property-rating');
    const ratings = ratingElements.map((el) => parseFloat(el.textContent || '0'));

    // Check if ratings are in descending order
    // Expected highest rating first (e.g. 4.9, 4.8, 4.7, 4.6, 4.5, 4.2, 4.0, 3.9, 2.8)
    const sortedRatings = [...ratings].sort((a, b) => b - a);
    expect(ratings).toEqual(sortedRatings);
    expect(ratings[0]).toBe(4.9);
    expect(ratings[ratings.length - 1]).toBe(2.8);
  });

  test('Task 3: Case-insensitive, partial-match search matching title or location', () => {
    const { unmount } = render(<App />);
    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;

    // 1. Test case-insensitivity with lowercase "mumbai"
    fireEvent.change(searchInput, { target: { value: 'mumbai' } });
    let cards = screen.getAllByTestId(/property-card-/);
    expect(cards.length).toBe(3); // Should match ID 1, 4, 9

    // 2. Test case-insensitivity with uppercase "MUMBAI"
    fireEvent.change(searchInput, { target: { value: 'MUMBAI' } });
    cards = screen.getAllByTestId(/property-card-/);
    expect(cards.length).toBe(3);

    // 3. Test partial matches (e.g., "luxury" matching "Luxury Modern Villa" and "Skyline Luxury Penthouse")
    fireEvent.change(searchInput, { target: { value: 'luxury' } });
    cards = screen.getAllByTestId(/property-card-/);
    expect(cards.length).toBe(2); // Matches ID 1 and ID 4

    // Let's refine search: search for "beach" should match "Cozy Beachfront Cabin" (ID 2)
    fireEvent.change(searchInput, { target: { value: 'beach' } });
    cards = screen.getAllByTestId(/property-card-/);
    expect(cards.length).toBe(1);
    expect(screen.getByText('Cozy Beachfront Cabin')).toBeInTheDocument();

    // 4. Search by location (e.g., "goa")
    fireEvent.change(searchInput, { target: { value: 'goa' } });
    cards = screen.getAllByTestId(/property-card-/);
    expect(cards.length).toBe(1);
    expect(screen.getByText('Goa, India')).toBeInTheDocument();
  });

  test('Task 4: Favorites toggle and persistence across reload', () => {
    // 1. Initial render - favorites badge should be 0
    const { unmount } = render(<App />);
    const badge = screen.getByTestId('favorites-badge');
    expect(badge.textContent).toContain('0 Favorites');

    // Click favorite button on first property card (Luxury Modern Villa, ID 1)
    const favBtn = screen.getByTestId('fav-btn-1');
    fireEvent.click(favBtn);

    // Badge should show 1 favorite
    expect(badge.textContent).toContain('1 Favorites');

    // Unmount the component to simulate a page reload
    unmount();

    // Re-render App
    render(<App />);
    const newBadge = screen.getByTestId('favorites-badge');
    
    // Favorites should persist and show 1 favorite
    expect(newBadge.textContent).toContain('1 Favorites');
    
    // Property card should maintain favorited styling
    const newFavBtn = screen.getByTestId('fav-btn-1');
    expect(newFavBtn.className).toContain('is-favorited');
  });

  test('Task 5: Minimum Rating filter integration', () => {
    render(<App />);
    
    // Check if the rating select is rendered in the UI
    const ratingSelect = screen.queryByTestId('rating-select');
    
    // If candidate has implemented the rating select, let's test it
    if (!ratingSelect) {
      // If it is not rendered (e.g. they haven't hooked it up yet or passed prop), fail this test
      fail('Rating filter dropdown select (data-testid="rating-select") was not found in the DOM.');
    }

    // 1. Filter by 4+ Stars
    fireEvent.change(ratingSelect, { target: { value: '4' } });

    // Verify all displayed property cards have rating >= 4.0
    const ratingElements = screen.getAllByTestId('property-rating');
    const ratings = ratingElements.map((el) => parseFloat(el.textContent || '0'));
    
    expect(ratings.length).toBeGreaterThan(0);
    ratings.forEach((rating) => {
      expect(rating).toBeGreaterThanOrEqual(4.0);
    });
    
    // Check that ID 9 (rating 2.8) is filtered out
    expect(screen.queryByTestId('property-card-9')).not.toBeInTheDocument();

    // 2. Filter by 5 Stars
    fireEvent.change(ratingSelect, { target: { value: '5' } });
    
    // Verify empty state is displayed since max rating is 4.9
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.queryByTestId('listings-grid')).not.toBeInTheDocument();
  });
});
