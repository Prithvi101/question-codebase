import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PropertyListing from './pages/PropertyListing';
import PropertyDetails from './pages/PropertyDetails';
import { useProperties } from './hooks/useProperties';

function App() {
  const {
    properties,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    favorites,
    toggleFavorite,
    minRating,
    setMinRating,
  } = useProperties();

  return (
    <Router>
      <div className="app-container">
        <div className="bg-mesh"></div>
        <Navbar favoritesCount={favorites.length} />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <PropertyListing
                  properties={properties}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  minRating={minRating}
                  setMinRating={setMinRating}
                />
              }
            />
            <Route
              path="/property/:id"
              element={
                <PropertyDetails
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
