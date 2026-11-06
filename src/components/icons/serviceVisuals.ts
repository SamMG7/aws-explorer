import {
  Activity,
  Boxes,
  Cloud,
  ClipboardCheck,
  Database,
  DoorOpen,
  FileCheck,
  FileJson,
  Gauge,
  Globe,
  HardDrive,
  KeyRound,
  Lock,
  type LucideIcon,
  MapPin,
  Network,
  Radar,
  ScrollText,
  Server,
  Shield,
  ShieldCheck,
  Split,
  Unlock,
  User,
  UserCog,
  Users,
  Zap,
  Signpost,
} from 'lucide-react';
import type { ServiceCategory, ServiceId } from '../../types/service';
import type { Tone } from '../../types/scenario';

export const SERVICE_ICONS: Record<ServiceId, LucideIcon> = {
  user: User,
  admin: UserCog,
  internet: Globe,
  'ops-team': Users,
  'aws-resources': Boxes,
  'aws-region': MapPin,
  route53: Signpost,
  cloudfront: Cloud,
  alb: Split,
  vpc: Network,
  'subnet-public': Unlock,
  'subnet-private': Lock,
  igw: DoorOpen,
  'security-group': Shield,
  ec2: Server,
  lambda: Zap,
  autoscaling: Gauge,
  s3: HardDrive,
  rds: Database,
  iam: KeyRound,
  'iam-role': ShieldCheck,
  'iam-policy': FileJson,
  'policy-evaluation': FileCheck,
  guardduty: Radar,
  cloudwatch: Activity,
  cloudtrail: ScrollText,
  config: ClipboardCheck,
};

/** Color de acento por categoría (variable CSS, se adapta al tema). */
export const CATEGORY_COLOR: Record<ServiceCategory, string> = {
  actor: 'var(--cat-actor)',
  redes: 'var(--cat-redes)',
  computo: 'var(--cat-computo)',
  almacenamiento: 'var(--cat-almacenamiento)',
  'base-de-datos': 'var(--cat-base)',
  seguridad: 'var(--cat-seguridad)',
  administracion: 'var(--cat-admin)',
  concepto: 'var(--cat-concepto)',
};

export const TONE_COLOR: Record<Tone, string> = {
  info: 'var(--cyan)',
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  deny: 'var(--deny)',
};

export const TONE_LABEL: Record<Tone, string> = {
  info: 'En curso',
  ok: 'Correcto',
  warn: 'Atención',
  deny: 'Denegado / bloqueado',
};
