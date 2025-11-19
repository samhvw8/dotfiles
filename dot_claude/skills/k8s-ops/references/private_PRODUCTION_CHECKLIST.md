# Production Deployment Checklist

## Pre-Deployment Verification

### Security Hardening

- [ ] **RBAC Configuration**
  - [ ] Service accounts created for all applications
  - [ ] Roles follow principle of least privilege
  - [ ] RoleBindings/ClusterRoleBindings properly scoped
  - [ ] Default service account not used for workloads
  - [ ] `automountServiceAccountToken: false` set where not needed

- [ ] **Secrets Management**
  - [ ] No secrets in Git repositories
  - [ ] Secrets encrypted at rest (encryption provider configured)
  - [ ] External secrets manager considered (Vault, AWS Secrets Manager, etc.)
  - [ ] Secret rotation policy defined
  - [ ] Secrets mounted as volumes or env vars, not in ConfigMaps

- [ ] **Network Policies**
  - [ ] Default deny ingress policy applied
  - [ ] Explicit allow rules for required traffic
  - [ ] Pod-to-pod communication restricted
  - [ ] Egress traffic controlled
  - [ ] Namespaces isolated via network policies

- [ ] **Image Security**
  - [ ] Images scanned for vulnerabilities (Trivy, Snyk, etc.)
  - [ ] Images from trusted registries only
  - [ ] Specific image tags used (no `latest`)
  - [ ] Image pull secrets configured
  - [ ] Private registry authentication tested
  - [ ] Read-only root filesystem where possible
  - [ ] Non-root user specified in containers

- [ ] **Pod Security Standards**
  - [ ] Pod Security Admission configured
  - [ ] Security context defined for all pods
  - [ ] Capabilities dropped appropriately
  - [ ] `allowPrivilegeEscalation: false` set
  - [ ] `runAsNonRoot: true` enforced
  - [ ] seccomp profiles applied

### Resource Configuration

- [ ] **Resource Requests & Limits**
  - [ ] CPU requests defined for all containers
  - [ ] Memory requests defined for all containers
  - [ ] CPU limits set (or consciously omitted for burstable)
  - [ ] Memory limits set to prevent OOM
  - [ ] Requests based on actual usage metrics
  - [ ] Limits allow for reasonable burst capacity
  - [ ] QoS class understood (Guaranteed, Burstable, BestEffort)

- [ ] **Autoscaling**
  - [ ] HPA configured for stateless workloads
  - [ ] CPU/Memory metrics configured correctly
  - [ ] Custom metrics considered if applicable
  - [ ] Min/max replicas set appropriately
  - [ ] Scale-down behavior configured
  - [ ] Cluster Autoscaler configured for node scaling
  - [ ] VPA considered for automatic right-sizing

- [ ] **Storage**
  - [ ] Persistent volumes use appropriate storage class
  - [ ] Storage size adequate with growth headroom
  - [ ] Backup strategy defined for persistent data
  - [ ] Volume access modes correct (ReadWriteOnce, ReadWriteMany)
  - [ ] Reclaim policy appropriate (Retain for production data)
  - [ ] StatefulSets used for stateful applications

### High Availability

- [ ] **Replica Configuration**
  - [ ] Minimum 2 replicas for all critical services
  - [ ] Odd number of replicas for quorum-based systems (3, 5)
  - [ ] Pod Disruption Budget (PDB) configured
  - [ ] PDB allows for rolling updates (minAvailable or maxUnavailable)
  - [ ] Anti-affinity rules prevent single points of failure

- [ ] **Multi-Zone Deployment**
  - [ ] Pods distributed across availability zones
  - [ ] Node affinity configured for zone distribution
  - [ ] Topology spread constraints used
  - [ ] Control plane HA verified (multi-master)

- [ ] **Rolling Update Strategy**
  - [ ] MaxSurge and MaxUnavailable configured
  - [ ] Update strategy tested in non-prod
  - [ ] Readiness probes prevent traffic to non-ready pods
  - [ ] Rollback plan documented

### Health Checks

