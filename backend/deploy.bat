@echo off
:: Exit on any error
setlocal enabledelayedexpansion
set ERRORLEVEL=0

:: Install dependencies
echo Installing dependencies...
yarn install

:: Build the project
echo Building the project...
yarn run build

:: Install serverless globally
yarn global add serverless

:: Install serverless-webpack plugin
yarn add serverless-webpack

:: Deploy using Serverless Framework
echo Deploying to AWS Lambda...
serverless dynamodb start

serverless offline start

echo Deployment finished successfully!
