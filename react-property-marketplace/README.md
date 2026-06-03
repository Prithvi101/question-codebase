# React Property Marketplace Assessment

Welcome to the React/TypeScript Property Marketplace assessment!

This codebase represents a small property search and listing application built using React, TypeScript, and React Router. It contains several intentional bugs and incomplete features that you need to resolve.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run tests:**
   ```bash
   npm run test
   ```

## Tasks

1. **Fix Broken Price Sorting:**
   Users report that sorting properties by price (both Low → High and High → Low) yields incorrect results. Currently, the prices are sorted alphabetically as strings (e.g., `$1,100` incorrectly sorts before `$350` because `"1"` comes before `"3"`). 
   *Expected:* Extract the numeric price values and sort properties correctly by their numeric price.

2. **Add Rating Sorting:**
   The sort dropdown contains an option called "Sort by Rating", but selecting it currently does nothing.
   *Expected:* Implement sorting by rating in descending order (highest rated properties first) when this option is selected.

3. **Fix Search Functionality:**
   Users report search is inconsistent. Currently, search is case-sensitive, requires exact title matches, and does not match locations.
   *Expected:* Implement case-insensitive search that matches both property titles and locations, and supports partial string matches (e.g., searching for "mumbai", "Mumbai", or "MUMBAI" should yield identical results).

4. **Fix Favorites Persistence:**
   Users can toggle properties as favorites using the heart icon on cards, but their favorites disappear after refreshing the page.
   *Expected:* Persist favorited property IDs using `localStorage` so they remain favorited even after a page reload.

5. **Add Minimum Rating Filter (Bonus Task):**
   A dropdown select component for "Minimum Rating" is partially configured. 
   *Expected:* Hook up the minimum rating select dropdown and implement filtering logic in `useProperties.ts` to display only properties with a rating greater than or equal to the selected rating (options: 1+, 2+, 3+, 4+, and 5+).
