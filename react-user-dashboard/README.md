# React User Dashboard Assessment

Welcome to the React/TypeScript User Management Dashboard assessment!

This project tests your ability to debug common React lifecycle issues (infinite loops), search algorithms, client-side input validations, and design empty states in TypeScript.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run tests:
   ```bash
   npm run test
   ```

## Tasks

1. **Fix Infinite Render Loop in User Fetching:** Find the `useEffect` responsible for loading the users and ensure it doesn't cause an infinite render loop.
2. **Fix Case-Insensitive Search:** Update the search text input filter so that matches are case-insensitive.
3. **Add Edit Email Validation Check:** Update the profile edit form saving validation. If the entered email is not valid (i.e. doesn't match a standard email format check), show a validation error message "Invalid email address" and do not save.
4. **Implement Empty State UI for Filtering:** Show a "No users found matching that search" text block when the search query does not match any user in the directory list.
