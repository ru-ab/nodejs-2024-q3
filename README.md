# Task 3: CRUD API

This repository contains a simple CRUD project written using Node.js.

## Requirements

- Node.js 22.9.0 or higher

## Endpoints

The application accepts the following endpoints:

### Get all users

```
GET api/users
```

Returns all users.

### Get user by userId

```
GET api/users/{userId}
```

Returns a user with the provided userId.

Params:

- userId - user's id (must to be a valid uuid)

### Create new user

```
POST api/users
```

Creates a new user.

Body (JSON):

- username — user's name (string, required)
- age — user's age (number, required)
- hobbies — user's hobbies (array of strings or empty array, required)

### Update user

```
PUT api/users/{userId}
```

Updates an existing user.

Params:

- userId - user's id (must to be a valid uuid)

Body (JSON):

- username — user's name (string, required)
- age — user's age (number, required)
- hobbies — user's hobbies (array of strings or empty array, required)

### Delete user

```
DELETE api/users/{userId}
```

Deletes an existing user from the database.

Params:

- userId - user's id (must to be a valid uuid)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ru-ab/nodejs-2024-q3.git
```

2. Enter the project directory:

```bash
cd nodejs-2024-q3.git
```

3. Download all project dependencies:

```bash
 npm install
```

## How to run

To specify a port on which the application will run, create a file named .env in the root folder with this content:

```
PORT=desired_port
```

### Development mode

Command to run the application in development mode:

```bash
npm run start:dev
```

### Production mode

Command to build and run the application in production mode:

```bash
npm run start:prod
```

### Testing

Command to run tests:

```bash
npm run test
```
