# Checkout App with AWS

This is a checkout application built to demonstrate **microservices** and **event-driven architecture** with **AWS**. The app leverages modern web technologies and AWS services to build scalable, efficient, and maintainable solutions.

## Tech Stack

### Frontend:
- **Next.js** – React framework for server-side rendering
- **ShadCN UI** – Component library
- **Tailwind CSS** – Utility-first CSS framework

### Backend:
- **Typescript** – JavaScript superset for static typing
- **Redis** – In-memory data structure store
- **DocumentDB** – NoSQL database for document storage
- **DynamoDB** – Managed NoSQL database service
- **Microservices Architecture** – Design pattern for distributed systems
- **CQRS** – Command Query Responsibility Segregation
- **GraphQL** – Query language for APIs
- **EventBridge** – Serverless event bus service
- **API Gateway** – Fully managed API service
- **Docker** – Containerization platform

---

## Getting Started

### Prerequisites

- **Node.js** (for frontend and backend)
- **Yarn** (for frontend and backend dependencies)
- **Docker** (for running local databases)

Ensure you have the following services running locally before proceeding.

### Web App Setup (Frontend)

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2. Install dependencies and run the development server:
    ```bash
    yarn install
    yarn dev
    ```

3. Open your browser and visit [http://localhost:3000](http://localhost:3000) to view the app.

### Backend Setup

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2. Set up local databases using Docker:
    - Make sure you have Docker installed and running.
    - You can use Docker Compose or individual commands to set up **DynamoDB**, **Redis**, and **MongoDB** containers.

3. Install backend dependencies and start serverless offline:
    ```bash
    ./deploy.sh
    ```

4. You can now test the API using **Postman**. The Postman collection for testing includes API endpoints for registering a new user and other operations.

---

## Testing

- The `Postman` collection can be found in the **tests** folder. It contains pre-configured requests for testing the backend API, including user registration.

---

## Docker Setup

To set up the backend services locally, make sure to configure Docker for the following services:
- **DynamoDB**: For storing transactional data.
- **Redis**: For caching and temporary data.
- **DocumentDB**: For document-based storage.

---

## create dynamoDB tables:
```bash
aws dynamodb create-table    --table-name cart-db-read     --attribute-definitions         AttributeName=cartId,AttributeType=S     --key-schema         AttributeName=cartId,KeyType=HASH     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000

aws dynamodb create-table    --table-name carts     --attribute-definitions         AttributeName=cartId,AttributeType=S     --key-schema         AttributeName=cartId,KeyType=HASH     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000

aws dynamodb create-table    --table-name pricing     --attribute-definitions         AttributeName=sku,AttributeType=S     --key-schema         AttributeName=sku,KeyType=HASH   --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000  

aws dynamodb create-table    --table-name pricing-db-read     --attribute-definitions         AttributeName=sku,AttributeType=S     --key-schema         AttributeName=sku,KeyType=HASH     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000

aws dynamodb create-table    --table-name inventory-db-read     --attribute-definitions         AttributeName=sku,AttributeType=S     --key-schema         AttributeName=sku,KeyType=HASH     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000

aws dynamodb create-table    --table-name inventory     --attribute-definitions         AttributeName=sku,AttributeType=S     --key-schema         AttributeName=sku,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000 

aws dynamodb create-table    --table-name UsersTable     --attribute-definitions         AttributeName=email,AttributeType=S     --key-schema         AttributeName=email,KeyType=HASH   --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     --endpoint-url http://localhost:8000  
```

## Additional Notes

- This project utilizes **AWS services** like **EventBridge**, **API Gateway**, and **Serverless Framework** for backend deployment. If you're deploying to AWS, make sure you have the necessary credentials and configurations set up in the `serverless.yml` file.
  
---


---


