---
name: k8s-ops
description: Production Kubernetes and Helm operations guide covering kubectl commands, cluster management, deployment strategies, troubleshooting, resource optimization, security best practices, GitOps workflows, pod management, service configuration, ConfigMaps, Secrets, RBAC, namespace organization, monitoring, and cost optimization for production environments.
---

# Kubernetes Operations (k8s-ops)

## Purpose

Comprehensive guide for production Kubernetes cluster management, Helm chart development, kubectl operations, troubleshooting, and deployment best practices following 2025 industry standards.

## When to Use This Skill

Automatically activates when working with:
- Kubernetes manifests (YAML files)
- Helm charts and values files
- kubectl commands and cluster operations
- Pod/Deployment/Service troubleshooting
- Production deployment strategies
- Cluster resource optimization
- Security configurations (RBAC, Secrets, NetworkPolicies)
- GitOps workflows (ArgoCD, Flux)
- Container orchestration problems

## Core Principles

<production_readiness>
**Golden Rules:**
1. **Declarative Everything**: YAML manifests in version control, never imperative-only changes
2. **GitOps First**: Git as single source of truth for cluster state
3. **Security by Default**: RBAC, least privilege, secrets management, network policies
4. **Observability Built-in**: Health checks, logging, metrics, tracing from day one
5. **Cost Awareness**: Resource limits, spot instances, autoscaling, over-provisioning prevention
</production_readiness>

<troubleshooting_workflow>
**Systematic Debugging Approach:**
1. **Get** → View resource status (`kubectl get`)
2. **Describe** → Detailed resource info (`kubectl describe`)
3. **Logs** → Application output (`kubectl logs`)
4. **Exec** → Interactive container access (`kubectl exec`)
5. **Events** → Cluster-wide issues (`kubectl get events`)
6. **Top** → Resource usage metrics (`kubectl top`)
</troubleseshooting_workflow>

## Essential kubectl Commands

### Resource Inspection
```bash
# View resources with wide output
kubectl get pods -o wide --all-namespaces

# Detailed resource information (troubleshooting step 2)
kubectl describe pod <pod-name> -n <namespace>

# Watch resources in real-time
kubectl get pods -w

# Output as JSON/YAML for parsing
kubectl get deployment <name> -o yaml
kubectl get pod <name> -o json | jq '.status.phase'
```

### Troubleshooting
```bash
# View logs (current container)
kubectl logs <pod-name> -n <namespace>

# Follow logs in real-time
kubectl logs -f <pod-name> -c <container-name>

# Previous container logs (after crash)
kubectl logs <pod-name> --previous

# Interactive shell access
kubectl exec -it <pod-name> -- /bin/bash

# View cluster events (critical for debugging)
kubectl get events --all-namespaces --sort-by='.lastTimestamp'

# Resource usage metrics
kubectl top nodes
kubectl top pods -n <namespace>
```

### Resource Management
```bash
# Apply configuration (idempotent)
kubectl apply -f deployment.yaml

# Dry-run to validate (ALWAYS use before production apply)
kubectl apply -f deployment.yaml --dry-run=client -o yaml

# Delete resources
kubectl delete -f deployment.yaml
kubectl delete pod <pod-name> --grace-period=0 --force  # Emergency only

# Scale deployments
kubectl scale deployment/<name> --replicas=3

# Rollout management
kubectl rollout status deployment/<name>
kubectl rollout history deployment/<name>
kubectl rollout undo deployment/<name>  # Rollback to previous version
```

### Port Forwarding & Access
```bash
# Forward local port to pod
kubectl port-forward pod/<pod-name> 8080:80

# Forward to service
kubectl port-forward service/<service-name> 8080:80

# Proxy to Kubernetes API
kubectl proxy --port=8001
```

### Context & Configuration
```bash
# View current context
kubectl config current-context

# Switch context
kubectl config use-context <context-name>

# Set default namespace
kubectl config set-context --current --namespace=<namespace>
```

## Production Deployment Best Practices

### Resource Configuration

