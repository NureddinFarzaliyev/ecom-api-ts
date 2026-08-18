# E-commerce API with TypeScript and Node.js

### Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Installation & Usage](#installation--usage)
- [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)

### Overview

This is an e-commerce REST API with a lot of features including cashback, wishlist, discounts, custom orders, feedback and more.

### Tech Stack

- _Main_:
- **Node.js** for server-side JavaScript execution
- **Express.js** for building the API
- **TypeScript** for static typing
- **MongoDB** as the database

- _Additional Tools_:
- **Mongoose** for MongoDB object modeling
- **Migrate-mongo** for database migrations
- **Joi** for input validation
- **Swagger** for API documentation
- **Bcrypt** for password hashing
- **JWT** for authentication cookies
- **Nodemailer** for sending emails
- **Winston** for structured logging
- **Express-rate-limit** for rate limiting
- **Helmet** for securing HTTP headers

### Installation and Usage

- Clone the repository:

```bash
git clone https://github.com/NureddinFarzaliyev/ecom-api-ts.git
```

- Install dependencies:

```bash
cd ecom-api-ts
bun install
```

You can also use npm or yarn to install dependencies.

- Set up `.env`

Create a `.env` file in the root directory. Use `.env.example` file as a reference while setting up your environment variables. You are going to need a MongoDB connection credentials, JWT secret and SMTP credentials for sending emails.

- Run DB migrations (first time only):

```bash
bun run migrate up
```

- Start the server:

```bash
bun run dev
```

Server will be available on `http://localhost:3000` by default.

- Building & starting (optional):

```bash
bun run build
```

```bash
bun run start
```

### API Documentation

After running the server, Swagger UI for the API documentation will be available at `http://localhost:3000/v1/docs`.
Yaml files for the documentation are located in the `src/docs` folder.

### Folder Structure

```
├── src
│   ├── docs            # Swagger documentation files
│   ├── features        # Feature-related code
│   ├── shared          # Shared utilities and modules
│   ├──── middlewares   # Express middlewares
│   ├──── tools         # Shared tools
│   ├──── types         # Shared TypeScript types
│   ├──── utilities     # Shared utility functions
│   └── app.ts          # Main application entry point
├── migrations          # MongoDB migrations
├── uploads             # Uploaded files
├── logs                # Log files
├── .env.example        # Example .env file
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

Note: The `uploads` and `logs` directories are created at runtime and may not be present initially.
