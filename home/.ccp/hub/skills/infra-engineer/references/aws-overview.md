# AWS Overview

Amazon Web Services (AWS) - comprehensive cloud computing platform with 200+ services across compute, storage, databases, networking, security, and more.

## Account Setup

### Initial Configuration
```bash
# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version

# Configure credentials
aws configure
# AWS Access Key ID: <your-access-key>
# AWS Secret Access Key: <your-secret-key>
# Default region: us-east-1
# Default output format: json
```

### Multiple Profiles
```bash
# Configure named profile
aws configure --profile production

# Use profile
aws s3 ls --profile production
export AWS_PROFILE=production
```

## IAM (Identity and Access Management)

### Core Concepts
- **Users**: Individual identities with long-term credentials
- **Groups**: Collections of users with shared permissions
- **Roles**: Assumed by services or users for temporary credentials
- **Policies**: JSON documents defining permissions

### Best Practices
- Enable MFA for all users
- Use IAM roles for EC2 instances (not access keys)
- Follow least privilege principle
- Rotate credentials regularly
- Use AWS Organizations for multi-account management

### Example Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

## Core Services

### Compute
- **EC2**: Virtual servers
- **Lambda**: Serverless functions
- **ECS**: Container orchestration (Docker)
- **EKS**: Managed Kubernetes
- **Fargate**: Serverless containers
- **Lightsail**: Simplified VPS

### Storage
- **S3**: Object storage (industry standard)
- **EBS**: Block storage for EC2
- **EFS**: Managed NFS file system
- **Glacier**: Archive storage

### Database
- **RDS**: Managed relational databases (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server)
- **Aurora**: MySQL/PostgreSQL-compatible with better performance
- **DynamoDB**: NoSQL key-value and document database
- **ElastiCache**: In-memory caching (Redis, Memcached)
- **DocumentDB**: MongoDB-compatible

### Networking
- **VPC**: Virtual Private Cloud (isolated network)
- **CloudFront**: CDN
- **Route 53**: DNS service
- **ELB**: Load balancers (ALB, NLB, CLB)
- **API Gateway**: Managed API service

## Regions and Availability Zones

### Global Infrastructure
- **Regions**: Geographic locations (us-east-1, eu-west-1, ap-southeast-1)
- **Availability Zones**: Isolated data centers within region (us-east-1a, us-east-1b)
- **Edge Locations**: CloudFront CDN points of presence

### High Availability Pattern
```yaml
Architecture:
  Region: us-east-1
  AZ-1 (us-east-1a):
    - EC2 instances
    - RDS primary
  AZ-2 (us-east-1b):
    - EC2 instances
    - RDS standby
  Load Balancer: Distributes traffic across AZs
```

## Cost Management

### Free Tier
- 750 hours/month EC2 t2.micro or t3.micro (12 months)
- 5GB S3 storage
- 25GB DynamoDB storage
- 1 million Lambda requests/month

### Cost Optimization
- Use Reserved Instances (up to 72% discount)
- Use Savings Plans (flexible commitment-based discount)
- Use Spot Instances (up to 90% discount)
- Enable Cost Explorer and Budget Alerts
- Right-size instances based on CloudWatch metrics
- Use S3 Intelligent-Tiering or Lifecycle policies

## Common CLI Commands

```bash
# EC2
aws ec2 describe-instances
aws ec2 start-instances --instance-ids i-1234567890abcdef0
aws ec2 stop-instances --instance-ids i-1234567890abcdef0

# S3
aws s3 ls
aws s3 cp file.txt s3://my-bucket/
aws s3 sync ./local-dir s3://my-bucket/remote-dir

# Lambda
aws lambda list-functions
aws lambda invoke --function-name my-function output.json

# CloudFormation
aws cloudformation create-stack --stack-name my-stack --template-body file://template.yaml
aws cloudformation describe-stacks --stack-name my-stack
```

## Security Best Practices

1. **Enable CloudTrail** for audit logging
2. **Use AWS Config** for compliance monitoring
3. **Enable GuardDuty** for threat detection
4. **Encrypt data** at rest (S3, EBS, RDS) and in transit
5. **Use Security Groups** as virtual firewalls
6. **Enable VPC Flow Logs** for network monitoring
7. **Use AWS Secrets Manager** for credentials
8. **Regular security assessments** with AWS Inspector

## Resources

- AWS Documentation: https://docs.aws.amazon.com
- AWS CLI Reference: https://awscli.amazonaws.com/v2/documentation/api/latest/index.html
- AWS Well-Architected Framework: https://aws.amazon.com/architecture/well-architected
- AWS Training: https://aws.amazon.com/training
