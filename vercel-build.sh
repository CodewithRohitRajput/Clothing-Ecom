#!/bin/bash

# Print Node.js version
echo "Node.js version: $(node -v)"

# Set OpenSSL legacy provider
export NODE_OPTIONS="--openssl-legacy-provider"
echo "Set NODE_OPTIONS to: $NODE_OPTIONS"

# Install dependencies
echo "Installing dependencies..."
npm install

# Run build
echo "Building the application..."
npm run build

echo "Build completed!" 