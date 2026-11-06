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
  | 'concepto';

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
