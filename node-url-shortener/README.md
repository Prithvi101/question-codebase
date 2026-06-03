# Node.js URL Shortener Assessment

Welcome to the Node.js/TypeScript URL Shortener API assessment!

This is a backend assessment testing absolute URL validation, Express redirect status codes, concurrency debugging in mock state storage, and custom middleware design.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Run tests:
   ```bash
   npm run test
   ```

## Tasks

1. **Fix URL Regex Validation Pattern:** Ensure only valid HTTP/HTTPS URLs (e.g. `https://example.com`) are shortened. The current checker accepts empty values or wrong schemes. Return `400 Bad Request` with `{ error: "Invalid URL format" }` for invalid URLs.
2. **Fix Redirect Location Headers:** The `GET /:code` endpoint is broken. It should redirect the browser/HTTP client with a `302 Found` status to the original URL.
3. **Fix Concurrent Analytics Counters:** Fix the analytics increment logic in the redirect route to properly record stats/visits without dropping count records when multiple redirects hit concurrently.
4. **Implement Client IP Rate Limiting:** Implement rate-limiting middleware for the `POST /shorten` endpoint. A client IP (retrieved from `req.ip`) should be limited to a maximum of 5 shorten operations per minute. If they exceed this rate, return a `429 Too Many Requests` status code with `{ error: "Rate limit exceeded. Try again later." }`.