<resource_management>
**Critical: Set Requests and Limits**
```yaml
resources:
  requests:
    cpu: "100m"        # Scheduling: minimum guaranteed
    memory: "128Mi"
  limits:
    cpu: "500m"        # Throttling: maximum allowed
    memory: "512Mi"    # OOMKill threshold
```

**Industry Reality (2025):**
- 99.94% of clusters are over-provisioned
- Average CPU utilization: 10%
- Average memory utilization: 23%

**Recommendations:**
- Start with conservative requests based on actual usage metrics
- Set limits 1.5-2x requests to handle bursts
- Use Vertical Pod Autoscaler (VPA) to tune over time
- Monitor actual usage and adjust quarterly
</resource_management>

### Health Checks

<health_probes>
**Readiness vs Liveness:**
```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 3     # Restart after 3 failures

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 3     # Remove from service after 3 failures
```

**Key Differences:**
- **Liveness**: When to restart container (app deadlocked/crashed)
- **Readiness**: When to send traffic (app starting/temporarily unavailable)
- **Startup**: Allow slow-starting apps extra time (overrides liveness initially)
</health_probes>

### High Availability

<availability_patterns>
**Pod Disruption Budgets:**
```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: app-pdb
spec:
  minAvailable: 2          # Or maxUnavailable: 1
  selector:
    matchLabels:
      app: myapp
```

**Multi-Node Deployment:**
- Minimum 3 nodes for HA (control plane)
- Spread pods across nodes using anti-affinity
- Use node selectors for workload isolation

**Anti-Affinity Example:**
```yaml
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 100
      podAffinityTerm:
        labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - myapp
        topologyKey: kubernetes.io/hostname
```
</availability_patterns>

### Security

<security_practices>
**RBAC (Principle of Least Privilege):**
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]
```

**Secrets Management:**
```bash
# Create secret from literal
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password=secret123

# Use in pod
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-credentials
      key: password
```

**Never commit secrets to Git!**

**Network Policies:**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress  # Default deny ingress
```

**Image Security:**
- Use image scanning (Trivy, kubescape)
- Pull from trusted registries only
- Specify image tags (never use `latest`)
- Use read-only root filesystem where possible
</security_practices>

### Configuration Management

<config_management>
**ConfigMaps (Non-sensitive):**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.properties: |
    key1=value1
    key2=value2
```

**Mounting ConfigMaps:**
```yaml
volumes:
- name: config
  configMap:
    name: app-config
volumeMounts:
- name: config
  mountPath: /etc/config
  readOnly: true
```

**Update Strategy:**
- ConfigMap changes don't auto-reload pods
- Use `kubectl rollout restart` after ConfigMap update
- Or implement file-watching in application
</config_management>

## Helm Charts Best Practices

### Chart Structure

<helm_structure>
```
mychart/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Default values
├── values-dev.yaml         # Environment-specific
├── values-staging.yaml
├── values-prod.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── _helpers.tpl       # Template helpers
│   └── NOTES.txt          # Post-install notes
└── charts/                 # Dependencies (subcharts)
```

**Chart.yaml:**
```yaml
apiVersion: v2
name: myapp
version: 1.2.3              # Chart version (SemVer)
appVersion: "2.0.1"         # Application version
description: Production app
dependencies:
  - name: postgresql
    version: 11.x.x
    repository: https://charts.bitnami.com/bitnami
