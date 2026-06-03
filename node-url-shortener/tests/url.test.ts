import request from 'supertest';
import app, { urlDatabase } from '../src/index';

describe('Node.js URL Shortener Assessment Tests', () => {
  beforeEach(() => {
    // Reset DB state
    for (const key in urlDatabase) {
      delete urlDatabase[key];
    }
    urlDatabase['google'] = { code: 'google', originalUrl: 'https://google.com', hits: 0 };
  });

  test('Task 1: URL input regex validations', async () => {
    // Should reject URLs without http/https protocol schemes
    const res1 = await request(app)
      .post('/shorten')
      .send({ url: 'google.com' });
    expect(res1.status).toBe(400);
    expect(res1.body.error).toBe('Invalid URL format');

    // Should reject wrong protocol schemes
    const res2 = await request(app)
      .post('/shorten')
      .send({ url: 'ftp://ftp.google.com' });
    expect(res2.status).toBe(400);

    // Should accept valid HTTP/HTTPS URLs
    const res3 = await request(app)
      .post('/shorten')
      .send({ url: 'https://google.com' });
    expect(res3.status).toBe(201);
    expect(res3.body.code).toBeDefined();
  });

  test('Task 2: Redirection response code and headers', async () => {
    const res = await request(app).get('/google');
    // Should redirect to original url
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('https://google.com');
  });

  test('Task 3: Concurrent analytics hit counting stability', async () => {
    // Trigger 10 concurrent requests to redirect
    const requests = Array.from({ length: 10 }).map(() =>
      request(app).get('/google')
    );
    await Promise.all(requests);

    // Hits count should be exactly 10, not truncated by concurrent updates
    expect(urlDatabase['google'].hits).toBe(10);
  });

  test('Task 4: IP-based Rate Limiter on POST /shorten', async () => {
    // Send 5 valid shorten requests (should pass)
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post('/shorten')
        .send({ url: 'https://example.com' });
      expect(res.status).toBe(201);
    }

    // 6th request should fail with 429 Too Many Requests
    const res6 = await request(app)
      .post('/shorten')
      .send({ url: 'https://example.com' });
    expect(res6.status).toBe(429);
    expect(res6.body.error).toBe('Rate limit exceeded. Try again later.');
  });
});
