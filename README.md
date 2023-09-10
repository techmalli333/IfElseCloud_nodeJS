# Microservices Application

This repository contains a microservices-based application with three separate services, each packaged in a Docker container for easy deployment.

## RabbitMQ Docker Compose Setup

This repository contains a Docker Compose configuration for running RabbitMQ, a popular message broker, in a Docker container.

### Prerequisites

Before you begin, make sure you have Docker and Docker Compose installed on your system. You can download and install them from the [Docker website](https://www.docker.com/get-started).

### Running the RabbitMQ

```bash
# norma mode
$ docker-compose up


# detach mode
$ docker-compose up -d

```

### To access the RabbitMQ http://localhost:15672/#/

#### Credentials:

```
Username: guest
Password: guest
```

## Services

1.  **Service Earth**

    - Description: Service Earth is sending messages to Service Translator.
    - Dockerfile: [Dockerfile-Earth](./earth/Dockerfile)
    - Usage:

      ```bash
      # Build the Docker image for Service Earth
      docker build -t earth .

      # Run Service A
      docker run --network="host" earth
      ```

2.  **Service Translator**

    - Description: The Service Translator is a critical component within our microservices architecture, responsible for facilitating seamless communication and data exchange between Service Earth and Service Mars. Its primary function is to act as a bridge, translating messages between these two services and ensuring efficient and accurate information transfer across the interplanetary divide..
    - Dockerfile: [Dockerfile-Translator](./translator/Dockerfile)
    - Usage:

      ```bash
      # Build the Docker image for Service Translator
      docker build -t translator .

      # Run Service B
          docker run --network="host" translator
      ```

3.  **Service Mars**

    - Description: Service Mars is sending messages to Service Translator..
    - Dockerfile: [Dockerfile-Mars](./mars/Dockerfile)
    - Usage:

      ```bash
      # Build the Docker image for Service Mars
      docker build -t mars .


      # Run Service C
      docker run --network="host" mars

      ```

## Postman Collection

To simplify the testing and interaction with our microservices, we provide a Postman collection. You can download it and import it into your Postman workspace.

[Download Postman Collection](https://www.postman.com/flight-astronaut-23387478/workspace/if-else-cloud)

...
