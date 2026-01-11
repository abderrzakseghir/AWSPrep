import { Question } from './types';

// OFFICIAL AWS CLF-C02 EXAM GUIDE WEIGHTINGS
// Domain 1: Cloud Concepts (24%)
// Domain 2: Security and Compliance (30%)
// Domain 3: Cloud Technology and Services (34%)
// Domain 4: Billing, Pricing, and Support (12%)
// --- PART 1: PRACTICE PACK QUESTIONS (Definitions & Basic Concepts) ---
// Balanced: ~12 Domain1, ~15 Domain2, ~17 Domain3, ~6 Domain4 (total 50)
export const QUESTION_BANK: Question[] = [
  // --- DOMAIN 1: Cloud Concepts (12 questions) ---
  {
    id: 1,
    category: 'Cloud Concepts',
    text: "What is a key benefit of the AWS Cloud that allows you to stop spending money on running and maintaining data centers?",
    options: [
      { id: "A", text: "Trade variable expense for capital expense" },
      { id: "B", text: "Trade capital expense for variable expense" },
      { id: "C", text: "Benefit from massive economies of scale" },
      { id: "D", text: "Increase speed and agility" }
    ],
    correctAnswerIds: ["B"],
    explanation: "In the AWS Cloud, you trade capital expense (CapEx) for variable expense (OpEx), paying only for what you use instead of upfront investments in hardware."
  },
  {
    id: 2,
    category: 'Cloud Concepts',
    text: "Which AWS Well-Architected Framework pillar focuses on using resources efficiently to meet system requirements and maintaining that efficiency as demand changes?",
    options: [
      { id: "A", text: "Operational Excellence" },
      { id: "B", text: "Security" },
      { id: "C", text: "Reliability" },
      { id: "D", text: "Performance Efficiency" }
    ],
    correctAnswerIds: ["D"],
    explanation: "The Performance Efficiency pillar emphasizes efficient use of computing resources, adapting to changes in demand."
  },
  {
    id: 3,
    category: 'Cloud Concepts',
    text: "What migration strategy involves moving applications to the cloud without changes, often called 'lift and shift'?",
    options: [
      { id: "A", text: "Refactor" },
      { id: "B", text: "Replatform" },
      { id: "C", text: "Rehost" },
      { id: "D", text: "Retire" }
    ],
    correctAnswerIds: ["C"],
    explanation: "Rehost is the 'lift and shift' strategy where applications are migrated as-is to the cloud."
  },
  {
    id: 4,
    category: 'Cloud Concepts',
    text: "Which economic aspect of the AWS Cloud allows customers to avoid over-provisioning or under-provisioning resources?",
    options: [
      { id: "A", text: "Go global in minutes" },
      { id: "B", text: "Stop guessing capacity" },
      { id: "C", text: "Increase speed and agility" },
      { id: "D", text: "Benefit from massive economies of scale" }
    ],
    correctAnswerIds: ["B"],
    explanation: "The cloud allows you to provision exactly the right amount and type of resources, eliminating the need to guess capacity."
  },
  {
    id: 5,
    category: 'Cloud Concepts',
    text: "In the AWS Cloud Adoption Framework, which perspective focuses on aligning cloud adoption with business goals?",
    options: [
      { id: "A", text: "People Perspective" },
      { id: "B", text: "Business Perspective" },
      { id: "C", text: "Platform Perspective" },
      { id: "D", text: "Operations Perspective" }
    ],
    correctAnswerIds: ["B"],
    explanation: "The Business Perspective ensures that cloud adoption supports overall business objectives."
  },
  {
    id: 6,
    category: 'Cloud Concepts',
    text: "What design principle under the Reliability pillar suggests distributing workloads across multiple Availability Zones?",
    options: [
      { id: "A", text: "Test recovery procedures" },
      { id: "B", text: "Automatically recover from failure" },
      { id: "C", text: "Scale horizontally" },
      { id: "D", text: "Manage change in automation" }
    ],
    correctAnswerIds: ["C"],
    explanation: "Scaling horizontally reduces the impact of a single failure by distributing load across multiple smaller resources."
  },
  {
    id: 7,
    category: 'Cloud Concepts',
    text: "Which benefit of the AWS Cloud enables deployment in multiple geographic locations with just a few clicks?",
    options: [
      { id: "A", text: "Trade capital expense for variable expense" },
      { id: "B", text: "Stop guessing capacity" },
      { id: "C", text: "Go global in minutes" },
      { id: "D", text: "Increase speed and agility" }
    ],
    correctAnswerIds: ["C"],
    explanation: "AWS allows global deployment quickly, reducing latency and improving user experience worldwide."
  },
  {
    id: 8,
    category: 'Cloud Concepts',
    text: "What is the primary focus of the Cost Optimization pillar in the AWS Well-Architected Framework?",
    options: [
      { id: "A", text: "Running systems to deliver business value at the lowest price point" },
      { id: "B", text: "Protecting information and systems" },
      { id: "C", text: "Recovering from failures" },
      { id: "D", text: "Performing efficiently" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Cost Optimization focuses on avoiding unnecessary costs while delivering value."
  },
  {
    id: 9,
    category: 'Cloud Concepts',
    text: "Which migration strategy might involve slight modifications to take advantage of cloud-native features without full redesign?",
    options: [
      { id: "A", text: "Rehost" },
      { id: "B", text: "Refactor" },
      { id: "C", text: "Replatform" },
      { id: "D", text: "Repurchase" }
    ],
    correctAnswerIds: ["C"],
    explanation: "Replatform involves optimizations like moving to a managed database without changing the core architecture."
  },
  {
    id: 10,
    category: 'Cloud Concepts',
    text: "How does the AWS Cloud provide massive economies of scale?",
    options: [
      { id: "A", text: "By requiring upfront payments" },
      { id: "B", text: "By passing on lower costs due to large-scale operations" },
      { id: "C", text: "By limiting resource availability" },
      { id: "D", text: "By charging fixed monthly fees" }
    ],
    correctAnswerIds: ["B"],
    explanation: "AWS aggregates usage from hundreds of thousands of customers, achieving lower pay-as-you-go prices."
  },
  {
    id: 11,
    category: 'Cloud Concepts',
    text: "Which pillar of the AWS Well-Architected Framework includes the principle of implementing security in all layers?",
    options: [
      { id: "A", text: "Operational Excellence" },
      { id: "B", text: "Security" },
      { id: "C", text: "Reliability" },
      { id: "D", text: "Performance Efficiency" }
    ],
    correctAnswerIds: ["B"],
    explanation: "The Security pillar emphasizes protecting data, systems, and assets."
  },
  {
    id: 12,
    category: 'Cloud Concepts',
    text: "What is a key advantage of cloud computing over on-premises infrastructure in terms of innovation?",
    options: [
      { id: "A", text: "Fixed capacity planning" },
      { id: "B", text: "Experimentation with new technologies at low cost" },
      { id: "C", text: "Long procurement cycles" },
      { id: "D", text: "Manual scaling" }
    ],
    correctAnswerIds: ["B"],
    explanation: "The cloud allows rapid experimentation, failing fast, and iterating without large upfront costs."
  },
  // --- DOMAIN 2: Security and Compliance (15 questions) ---
  {
    id: 13,
    category: 'Security and Compliance',
    text: "Under the AWS Shared Responsibility Model, who is responsible for patching the operating system on an Amazon EC2 instance?",
    options: [
      { id: "A", text: "AWS" },
      { id: "B", text: "The customer" },
      { id: "C", text: "Both AWS and the customer" },
      { id: "D", text: "Neither, it's automated" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Customers are responsible for security 'in' the cloud, including OS patches on EC2."
  },
  {
    id: 14,
    category: 'Security and Compliance',
    text: "Which AWS service is used to manage permissions for users and groups to access AWS resources?",
    options: [
      { id: "A", text: "AWS Organizations" },
      { id: "B", text: "AWS IAM" },
      { id: "C", text: "AWS Shield" },
      { id: "D", text: "Amazon GuardDuty" }
    ],
    correctAnswerIds: ["B"],
    explanation: "AWS Identity and Access Management (IAM) controls who is authenticated and authorized to use resources."
  },
  {
    id: 15,
    category: 'Security and Compliance',
    text: "What does the principle of least privilege mean in AWS IAM?",
    options: [
      { id: "A", text: "Granting all permissions by default" },
      { id: "B", text: "Providing users only the permissions necessary to perform their job" },
      { id: "C", text: "Using root account for daily tasks" },
      { id: "D", text: "Sharing credentials across teams" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Least privilege ensures users have minimal access, reducing risk."
  },
  {
    id: 16,
    category: 'Security and Compliance',
    text: "Which compliance program does AWS support for healthcare applications?",
    options: [
      { id: "A", text: "HIPAA" },
      { id: "B", text: "Only PCI DSS" },
      { id: "C", text: "Only SOC 2" },
      { id: "D", text: "No compliance programs" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS supports HIPAA for protected health information, among other compliances like PCI DSS and SOC."
  },
  {
    id: 17,
    category: 'Security and Compliance',
    text: "What AWS artifact provides on-demand access to compliance reports?",
    options: [
      { id: "A", text: "AWS Artifact" },
      { id: "B", text: "AWS Config" },
      { id: "C", text: "Amazon Inspector" },
      { id: "D", text: "AWS Trusted Advisor" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS Artifact offers compliance reports and agreements like SOC, PCI, ISO."
  },
  {
    id: 18,
    category: 'Security and Compliance',
    text: "Which service detects sensitive data like PII in Amazon S3 buckets?",
    options: [
      { id: "A", text: "Amazon Macie" },
      { id: "B", text: "Amazon GuardDuty" },
      { id: "C", text: "AWS Shield" },
      { id: "D", text: "AWS WAF" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Amazon Macie uses ML to discover and protect sensitive data in S3."
  },
  {
    id: 19,
    category: 'Security and Compliance',
    text: "In the Shared Responsibility Model, AWS is responsible for which of the following?",
    options: [
      { id: "A", text: "Application code security" },
      { id: "B", text: "Physical security of data centers" },
      { id: "C", text: "Customer data encryption" },
      { id: "D", text: "IAM user management" }
    ],
    correctAnswerIds: ["B"],
    explanation: "AWS handles security 'of' the cloud, including physical infrastructure."
  },
  {
    id: 20,
    category: 'Security and Compliance',
    text: "What is an IAM policy?",
    options: [
      { id: "A", text: "A document defining permissions" },
      { id: "B", text: "A user account" },
      { id: "C", text: "A group of users" },
      { id: "D", text: "A password requirement" }
    ],
    correctAnswerIds: ["A"],
    explanation: "IAM policies are JSON documents that define effects, actions, resources, and conditions for access."
  },
  {
    id: 21,
    category: 'Security and Compliance',
    text: "Which feature adds an extra layer of security to AWS account logins?",
    options: [
      { id: "A", text: "Multi-Factor Authentication (MFA)" },
      { id: "B", text: "Single Sign-On (SSO)" },
      { id: "C", text: "IAM Roles" },
      { id: "D", text: "Service Control Policies (SCPs)" }
    ],
    correctAnswerIds: ["A"],
    explanation: "MFA requires a second form of authentication beyond username/password."
  },
  {
    id: 22,
    category: 'Security and Compliance',
    text: "What service centrally manages security policies across multiple AWS accounts?",
    options: [
      { id: "A", text: "AWS Organizations" },
      { id: "B", text: "AWS IAM" },
      { id: "C", text: "AWS Config" },
      { id: "D", text: "Amazon GuardDuty" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS Organizations uses SCPs to manage permissions across accounts."
  },
  {
    id: 23,
    category: 'Security and Compliance',
    text: "Which AWS service provides encryption for data at rest and in transit?",
    options: [
      { id: "A", text: "AWS KMS" },
      { id: "B", text: "AWS Certificate Manager" },
      { id: "C", text: "AWS Secrets Manager" },
      { id: "D", text: "All of the above" }
    ],
    correctAnswerIds: ["D"],
    explanation: "KMS for keys, ACM for SSL/TLS, Secrets Manager for secrets; all support encryption."
  },
  {
    id: 24,
    category: 'Security and Compliance',
    text: "What is the purpose of AWS CloudTrail?",
    options: [
      { id: "A", text: "Monitoring performance" },
      { id: "B", text: "Logging API calls" },
      { id: "C", text: "Threat detection" },
      { id: "D", text: "Vulnerability scanning" }
    ],
    correctAnswerIds: ["B"],
    explanation: "CloudTrail records API activity for governance, compliance, and auditing."
  },
  {
    id: 25,
    category: 'Security and Compliance',
    text: "Which compliance certification is relevant for payment card industry?",
    options: [
      { id: "A", text: "PCI DSS" },
      { id: "B", text: "GDPR" },
      { id: "C", text: "ISO 27001" },
      { id: "D", text: "HIPAA" }
    ],
    correctAnswerIds: ["A"],
    explanation: "PCI DSS is for handling credit card data securely."
  },
  {
    id: 26,
    category: 'Security and Compliance',
    text: "What does AWS Config do?",
    options: [
      { id: "A", text: "Assesses resource configurations for compliance" },
      { id: "B", text: "Detects threats" },
      { id: "C", text: "Manages firewalls" },
      { id: "D", text: "Encrypts data" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS Config evaluates configurations against desired states."
  },
  {
    id: 27,
    category: 'Security and Compliance',
    text: "Which IAM entity allows temporary access for federated users?",
    options: [
      { id: "A", text: "IAM User" },
      { id: "B", text: "IAM Group" },
      { id: "C", text: "IAM Role" },
      { id: "D", text: "IAM Policy" }
    ],
    correctAnswerIds: ["C"],
    explanation: "IAM Roles provide temporary credentials for users or services."
  },
  // --- DOMAIN 3: Cloud Technology and Services (17 questions) ---
  {
    id: 28,
    category: 'Cloud Technology and Services',
    text: "Which AWS service provides a virtual private network in the cloud?",
    options: [
      { id: "A", text: "Amazon VPC" },
      { id: "B", text: "AWS Direct Connect" },
      { id: "C", text: "Amazon Route 53" },
      { id: "D", text: "AWS Transit Gateway" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Amazon Virtual Private Cloud (VPC) isolates your cloud resources."
  },
  {
    id: 29,
    category: 'Cloud Technology and Services',
    text: "What is the smallest geographic unit in AWS global infrastructure where resources can be launched?",
    options: [
      { id: "A", text: "Region" },
      { id: "B", text: "Availability Zone" },
      { id: "C", text: "Edge Location" },
      { id: "D", text: "Local Zone" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Availability Zones are isolated data centers within a Region."
  },
  {
    id: 30,
    category: 'Cloud Technology and Services',
    text: "Which compute service allows running code without managing servers?",
    options: [
      { id: "A", text: "Amazon EC2" },
      { id: "B", text: "AWS Lambda" },
      { id: "C", text: "Amazon ECS" },
      { id: "D", text: "Amazon EKS" }
    ],
    correctAnswerIds: ["B"],
    explanation: "AWS Lambda is serverless, executing code in response to events."
  },
  {
    id: 31,
    category: 'Cloud Technology and Services',
    text: "Which database service is a fully managed relational database?",
    options: [
      { id: "A", text: "Amazon DynamoDB" },
      { id: "B", text: "Amazon RDS" },
      { id: "C", text: "Amazon Redshift" },
      { id: "D", text: "Amazon Neptune" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Amazon RDS manages relational databases like MySQL, PostgreSQL."
  },
  {
    id: 32,
    category: 'Cloud Technology and Services',
    text: "What service provides object storage with high durability?",
    options: [
      { id: "A", text: "Amazon EBS" },
      { id: "B", text: "Amazon EFS" },
      { id: "C", text: "Amazon S3" },
      { id: "D", text: "Amazon FSx" }
    ],
    correctAnswerIds: ["C"],
    explanation: "Amazon S3 is designed for 99.999999999% durability."
  },
  {
    id: 33,
    category: 'Cloud Technology and Services',
    text: "Which networking service routes traffic based on DNS?",
    options: [
      { id: "A", text: "Amazon VPC" },
      { id: "B", text: "Amazon Route 53" },
      { id: "C", text: "AWS Direct Connect" },
      { id: "D", text: "AWS VPN" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Amazon Route 53 is a scalable DNS service."
  },
  {
    id: 34,
    category: 'Cloud Technology and Services',
    text: "What AI service extracts text from images?",
    options: [
      { id: "A", text: "Amazon Rekognition" },
      { id: "B", text: "Amazon Textract" },
      { id: "C", text: "Amazon Comprehend" },
      { id: "D", text: "Amazon Polly" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Amazon Textract uses OCR to extract text and data from documents."
  },
  {
    id: 35,
    category: 'Cloud Technology and Services',
    text: "Which service is used for container orchestration?",
    options: [
      { id: "A", text: "AWS Lambda" },
      { id: "B", text: "Amazon ECS" },
      { id: "C", text: "Amazon EC2" },
      { id: "D", text: "AWS Fargate" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Amazon Elastic Container Service (ECS) orchestrates Docker containers."
  },
  {
    id: 36,
    category: 'Cloud Technology and Services',
    text: "What is Amazon Athena used for?",
    options: [
      { id: "A", text: "Querying data in S3 using SQL" },
      { id: "B", text: "Real-time analytics" },
      { id: "C", text: "Machine learning training" },
      { id: "D", text: "Data warehousing" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Athena is serverless query service for S3 data."
  },
  {
    id: 37,
    category: 'Cloud Technology and Services',
    text: "Which storage service is block-level for EC2?",
    options: [
      { id: "A", text: "Amazon S3" },
      { id: "B", text: "Amazon EBS" },
      { id: "C", text: "Amazon EFS" },
      { id: "D", text: "Amazon Glacier" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Amazon Elastic Block Store (EBS) provides persistent block storage."
  },
  {
    id: 38,
    category: 'Cloud Technology and Services',
    text: "What service accelerates content delivery globally?",
    options: [
      { id: "A", text: "Amazon CloudFront" },
      { id: "B", text: "AWS Global Accelerator" },
      { id: "C", text: "Amazon Route 53" },
      { id: "D", text: "AWS Transit Gateway" }
    ],
    correctAnswerIds: ["A"],
    explanation: "CloudFront is a CDN caching content at edge locations."
  },
  {
    id: 39,
    category: 'Cloud Technology and Services',
    text: "Which database is NoSQL key-value store?",
    options: [
      { id: "A", text: "Amazon RDS" },
      { id: "B", text: "Amazon DynamoDB" },
      { id: "C", text: "Amazon Aurora" },
      { id: "D", text: "Amazon Redshift" }
    ],
    correctAnswerIds: ["B"],
    explanation: "DynamoDB is a fast, flexible NoSQL database."
  },
  {
    id: 40,
    category: 'Cloud Technology and Services',
    text: "What is AWS Snowball for?",
    options: [
      { id: "A", text: "Large-scale data transfer" },
      { id: "B", text: "Real-time streaming" },
      { id: "C", text: "Compute processing" },
      { id: "D", text: "Database migration" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Snowball is a physical device for transferring petabytes of data."
  },
  {
    id: 41,
    category: 'Cloud Technology and Services',
    text: "Which service builds and deploys web apps?",
    options: [
      { id: "A", text: "AWS Elastic Beanstalk" },
      { id: "B", text: "AWS CodePipeline" },
      { id: "C", text: "AWS CloudFormation" },
      { id: "D", text: "AWS OpsWorks" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Elastic Beanstalk handles deployment and scaling of applications."
  },
  {
    id: 42,
    category: 'Cloud Technology and Services',
    text: "What ML service forecasts time-series data?",
    options: [
      { id: "A", text: "Amazon SageMaker" },
      { id: "B", text: "Amazon Forecast" },
      { id: "C", text: "Amazon Personalize" },
      { id: "D", text: "Amazon Fraud Detector" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Amazon Forecast uses ML for accurate forecasting."
  },
  {
    id: 43,
    category: 'Cloud Technology and Services',
    text: "Which service monitors applications and infrastructure?",
    options: [
      { id: "A", text: "Amazon CloudWatch" },
      { id: "B", text: "AWS X-Ray" },
      { id: "C", text: "AWS CloudTrail" },
      { id: "D", text: "Amazon Inspector" }
    ],
    correctAnswerIds: ["A"],
    explanation: "CloudWatch collects metrics, logs, and sets alarms."
  },
  {
    id: 44,
    category: 'Cloud Technology and Services',
    text: "What is Amazon EMR for?",
    options: [
      { id: "A", text: "Big data processing" },
      { id: "B", text: "Relational databases" },
      { id: "C", text: "Graph databases" },
      { id: "D", text: "In-memory caching" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Elastic MapReduce processes large datasets using Hadoop, Spark."
  },
  // --- DOMAIN 4: Billing, Pricing, and Support (6 questions) ---
  {
    id: 45,
    category: 'Billing, Pricing, and Support',
    text: "Which pricing model charges only for what you use with no upfront costs?",
    options: [
      { id: "A", text: "Reserved" },
      { id: "B", text: "On-Demand" },
      { id: "C", text: "Spot" },
      { id: "D", text: "Dedicated" }
    ],
    correctAnswerIds: ["B"],
    explanation: "On-Demand pricing is pay-as-you-go without commitments."
  },
  {
    id: 46,
    category: 'Billing, Pricing, and Support',
    text: "What tool visualizes costs over time?",
    options: [
      { id: "A", text: "AWS Budgets" },
      { id: "B", text: "AWS Cost Explorer" },
      { id: "C", text: "AWS Pricing Calculator" },
      { id: "D", text: "AWS Trusted Advisor" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Cost Explorer analyzes spending patterns."
  },
  {
    id: 47,
    category: 'Billing, Pricing, and Support',
    text: "Which support plan includes 24/7 access to Cloud Support Engineers?",
    options: [
      { id: "A", text: "Basic" },
      { id: "B", text: "Developer" },
      { id: "C", text: "Business" },
      { id: "D", text: "Enterprise" }
    ],
    correctAnswerIds: ["C"],
    explanation: "Business and Enterprise plans offer 24/7 support."
  },
  {
    id: 48,
    category: 'Billing, Pricing, and Support',
    text: "What is AWS Free Tier?",
    options: [
      { id: "A", text: "Unlimited free usage" },
      { id: "B", text: "Free usage for certain services up to limits" },
      { id: "C", text: "Only for enterprises" },
      { id: "D", text: "Requires commitment" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Free Tier offers limited free usage for 12 months on select services."
  },
  {
    id: 49,
    category: 'Billing, Pricing, and Support',
    text: "Which resource provides best practice checks?",
    options: [
      { id: "A", text: "AWS Support Center" },
      { id: "B", text: "AWS Trusted Advisor" },
      { id: "C", text: "AWS Documentation" },
      { id: "D", text: "AWS Forums" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Trusted Advisor inspects your environment for optimizations."
  },
  {
    id: 50,
    category: 'Billing, Pricing, and Support',
    text: "What is Consolidated Billing?",
    options: [
      { id: "A", text: "Paying separately for each account" },
      { id: "B", text: "Combining payments across linked accounts" },
      { id: "C", text: "Only for Enterprise" },
      { id: "D", text: "Monthly fixed charges" }
    ],
    correctAnswerIds: ["B"],
    explanation: "In AWS Organizations, Consolidated Billing aggregates usage for volume discounts."
  }
];

// --- PART 2: REAL EXAM SCENARIO QUESTIONS (Scenario-based, slightly harder) ---
// Balanced: ~12 Domain1, ~15 Domain2, ~17 Domain3, ~6 Domain4 (total 50)
export const EXAM_QUESTION_BANK: Question[] = [
  // --- DOMAIN 1: Cloud Concepts (12 questions) ---
  {
    id: 51,
    category: 'Cloud Concepts',
    text: "A company experiences unpredictable traffic spikes on their website. In the cloud, how can they ensure capacity matches demand without overpaying?",
    options: [
      { id: "A", text: "Purchase hardware for peak load" },
      { id: "B", text: "Use Auto Scaling groups" },
      { id: "C", text: "Fixed capacity planning" },
      { id: "D", text: "Manual intervention" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Auto Scaling adjusts capacity automatically, embodying 'stop guessing capacity' benefit."
  },
  {
    id: 52,
    category: 'Cloud Concepts',
    text: "An enterprise wants to reduce TCO by moving to AWS. Which economic benefit helps achieve lower costs through aggregated usage?",
    options: [
      { id: "A", text: "Pay-as-you-go" },
      { id: "B", text: "Economies of scale" },
      { id: "C", text: "Global deployment" },
      { id: "D", text: "Agility" }
    ],
    correctAnswerIds: ["B"],
    explanation: "AWS passes savings from large-scale operations to customers via lower prices."
  },
  {
    id: 53,
    category: 'Cloud Concepts',
    text: "During a migration, a legacy app is moved as-is to EC2. Later, it's optimized for cloud-native. What strategies are used?",
    options: [
      { id: "A", text: "Rehost then Refactor" },
      { id: "B", text: "Repurchase then Replatform" },
      { id: "C", text: "Retain then Retire" },
      { id: "D", text: "Refactor then Rehost" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Rehost first (lift and shift), then Refactor for cloud optimizations."
  },
  {
    id: 54,
    category: 'Cloud Concepts',
    text: "A startup needs to launch in Europe and Asia quickly. How does AWS support this?",
    options: [
      { id: "A", text: "By requiring data center builds" },
      { id: "B", text: "Through global Regions" },
      { id: "C", text: "Limited to one Region" },
      { id: "D", text: "High latency connections" }
    ],
    correctAnswerIds: ["B"],
    explanation: "AWS enables 'go global in minutes' with infrastructure in multiple Regions."
  },
  {
    id: 55,
    category: 'Cloud Concepts',
    text: "To improve operational processes, a team automates deployments. Which pillar does this align with?",
    options: [
      { id: "A", text: "Security" },
      { id: "B", text: "Operational Excellence" },
      { id: "C", text: "Cost Optimization" },
      { id: "D", text: "Performance Efficiency" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Operational Excellence includes automating changes for efficiency."
  },
  {
    id: 56,
    category: 'Cloud Concepts',
    text: "A system fails due to a single component. How can reliability be improved?",
    options: [
      { id: "A", text: "Use larger instances" },
      { id: "B", text: "Distribute across AZs" },
      { id: "C", text: "Manual backups" },
      { id: "D", text: "Increase costs" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Distributing workloads (horizontal scaling) enhances reliability."
  },
  {
    id: 57,
    category: 'Cloud Concepts',
    text: "To align IT with business, which CAF perspective involves skill development?",
    options: [
      { id: "A", text: "Governance" },
      { id: "B", text: "People" },
      { id: "C", text: "Security" },
      { id: "D", text: "Operations" }
    ],
    correctAnswerIds: ["B"],
    explanation: "People Perspective focuses on training and culture for cloud adoption."
  },
  {
    id: 58,
    category: 'Cloud Concepts',
    text: "A company shifts from CapEx to OpEx. What cloud benefit is this?",
    options: [
      { id: "A", text: "Variable expense" },
      { id: "B", text: "Fixed pricing" },
      { id: "C", text: "Upfront commitments" },
      { id: "D", text: "Hardware ownership" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Trading CapEx for variable expense reduces financial risk."
  },
  {
    id: 59,
    category: 'Cloud Concepts',
    text: "For cost savings, an app is rewritten using serverless. What strategy?",
    options: [
      { id: "A", text: "Rehost" },
      { id: "B", text: "Refactor" },
      { id: "C", text: "Replatform" },
      { id: "D", text: "Retain" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Refactor involves rearchitecting for cloud-native, like serverless."
  },
  {
    id: 60,
    category: 'Cloud Concepts',
    text: "To optimize performance, select right resource types. Which pillar?",
    options: [
      { id: "A", text: "Reliability" },
      { id: "B", text: "Performance Efficiency" },
      { id: "C", text: "Security" },
      { id: "D", text: "Cost Optimization" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Performance Efficiency selects optimal resources."
  },
  {
    id: 61,
    category: 'Cloud Concepts',
    text: "A global app needs low latency. How?",
    options: [
      { id: "A", text: "Single Region deployment" },
      { id: "B", text: "Use Edge Locations" },
      { id: "C", text: "Ignore geography" },
      { id: "D", text: "High cost options" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Edge Locations cache content closer to users."
  },
  {
    id: 62,
    category: 'Cloud Concepts',
    text: "To protect data, implement encryption. Which pillar?",
    options: [
      { id: "A", text: "Operational Excellence" },
      { id: "B", text: "Security" },
      { id: "C", text: "Reliability" },
      { id: "D", text: "Performance Efficiency" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Security pillar includes data protection."
  },
  // --- DOMAIN 2: Security and Compliance (15 questions) ---
  {
    id: 63,
    category: 'Security and Compliance',
    text: "A developer needs access to S3 but not EC2. How to enforce?",
    options: [
      { id: "A", text: "Use IAM policy with least privilege" },
      { id: "B", text: "Share root credentials" },
      { id: "C", text: "No policies needed" },
      { id: "D", text: "Use groups only" }
    ],
    correctAnswerIds: ["A"],
    explanation: "IAM policies grant specific permissions."
  },
  {
    id: 64,
    category: 'Security and Compliance',
    text: "For HIPAA compliance, what must be enabled?",
    options: [
      { id: "A", text: "Sign BAA with AWS" },
      { id: "B", text: "Ignore compliance" },
      { id: "C", text: "Use only free services" },
      { id: "D", text: "No encryption" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Business Associate Agreement (BAA) for HIPAA."
  },
  {
    id: 65,
    category: 'Security and Compliance',
    text: "An S3 bucket has PII. How to detect?",
    options: [
      { id: "A", text: "Manual review" },
      { id: "B", text: "Use Amazon Macie" },
      { id: "C", text: "Ignore" },
      { id: "D", text: "Delete bucket" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Macie classifies sensitive data."
  },
  {
    id: 66,
    category: 'Security and Compliance',
    text: "Who secures the hypervisor in Shared Model?",
    options: [
      { id: "A", text: "Customer" },
      { id: "B", text: "AWS" },
      { id: "C", text: "Both" },
      { id: "D", text: "Neither" }
    ],
    correctAnswerIds: ["B"],
    explanation: "AWS manages host OS and hypervisor."
  },
  {
    id: 67,
    category: 'Security and Compliance',
    text: "To audit API calls, enable what?",
    options: [
      { id: "A", text: "CloudWatch" },
      { id: "B", text: "CloudTrail" },
      { id: "C", text: "Config" },
      { id: "D", text: "Inspector" }
    ],
    correctAnswerIds: ["B"],
    explanation: "CloudTrail logs API activity."
  },
  {
    id: 68,
    category: 'Security and Compliance',
    text: "For temporary access to EC2, use what?",
    options: [
      { id: "A", text: "IAM User" },
      { id: "B", text: "IAM Role" },
      { id: "C", text: "IAM Group" },
      { id: "D", text: "Root" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Roles for EC2 instances provide temp credentials."
  },
  {
    id: 69,
    category: 'Security and Compliance',
    text: "To prevent accidental deletion, use?",
    options: [
      { id: "A", text: "MFA Delete" },
      { id: "B", text: "No protection" },
      { id: "C", text: "Public access" },
      { id: "D", text: "Ignore" }
    ],
    correctAnswerIds: ["A"],
    explanation: "MFA Delete for S3 versioned buckets."
  },
  {
    id: 70,
    category: 'Security and Compliance',
    text: "Central governance for accounts?",
    options: [
      { id: "A", text: "IAM" },
      { id: "B", text: "Organizations" },
      { id: "C", text: "Config" },
      { id: "D", text: "Shield" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Organizations with SCPs."
  },
  {
    id: 71,
    category: 'Security and Compliance',
    text: "Encrypt EBS volumes using?",
    options: [
      { id: "A", text: "KMS" },
      { id: "B", text: "No encryption" },
      { id: "C", text: "Manual" },
      { id: "D", text: "Ignore" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS KMS for managed keys."
  },
  {
    id: 72,
    category: 'Security and Compliance',
    text: "Threat detection service?",
    options: [
      { id: "A", text: "GuardDuty" },
      { id: "B", text: "WAF" },
      { id: "C", text: "Shield" },
      { id: "D", text: "Inspector" }
    ],
    correctAnswerIds: ["A"],
    explanation: "GuardDuty analyzes logs for threats."
  },
  {
    id: 73,
    category: 'Security and Compliance',
    text: "For PCI compliance report, use?",
    options: [
      { id: "A", text: "Artifact" },
      { id: "B", text: "Config" },
      { id: "C", text: "CloudTrail" },
      { id: "D", text: "Macie" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS Artifact for reports."
  },
  {
    id: 74,
    category: 'Security and Compliance',
    text: "Vulnerability scans on EC2?",
    options: [
      { id: "A", text: "Inspector" },
      { id: "B", text: "GuardDuty" },
      { id: "C", text: "Config" },
      { id: "D", text: "WAF" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Amazon Inspector assesses for vulnerabilities."
  },
  {
    id: 75,
    category: 'Security and Compliance',
    text: "Manage secrets like API keys?",
    options: [
      { id: "A", text: "Secrets Manager" },
      { id: "B", text: "KMS" },
      { id: "C", text: "IAM" },
      { id: "D", text: "S3" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Secrets Manager rotates and retrieves secrets."
  },
  {
    id: 76,
    category: 'Security and Compliance',
    text: "DDoS protection?",
    options: [
      { id: "A", text: "Shield" },
      { id: "B", text: "WAF" },
      { id: "C", text: "Firewall Manager" },
      { id: "D", text: "Network ACL" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS Shield for DDoS mitigation."
  },
  {
    id: 77,
    category: 'Security and Compliance',
    text: "Web app firewall?",
    options: [
      { id: "A", text: "WAF" },
      { id: "B", text: "Shield" },
      { id: "C", text: "GuardDuty" },
      { id: "D", text: "Config" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS WAF protects against web exploits."
  },
  // --- DOMAIN 3: Cloud Technology and Services (17 questions) ---
  {
    id: 78,
    category: 'Cloud Technology and Services',
    text: "Hybrid connectivity with on-premises?",
    options: [
      { id: "A", text: "Site-to-Site VPN" },
      { id: "B", text: "Public internet" },
      { id: "C", text: "No connection" },
      { id: "D", text: "Ignore" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS Site-to-Site VPN for secure connection."
  },
  {
    id: 79,
    category: 'Cloud Technology and Services',
    text: "Data warehouse for analytics?",
    options: [
      { id: "A", text: "Redshift" },
      { id: "B", text: "DynamoDB" },
      { id: "C", text: "RDS" },
      { id: "D", text: "ElastiCache" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Amazon Redshift for petabyte-scale warehousing."
  },
  {
    id: 80,
    category: 'Cloud Technology and Services',
    text: "Serverless app with GraphQL?",
    options: [
      { id: "A", text: "AppSync" },
      { id: "B", text: "API Gateway" },
      { id: "C", text: "Lambda" },
      { id: "D", text: "EC2" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS AppSync for managed GraphQL APIs."
  },
  {
    id: 81,
    category: 'Cloud Technology and Services',
    text: "File storage for multiple EC2?",
    options: [
      { id: "A", text: "EFS" },
      { id: "B", text: "S3" },
      { id: "C", text: "EBS" },
      { id: "D", text: "Glacier" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Amazon EFS for shared file systems."
  },
  {
    id: 82,
    category: 'Cloud Technology and Services',
    text: "Managed Kubernetes?",
    options: [
      { id: "A", text: "EKS" },
      { id: "B", text: "ECS" },
      { id: "C", text: "Fargate" },
      { id: "D", text: "Lambda" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Amazon Elastic Kubernetes Service."
  },
  {
    id: 83,
    category: 'Cloud Technology and Services',
    text: "Chatbot building?",
    options: [
      { id: "A", text: "Lex" },
      { id: "B", text: "Comprehend" },
      { id: "C", text: "Polly" },
      { id: "D", text: "Rekognition" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Amazon Lex for conversational interfaces."
  },
  {
    id: 84,
    category: 'Cloud Technology and Services',
    text: "IoT device management?",
    options: [
      { id: "A", text: "AWS IoT Core" },
      { id: "B", text: "Lambda" },
      { id: "C", text: "S3" },
      { id: "D", text: "EC2" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS IoT Core connects devices securely."
  },
  {
    id: 85,
    category: 'Cloud Technology and Services',
    text: "Data lake on S3?",
    options: [
      { id: "A", text: "Lake Formation" },
      { id: "B", text: "Glue" },
      { id: "C", text: "EMR" },
      { id: "D", text: "Athena" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS Lake Formation builds secure data lakes."
  },
  {
    id: 86,
    category: 'Cloud Technology and Services',
    text: "Video transcription?",
    options: [
      { id: "A", text: "Transcribe" },
      { id: "B", text: "Translate" },
      { id: "C", text: "Polly" },
      { id: "D", text: "Comprehend" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Amazon Transcribe for speech-to-text."
  },
  {
    id: 87,
    category: 'Cloud Technology and Services',
    text: "Managed blockchain?",
    options: [
      { id: "A", text: "Amazon QLDB" },
      { id: "B", text: "Amazon Managed Blockchain" },
      { id: "C", text: "DynamoDB" },
      { id: "D", text: "Neptune" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Managed Blockchain for decentralized networks."
  },
  {
    id: 88,
    category: 'Cloud Technology and Services',
    text: "App monitoring traces?",
    options: [
      { id: "A", text: "X-Ray" },
      { id: "B", text: "CloudWatch" },
      { id: "C", text: "CloudTrail" },
      { id: "D", text: "Config" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS X-Ray for distributed tracing."
  },
  {
    id: 89,
    category: 'Cloud Technology and Services',
    text: "Graph database?",
    options: [
      { id: "A", text: "Neptune" },
      { id: "B", text: "DynamoDB" },
      { id: "C", text: "RDS" },
      { id: "D", text: "Redshift" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Amazon Neptune for graph data."
  },
  {
    id: 90,
    category: 'Cloud Technology and Services',
    text: "ETL service?",
    options: [
      { id: "A", text: "Glue" },
      { id: "B", text: "EMR" },
      { id: "C", text: "Athena" },
      { id: "D", text: "Kinesis" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS Glue for serverless ETL."
  },
  {
    id: 91,
    category: 'Cloud Technology and Services',
    text: "Streaming data analytics?",
    options: [
      { id: "A", text: "Kinesis" },
      { id: "B", text: "SQS" },
      { id: "C", text: "SNS" },
      { id: "D", text: "MQ" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Amazon Kinesis for real-time data streams."
  },
  {
    id: 92,
    category: 'Cloud Technology and Services',
    text: "Windows file server?",
    options: [
      { id: "A", text: "FSx for Windows" },
      { id: "B", text: "EFS" },
      { id: "C", text: "S3" },
      { id: "D", text: "EBS" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Amazon FSx for Windows File Server."
  },
  {
    id: 93,
    category: 'Cloud Technology and Services',
    text: "Disaster recovery service?",
    options: [
      { id: "A", text: "Elastic Disaster Recovery" },
      { id: "B", text: "Backup" },
      { id: "C", text: "S3" },
      { id: "D", text: "RDS" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS Elastic Disaster Recovery for minimal downtime."
  },
  {
    id: 94,
    category: 'Cloud Technology and Services',
    text: "BI dashboards?",
    options: [
      { id: "A", text: "QuickSight" },
      { id: "B", text: "Redshift" },
      { id: "C", text: "Athena" },
      { id: "D", text: "Glue" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Amazon QuickSight for visualizations."
  },
  // --- DOMAIN 4: Billing, Pricing, and Support (6 questions) ---
  {
    id: 95,
    category: 'Billing, Pricing, and Support',
    text: "Steady workload for 1 year, cost save?",
    options: [
      { id: "A", text: "On-Demand" },
      { id: "B", text: "Reserved Instances" },
      { id: "C", text: "Spot" },
      { id: "D", text: "Dedicated" }
    ],
    correctAnswerIds: ["B"],
    explanation: "Reserved Instances discount for commitments."
  },
  {
    id: 96,
    category: 'Billing, Pricing, and Support',
    text: "Budget alerts?",
    options: [
      { id: "A", text: "AWS Budgets" },
      { id: "B", text: "Cost Explorer" },
      { id: "C", text: "Trusted Advisor" },
      { id: "D", text: "Pricing Calculator" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Budgets set thresholds and notify."
  },
  {
    id: 97,
    category: 'Billing, Pricing, and Support',
    text: "TAM for proactive guidance?",
    options: [
      { id: "A", text: "Developer" },
      { id: "B", text: "Business" },
      { id: "C", text: "Enterprise" },
      { id: "D", text: "Basic" }
    ],
    correctAnswerIds: ["C"],
    explanation: "Enterprise Support includes TAM."
  },
  {
    id: 98,
    category: 'Billing, Pricing, and Support',
    text: "Estimate costs?",
    options: [
      { id: "A", text: "Pricing Calculator" },
      { id: "B", text: "Budgets" },
      { id: "C", text: "Cost Explorer" },
      { id: "D", text: "Free Tier" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS Pricing Calculator for configurations."
  },
  {
    id: 99,
    category: 'Billing, Pricing, and Support',
    text: "Optimization recs?",
    options: [
      { id: "A", text: "Compute Optimizer" },
      { id: "B", text: "Budgets" },
      { id: "C", text: "Artifact" },
      { id: "D", text: "Config" }
    ],
    correctAnswerIds: ["A"],
    explanation: "Compute Optimizer analyzes usage for recommendations."
  },
  {
    id: 100,
    category: 'Billing, Pricing, and Support',
    text: "Startup credits?",
    options: [
      { id: "A", text: "AWS Activate" },
      { id: "B", text: "Educate" },
      { id: "C", text: "Marketplace" },
      { id: "D", text: "APN" }
    ],
    correctAnswerIds: ["A"],
    explanation: "AWS Activate for startups with credits and support."
  }
];