- [ ] **Liveness Probes**
  - [ ] Liveness probe configured for all containers
  - [ ] Initial delay accounts for startup time
  - [ ] Failure threshold appropriate (3+ failures before restart)
  - [ ] Period frequency reasonable (10-30s)
  - [ ] Probe endpoint doesn't check dependencies
  - [ ] Probe is lightweight (fast response)

- [ ] **Readiness Probes**
  - [ ] Readiness probe configured for all containers
  - [ ] Checks dependencies (database, cache, etc.)
  - [ ] Initial delay shorter than liveness
  - [ ] Failure threshold removes pod from service
  - [ ] Pod marked ready only when actually ready to serve

- [ ] **Startup Probes**
  - [ ] Startup probe used for slow-starting applications
  - [ ] Prevents liveness probe from killing during startup
  - [ ] Failure threshold high enough for worst-case startup

### Configuration Management

- [ ] **Environment-Specific Values**
  - [ ] Environment variables externalized to ConfigMaps
  - [ ] Production values in separate files
  - [ ] Secrets not in ConfigMaps
  - [ ] ConfigMap updates trigger pod restarts (if needed)
  - [ ] Immutable ConfigMaps considered for stability

- [ ] **Helm Charts (if applicable)**
  - [ ] Chart tested with `helm lint`
  - [ ] Chart tested with `helm template`
  - [ ] Values validated with `--dry-run`
  - [ ] Chart version follows SemVer
  - [ ] AppVersion matches application version
  - [ ] Dependencies up to date
  - [ ] values-prod.yaml reviewed

### Monitoring & Observability

- [ ] **Metrics**
  - [ ] Prometheus metrics exposed
  - [ ] Service monitors/PodMonitors created
  - [ ] Key metrics dashboards created
  - [ ] Resource usage metrics collected (CPU, memory, disk)
  - [ ] Application-specific metrics defined
  - [ ] SLIs (Service Level Indicators) defined

- [ ] **Logging**
  - [ ] Structured logging implemented (JSON format)
  - [ ] Log aggregation configured (ELK, Loki, CloudWatch, etc.)
  - [ ] Log retention policy defined
  - [ ] Sensitive data not logged
  - [ ] Log levels configurable per environment
  - [ ] Application logs to stdout/stderr

- [ ] **Tracing**
  - [ ] Distributed tracing implemented (Jaeger, Zipkin, etc.)
  - [ ] Trace context propagated across services
  - [ ] Sampling rate configured appropriately
  - [ ] Critical paths instrumented

- [ ] **Alerting**
  - [ ] Alerts defined for critical issues
  - [ ] Alert routing configured (PagerDuty, Slack, etc.)
  - [ ] Alerts have clear actionable steps
  - [ ] Alert fatigue avoided (no false positives)
  - [ ] SLOs (Service Level Objectives) defined
  - [ ] Error budget tracking configured

### Disaster Recovery

- [ ] **Backup Strategy**
  - [ ] Persistent volume backups configured
  - [ ] Database backups automated
  - [ ] Backup retention policy defined
  - [ ] Backup restoration tested
  - [ ] Etcd backups configured (control plane)
  - [ ] Velero or similar tool configured for cluster backup

- [ ] **GitOps**
  - [ ] All manifests in version control
  - [ ] Git is single source of truth
  - [ ] ArgoCD/Flux configured for automated sync
  - [ ] Drift detection enabled
  - [ ] Cluster can be recreated from Git

- [ ] **Failover Plan**
  - [ ] Multi-region deployment considered
  - [ ] DNS failover configured (if multi-region)
  - [ ] RTO (Recovery Time Objective) defined
  - [ ] RPO (Recovery Point Objective) defined
  - [ ] Disaster recovery runbook documented

### Performance

- [ ] **Load Testing**
  - [ ] Load tests executed in staging
  - [ ] Performance benchmarks established
  - [ ] Bottlenecks identified and addressed
  - [ ] Autoscaling behavior validated under load
  - [ ] Resource limits tested (memory OOM behavior)

