# Express.js Application with MongoDB for User Management

## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Middleware and Security](#middleware-and-security)
- [Routes](#routes)
  - [User Router](#user-router)
- [Global Error Handling](#global-error-handling)
  - [Error Controller](#error-controller)
- [Email Module](#email-module)

## Introduction

This Express.js application, integrated with MongoDB, serves as a foundation for building user management systems. It includes essential middleware for security, request logging, rate limiting, and more. The user management system is based on RESTful API routes for user registration, authentication, profile management, and admin functionalities.

## Prerequisites

Before getting started, ensure you have the following prerequisites:

- Node.js installed on your machine.
- MongoDB installed and running.
- Basic knowledge of Express.js and MongoDB.

## Getting Started

### Installation

1. Clone this repository:

   ```
   git clone <repository_url>
   cd express-mongodb-user-management
   ```
   
2. Install project dependencies:

    ```
    npm install
    ```

### Configuration

1. Create a .env file in the root directory of the project with the following content:

    ```
    PORT=3000
    NODE_ENV=dev or prod
    MONGODB_URI=<mongoDB url>
    ```
    
Replace <mongoDB url> with the url of your MongoDB database.

## Middleware and Security

This application includes several middleware packages for security and request handling:

- Morgan: Request logging with the 'tiny' format (for development environment).
- Helmet: Sets security headers to enhance application security.
- Express-Mongo-Sanitize: Prevents NoSQL injection.
- XSS-Clean: Prevents cross-site scripting (XSS) attacks.
- HPP (HTTP Parameter Pollution): Prevents HTTP Parameter Pollution.


## Routes

The application is structured around RESTful API routes. Currently, the following route is available:

### User Router

- **GET /api/users:** Get all users (admin-only).
- **POST /api/users/register:** Register a new user.
- **POST /api/users/login:** User login.
- **POST /api/users/forgotPassword:** Forgot password.
- **PATCH /api/users/resetPassword/:token:** Reset password.
- **PATCH /api/users/updateUserPassword:** Update user password (protected).
- **PATCH /api/users/updateUser:** Update user information (protected).
- **DELETE /api/users/deleteUser:** Delete user (protected).

You can extend and customize these routes according to your application's needs.

## Global Error Handling

Global error handling is implemented to provide consistent error responses. Any errors that occur during request processing are routed through the global error controller.

## Error Controller

The error controller handles errors and formats responses accordingly. It includes the following functions:

- **handleCastErrorDB:** Formats casting errors related to MongoDB.
- **sendErrorDev:** Sends detailed error responses in development mode.
- **sendErrorProd:** Sends simplified error responses in production mode.

## Email Module

The email module (`email.js`) is responsible for sending email notifications. It uses the Nodemailer library to create and send emails.

### Configuration

To configure the email module, make sure you have the following environment variables set in your .env file:

- **EMAIL_HOST:** The SMTP server hostname or IP address.
- **EMAIL_PORT:** The SMTP server port (e.g., 587 for TLS, 465 for SSL).
- **EMAIL_USERNAME:** The username for authenticating with the SMTP server.
- **EMAIL_PASSWORD:** The password for authenticating with the SMTP server.
- **EMAIL:** The default 'from' email address for sending emails.

Example .env configuration:
    
    EMAIL_HOST=smtp.example.com
    EMAIL_PORT=587
    EMAIL_USERNAME=your_username
    EMAIL_PASSWORD=your_password
    EMAIL=your_email@example.com
    
Make sure to replace the placeholders with your actual email server and credentials.


    













