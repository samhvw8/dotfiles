# DevSecOps Basics

Security integrated into DevOps practices - "shift left" approach bringing security early in the development lifecycle.

## Core Principles

### Shift-Left Security
- Security testing early in development (not at the end)
- Automated security scanning in CI/CD pipeline
- Developers empowered with security tools and knowledge
- Fast feedback on security issues

### Security as Code
- Infrastructure security in version control
- Automated compliance checks
- Security policies as code
- Immutable infrastructure

### Continuous Monitoring
- Real-time security monitoring
- Automated threat detection
- Incident response automation
- Security metrics and dashboards

## Security Scanning Types

### 1. SAST (Static Application Security Testing)

Analyzes source code for vulnerabilities without executing it.

**Tools:**
- **SonarQube**: Code quality and security
- **Semgrep**: Pattern-based code scanning
- **Checkmarx**: Enterprise SAST
- **CodeQL**: GitHub's code analysis engine

**Example: SonarQube in CI/CD**
```yaml
# GitHub Actions
- name: SonarQube Scan
  uses: SonarSource/sonarqube-scan-action@master
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

### 2. DAST (Dynamic Application Security Testing)

Tests running applications for vulnerabilities (black-box testing).

**Tools:**
- **OWASP ZAP**: Open-source web app scanner
- **Burp Suite**: Security testing platform
- **Acunetix**: Automated web vulnerability scanner

**Example: OWASP ZAP**
```bash
# Run ZAP baseline scan
docker run -v $(pwd):/zap/wrk/:rw \
  -t owasp/zap2docker-stable zap-baseline.py \
  -t https://example.com \
  -r zap-report.html
```

### 3. SCA (Software Composition Analysis)

Identifies vulnerabilities in dependencies and open-source libraries.

**Tools:**
- **Snyk**: Vulnerability scanning for dependencies
- **Trivy**: Container and dependency scanner
- **Dependabot**: GitHub's automated dependency updates
- **WhiteSource**: Open-source security management

**Example: Snyk in CI/CD**
```yaml
# GitHub Actions
- name: Run Snyk to check for vulnerabilities
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high
```

### 4. Container Scanning

Scans container images for vulnerabilities and misconfigurations.

**Tools:**
- **Trivy**: Comprehensive container scanner
- **Grype**: Vulnerability scanner for container images
- **Clair**: Static analysis for container vulnerabilities
- **AWS ECR Scanning**: Built-in scanning for ECR images

**Example: Trivy**
```bash
# Scan Docker image
trivy image nginx:latest

# Scan image in CI/CD and fail on HIGH/CRITICAL
trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest

# Scan Kubernetes manifests
trivy config ./k8s/
```

## Secrets Management

### Never Commit Secrets to Git

**Scan for leaked secrets:**
```bash
# TruffleHog - find secrets in git history
docker run -it -v "$PWD:/pwd" trufflesecurity/trufflehog:latest \
  git file:///pwd --json

# GitGuardian - monitor for exposed secrets
# Integrate with GitHub/GitLab for real-time alerts
```

### Secrets Management Solutions

**HashiCorp Vault**
```bash
# Start Vault server
vault server -dev

# Store secret
vault kv put secret/database password=supersecret

# Retrieve secret
vault kv get secret/database

# Use in app via API or SDK
curl -H "X-Vault-Token: $VAULT_TOKEN" \
  http://127.0.0.1:8200/v1/secret/data/database
```

**AWS Secrets Manager**
```bash
# Create secret
aws secretsmanager create-secret \
  --name prod/db/password \
  --secret-string "supersecret"

# Retrieve secret
aws secretsmanager get-secret-value \
  --secret-id prod/db/password \
  --query SecretString --output text

# Automatic rotation enabled
aws secretsmanager rotate-secret \
  --secret-id prod/db/password \
  --rotation-lambda-arn arn:aws:lambda:...
```

**Kubernetes Sealed Secrets**
```bash
# Install sealed-secrets controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Seal a secret
echo -n supersecret | kubectl create secret generic db-secret \
  --dry-run=client --from-file=password=/dev/stdin -o yaml | \
  kubeseal -o yaml > sealed-secret.yaml

