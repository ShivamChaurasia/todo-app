# Todo Application

This project is a full-stack Todo application with a React frontend and a NestJS backend. The frontend is a Single Page Application (SPA) built with Create React App, while the backend is built with NestJS and TypeORM.

## Preview

- **Frontend**: [Todo Frontend](https://todo-app-tau-opal.vercel.app/)
- **Backend**: [Todo Backend](https://todo-app-kszp.onrender.com/)

> **Note:** Since the backend is deployed on a free service, the instance may spin down with periods of inactivity. This can result in initial request delays of 50 seconds or more.

## Screenshots

<img width="1436" alt="image" src="https://github.com/user-attachments/assets/b19138f3-984a-4a98-a747-0ca62c5828d9">
<img width="1435" alt="image" src="https://github.com/user-attachments/assets/edcbd2fd-3a04-44a0-9619-62c8fe112d52"

## Project Structure

- **todo-frontend**: A React application for managing todo items.
- **todo-backend**: A NestJS application providing a REST API for managing todos.

## Features

- **Frontend**:
  - Create, read, update, and delete todo items.
  - User authentication and authorization.
  - Responsive and user-friendly interface.

- **Backend**:
  - RESTful API for todo management.
  - User authentication with JWT.
  - Secure and efficient data handling with TypeORM.

### API Documentation

API documentation is provided using Swagger. You can view the API documentation at: https://todo-app-kszp.onrender.com/api

-   Swagger UI

**Endpoints**:

-   **Authentication**

    -   `POST /auth/login`: Authenticate a user and obtain JWT tokens
    -   `POST /auth/signup`: Register a new user
    -   `GET /auth/refresh-token`: Refresh the JWT tokens
    -   `POST /auth/logout`: Invalidate the user session
-   **Todos**

    -   `GET /todos`: Get all todos for the authenticated user
    -   `GET /todos/:id`: Get a specific todo by ID
    -   `POST /todos`: Create a new todo
    -   `PUT /todos/:id`: Update an existing todo
    -   `DELETE /todos/:id`: Delete a todo by ID

## Deployment

- **Frontend**: Deployed on [Vercel](https://vercel.com). The frontend is automatically built and deployed whenever changes are pushed to the `main` branch.
- **Backend**: Deployed on [Render](https://render.com). The backend is automatically built and deployed whenever changes are pushed to the `main` branch.

## Getting Started

### Backend

1. **Clone the repository:**

   ```bash
   git clone git@github.com:ShivamChaurasia/todo-app.git

2. **Navigate to the todo-backend directory:**

   ```bash
   cd todo-app/todo-backend

3. **Install dependencies:**

   ```bash
   npm install

4. **Set up environment variables:**

  Create a .env file in the todo-backend directory, copy the content from the .env.example file and provide the values.

5. **Start the development server:**

   ```bash
   npm run start:dev

The application will be accessible at http://localhost:3000.

### Frontend

1. **Clone the repository:**

   ```bash
   git clone git@github.com:ShivamChaurasia/todo-app.git

2. **Navigate to the todo-frontend directory:**

   ```bash
   cd todo-app/todo-frontend

3. **Install dependencies:**

   ```bash
   npm install

4. **Set up environment variables:**

  Create a .env file in the todo-backend directory, copy the content from the .env.example file and provide the values.

5. **Start the development server:**
   ```bash
   npm start

The application will be accessible at http://localhost:3000.

## Running Tests

1. **Backend:**
   ```bash
   cd todo-backend
   npm run test:watch

2. **Frontend:**
   ```bash
   cd todo-frontend
   npm test
