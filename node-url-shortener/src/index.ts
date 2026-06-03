import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

interface UrlRecord {
  code: string;
  originalUrl: string;
  hits: number;
}

export const urlDatabase: Record<string, UrlRecord> = {
  'google': { code: 'google', originalUrl: 'https://google.com', hits: 0 }
};

// BUG: Allows relative paths or URLs without HTTP/HTTPS scheme.
const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  // This loose regex accepts strings like "google.com" or "ftp://example.com"
  const regex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  return regex.test(url);
};

// Generate random short code
const generateCode = (): string => {
  return Math.random().toString(36).substring(2, 8);
};

// Rate limiter middleware placeholder
// BUG: No rate limiting is implemented or applied currently on POST /shorten.

app.post('/shorten', (req: Request, res: Response) => {
  const { url } = req.body;

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const code = generateCode();
  urlDatabase[code] = {
    code,
    originalUrl: url,
    hits: 0
  };

  res.status(201).json({ code, shortUrl: `http://localhost:3000/${code}` });
});

app.get('/:code', async (req: Request, res: Response) => {
  const { code } = req.params;
  const record = urlDatabase[code];

  if (!record) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  // BUG: Concurrency race condition simulated.
  // Reading the count, waiting asynchronously, then saving it back.
  // If multiple hits come concurrently, some increments will be overwritten.
  const currentHits = record.hits;
  await new Promise((resolve) => setTimeout(resolve, 5));
  record.hits = currentHits + 1;

  // BUG: Sends 200 JSON instead of performing an actual HTTP 302 Redirect.
  res.status(200).json({ originalUrl: record.originalUrl });
});

export default app;
