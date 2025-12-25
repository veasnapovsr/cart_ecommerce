# Cart Service CI/CD Setup

This folder contains CI/CD pipeline configurations for the Cart microservice.

## Available CI/CD Configurations

### 1. GitHub Actions (`.github/workflows/ci-cd.yml`)

**Setup Instructions:**

1. Add the following secrets to your GitHub repository:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token
   - `SERVER_HOST`: Your deployment server hostname/IP
   - `SERVER_USERNAME`: SSH username for deployment server
   - `SSH_PRIVATE_KEY`: Private SSH key for deployment

2. Update the environment variables in the workflow:
   ```yaml
   DOCKER_IMAGE: your-dockerhub-username/ecommerce-cart
   ```

3. The pipeline will automatically run on:
   - Push to `main` or `develop` branches
   - Pull requests to `main` branch
   - Only when files in `Cart/` directory change

### 2. GitLab CI (`.gitlab-ci.yml`)

**Setup Instructions:**

1. Add the following CI/CD variables in GitLab:
   - `SSH_PRIVATE_KEY`: Your SSH private key
   - `SERVER_USER`: SSH username
   - `DEV_SERVER`: Development server hostname
   - `PROD_SERVER`: Production server hostname

2. The pipeline has three stages:
   - **Test**: Run linting and tests
   - **Build**: Build and push Docker image
   - **Deploy**: Deploy to dev (automatic) or prod (manual)

### 3. Jenkins (`Jenkinsfile`)

**Setup Instructions:**

1. Configure Jenkins credentials:
   - `docker-hub-credentials`: Docker Hub username and password
   - `server-ssh-credentials`: SSH credentials for deployment

2. Update environment variables:
   ```groovy
   DOCKER_IMAGE = 'your-registry/ecommerce-cart'
   ```

3. Create a Jenkins pipeline job and point it to this repository

## Pipeline Stages

All pipelines follow a similar flow:

1. **Checkout**: Get the latest code
2. **Install**: Install Node.js dependencies
3. **Lint**: Run code linting (if configured)
4. **Test**: Run unit tests (if available)
5. **Build**: Build Docker image
6. **Push**: Push image to registry
7. **Deploy**: Deploy to server (dev/prod)

## Environment Variables

Update these in your `.env` file or CI/CD secrets:

```env
PORT=9003
MONGO_USERNAME=your_username
MONGO_PASSWORD=your_password
MONGO_CLUSTER=your_cluster
MONGO_DBNAME=ecommerce_db
ACCESS_TOKEN=your_access_token
JWT_SECRET=your_jwt_secret
```

## Docker Deployment

The deployment scripts expect:
- Docker and Docker Compose installed on the server
- A `docker-compose.yml` file in the deployment directory
- The Cart service defined as `cart` in docker-compose

Example docker-compose.yml section:
```yaml
services:
  cart:
    image: your-registry/ecommerce-cart:latest
    ports:
      - "9003:9003"
    environment:
      - PORT=9003
      - MONGO_USERNAME=${MONGO_USERNAME}
      - MONGO_PASSWORD=${MONGO_PASSWORD}
    restart: unless-stopped
```

## Monitoring Deployments

- **GitHub Actions**: Check the Actions tab in your repository
- **GitLab CI**: Check CI/CD > Pipelines in your project
- **Jenkins**: Check the build history in your Jenkins job

## Rollback

To rollback to a previous version:

```bash
# SSH into your server
ssh user@server

# Navigate to deployment directory
cd /var/www/ecommerce

# Pull specific image version
docker pull your-registry/ecommerce-cart:BUILD_NUMBER

# Update docker-compose to use specific tag and restart
docker-compose up -d cart
```

## Testing Locally

Before pushing, test the Docker build locally:

```bash
cd Cart
docker build -t ecommerce-cart:test .
docker run -p 9003:9003 --env-file .env ecommerce-cart:test
```

## Common Issues

1. **Build fails on dependencies**: Make sure `package-lock.json` is committed
2. **Docker push fails**: Verify Docker Hub credentials
3. **Deployment fails**: Check SSH access and server Docker installation
4. **Tests fail**: Run `npm test` locally to debug

## Support

For issues with the CI/CD pipeline, check:
- Pipeline logs in your CI/CD platform
- Docker build logs
- Server deployment logs: `docker logs <container-name>`
