# Evaluation Notes (For Reviewers)

This document contains the solutions and evaluation criteria for the BeeCrypt Backend Authentication API assessment.

## Task 1: Fix Data Leak in User Profile
**Issue:** `src/controllers/auth.controller.ts` returns the entire user object, including `passwordHash`.
**Fix:** The candidate should explicitly pick fields or delete the password field before sending the response.
**Evaluation:** Did they use destructuring or a clean omission method? Did they accidentally mutate the mock DB object?

## Task 2: Fix Password Verification
**Issue:** In `auth.controller.ts`, the `login` function compares the raw password against the raw password instead of the hash, or uses `bcrypt.compare` incorrectly (e.g., `bcrypt.compare(password, password)` instead of `bcrypt.compare(password, user.passwordHash)`).
**Fix:** Use `await bcrypt.compare(password, user.passwordHash)`.
**Evaluation:** Do they understand asynchronous bcrypt comparison?

## Task 3: Improve Token Validation Error Handling
**Issue:** `src/middleware/auth.middleware.ts` uses `jwt.verify` without a `try/catch` block. When a token is expired, `jwt.verify` throws an error causing an unhandled rejection / 500 error.
**Fix:** Wrap `jwt.verify` in a `try/catch` block and return `res.status(401).json({ message: "Invalid or expired token" })`.
**Evaluation:** Do they understand Express error handling and JWT synchronous verification?

## Task 4: Include Role in JWT Payload
**Issue:** `jwt.sign` in the login controller only includes the `userId` in the payload.
**Fix:** Update the payload to `{ userId: user.id, role: user.role }`.
**Evaluation:** Very simple fix, but tests if they can trace how tokens are generated.

## Task 5: Implement Role-Based Access Control
**Issue:** `GET /api/admin/dashboard` only uses `requireAuth`, which means any user can access it.
**Fix:** Create a new middleware (e.g., `requireRole("ADMIN")`) or update the route to check `req.user.role`.
**Evaluation:** Did they implement a reusable middleware factory, or hardcode the check in the route? Both are acceptable, but a factory is better.

## Task 6: Implement Token Refresh
**Issue:** The `/api/auth/refresh` endpoint is empty.
**Fix:** Read the refresh token from the request body, verify it, find the user, and issue a new access token.
**Evaluation:** Did they verify the refresh token properly? Did they check if the user still exists?
