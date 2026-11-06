import type { Difficulty, ScenarioCategory } from '../types/scenario';

export const SCENARIO_CATEGORIES: ScenarioCategory[] = [
  { id: 'arquitectura-web', label: 'Arquitectura web' },
  { id: 'almacenamiento-serverless', label: 'Almacenamiento y serverless' },
  { id: 'redes', label: 'Redes' },
  { id: 'seguridad', label: 'Seguridad e identidad' },
  { id: 'escalabilidad', label: 'Escalabilidad' },
  { id: 'monitoreo', label: 'Monitoreo y auditoría' },
];

export const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  básico: 0,
  intermedio: 1,
  avanzado: 2,
};
