const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check Node.js version
const nodeVersion = process.version;
console.log(`Using Node.js version: ${nodeVersion}`);

// Determine if we need legacy OpenSSL provider
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);
const needsLegacyProvider = majorVersion >= 17;

if (needsLegacyProvider) {
  console.log('Node.js version >= 17 detected, using OpenSSL legacy provider');
  process.env.NODE_OPTIONS = '--openssl-legacy-provider';
} else {
  console.log('Node.js version < 17 detected, no need for OpenSSL legacy provider');
}

// Run the build command
try {
  console.log('Building the application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 