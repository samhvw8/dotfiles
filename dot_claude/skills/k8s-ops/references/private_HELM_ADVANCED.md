# Helm Advanced Topics

## Table of Contents
- [Chart Dependencies](#chart-dependencies)
- [Template Functions](#template-functions)
- [Hooks](#hooks)
- [Chart Testing](#chart-testing)
- [Repository Management](#repository-management)
- [Security & Signing](#security--signing)
- [Advanced Patterns](#advanced-patterns)

## Chart Dependencies

### Defining Dependencies

**Chart.yaml:**
```yaml
apiVersion: v2
name: myapp
version: 1.0.0
dependencies:
  - name: postgresql
    version: "11.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled        # Optional: enable/disable via values
    tags:                                 # Optional: tag-based control
      - database
    import-values:                        # Import values from subchart
      - child: postgresql.auth
        parent: database

  - name: redis
    version: "^17.0.0"                   # Semver range
    repository: https://charts.bitnami.com/bitnami
    alias: cache                          # Use different name in templates
    condition: cache.enabled
```

### Dependency Management

```bash
# Download dependencies
helm dependency update ./mychart

# List dependencies
helm dependency list ./mychart

# Build dependencies (create charts/ directory)
helm dependency build ./mychart
```

### Overriding Subchart Values

**values.yaml:**
```yaml
# Parent chart values
replicaCount: 3

# Subchart values (postgresql)
postgresql:
  enabled: true
  auth:
    username: myuser
    password: mypassword
    database: mydb
  primary:
    persistence:
      size: 10Gi

# Aliased subchart (redis as cache)
cache:
  enabled: true
  master:
    persistence:
      size: 5Gi
```

### Conditional Dependencies

**values.yaml:**
```yaml
postgresql:
  enabled: true   # Enables postgresql dependency

redis:
  enabled: false  # Disables redis dependency

# Tag-based control
tags:
  database: true  # Enables all charts with "database" tag
  cache: false    # Disables all charts with "cache" tag
```

## Template Functions

### Built-in Functions

#### String Functions
```yaml
# Upper/Lower case
{{ .Values.name | upper }}
{{ .Values.name | lower }}
{{ .Values.name | title }}

# Trimming
{{ .Values.name | trim }}
{{ .Values.name | trimPrefix "prefix-" }}
{{ .Values.name | trimSuffix "-suffix" }}

# Replacement
{{ .Values.name | replace "old" "new" }}

# Substring
{{ .Values.name | substr 0 5 }}

# Quotes
{{ .Values.name | quote }}
{{ .Values.name | squote }}
```

#### List Functions
```yaml
# First/Last
{{ first .Values.list }}
{{ last .Values.list }}

# Has element
{{ has "value" .Values.list }}

# Join
{{ .Values.list | join "," }}

# Append/Prepend
{{ append .Values.list "newitem" }}
{{ prepend .Values.list "newitem" }}

# Unique
{{ .Values.list | uniq }}

# Sort
{{ .Values.list | sortAlpha }}
```

#### Dict/Map Functions
```yaml
# Get value
{{ .Values.config | get "key" "default" }}

# Set value
{{ $config := set .Values.config "key" "value" }}

# Has key
{{ hasKey .Values.config "key" }}

# Keys
{{ keys .Values.config }}

# Merge
{{ merge .Values.config1 .Values.config2 }}
```

#### Type Conversion
```yaml
# To YAML
{{ .Values.config | toYaml }}
{{ .Values.config | toYaml | nindent 4 }}

# To JSON
{{ .Values.config | toJson }}

# From YAML/JSON
{{ .Values.yamlString | fromYaml }}
{{ .Values.jsonString | fromJson }}

# To/From String
{{ .Values.number | toString }}
{{ .Values.string | atoi }}
```

#### Logic Functions
```yaml
# If/Else
{{ if .Values.enabled }}
enabled: true
{{ else }}
enabled: false
{{ end }}

# Ternary
{{ .Values.env | default "production" | ternary "prod" "dev" }}

# And/Or/Not
{{ and .Values.enabled .Values.production }}
{{ or .Values.dev .Values.staging }}
{{ not .Values.disabled }}

# Coalesce (first non-empty value)
{{ coalesce .Values.override .Values.default "fallback" }}
```

#### Encoding
```yaml
# Base64
{{ .Values.secret | b64enc }}
{{ .Values.encodedSecret | b64dec }}

# URL encoding
{{ .Values.url | urlquery }}
```

### Custom Template Functions

**templates/_helpers.tpl:**
```yaml
{{/*
Chart fullname
*/}}
{{- define "mychart.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "mychart.labels" -}}
helm.sh/chart: {{ include "mychart.chart" . }}
{{ include "mychart.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "mychart.selectorLabels" -}}
app.kubernetes.io/name: {{ include "mychart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create image pull secret
*/}}
{{- define "mychart.imagePullSecret" -}}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":\"%s\",\"auth\":\"%s\"}}}" .Values.imageCredentials.registry .Values.imageCredentials.username .Values.imageCredentials.password (printf "%s:%s" .Values.imageCredentials.username .Values.imageCredentials.password | b64enc) | b64enc }}
{{- end }}
```

**Usage in templates:**
```yaml
metadata:
  name: {{ include "mychart.fullname" . }}
  labels:
    {{- include "mychart.labels" . | nindent 4 }}
```

## Hooks

### Hook Types

**Available Hooks:**
- `pre-install`: Before any resources are installed
- `post-install`: After all resources are installed
- `pre-delete`: Before any resources are deleted
- `post-delete`: After all resources are deleted
- `pre-upgrade`: Before any resources are upgraded
- `post-upgrade`: After all resources are upgraded
- `pre-rollback`: Before any resources are rolled back
- `post-rollback`: After all resources are rolled back
- `test`: When `helm test` is invoked

### Hook Example

**templates/hooks/db-migration.yaml:**
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ include "mychart.fullname" . }}-db-migration
  annotations:
    "helm.sh/hook": post-install,post-upgrade
    "helm.sh/hook-weight": "-5"              # Execution order (lower = earlier)
    "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
spec:
  template:
    metadata:
      name: {{ include "mychart.fullname" . }}-db-migration
    spec:
      restartPolicy: Never
      containers:
      - name: db-migration
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        command: ["npm", "run", "migrate"]
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: {{ include "mychart.fullname" . }}-db
              key: url
```

### Hook Deletion Policies
- `before-hook-creation`: Delete previous hook before creating new one
- `hook-succeeded`: Delete hook after successful execution
- `hook-failed`: Delete hook after failed execution

### Hook Weights
- Lower weights execute first (can be negative)
- Hooks with same weight execute in alphabetical order
- Example: -5, -3, 0, 1, 5

## Chart Testing

### Test Hook

**templates/tests/test-connection.yaml:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "mychart.fullname" . }}-test-connection"
  annotations:
    "helm.sh/hook": test
spec:
  restartPolicy: Never
  containers:
  - name: wget
    image: busybox
    command: ['wget']
    args: ['{{ include "mychart.fullname" . }}:{{ .Values.service.port }}']
```

### Running Tests
```bash
# Run tests
helm test <release-name>

# Show logs
helm test <release-name> --logs

# Cleanup after test
helm test <release-name> --logs --timeout 5m
```

### Chart Linting
```bash
# Lint chart
helm lint ./mychart

# Lint with values
helm lint ./mychart -f values-prod.yaml

# Strict mode
helm lint ./mychart --strict
```

### Template Validation
```bash
# Render templates locally
helm template myapp ./mychart

# With values
helm template myapp ./mychart -f values-prod.yaml

# Debug mode (show computed values)
helm template myapp ./mychart --debug

# Validate against Kubernetes API
helm template myapp ./mychart | kubectl apply --dry-run=server -f -
```

## Repository Management

### Adding Repositories
```bash
# Add repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add stable https://charts.helm.sh/stable

# Update repositories
helm repo update

# List repositories
helm repo list

# Remove repository
helm repo remove bitnami
```

### Searching Charts
```bash
# Search repositories
helm search repo postgresql
helm search repo bitnami/

# Search Helm Hub
helm search hub wordpress

# Show chart info
helm show chart bitnami/postgresql
helm show values bitnami/postgresql
helm show all bitnami/postgresql
```

### Private Repositories

**Using OCI Registry:**
```bash
# Login to registry
helm registry login registry.example.com

# Push chart
helm push mychart-1.0.0.tgz oci://registry.example.com/charts

# Pull chart
helm pull oci://registry.example.com/charts/mychart --version 1.0.0

# Install from OCI
helm install myapp oci://registry.example.com/charts/mychart --version 1.0.0
```

**Using HTTP Auth:**
```bash
# Add repo with auth
helm repo add myrepo https://charts.example.com \
  --username admin \
  --password secret

# Or use environment variables
export HELM_REPO_USERNAME=admin
export HELM_REPO_PASSWORD=secret
helm repo add myrepo https://charts.example.com
```

## Security & Signing

### Chart Signing

```bash
# Generate key pair
gpg --gen-key

# Package and sign chart
helm package --sign --key 'Your Name' --keyring ~/.gnupg/secring.gpg mychart/

# Verify chart
helm verify mychart-1.0.0.tgz

# Install with verification
helm install myapp ./mychart-1.0.0.tgz --verify
```

### Provenance Files

**Provenance (.prov) includes:**
- Chart hash
- Chart metadata
- PGP signature
- Timestamp

```bash
# Create provenance file
helm package --sign --key 'Your Name' mychart/

# Verify provenance
helm verify mychart-1.0.0.tgz
```

### RBAC for Helm

**ServiceAccount:**
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: helm
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: helm
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: helm
  namespace: kube-system
```

## Advanced Patterns

### Monorepo Charts

**Directory Structure:**
```
charts/
├── common/              # Shared library chart
│   ├── Chart.yaml
│   └── templates/
│       └── _helpers.tpl
├── frontend/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
└── backend/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
```

**Using Library Charts:**

**common/Chart.yaml:**
```yaml
apiVersion: v2
name: common
type: library      # Library chart, not installable
version: 1.0.0
```

**frontend/Chart.yaml:**
```yaml
apiVersion: v2
name: frontend
version: 1.0.0
dependencies:
  - name: common
    version: 1.0.0
    repository: "file://../common"
```

**frontend/templates/deployment.yaml:**
```yaml
{{- include "common.deployment" . }}
```

### Multi-Environment Charts

**Directory Structure:**
```
mychart/
├── Chart.yaml
├── values.yaml          # Base values
├── values-dev.yaml
├── values-staging.yaml
├── values-prod.yaml
└── templates/
```

**Deployment:**
```bash
# Development
helm install myapp ./mychart -f values-dev.yaml

# Staging
helm install myapp ./mychart -f values-staging.yaml

# Production
helm install myapp ./mychart -f values-prod.yaml

# Multiple value files (later files override earlier)
helm install myapp ./mychart -f values.yaml -f values-prod.yaml -f secrets-prod.yaml
```

### Umbrella Charts

**Chart.yaml (umbrella chart):**
```yaml
apiVersion: v2
name: myplatform
version: 1.0.0
dependencies:
  - name: frontend
    version: 1.0.0
    repository: "file://./charts/frontend"
  - name: backend
    version: 1.0.0
    repository: "file://./charts/backend"
  - name: postgresql
    version: 11.x.x
    repository: https://charts.bitnami.com/bitnami
```

**Install entire platform:**
```bash
helm dependency update ./myplatform
helm install platform ./myplatform
```

### GitOps with Helm

**ArgoCD Application:**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/repo
    targetRevision: main
    path: charts/myapp
    helm:
      valueFiles:
        - values-prod.yaml
      parameters:
        - name: image.tag
          value: v1.2.3
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

**Flux HelmRelease:**
```yaml
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: myapp
  namespace: production
spec:
  interval: 5m
  chart:
    spec:
      chart: ./charts/myapp
      sourceRef:
        kind: GitRepository
        name: myapp
  values:
    replicaCount: 3
    image:
      tag: v1.2.3
```

---

**Find Specific Topics:**
```bash
# Hook examples
grep -A 15 "Hook Example" HELM_ADVANCED.md

# Dependency management
grep -A 10 "Dependency Management" HELM_ADVANCED.md

# Template functions
grep -A 5 "String Functions" HELM_ADVANCED.md
```
