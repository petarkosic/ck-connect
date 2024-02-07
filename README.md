# Simple API Gateway and Service Discovery with Kong and Consul

This repository contains a simple demonstration of using Kong as an API gateway and Consul for service discovery. The application consists of two services: users and orders, and it's all orchestrated within Docker Compose.

## Prerequisites

Before running the application, ensure you have the following installed on your system:

- Docker (https://www.docker.com/)
- Docker Compose

## Setup

Clone this repository to your local machine and navigate to it:

```bash
git clone https://github.com/petarkosic/ck-connect.git
cd ck-connect
```

Run Docker Compose to build and start the services:

```bash
docker-compose up --build -d
```

## Usage

Once the services are up and running, you can interact with them through Kong's API gateway.
Here's how to access the services:

- **Users Service**: Access user-related functionalities through http://localhost:8000/users.
- **Orders Service**: Access order-related functionalities through http://localhost:8000/orders.

</br>

**Service Discovery**
Consul is utilized for service discovery, allowing services to dynamically find and communicate with each other. You can access the Consul UI via http://localhost:8500 to view registered services and their health status.

## Configuration

- **Kong Configuration**: The Kong API gateway configuration is defined in **\`/config/kong.yml\`**. You can modify this file to add or modify API routes, plugins, etc.

## Tear Down

To stop and remove the containers, use the following command:

```bash
docker-compose down
```
