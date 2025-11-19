# kubectl Complete Command Reference

## Table of Contents
- [Resource Management](#resource-management)
- [Debugging Commands](#debugging-commands)
- [Configuration & Context](#configuration--context)
- [Deployment Operations](#deployment-operations)
- [Advanced Queries](#advanced-queries)
- [Output Formatting](#output-formatting)
- [Common Flags](#common-flags)

## Resource Management

### Get Resources
```bash
# List all resource types
kubectl api-resources

# Get pods
kubectl get pods                              # Current namespace
kubectl get pods -A                           # All namespaces
kubectl get pods -n <namespace>               # Specific namespace
kubectl get pods -o wide                      # More details
kubectl get pods --show-labels                # Show labels
kubectl get pods -l app=myapp                 # Filter by label

# Get deployments
kubectl get deployments
kubectl get deploy -o yaml                    # YAML output

# Get services
kubectl get services
kubectl get svc

# Get all resources in namespace
kubectl get all -n <namespace>
```

### Describe Resources
```bash
# Detailed information about resource
kubectl describe pod <pod-name>
kubectl describe deployment <deployment-name>
kubectl describe service <service-name>
kubectl describe node <node-name>

# Show events in description
kubectl describe pod <pod-name> | grep -A 10 Events
```

### Create/Apply Resources
```bash
# Apply configuration from file
kubectl apply -f deployment.yaml
kubectl apply -f .                            # All files in directory
kubectl apply -f https://url/to/manifest.yaml # From URL

# Create resource imperatively
kubectl create deployment nginx --image=nginx
kubectl create service clusterip myapp --tcp=80:8080
kubectl create configmap myconfig --from-literal=key=value
kubectl create secret generic mysecret --from-literal=password=secret123

# Dry-run (validation)
kubectl apply -f deployment.yaml --dry-run=client -o yaml
kubectl create deployment test --image=nginx --dry-run=client -o yaml

# Server-side dry-run
kubectl apply -f deployment.yaml --dry-run=server
```

### Delete Resources
```bash
# Delete by file
kubectl delete -f deployment.yaml

# Delete by name
kubectl delete pod <pod-name>
kubectl delete deployment <deployment-name>

# Delete by label
kubectl delete pods -l app=myapp

# Force delete (use with caution)
kubectl delete pod <pod-name> --force --grace-period=0

# Delete all pods in namespace
kubectl delete pods --all -n <namespace>
```

### Edit Resources
```bash
# Edit resource in default editor
kubectl edit deployment <deployment-name>
kubectl edit service <service-name>

# Patch resource (JSON merge)
kubectl patch deployment nginx -p '{"spec":{"replicas":5}}'

# Patch with strategic merge
kubectl patch deployment nginx --type='strategic' -p '{"spec":{"template":{"spec":{"containers":[{"name":"nginx","image":"nginx:1.21"}]}}}}'
```

## Debugging Commands

### Logs
```bash
# View logs
kubectl logs <pod-name>                       # Current logs
kubectl logs <pod-name> -f                    # Follow/stream logs
kubectl logs <pod-name> --tail=100            # Last 100 lines
kubectl logs <pod-name> --since=1h            # Last hour
kubectl logs <pod-name> --timestamps          # With timestamps

# Multi-container pods
kubectl logs <pod-name> -c <container-name>   # Specific container
kubectl logs <pod-name> --all-containers      # All containers

# Previous container (after crash)
kubectl logs <pod-name> --previous
kubectl logs <pod-name> -c <container> --previous
```

### Exec (Interactive Shell)
```bash
# Execute command in container
kubectl exec <pod-name> -- ls /app
kubectl exec <pod-name> -- env

# Interactive shell
kubectl exec -it <pod-name> -- /bin/bash
kubectl exec -it <pod-name> -- /bin/sh       # If bash not available

# Multi-container pods
kubectl exec -it <pod-name> -c <container-name> -- /bin/bash
```

### Port Forwarding
```bash
# Forward local port to pod
kubectl port-forward pod/<pod-name> 8080:80
kubectl port-forward pod/<pod-name> :80      # Random local port

# Forward to service
kubectl port-forward service/<service-name> 8080:80

# Forward to deployment
kubectl port-forward deployment/<deployment-name> 8080:80

# Listen on all interfaces
kubectl port-forward --address 0.0.0.0 pod/<pod-name> 8080:80
```

### Events
```bash
# View events (all namespaces)
kubectl get events --all-namespaces

# Sorted by timestamp
kubectl get events --sort-by='.lastTimestamp'
kubectl get events --sort-by='.metadata.creationTimestamp'

# Watch events
kubectl get events -w

# Events for specific resource
kubectl get events --field-selector involvedObject.name=<pod-name>
```

### Resource Usage
```bash
# Node resource usage
kubectl top nodes
kubectl top nodes --sort-by=cpu
kubectl top nodes --sort-by=memory

# Pod resource usage
kubectl top pods
kubectl top pods -n <namespace>
kubectl top pods --all-namespaces
kubectl top pods --sort-by=cpu
kubectl top pods --sort-by=memory

# Container-level metrics
kubectl top pod <pod-name> --containers
```

### Debug Containers
```bash
# Create debug container (ephemeral containers)
kubectl debug <pod-name> -it --image=busybox
kubectl debug <pod-name> -it --image=ubuntu --target=<container-name>

# Debug node
kubectl debug node/<node-name> -it --image=ubuntu

# Copy pod and add debug container
kubectl debug <pod-name> -it --copy-to=<new-pod-name> --container=debug --image=busybox
```

## Configuration & Context

### Context Management
```bash
# View contexts
kubectl config get-contexts

# Current context
kubectl config current-context

# Switch context
kubectl config use-context <context-name>

# Set default namespace for context
kubectl config set-context --current --namespace=<namespace>

# Create new context
kubectl config set-context <context-name> --cluster=<cluster> --user=<user> --namespace=<namespace>
```

### Cluster Info
```bash
# Cluster information
kubectl cluster-info
kubectl cluster-info dump                     # Detailed dump

# API server endpoint
kubectl config view --minify | grep server

# Cluster version
kubectl version
kubectl version --short
```

### Authentication
```bash
# View current user
kubectl config view --minify | grep user

# Check authorization (can-i)
kubectl auth can-i create pods
kubectl auth can-i create pods --namespace=production
kubectl auth can-i '*' '*'                    # All permissions
kubectl auth can-i --list                     # List all permissions
```

## Deployment Operations

### Scaling
```bash
# Scale deployment
kubectl scale deployment <deployment-name> --replicas=5

# Scale ReplicaSet
kubectl scale rs/<replicaset-name> --replicas=3

# Scale multiple deployments
kubectl scale deployment/app1 deployment/app2 --replicas=3

# Autoscale (HPA)
kubectl autoscale deployment <deployment-name> --min=2 --max=10 --cpu-percent=80
```

### Rollouts
```bash
# View rollout status
kubectl rollout status deployment/<deployment-name>

# View rollout history
kubectl rollout history deployment/<deployment-name>

# View specific revision
kubectl rollout history deployment/<deployment-name> --revision=2

# Rollback to previous version
kubectl rollout undo deployment/<deployment-name>

# Rollback to specific revision
kubectl rollout undo deployment/<deployment-name> --to-revision=2

# Pause rollout
kubectl rollout pause deployment/<deployment-name>

# Resume rollout
kubectl rollout resume deployment/<deployment-name>

# Restart deployment (recreate pods)
kubectl rollout restart deployment/<deployment-name>
```

### Image Updates
```bash
# Update image
kubectl set image deployment/<deployment-name> <container-name>=<new-image>

# Update multiple containers
kubectl set image deployment/myapp web=nginx:1.21 cache=redis:6.2

# Record change (for rollout history)
kubectl set image deployment/myapp web=nginx:1.21 --record
```

## Advanced Queries

### JSONPath
```bash
# Extract specific field
kubectl get pods -o jsonpath='{.items[0].metadata.name}'

# Multiple fields
kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.podIP}{"\n"}{end}'

# Filter and extract
kubectl get nodes -o jsonpath='{.items[?(@.status.capacity.cpu=="4")].metadata.name}'

# Custom columns
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase,IP:.status.podIP
```

### Filtering
```bash
# Label selectors
kubectl get pods -l app=myapp
kubectl get pods -l 'environment in (production,staging)'
kubectl get pods -l app=myapp,tier=frontend

# Field selectors
kubectl get pods --field-selector status.phase=Running
kubectl get pods --field-selector metadata.namespace!=default
kubectl get events --field-selector type=Warning

# Grep-like filtering
kubectl get pods | grep Running
kubectl get pods -A | grep -v Running
```

### Sorting
```bash
# Sort by name
kubectl get pods --sort-by=.metadata.name

# Sort by creation time
kubectl get pods --sort-by=.metadata.creationTimestamp

# Sort by restart count
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'
```

## Output Formatting

### Output Formats
```bash
# YAML
kubectl get pod <pod-name> -o yaml

# JSON
kubectl get pod <pod-name> -o json

# Wide (more columns)
kubectl get pods -o wide

# Name only
kubectl get pods -o name

# Custom columns
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase

# JSON with jq
kubectl get pods -o json | jq '.items[].metadata.name'
```

### Watch Mode
```bash
# Watch resources update in real-time
kubectl get pods -w
kubectl get deployments -w
kubectl get events -w

# Watch with output format
kubectl get pods -o wide -w
```

## Common Flags

### Universal Flags
```bash
-n, --namespace=<namespace>    # Specify namespace
-A, --all-namespaces           # All namespaces
-l, --selector=<label>         # Label selector
-o, --output=<format>          # Output format (yaml, json, wide, name, etc.)
-w, --watch                    # Watch for changes
--dry-run=client               # Client-side dry run
--dry-run=server               # Server-side dry run
--field-selector=<selector>    # Field selector
--sort-by=<field>              # Sort output
--show-labels                  # Show labels
-v, --v=<level>                # Verbosity (0-9)
```

### Resource Creation Flags
```bash
--record                       # Record command in resource annotation
--save-config                  # Save current config in annotation
--force                        # Force operation
--grace-period=<seconds>       # Grace period for deletion
--cascade=<true|false>         # Cascade deletion
```

### Output Flags
```bash
-o yaml                        # YAML output
-o json                        # JSON output
-o wide                        # Wide output (more columns)
-o name                        # Resource name only
-o jsonpath=<template>         # JSONPath expression
-o custom-columns=<spec>       # Custom columns
-o go-template=<template>      # Go template
```

## Emergency Commands

### Force Operations
```bash
# Force delete pod
kubectl delete pod <pod-name> --force --grace-period=0

# Force delete namespace (stuck in Terminating)
kubectl delete namespace <namespace> --force --grace-period=0

# Remove finalizers (emergency only)
kubectl patch pod <pod-name> -p '{"metadata":{"finalizers":[]}}' --type=merge
```

### Node Maintenance
```bash
# Cordon node (mark unschedulable)
kubectl cordon <node-name>

# Uncordon node
kubectl uncordon <node-name>

# Drain node (evict pods)
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# Drain with force
kubectl drain <node-name> --ignore-daemonsets --force --delete-emptydir-data --grace-period=0
```

### Resource Quota & Limits
```bash
# View resource quotas
kubectl get resourcequota -n <namespace>
kubectl describe resourcequota <quota-name>

# View limit ranges
kubectl get limitrange -n <namespace>
kubectl describe limitrange <limitrange-name>
```

## Tips & Tricks

### Aliases
```bash
# Add to ~/.bashrc or ~/.zshrc
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias kdp='kubectl describe pod'
alias kdd='kubectl describe deployment'
alias kl='kubectl logs'
alias kx='kubectl exec -it'

# Context switching
alias kctx='kubectl config use-context'
alias kns='kubectl config set-context --current --namespace'
```

### Shell Completion
```bash
# Bash
source <(kubectl completion bash)
echo "source <(kubectl completion bash)" >> ~/.bashrc

# Zsh
source <(kubectl completion zsh)
echo "source <(kubectl completion zsh)" >> ~/.zshrc

# Alias completion (bash)
complete -F __start_kubectl k
```

### Quick Debugging Workflow
```bash
# 1. Get pod status
kubectl get pod <pod-name>

# 2. Describe pod (check events)
kubectl describe pod <pod-name>

# 3. View logs
kubectl logs <pod-name> --tail=50

# 4. Interactive shell (if pod is running)
kubectl exec -it <pod-name> -- /bin/bash

# 5. Check events
kubectl get events --field-selector involvedObject.name=<pod-name>
```

---

**Find Specific Commands:**
```bash
# Port forwarding examples
grep -A 5 "Port Forwarding" KUBECTL_REFERENCE.md

# Rollout commands
grep -A 10 "Rollouts" KUBECTL_REFERENCE.md

# JSONPath examples
grep -A 10 "JSONPath" KUBECTL_REFERENCE.md
```
