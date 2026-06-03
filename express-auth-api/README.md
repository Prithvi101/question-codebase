# BeeCrypt Backend Authentication API

Welcome to the BeeCrypt Backend Authentication API assessment! 

This repository contains a Node.js/Express application that handles user authentication and role-based access. However, the current implementation has several bugs, missing features, and security vulnerabilities.

## Your Task

Your objective is to fix the issues and complete the missing features described below.

### Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Run tests (to verify your fixes):
   ```bash
   npm run test
   ```

### Tasks

1. **Fix Data Leak in User Profile:** The `GET /api/users/profile` endpoint currently returns the user's password hash. Update the controller to omit sensitive fields.
2. **Fix Password Verification:** Users are unable to log in even with correct credentials. Fix the password comparison logic in the login controller.
3. **Improve Token Validation Error Handling:** The authentication middleware crashes the server (500 Error) when an expired JWT is provided. Update it to return a clean `401 Unauthorized` response instead.
4. **Include Role in JWT Payload:** The login token generation is missing the user's role. Ensure the role is included in the JWT payload.
5. **Implement Role-Based Access Control:** The `GET /api/admin/dashboard` endpoint is currently accessible by any authenticated user. Implement a middleware to restrict access only to users with the `ADMIN` role.
6. **Implement Token Refresh:** Implement the `POST /api/auth/refresh` endpoint to issue a new access token when provided with a valid refresh token.

You are encouraged to use the existing `tests/auth.test.ts` file to guide your development. Some tests are currently failing and should pass once you complete the tasks.

Good luck!
