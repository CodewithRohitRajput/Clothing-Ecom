// This file is used by Vercel to understand how to build and serve the application
module.exports = {
  // Use Node.js 18.x
  version: 2,
  
  // Build command
  build: {
    env: {
      NODE_OPTIONS: '--openssl-legacy-provider'
    }
  },
  
  // Routes
  routes: [
    { handle: 'filesystem' },
    { src: '/static/(.*)', dest: '/static/$1' },
    { src: '/favicon.ico', dest: '/favicon.ico' },
    { src: '/manifest.json', dest: '/manifest.json' },
    { src: '/(.*)', dest: '/index.html' }
  ]
}; 