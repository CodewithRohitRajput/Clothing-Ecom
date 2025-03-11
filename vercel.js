// This file is used by Vercel to understand how to serve the application
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';

// If we're in a Vercel environment, we need to serve the static files
if (isVercel) {
  console.log('Running in Vercel environment');
}

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Serve static files
    if (pathname.startsWith('/static/')) {
      const filePath = path.join(__dirname, 'build', pathname);
      if (fs.existsSync(filePath)) {
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        return;
      }
    }

    // Serve API routes
    if (pathname.startsWith('/api/')) {
      handle(req, res, parsedUrl);
      return;
    }

    // Serve index.html for all other routes
    const filePath = path.join(__dirname, 'build', 'index.html');
    if (fs.existsSync(filePath)) {
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      return;
    }

    // Fall back to Next.js handler
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
}); 