- [ ] **Optimization**
  - [ ] Container images optimized (multi-stage builds)
  - [ ] Image sizes minimized
  - [ ] Init containers used for setup tasks
  - [ ] Sidecar containers justified and lightweight
  - [ ] DNS caching configured (NodeLocal DNSCache)

### Cost Optimization

- [ ] **Resource Right-Sizing**
  - [ ] Resource requests match actual usage
  - [ ] Over-provisioning minimized
  - [ ] Unused resources identified and removed
  - [ ] VPA recommendations reviewed

- [ ] **Scaling Strategy**
  - [ ] Cluster autoscaler configured
  - [ ] Spot instances used for non-critical workloads
  - [ ] Scale-to-zero considered for dev/staging
  - [ ] Reserved instances/savings plans evaluated

- [ ] **Monitoring Costs**
  - [ ] Cost allocation labels applied
  - [ ] Cost monitoring dashboard created
  - [ ] Budget alerts configured
  - [ ] Regular cost reviews scheduled

### Compliance & Governance

- [ ] **Policies**
  - [ ] OPA/Gatekeeper policies enforced (if applicable)
  - [ ] Admission webhooks configured
  - [ ] Resource naming conventions enforced
  - [ ] Label standards enforced
  - [ ] Compliance requirements met (GDPR, HIPAA, etc.)

- [ ] **Audit Logging**
  - [ ] Kubernetes audit logging enabled
  - [ ] Audit logs shipped to SIEM
  - [ ] Audit retention policy defined
  - [ ] Access logs reviewed regularly

### Documentation

- [ ] **Runbooks**
  - [ ] Deployment runbook created
  - [ ] Rollback procedure documented
  - [ ] Troubleshooting guide written
  - [ ] Emergency contacts listed
  - [ ] On-call escalation path defined

- [ ] **Architecture Documentation**
  - [ ] Architecture diagram created
  - [ ] Component dependencies mapped
  - [ ] Network topology documented
  - [ ] Data flow diagrams created

- [ ] **Operational Documentation**
  - [ ] Common operations documented (scaling, updates, etc.)
  - [ ] Monitoring dashboards documented
  - [ ] Alert response procedures documented
  - [ ] Maintenance procedures documented

### Testing

- [ ] **Deployment Testing**
  - [ ] Helm chart tested with `helm test`
  - [ ] Smoke tests executed post-deployment
  - [ ] Integration tests passed
  - [ ] End-to-end tests passed
  - [ ] Canary deployment tested (if applicable)

- [ ] **Chaos Engineering**
  - [ ] Pod deletion tested (resilience)
  - [ ] Node failure tested
  - [ ] Network partition tested
  - [ ] Resource exhaustion tested
  - [ ] Chaos Mesh or similar tool considered

### Final Verification

- [ ] **Pre-Deployment Review**
  - [ ] Change request approved
  - [ ] Stakeholders notified
  - [ ] Deployment window scheduled
  - [ ] Rollback plan reviewed
  - [ ] Team availability confirmed

- [ ] **Deployment Validation**
  - [ ] All pods running
  - [ ] All services accessible
  - [ ] Health checks passing
  - [ ] No errors in logs
  - [ ] Metrics flowing to monitoring
  - [ ] Smoke tests passed
  - [ ] User acceptance testing completed

## Post-Deployment

### Immediate Verification

- [ ] Application responding correctly
- [ ] All endpoints accessible
- [ ] No error spike in logs
- [ ] Metrics within expected range
- [ ] Alerts not firing
- [ ] User traffic flowing normally

### Short-Term Monitoring

- [ ] Monitor for 24-48 hours post-deployment
- [ ] Check resource usage trends
- [ ] Review error rates
- [ ] Validate autoscaling behavior
- [ ] Collect performance metrics

### Documentation Updates

- [ ] Update deployment log
- [ ] Document any issues encountered
- [ ] Update runbooks if needed
- [ ] Share lessons learned
- [ ] Update architecture docs if changes made

---

**Usage:**
Print this checklist for each production deployment and check off items as completed.
Store completed checklists as deployment records for audit purposes.
