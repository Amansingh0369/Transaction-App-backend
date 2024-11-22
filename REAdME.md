# Transaction App (Backend)

### Financial Transaction System API

This is the **backend** for the **Transaction App**, a Paytm-inspired financial transaction system. It supports secure user authentication, transaction management, and money transfers. The backend is built with **Node.js**, **Express.js**, and **MongoDB**. **JWT (JSON Web Tokens)** is used for secure user sessions and API interactions.

## Features

- **User Authentication**: Secure login and signup functionality using JWT.
- **Transaction CRUD**: APIs to create, read, update, and delete transactions.
- **Money Transfer**: API to facilitate money transfers between users.
- **Secure Communication**: JWT for managing user sessions and protecting endpoints.
- **Database**: MongoDB for storing user data and transaction history.

## Tech Stack

- **Node.js**: JavaScript runtime for building scalable backend services.
- **Express.js**: Framework for handling HTTP requests and creating APIs.
- **MongoDB**: NoSQL database for storing transaction and user data.
- **JWT**: For handling secure user authentication and managing sessions.
- **Bcrypt.js**: For securely hashing user passwords.
- **Mongoose**: MongoDB object modeling for easier database interactions.

## Installation

To run the backend locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/Amansingh0369/Transaction-App-Backend.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Transaction-App-Backend
    ```
3. Install the required dependencies:
    ```bash
    npm install
    ```
4. Configure your environment variables in a `.env` file:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
5. Start the server:
    ```bash
    npm start
    ```
   The backend will run on `http://localhost:5000`.

## API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Login an existing user and receive a JWT.

### Transactions
- **GET** `/api/transactions`: Get a list of all transactions for the authenticated user.
- **POST** `/api/transactions`: Create a new transaction.
- **PUT** `/api/transactions/:id`: Update a transaction by ID.
- **DELETE** `/api/transactions/:id`: Delete a transaction by ID.

### Money Transfer
- **POST** `/api/transfer`: Transfer money from one user to another.
