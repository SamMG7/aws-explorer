/**
 * Catálogo de identificadores de servicios y conceptos.
 * Al ser una tupla `as const`, TypeScript obliga a que el catálogo
 * educativo (`src/data/services.ts`) tenga una ficha para cada uno.
 */
export const SERVICE_IDS = [
  // Actores y elementos genéricos
  'user',
  'admin',
  'internet',
  'ops-team',
  'aws-resources',
  'aws-region',
  // Redes y entrega de contenido
  'route53',
  'cloudfront',
  'alb',
  'vpc',
  'subnet-public',
  'subnet-private',
  'igw',
  'security-group',
  // Cómputo
  'ec2',
  'lambda',
  'autoscaling',
  // Almacenamiento y bases de datos
  's3',
  'rds',
  // Seguridad e identidad
  'iam',
  'iam-role',
  'iam-policy',
  'policy-evaluation',
  'guardduty',
  // Administración y gobierno
  'cloudwatch',
  'cloudtrail',
  'config',
  // Temario CLF-C02 (fichas de catálogo; ver src/data/clf-c02/)
  'ebs',
  'efs',
  'fsx',
  's3-glacier',
  'storage-gateway',
  'aws-backup',
  'elastic-disaster-recovery',
  'instance-store',
  'datasync',
  'transfer-family',
  'snow-family',
  'aurora',
  'dynamodb',
  'documentdb',
  'elasticache',
  'neptune',
  'batch',
  'elastic-beanstalk',
  'lightsail',
  'outposts',
  'ecr',
  'ecs',
  'eks',
  'fargate',
  'api-gateway',
  'direct-connect',
  'global-accelerator',
  'privatelink',
  'transit-gateway',
  'vpn',
  'site-to-site-vpn',
  'client-vpn',
  'nat-gateway',
  'network-acl',
  'edge-location',
  'athena',
  'emr',
  'glue',
  'kinesis',
  'opensearch',
  'amazon-quick',
  'redshift',
  'eventbridge',
  'sns',
  'sqs',
  'step-functions',
  'connect',
  'ses',
  'budgets',
  'cost-usage-reports',
  'cost-explorer',
  'marketplace',
  'pricing-calculator',
  'savings-plans',
  'reserved-instances',
  'spot-instances',
  'aws-support',
  'repost',
  'partner-network',
  'aws-cli',
  'codebuild',
  'codepipeline',
  'xray',
  'appstream',
  'workspaces',
  'workspaces-browser',
  'amplify',
  'iot-core',
  'comprehend',
  'lex',
  'polly',
  'amazon-q',
  'rekognition',
  'sagemaker',
  'textract',
  'transcribe',
  'translate',
  'aws-auto-scaling',
  'cloudformation',
  'compute-optimizer',
  'control-tower',
  'health-dashboard',
  'license-manager',
  'management-console',
  'organizations',
  'service-catalog',
  'service-quotas',
  'systems-manager',
  'trusted-advisor',
  'well-architected-tool',
  'application-discovery',
  'application-migration',
  'dms',
  'migration-evaluator',
  'migration-hub',
  'schema-conversion',
  'artifact',
  'acm',
  'cloudhsm',
  'cognito',
  'detective',
  'directory-service',
  'firewall-manager',
  'iam-identity-center',
  'inspector',
  'kms',
  'macie',
  'ram',
  'secrets-manager',
  'security-hub',
  'shield',
  'waf',
  'shared-responsibility',
  'well-architected',
  'cloud-adoption-framework',
  'elasticity',
  'scalability',
  'high-availability',
  'fault-tolerance',
  'capex-opex',
  'cloud-models',
  'service-models',
  'availability-zone',
  'rto-rpo',
  'least-privilege',
  'encryption',
  'mfa',
  'infrastructure-as-code',
  'data-transfer-pricing',
  'support-plans',
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

export type ServiceCategory =
  | 'actor'
  | 'redes'
  | 'computo'
  | 'almacenamiento'
  | 'base-de-datos'
  | 'seguridad'
  | 'administracion'
  | 'concepto'
  | 'analitica'
  | 'integracion'
  | 'aplicaciones'
  | 'finanzas'
  | 'contenedores'
  | 'serverless'
  | 'soporte'
  | 'desarrollo'
  | 'escritorio'
  | 'frontend'
  | 'iot'
  | 'ia'
  | 'migracion';

export interface ServiceInfo {
  id: ServiceId;
  /** Nombre oficial completo (p. ej. "Amazon Route 53"). */
  name: string;
  /** Nombre corto para nodos y chips (p. ej. "Route 53"). */
  shortName: string;
  category: ServiceCategory;
  /** ¿Qué es? */
  definition: string;
  /** ¿Para qué sirve principalmente? */
  mainFunction: string;
  useCases: string[];
  related: ServiceId[];
  /** Confusiones frecuentes / diferencias frente a otros servicios. */
  confusions: string[];
  /** Consideraciones importantes (costos, límites, buenas prácticas). */
  considerations: string[];
  /** Página oficial del servicio en aws.amazon.com (cuando aplica). */
  docsUrl?: string;
}
