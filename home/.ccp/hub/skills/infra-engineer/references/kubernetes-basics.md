# Kubernetes Basics

Container orchestration platform for automating deployment, scaling, and management of containerized applications.

## Core Concepts

### Cluster Architecture
- **Control Plane**: Manages cluster (API server, scheduler, controller manager, etcd)
- **Nodes**: Worker machines running containerized applications
- **Pods**: Smallest deployable unit (one or more containers)

### Key Resources

**Pod**: Group of one or more containers
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:1.25
    ports:
    - containerPort: 80
```

**Deployment**: Manages replica sets and rolling updates
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

**Service**: Network endpoint for accessing pods
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer  # ClusterIP, NodePort, or LoadBalancer
```

**Ingress**: HTTP/HTTPS routing to services
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress
spec:
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-service
            port:
              number: 80
```

## kubectl Commands

### Cluster Management
```bash
# Get cluster info
kubectl cluster-info
kubectl get nodes

# Set context
kubectl config get-contexts
kubectl config use-context production
```

### Resource Management
```bash
# Apply configuration
kubectl apply -f deployment.yaml
kubectl apply -f ./manifests/

# Get resources
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get all -n default

# Describe resource
kubectl describe pod nginx-pod
kubectl describe deployment nginx-deployment

# Delete resources
kubectl delete pod nginx-pod
kubectl delete -f deployment.yaml
kubectl delete deployment nginx-deployment
```

### Debugging
```bash
# View logs
kubectl logs pod-name
kubectl logs pod-name -c container-name
kubectl logs -f pod-name  # Follow logs

# Execute commands in pod
kubectl exec -it pod-name -- /bin/bash
kubectl exec pod-name -- ls /app

# Port forwarding
kubectl port-forward pod-name 8080:80

# Get events
kubectl get events --sort-by=.metadata.creationTimestamp
```

### Scaling
```bash
# Manual scaling
kubectl scale deployment nginx-deployment --replicas=5

# Autoscaling
kubectl autoscale deployment nginx-deployment --min=2 --max=10 --cpu-percent=80
```

## Namespaces

Isolate resources within cluster:
```bash
# Create namespace
kubectl create namespace production

# Use namespace
kubectl get pods -n production
kubectl apply -f deployment.yaml -n production

# Set default namespace
kubectl config set-context --current --namespace=production
```

## ConfigMaps and Secrets

### ConfigMap (non-sensitive configuration)
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: production
  LOG_LEVEL: info
```

### Secret (sensitive data)
```bash
# Create secret from literal
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=secret123

# Create secret from file
kubectl create secret generic tls-secret \
  --from-file=tls.crt=path/to/cert \
  --from-file=tls.key=path/to/key
```

Use in pod:
```yaml
spec:
  containers:
  - name: app
    image: myapp:1.0
    envFrom:
    - configMapRef:
        name: app-config
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password
```

## Managed Kubernetes

### AWS EKS
```bash
# Install eksctl
brew install eksctl

# Create cluster
eksctl create cluster \
  --name my-cluster \
  --region us-west-2 \
  --nodegroup-name standard \
  --node-type t3.medium \
  --nodes 3

# Delete cluster
eksctl delete cluster --name my-cluster
```

### Azure AKS
```bash
# Create cluster
az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --node-count 3 \
  --enable-managed-identity

# Get credentials
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

### GCP GKE
```bash
# Create cluster
gcloud container clusters create my-cluster \
  --zone us-central1-a \
  --num-nodes 3

# Get credentials
gcloud container clusters get-credentials my-cluster --zone us-central1-a
```

## Helm (Package Manager)

```bash
# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Add repository
helm repo add stable https://charts.helm.sh/stable
helm repo update

# Install chart
helm install my-release stable/mysql

# List releases
helm list

# Upgrade release
helm upgrade my-release stable/mysql --set mysqlRootPassword=newpassword

# Uninstall release
helm uninstall my-release
```

## Best Practices

1. **Resource Limits**: Always set requests and limits for CPU/memory
2. **Health Checks**: Define liveness and readiness probes
3. **Labels**: Use consistent labeling for organization
4. **Namespaces**: Separate environments (dev, staging, prod)
5. **RBAC**: Implement role-based access control
6. **Network Policies**: Control pod-to-pod communication
7. **Pod Security**: Use security contexts, run as non-root
8. **GitOps**: Declarative configuration in Git (ArgoCD, Flux)

## Resources

- Kubernetes Documentation: https://kubernetes.io/docs
- kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet
- Kubernetes Patterns: https://k8spatterns.io
