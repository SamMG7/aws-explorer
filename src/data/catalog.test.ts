import { describe, expect, it } from 'vitest';
import { ALL_SERVICES, SERVICES } from './services';
import { SERVICE_IDS } from '../types/service';

/**
 * Servicios en el alcance del examen CLF-C02 según la lista oficial de AWS
 * (consultada el 9-nov-2026). La lista no es exhaustiva y puede cambiar:
 * actualízala junto con las fichas.
 * https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html
 */
const OFFICIAL_IN_SCOPE: Record<string, string[]> = {
  Analítica: ['Amazon Athena', 'Amazon EMR', 'AWS Glue', 'Amazon Kinesis', 'Amazon OpenSearch Service', 'Amazon Quick', 'Amazon Redshift'],
  'Integración de aplicaciones': ['Amazon EventBridge', 'Amazon Simple Notification Service', 'Amazon Simple Queue Service', 'AWS Step Functions'],
  'Aplicaciones empresariales': ['Amazon Connect', 'Amazon Simple Email Service'],
  'Finanzas de la nube': ['AWS Budgets', 'AWS Cost and Usage Reports', 'AWS Cost Explorer', 'AWS Marketplace'],
  Cómputo: ['AWS Batch', 'Amazon Elastic Compute Cloud', 'AWS Elastic Beanstalk', 'Amazon Lightsail', 'AWS Outposts'],
  Contenedores: ['Amazon Elastic Container Registry', 'Amazon Elastic Container Service', 'Amazon Elastic Kubernetes Service'],
  'Habilitación del cliente': ['AWS Support'],
  'Bases de datos': ['Amazon Aurora', 'Amazon DocumentDB', 'Amazon DynamoDB', 'Amazon ElastiCache', 'Amazon Neptune', 'Amazon Relational Database Service'],
  'Herramientas para desarrolladores': ['AWS Command Line Interface', 'AWS CodeBuild', 'AWS CodePipeline', 'AWS X-Ray'],
  'Computación para usuarios finales': ['Amazon AppStream 2.0', 'Amazon WorkSpaces', 'Amazon WorkSpaces Secure Browser'],
  'Frontend web y móvil': ['AWS Amplify'],
  IoT: ['AWS IoT Core'],
  'Machine learning': ['Amazon Comprehend', 'Amazon Lex', 'Amazon Polly', 'Amazon Q', 'Amazon Rekognition', 'Amazon SageMaker AI', 'Amazon Textract', 'Amazon Transcribe', 'Amazon Translate'],
  'Administración y gobierno': [
    'AWS Auto Scaling', 'AWS CloudFormation', 'AWS CloudTrail', 'Amazon CloudWatch', 'AWS Compute Optimizer', 'AWS Config', 'AWS Control Tower',
    'AWS Health Dashboard', 'AWS License Manager', 'AWS Management Console', 'AWS Organizations', 'AWS Service Catalog', 'Service Quotas',
    'AWS Systems Manager', 'AWS Trusted Advisor', 'AWS Well-Architected Tool',
  ],
  'Migración y transferencia': ['AWS Application Discovery Service', 'AWS Application Migration Service', 'AWS Database Migration Service', 'Migration Evaluator', 'AWS Migration Hub', 'AWS Schema Conversion Tool'],
  'Redes y entrega de contenido': [
    'Amazon API Gateway', 'Amazon CloudFront', 'AWS Direct Connect', 'AWS Global Accelerator', 'AWS PrivateLink', 'Amazon Route 53',
    'AWS Transit Gateway', 'Amazon Virtual Private Cloud', 'AWS VPN', 'AWS Site-to-Site VPN', 'AWS Client VPN',
  ],
  'Seguridad, identidad y cumplimiento': [
    'AWS Artifact', 'AWS Certificate Manager', 'AWS CloudHSM', 'Amazon Cognito', 'Amazon Detective', 'AWS Directory Service', 'AWS Firewall Manager',
    'Amazon GuardDuty', 'AWS Identity and Access Management', 'AWS IAM Identity Center', 'Amazon Inspector', 'AWS Key Management Service',
    'Amazon Macie', 'AWS Resource Access Manager', 'AWS Secrets Manager', 'AWS Security Hub', 'AWS Shield', 'AWS WAF',
  ],
  Serverless: ['AWS Fargate', 'AWS Lambda'],
  Almacenamiento: ['AWS Backup', 'Amazon Elastic Block Store', 'Amazon Elastic File System', 'AWS Elastic Disaster Recovery', 'Amazon FSx', 'Amazon Simple Storage Service', 'Amazon S3 Glacier', 'AWS Storage Gateway'],
};

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const names = ALL_SERVICES.map((s) => normalize(s.name));

describe('cobertura del temario CLF-C02', () => {
  it.each(Object.entries(OFFICIAL_IN_SCOPE))('%s: cada servicio oficial tiene ficha', (_cat, services) => {
    const missing = services.filter((official) => !names.some((n) => n.startsWith(normalize(official))));
    expect(missing).toEqual([]);
  });

  it('el catálogo tiene una ficha por cada id declarado', () => {
    expect(ALL_SERVICES).toHaveLength(SERVICE_IDS.length);
    expect(new Set(ALL_SERVICES.map((s) => s.id)).size).toBe(SERVICE_IDS.length);
  });
});

describe('calidad de las fichas', () => {
  it.each(ALL_SERVICES.map((s) => [s.id, s] as const))('%s tiene contenido real y coherente', (id, s) => {
    expect(SERVICES[id]).toBe(s);
    expect(s.definition.length).toBeGreaterThan(30);
    expect(s.mainFunction).not.toBe(s.definition);
    expect(s.useCases.length).toBeGreaterThan(0);
    for (const r of s.related) {
      expect(r).not.toBe(id);
      expect(SERVICE_IDS).toContain(r);
    }
    // Sin textos de relleno.
    const all = [s.definition, s.mainFunction, ...s.useCases, ...s.confusions, ...s.considerations].join(' ');
    expect(all).not.toMatch(/Ficha introductoria|ampliar con comparaciones|Identificar cuándo utilizar/);
    if (s.docsUrl) expect(s.docsUrl).toMatch(/^https:\/\/(aws\.amazon\.com|docs\.aws\.amazon\.com|calculator\.aws|repost\.aws|health\.aws\.amazon\.com)\//);
  });

  it('las fichas de servicios (no actores) tienen confusiones o consideraciones', () => {
    const empty = ALL_SERVICES.filter((s) => s.category !== 'actor' && s.confusions.length + s.considerations.length === 0).map((s) => s.id);
    expect(empty).toEqual([]);
  });
});
