// This file is used by Vercel to handle API requests
const express = require('express');
const app = express();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Fallback for all other API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Export the Express app
module.exports = app; 