# Commit sealed-secret.yaml to Git (encrypted)
kubectl apply -f sealed-secret.yaml
```

## Security in CI/CD Pipeline

### Complete Security Pipeline

```yaml
# GitHub Actions example
name: Security Pipeline
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      # 1. Code checkout
      - uses: actions/checkout@v3
      
      # 2. Secret scanning
      - name: TruffleHog Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
      
      # 3. SAST - Static code analysis
      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
      
      # 4. SCA - Dependency check
      - name: Snyk Dependency Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      
      # 5. Build Docker image
      - name: Build Image
        run: docker build -t myapp:${{ github.sha }} .
      
      # 6. Container scanning
      - name: Trivy Container Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:${{ github.sha }}
          severity: 'HIGH,CRITICAL'
          exit-code: '1'
      
      # 7. Infrastructure as Code scanning
      - name: Trivy IaC Scan
        run: trivy config ./terraform/
      
      # 8. Deploy (only if all scans pass)
      - name: Deploy
        if: success()
        run: kubectl apply -f k8s/
```

## Compliance and Governance

### Compliance Frameworks
- **SOC 2**: Security, availability, processing integrity, confidentiality, privacy
- **HIPAA**: Healthcare data protection
- **PCI-DSS**: Payment card data security
- **GDPR**: EU data protection regulation
- **ISO 27001**: Information security management

### Compliance Automation

**AWS Config**
```bash
# Enable AWS Config
aws configservice put-configuration-recorder \
  --configuration-recorder name=default,roleARN=arn:aws:iam::...

# Add compliance rules
aws configservice put-config-rule \
  --config-rule file://encrypted-volumes.json

# Check compliance
aws configservice get-compliance-details-by-config-rule \
  --config-rule-name encrypted-volumes
```

**Policy as Code (OPA - Open Policy Agent)**
```rego
# Deny deployments without resource limits
package kubernetes.admission

deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  not container.resources.limits
  msg := sprintf("Container %v must have resource limits", [container.name])
}
```

## Network Security

### Zero Trust Architecture
- No implicit trust based on network location
- Verify every access request
- Least privilege access
- Micro-segmentation

### Kubernetes Network Policies
```yaml
# Deny all ingress traffic by default
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress

---
# Allow specific traffic
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

### Service Mesh (Istio/Linkerd)
- mTLS between services
- Traffic encryption
- Fine-grained access control
- Distributed tracing for security events

## Runtime Security

### Container Runtime Protection

**Falco (CNCF Project)**
```yaml
# Detect suspicious activity
rules:
  - rule: Unauthorized Process
    desc: Detect unexpected process in container
    condition: container and not proc.name in (allowed_processes)
    output: "Unauthorized process started (proc=%proc.name container=%container.id)"
    priority: WARNING
```

**AWS GuardDuty**
- Threat detection for AWS accounts
- ML-based anomaly detection
- Integration with AWS Security Hub

## Security Metrics

### Key Metrics
- **Mean Time to Remediate (MTTR)**: Time from vulnerability discovery to fix
- **Vulnerability Density**: Vulnerabilities per 1000 lines of code
- **Security Test Coverage**: % of code covered by security tests
- **False Positive Rate**: % of security alerts that are false positives
- **Compliance Score**: % of resources meeting compliance requirements

## Best Practices

1. **Automate Security**: Integrate scanning in CI/CD, fail builds on critical issues
2. **Least Privilege**: Minimum permissions for users, services, containers
3. **Defense in Depth**: Multiple security layers (network, application, data)
4. **Encrypt Everything**: Data at rest and in transit
5. **Audit Logging**: Comprehensive logging for security events
6. **Regular Updates**: Patch OS, dependencies, containers regularly
7. **Security Training**: Educate developers on secure coding
8. **Incident Response Plan**: Documented process for security incidents

## Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten
- CIS Benchmarks: https://www.cisecurity.org/cis-benchmarks
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- DevSecOps Manifesto: https://www.devsecops.org
- Cloud Security Alliance: https://cloudsecurityalliance.org
