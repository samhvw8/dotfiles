# GitHub Actions CI/CD

Automation platform for building, testing, and deploying code directly from GitHub repositories.

## Core Concepts

### Workflow Components
- **Workflow**: Automated process defined in YAML (`.github/workflows/`)
- **Event**: Trigger that starts workflow (push, pull_request, schedule)
- **Job**: Set of steps that execute on same runner
- **Step**: Individual task (action or shell command)
- **Runner**: Server that runs workflows (GitHub-hosted or self-hosted)

## Basic Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push myapp:${{ github.sha }}
```

## Triggers (Events)

### Push Events
```yaml
on:
  push:
    branches:
      - main
      - 'releases/**'
    paths:
      - 'src/**'
      - '!src/docs/**'
    tags:
      - 'v*'
```

### Pull Request Events
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [main]
```

### Scheduled Events (Cron)
```yaml
on:
  schedule:
    # Every day at 2am UTC
    - cron: '0 2 * * *'
```

### Manual Trigger
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
```

## Secrets Management

### Setting Secrets
1. Repository Settings → Secrets and variables → Actions
2. Add repository secret or environment secret

### Using Secrets
```yaml
steps:
  - name: Deploy to AWS
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    run: aws s3 sync ./build s3://my-bucket
```

## Environment Variables

### Repository/Workflow Level
```yaml
env:
  NODE_ENV: production
  API_URL: https://api.example.com

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      DEPLOY_ENV: staging
    steps:
      - name: Print variables
        run: |
          echo "NODE_ENV: $NODE_ENV"
          echo "DEPLOY_ENV: $DEPLOY_ENV"
```

### GitHub Default Variables
```yaml
steps:
  - name: Print GitHub variables
    run: |
      echo "Repository: ${{ github.repository }}"
      echo "Commit SHA: ${{ github.sha }}"
      echo "Branch: ${{ github.ref_name }}"
      echo "Actor: ${{ github.actor }}"
      echo "Event: ${{ github.event_name }}"
```

## Matrix Builds

Test across multiple versions/platforms:
```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

## Caching

Speed up workflows by caching dependencies:
```yaml
steps:
  - uses: actions/checkout@v3
  
  # Cache npm dependencies
  - uses: actions/cache@v3
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
  
  - run: npm ci
```

## Artifacts

Share data between jobs or download build outputs:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
          retention-days: 7

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
```

## Docker Build and Push

### Basic Docker Workflow
```yaml
jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            myapp:latest
            myapp:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Multi-Platform Builds
```yaml
- name: Build multi-platform image
  uses: docker/build-push-action@v4
  with:
    platforms: linux/amd64,linux/arm64
    push: true
    tags: myapp:latest
```

## Deployment Examples

### Deploy to AWS ECS
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: myapp
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:${{ github.sha }} .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:${{ github.sha }}
      
      - name: Deploy to ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: task-definition.json
          service: myapp-service
          cluster: production
          wait-for-service-stability: true
```

### Deploy to Kubernetes
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up kubectl
        uses: azure/setup-kubectl@v3
      
      - name: Configure kubeconfig
        run: |
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig
      
      - name: Deploy to cluster
        run: |
          kubectl set image deployment/myapp \
            myapp=myapp:${{ github.sha }} \
            --record
          kubectl rollout status deployment/myapp
```

### Deploy to Cloudflare Workers
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy
```

## Reusable Workflows

### Define Reusable Workflow
```yaml
# .github/workflows/reusable-deploy.yml
name: Reusable Deploy
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      deploy-token:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to ${{ inputs.environment }}"
```

### Use Reusable Workflow
```yaml
jobs:
  deploy-staging:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
    secrets:
      deploy-token: ${{ secrets.STAGING_TOKEN }}
```

## Conditional Execution

```yaml
steps:
  - name: Deploy to production
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    run: ./deploy-production.sh
  
  - name: Run only on PR
    if: github.event_name == 'pull_request'
    run: ./pr-checks.sh
  
  - name: Run if previous step failed
    if: failure()
    run: ./cleanup.sh
```

## Self-Hosted Runners

### Set Up Self-Hosted Runner
```bash
# Download runner
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf actions-runner-linux-x64-2.311.0.tar.gz

# Configure
./config.sh --url https://github.com/myorg/myrepo --token TOKEN

# Run
./run.sh
```

### Use Self-Hosted Runner
```yaml
jobs:
  build:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v3
      - run: ./build.sh
```

## Best Practices

1. **Use Latest Actions**: Keep actions up to date with Dependabot
2. **Pin Action Versions**: Use specific SHA or version (not `@main`)
3. **Minimize Secrets**: Use OIDC for cloud providers when possible
4. **Cache Dependencies**: Speed up builds with caching
5. **Fail Fast**: Use `continue-on-error: false` for critical steps
6. **Parallel Jobs**: Run independent jobs in parallel
7. **Limit Workflows**: Use path filters to avoid unnecessary runs
8. **Monitor Usage**: Track Actions minutes and storage

## Resources

- GitHub Actions Documentation: https://docs.github.com/actions
- Actions Marketplace: https://github.com/marketplace?type=actions
- Workflow Syntax: https://docs.github.com/actions/reference/workflow-syntax-for-github-actions
- Security Hardening: https://docs.github.com/actions/security-guides
