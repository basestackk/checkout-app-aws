#!/bin/bash

# Exit script on any error
set -e

# Use the serverless.yaml inside the service folder
# npx serverless deploy --config $SERVICE_DIR/serverless.yaml  # Deploy using the service-specific serverless.yaml

# Optionally, you can run the serverless-offline server to start the service locally
serverless offline start --config eventbridge.yaml --noLambda # Use the correct serverless.yaml for local offline start


