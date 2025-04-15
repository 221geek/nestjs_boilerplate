# NestJS Enterprise Boilerplate

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- npm 8+

## Setup Instructions

1. **Clone the repository and install dependencies**

```bash
npm install
```

2. **Configure Environment Variables**

Copy the example environment file:

```bash
cp .env.example .env
```

3. **Start the Infrastructure Services**

```bash
docker-compose up -d vault mongodb redis elasticsearch kafka keycloak
```

4. **Configure Vault**

After Vault is running, initialize it with the required secrets:

```bash
# Login to Vault
export VAULT_ADDR='http://localhost:8200'
export VAULT_TOKEN='dev-token'

# Write secrets
vault kv put secret/database uri="mongodb://localhost:27017/nest-boilerplate"

vault kv put secret/redis \
    host="localhost" \
    port="6379" \
    password="redis_password"

vault kv put secret/elasticsearch \
    node="http://localhost:9200" \
    username="elastic" \
    password="elastic_password"

vault kv put secret/kafka \
    brokers="localhost:9092" \
    client_id="nest-boilerplate" \
    group_id="nest-boilerplate-group" \
    connection_timeout="3000" \
    retry_delay="100" \
    retry_attempts="3"

vault kv put secret/keycloak \
    auth_server_url="http://localhost:8080" \
    realm="nest-boilerplate" \
    client_id="nest-api" \
    client_secret="your-client-secret" \
    jwt_secret="your-jwt-secret"
```

5. **Configure Keycloak**

- Access Keycloak Admin Console at http://localhost:8080
- Default credentials: admin/admin
- Create a new realm: "nest-boilerplate"
- Create a new client: "nest-api"
- Configure client settings:
  - Access Type: confidential
  - Service Accounts Enabled: true
  - Valid Redirect URIs: http://localhost:3000/\*
- Save the client secret for your environment variables

6. **Start the Application**

For development:

```bash
npm run start:dev
```

For production:

```bash
npm run build
npm run start:prod
```

Using Docker:

```bash
docker-compose up app
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
http://localhost:3000/api

## Health Checks

The application provides health check endpoints:

- MongoDB: http://localhost:3000/health/db
- Redis: http://localhost:3000/health/redis
- Elasticsearch: http://localhost:3000/health/elastic
- Kafka: http://localhost:3000/health/kafka

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```
