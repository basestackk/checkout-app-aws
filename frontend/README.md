Checkout App with AWS

This is a checkout application built to demonstrate microservices, event driven architecture
with AWS. 

Tech Stack

Frontend:
Next.js 
ShadCN UI
Tailwind CSS

Backend:
Typescript
Redis
DocumentDB
DynamoDB
Microservices Architecture
GraphQL
EventBridge
APIGateway
Docker

## Getting Started

Web app:

```bash
cd to frontend
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Backend:

```bash
cd to backend/src
setup dynamo, redis and mongoDB using Docker
run yarn
run yarn build
run serverless offline start

see postman collection included in tests for registering new user
```

