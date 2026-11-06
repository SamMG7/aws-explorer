import type { ServiceId } from './service';

export type Side = 'top' | 'right' | 'bottom' | 'left';

/** Tono semántico de un paso, conexión o estado de nodo. */
export type Tone = 'info' | 'ok' | 'warn' | 'deny';

export type Difficulty = 'básico' | 'intermedio' | 'avanzado';

export type ScenarioCategoryId =
  | 'arquitectura-web'
  | 'almacenamiento-serverless'
  | 'redes'
  | 'seguridad'
  | 'escalabilidad'
  | 'monitoreo';

export interface XY {
  x: number;
  y: number;
}

export type GroupVariant = 'region' | 'vpc' | 'subnet-public' | 'subnet-private' | 'asg';

export interface ScenarioNode {
  id: string;
  /** `service`: tarjeta de servicio. `group`: contenedor (VPC, subred, región, ASG). */
  kind: 'service' | 'group';
  serviceId: ServiceId;
  label: string;
  sublabel?: string;
  /** Posición ABSOLUTA en el lienzo. El canvas la convierte a relativa si hay `parentId`. */
  position: XY;
  /** Obligatorio para grupos. */
  size?: { width: number; height: number };
  /** Grupo contenedor. Debe declararse antes que sus hijos. */
  parentId?: string;
  /** Notas cortas visibles bajo el nodo (reglas de SG, tablas de rutas, etc.). */
  badges?: string[];
  /** Nodo que solo aparece en los pasos que lo listan en `showNodes`. */
  dynamic?: boolean;
  variant?: GroupVariant;
}

export interface ScenarioEdge {
  id: string;
  from: string;
  to: string;
  fromSide?: Side;
  toSide?: Side;
  label?: string;
  /** La conexión solo se dibuja mientras está activa (p. ej. un intento bloqueado). */
  hiddenUnlessActive?: boolean;
}

export interface ActiveEdgeRef {
  id: string;
  /** El flujo animado va de `to` hacia `from` (respuestas). */
  reverse?: boolean;
  tone?: Tone;
}

export interface NodeStatus {
  label: string;
  tone: Tone;
}

export interface CodeSnippet {
  title: string;
  language: 'json' | 'texto';
  content: string;
}

export interface ScenarioStep {
  id: string;
  title: string;
  /** ¿Qué está ocurriendo? */
  what: string;
  /** ¿Por qué ocurre? */
  why: string;
  /** ¿Qué servicio interviene? */
  serviceId: ServiceId;
  /** ¿Qué sucedería si este componente no estuviera disponible o estuviera mal configurado? */
  failure: string;
  concepts: string[];
  activeNodes: string[];
  activeEdges: Array<string | ActiveEdgeRef>;
  /** Duración del paso a velocidad 1x, en milisegundos. */
  durationMs: number;
  tone?: Tone;
  /** Aclaración explícita cuando el diagrama simplifica el funcionamiento real. */
  simplification?: string;
  nodeStatus?: Record<string, NodeStatus>;
  /** Nodos `dynamic` visibles en este paso. */
  showNodes?: string[];
  snippet?: CodeSnippet;
}

export interface Scenario {
  id: string;
  title: string;
  /** Una línea para la tarjeta del catálogo. */
  summary: string;
  description: string;
  category: ScenarioCategoryId;
  difficulty: Difficulty;
  certifications: string[];
  estimatedMinutes: number;
  objectives: string[];
  nodes: ScenarioNode[];
  edges: ScenarioEdge[];
  steps: ScenarioStep[];
  /** Simplificaciones educativas generales del escenario. */
  simplifications: string[];
}

export interface ScenarioCategory {
  id: ScenarioCategoryId;
  label: string;
}
