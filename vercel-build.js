// This script is executed by Vercel during the build process
const { execSync } = require('child_process');

// Print Node.js version
console.log(`Node.js version: ${process.version}`);

// Set OpenSSL legacy provider
process.env.NODE_OPTIONS = '--openssl-legacy-provider';
console.log(`Set NODE_OPTIONS to: ${process.env.NODE_OPTIONS}`);

// Run the build command
console.log('Running build command...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 