// Configuration for different environments
const dev = {
  API_URL: 'http://localhost:5001'
};

const prod = {
  API_URL: process.env.REACT_APP_API_URL || 'https://your-backend-api-url.vercel.app/api'
};

// Determine which environment we're in
const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default config; 