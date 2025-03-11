#!/bin/bash

# This script is executed by Vercel during the build process

# Print Node.js version
echo "Node.js version: $(node -v)"

# Set OpenSSL legacy provider
export NODE_OPTIONS="--openssl-legacy-provider"
echo "Set NODE_OPTIONS to: $NODE_OPTIONS"

# Run the build command
echo "Running build command..."
npm run build

echo "Build completed!" 