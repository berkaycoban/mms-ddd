# Movie Management System

[Beta URL](https://mms-api.berkaycoban.com)

## Project Overview

The Movie Management System is a domain-driven designed backend service that manage movies, sessions, and ticket operations.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/berkaycoban/mms-ddd.git
   cd mms-ddd
   ```

---

## Configuration

1. **Environment Variables:** Ensure you have the required environment variables set up. Create a `.env` file in the project root directory and add the necessary variables.

   ```env
   # Example environment variables
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   ```

2. **Docker Configuration:** Make sure your Docker configuration files (`docker-compose.{beta}.yml`) are properly set up according to your environment needs.

---

## Start PostgreSQL with Docker Compose

```bash
# Start PostgreSQL container
$ docker compose up -d --build

# Stop PostgreSQL container
$ docker compose down
```

## Install packages

```bash
$ cd backend

# install packages
$ yarn install
```

## Apply migrations and Create Prisma Client

```bash
# prisma migration and deploy
$ yarn db
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Beta Deployment

### Connecting to the Server

1. Connect to the server via SSH:

   ```sh
   ssh -i path/to/SSH_KEY root@SERVER_IP
   ```

### Starting the Project

1. Go to the project folder:

   ```sh
   cd /opt/movie-management-system
   ```

2. Run the appropriate Docker Compose command:

   ```sh
   docker compose -f docker-compose.beta.yml up -d --build
   ```

---

## Docker Helpful Commands

- **Remove unused docker data:**

  ```sh
  docker system prune -f
  ```

- **Show logs:**

  ```sh
  docker logs CONTAINER_ID -f --tail 100
  ```

- **Show running containers:**

  ```sh
  docker ps
  ```

---

## Troubleshooting

- If you encounter issues with Docker, try restarting the Docker service:

  ```sh
  sudo systemctl restart docker
  ```

- Check the logs for any errors:

  ```sh
  docker logs CONTAINER_ID
  ```
