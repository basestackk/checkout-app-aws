#!/bin/bash

# Exit script on any error
set -e

# Install dependencies
echo "Installing dependencies..."
yarn install

# Build the project
echo "Building the project..."
yarn build  # Replace with `npm run build` if you're using npm

echo "Creating Dynamo DB tables..."
# aws dynamodb create-table    --table-name cart-db-read     --attribute-definitions         AttributeName=cartId,AttributeType=S     --key-schema         AttributeName=cartId,KeyType=HASH     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000
# aws dynamodb create-table    --table-name carts     --attribute-definitions         AttributeName=cartId,AttributeType=S     --key-schema         AttributeName=cartId,KeyType=HASH     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000
# aws dynamodb create-table    --table-name pricing     --attribute-definitions         AttributeName=sku,AttributeType=S     --key-schema         AttributeName=sku,KeyType=HASH   --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000  
# aws dynamodb create-table    --table-name pricing-db-read     --attribute-definitions         AttributeName=sku,AttributeType=S     --key-schema         AttributeName=sku,KeyType=HASH     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000
# aws dynamodb create-table    --table-name inventory-db-read     --attribute-definitions         AttributeName=sku,AttributeType=S     --key-schema         AttributeName=sku,KeyType=HASH     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000
# aws dynamodb create-table    --table-name inventory     --attribute-definitions         AttributeName=sku,AttributeType=S     --key-schema         AttributeName=sku,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000 
# aws dynamodb create-table    --table-name UsersTable     --attribute-definitions         AttributeName=email,AttributeType=S     --key-schema         AttributeName=email,KeyType=HASH   --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000  

# yarn global add serverless

# yarn add serverless-webpack

# Deploy using Serverless Framework
echo "starting AWS on local..."
# npx serverless deploy  # or `npx serverless deploy` if `serverless` is not globally installed
# serverless dynamodb start

serverless offline start

echo "Serverless on local is running!"

