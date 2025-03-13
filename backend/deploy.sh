#!/bin/bash

# Exit script on any error
set -e

# Install dependencies
echo "Installing dependencies..."
yarn install

# Build the project
echo "Building the project..."
yarn build  # Replace with `npm run build` if you're using npm

# yarn global add serverless

# yarn add serverless-webpack

# Deploy using Serverless Framework
echo "starting AWS on local..."
# npx serverless deploy  # or `npx serverless deploy` if `serverless` is not globally installed
# serverless dynamodb start

serverless offline start

echo "Serverless on local is running!"