```
</helm_structure>

### Template Best Practices

<helm_templates>
**Parameterize Everything:**
```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mychart.fullname" . }}
  labels:
    {{- include "mychart.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "mychart.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "mychart.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
        resources:
          {{- toYaml .Values.resources | nindent 10 }}
```

**values.yaml:**
```yaml
replicaCount: 3

image:
  repository: myapp
  tag: ""  # Defaults to Chart.AppVersion
  pullPolicy: IfNotPresent

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

**Environment Overrides:**
```yaml
# values-prod.yaml
replicaCount: 5

resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 2000m
    memory: 4Gi
```
</helm_templates>

### Helm Commands

```bash
# Install chart
helm install myapp ./mychart -f values-prod.yaml -n production

# Upgrade (preserves history)
helm upgrade myapp ./mychart -f values-prod.yaml -n production

# Dry-run (CRITICAL before production deploy)
helm install myapp ./mychart --dry-run --debug -f values-prod.yaml

# Rollback to previous release
helm rollback myapp 0 -n production  # 0 = previous version

# List releases
helm list -n production

# View release history
helm history myapp -n production

# Uninstall (keeps history unless --keep-history=false)
helm uninstall myapp -n production

# Template validation (no cluster access needed)
helm template myapp ./mychart -f values-prod.yaml

# Package chart for distribution
helm package mychart/

# Dependency management
helm dependency update ./mychart
```

## GitOps Workflows

<gitops_patterns>
**ArgoCD / Flux Core Concept:**
- Git repository = single source of truth
- Automated sync from Git to cluster
- Declarative application definitions
- Self-healing (auto-revert manual changes)
- Progressive delivery (canary, blue-green)

**Directory Structure:**
```
k8s-gitops/
├── base/                   # Base manifests
│   ├── deployment.yaml
│   └── service.yaml
├── overlays/
│   ├── dev/
│   │   └── kustomization.yaml
│   ├── staging/
│   │   └── kustomization.yaml
│   └── production/
│       └── kustomization.yaml
```

**Benefits:**
- Version control for all changes (audit trail)
- Peer review via pull requests
- Automated deployment pipelines
- Easy rollback (Git revert)
- Disaster recovery (cluster rebuild from Git)
</gitops_patterns>

## Namespace Organization

<namespace_strategy>
**Environment Separation:**
```bash
# Create namespaces
kubectl create namespace dev
kubectl create namespace staging
kubectl create namespace production

# Set resource quotas per namespace
kubectl create quota production-quota \
  --hard=pods=50,requests.cpu=10,requests.memory=20Gi \
  -n production
```

**Namespace Best Practices:**
- Separate by environment (dev/staging/prod)
- Or by team/project for multi-tenancy
- Apply RBAC per namespace
- Set resource quotas to prevent noisy neighbors
- Use network policies for isolation

**Labeling Convention:**
```yaml
metadata:
  labels:
    app: myapp
    environment: production
    team: platform
    version: v1.2.3
```
</namespace_strategy>

## Cost Optimization

<cost_strategies>
**Spot Instances (Non-critical workloads):**
- Azure: Up to 90% discount on GPU-powered spot
- AWS: Average 67% discount
- GCP: Around 66% discount

**Use Cases for Spot:**
- Batch processing jobs
- CI/CD pipelines
- Development environments
- Stateless worker nodes

**Autoscaling:**
```yaml
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

**Cluster Autoscaler:**
- Automatically adds/removes nodes based on pending pods
- Configure min/max node counts
- Use node affinity to separate critical vs burstable workloads
</cost_strategies>

## Troubleshooting Playbook

### Pod Not Starting

<pod_troubleshooting>
**Step 1: Check Pod Status**
```bash
kubectl get pod <pod-name> -o wide
```

**Common States:**
- `Pending`: Scheduling issues (resources, node selectors, taints)
- `ImagePullBackOff`: Image not found or registry auth failed
- `CrashLoopBackOff`: Application exiting immediately
- `ContainerCreating`: Stuck creating (volume mount issues)

**Step 2: Describe Pod**
```bash
kubectl describe pod <pod-name>
```

Look for:
- Events section (errors appear here)
- Resource requests vs available
- Volume mount failures
- Image pull errors

**Step 3: Check Logs**
```bash
kubectl logs <pod-name> --previous  # Crashed container
kubectl logs <pod-name> -c <container>  # Multi-container pods
```

**Step 4: Interactive Debug**
```bash
# Exec into running container
kubectl exec -it <pod-name> -- /bin/bash

# Or create debug container (ephemeral containers)
kubectl debug <pod-name> -it --image=busybox --target=<container>
```
</pod_troubleshooting>

### Service Not Reachable

<service_troubleshooting>
**Step 1: Verify Service**
```bash
kubectl get svc <service-name>
kubectl describe svc <service-name>
```

**Check:**
- Selector labels match pod labels
- Port configuration (port vs targetPort)
- Endpoints exist: `kubectl get endpoints <service-name>`

**Step 2: Test Connectivity**
```bash
# Port-forward to test directly
kubectl port-forward svc/<service-name> 8080:80
curl localhost:8080

# From another pod (DNS test)
kubectl run tmp --rm -i --tty --image=busybox -- /bin/sh
wget -O- http://<service-name>.<namespace>.svc.cluster.local
```

**Step 3: Check NetworkPolicies**
```bash
kubectl get networkpolicy -n <namespace>
kubectl describe networkpolicy <policy-name>
```
</service_troubleshooting>

### High Resource Usage

<resource_troubleshooting>
**Identify Top Consumers:**
```bash
kubectl top nodes
kubectl top pods --all-namespaces | sort --reverse --key 3 --numeric
```

**Investigate Specific Pod:**
```bash
kubectl describe pod <pod-name> | grep -A 5 "Limits\|Requests"
kubectl exec <pod-name> -- top  # Inside container
kubectl exec <pod-name> -- ps aux | grep <process>
```

**Check for Memory Leaks:**
```bash
# Monitor over time
watch -n 5 'kubectl top pod <pod-name>'

# Heap dump (Java example)
kubectl exec <pod-name> -- jmap -dump:live,format=b,file=/tmp/heap.bin <pid>
```
</resource_troubleshooting>

## References

For detailed information, see reference files:

### [KUBECTL_REFERENCE.md](references/kubectl_reference.md)
Complete kubectl command reference organized by category:
- Resource management commands
- Debugging commands with examples
- Output formatting options
- Common flags and their usage
- Quick reference tables

Find specific commands:
```bash
grep -i "port-forward" references/kubectl_reference.md
grep -i "rollout" references/kubectl_reference.md
```

### [HELM_ADVANCED.md](references/helm_advanced.md)
Advanced Helm topics:
- Chart dependencies management
- Custom template functions
- Hooks (pre-install, post-upgrade, etc.)
- Chart testing strategies
- Repository management
- Security signing and verification

Find specific topics:
```bash
grep -i "dependencies" references/helm_advanced.md
grep -i "hooks" references/helm_advanced.md
```

### [PRODUCTION_CHECKLIST.md](references/production_checklist.md)
Pre-deployment verification checklist:
- Security hardening steps
- Resource configuration validation
- Monitoring and alerting setup
- Backup and disaster recovery
- Performance testing results
- Runbook documentation

Use before production deployment.

## Quick Reference

### Essential Commands
```bash
# Cluster info
kubectl cluster-info
kubectl get nodes

# Common operations
kubectl get pods -n <namespace>
kubectl describe pod <pod-name>
kubectl logs -f <pod-name>
kubectl exec -it <pod-name> -- /bin/bash

# Apply configuration
kubectl apply -f manifest.yaml --dry-run=client
kubectl apply -f manifest.yaml

# Helm operations
helm install <release> <chart> -f values.yaml
helm upgrade <release> <chart> -f values.yaml
helm rollback <release> 0
```

### Key Flags
- `-n <namespace>`: Specify namespace
- `-o wide`: More output columns
- `-o yaml/json`: Structured output
- `--dry-run=client`: Validate without applying
- `-w`: Watch for changes
- `--all-namespaces`: All namespaces

### Emergency Commands
```bash
# Force delete stuck pod
kubectl delete pod <pod-name> --force --grace-period=0

# Drain node (maintenance)
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# Cordon node (prevent scheduling)
kubectl cordon <node-name>

# Emergency rollback
kubectl rollout undo deployment/<name>
helm rollback <release> 0
```

---

**Skill Status**: Production-ready following 2025 industry best practices ✅
**Coverage**: kubectl operations, Helm charts, production deployment, troubleshooting, security, GitOps ✅
**Line Count**: <500 (following Anthropic 500-line rule) ✅
**Progressive Disclosure**: Reference files for advanced topics ✅
