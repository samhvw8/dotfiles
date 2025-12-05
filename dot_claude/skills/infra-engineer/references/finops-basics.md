# FinOps Basics

Financial Operations (FinOps) - cultural practice of bringing financial accountability to cloud spending through collaboration between engineering, finance, and business teams.

## FinOps Principles

### Core Values
1. **Teams collaborate**: Cross-functional accountability for cloud spend
2. **Everyone owns usage**: Engineers make cost-conscious decisions
3. **Centralized team**: FinOps team enables and drives best practices
4. **Reports accessible**: Real-time visibility into cloud costs
5. **Decisions driven by business value**: Cost vs. performance trade-offs
6. **Take advantage of variable cost**: Leverage cloud pricing models

## FinOps Lifecycle

### 1. Inform Phase
**Goal**: Understand current cloud spending

**Actions:**
- Enable cost allocation tags
- Implement showback/chargeback
- Create cost dashboards
- Analyze spending trends
- Benchmark against industry

**Tools:**
- AWS Cost Explorer
- Azure Cost Management
- GCP Cost Management
- CloudHealth
- Datadog Cloud Cost Management

### 2. Optimize Phase
**Goal**: Reduce cloud spend while maintaining performance

**Actions:**
- Rightsize resources (downsize over-provisioned)
- Purchase reserved capacity
- Use spot/preemptible instances
- Implement auto-scaling
- Clean up unused resources
- Optimize storage tiers

### 3. Operate Phase
**Goal**: Continuously monitor and improve

**Actions:**
- Set budget alerts
- Track KPIs (cost per customer, cost per transaction)
- Regular cost reviews
- Enforce governance policies
- Celebrate wins, share learnings

## Cost Optimization Strategies

### 1. Compute Optimization

**Rightsizing**
```bash
# AWS: Analyze CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890 \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-31T23:59:59Z \
  --period 3600 \
  --statistics Average

# Recommendation: If avg CPU < 20%, downsize instance type
```

**Reserved Instances (AWS/Azure/GCP)**
- **Commitment**: 1 or 3 years
- **Discount**: Up to 72% vs on-demand
- **Best For**: Steady-state, predictable workloads
- **Types**: Standard (fixed instance), Convertible (changeable)

**Savings Plans (AWS)**
- **Commitment**: $X/hour for 1 or 3 years
- **Discount**: Up to 72%
- **Flexibility**: Applies across instance family, size, region, OS

**Spot/Preemptible Instances**
- **Discount**: Up to 90% vs on-demand
- **Risk**: Can be interrupted with short notice
- **Best For**: Fault-tolerant, flexible workloads (batch processing, CI/CD)

### 2. Storage Optimization

**S3 Lifecycle Policies (AWS)**
```yaml
Transition objects to cheaper tiers:
- Day 0-30: S3 Standard ($0.023/GB)
- Day 30-90: S3 Intelligent-Tiering (auto-optimization)
- Day 90+: Glacier Flexible Retrieval ($0.0036/GB)
- Delete after 365 days
```

**Storage Cleanup**
```bash
# Find old EBS snapshots (AWS)
aws ec2 describe-snapshots --owner-ids self \
  --query 'Snapshots[?StartTime<=`2023-01-01`].[SnapshotId,StartTime,VolumeSize]'

# Delete unattached volumes
aws ec2 describe-volumes --filters Name=status,Values=available
```

### 3. Auto-Scaling

**Horizontal Pod Autoscaler (Kubernetes)**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
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

**Time-Based Scaling**
```bash
# Scale down dev environment at night
# AWS Auto Scaling scheduled action
aws autoscaling put-scheduled-update-group-action \
  --auto-scaling-group-name dev-asg \
  --scheduled-action-name scale-down-evening \
  --recurrence "0 18 * * *" \
  --min-size 0 --max-size 0 --desired-capacity 0
```

### 4. Container Cost Optimization

**Kubernetes Resource Requests/Limits**
```yaml
# Set appropriate requests (guaranteed) and limits (max)
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

**Cluster Autoscaler**
- Automatically adjusts node count based on pod resource requests
- Removes underutilized nodes
- AWS: Cluster Autoscaler, Karpenter
- GCP: GKE Autopilot

**Kubecost**
- Real-time cost visibility for Kubernetes
- Cost allocation by namespace, deployment, pod
- Recommendations for rightsizing and efficiency

## Tagging Strategy

### Mandatory Tags
```yaml
Cost Center: finance, engineering, marketing
Environment: dev, staging, prod
Project: project-alpha, project-beta
Owner: team-name or email
Expiration: 2024-12-31 (for temporary resources)
```

### AWS Tag Enforcement (IAM Policy)
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Action": "ec2:RunInstances",
    "Resource": "arn:aws:ec2:*:*:instance/*",
    "Condition": {
      "StringNotLike": {
        "aws:RequestTag/CostCenter": "*"
      }
    }
  }]
}
```

## Budget and Alerts

### AWS Budgets
```bash
# Create budget with alert
aws budgets create-budget \
  --account-id 123456789012 \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

### Azure Budget Alert
```bash
az consumption budget create \
  --budget-name monthly-budget \
  --amount 10000 \
  --time-grain Monthly \
  --resource-group myResourceGroup
```

### GCP Budget Alert
```bash
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Monthly Budget" \
  --budget-amount=10000 \
  --threshold-rule=percent=80 \
  --threshold-rule=percent=100
```

## FinOps Metrics (KPIs)

### Unit Economics
- **Cost per User**: Total cloud cost / Active users
- **Cost per Transaction**: Total cloud cost / Transactions
- **Cost per Environment**: Dev vs staging vs production spend

### Efficiency Metrics
- **Coverage**: % of compute covered by RI/savings plans
- **Utilization**: % of purchased RI/savings plans used
- **Waste**: Idle resources, unattached volumes, old snapshots
- **Rightsizing Opportunities**: Over-provisioned resources

### Financial Metrics
- **Month-over-Month Growth**: Spending trend
- **Budget Variance**: Actual vs forecasted spend
- **Cost Avoidance**: Savings from optimization initiatives

## FinOps Tools

### Native Cloud Tools
- **AWS**: Cost Explorer, Budgets, Compute Optimizer, Trusted Advisor
- **Azure**: Cost Management + Billing, Advisor
- **GCP**: Cost Management, Recommender

### Third-Party Tools
- **CloudHealth**: Multi-cloud cost management
- **Kubecost**: Kubernetes cost monitoring
- **Infracost**: Cost estimation for Terraform
- **Spot.io**: Automated infrastructure optimization
- **Datadog Cloud Cost**: Integrated monitoring and cost

## Best Practices

1. **Tag Everything**: Consistent tagging for cost allocation
2. **Regular Reviews**: Weekly/monthly cost reviews with teams
3. **Forecast Proactively**: Predict spending based on growth
4. **Educate Teams**: FinOps training for engineers
5. **Automate Cleanup**: Scripts to delete orphaned resources
6. **Right Commitment Level**: Balance flexibility vs savings
7. **Measure Unit Costs**: Track cost per business metric
8. **Celebrate Wins**: Recognize teams for cost savings

## Resources

- FinOps Foundation: https://www.finops.org
- AWS Cost Optimization: https://aws.amazon.com/pricing/cost-optimization
- Azure FinOps: https://learn.microsoft.com/azure/cost-management-billing
- GCP Cost Optimization: https://cloud.google.com/cost-management
- Kubecost: https://www.kubecost.com
