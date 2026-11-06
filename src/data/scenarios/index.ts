import type { Scenario, ScenarioCategoryId } from '../../types/scenario';
import { SCENARIO_CATEGORIES } from '../categories';
import { getService } from '../services';
import { validateScenario } from '../validateScenario';
import { webAppScenario } from './web-app';
import { s3LambdaScenario } from './s3-lambda';
import { vpcScenario } from './vpc';
import { iamScenario } from './iam';
import { autoScalingScenario } from './auto-scaling';
import { monitoringScenario } from './monitoring';

/**
 * Registro de escenarios. Para agregar uno nuevo basta con crear su archivo
 * de datos e incluirlo aquí: el motor y la interfaz no cambian.
 */
export const SCENARIOS: Scenario[] = [
  webAppScenario,
  s3LambdaScenario,
  vpcScenario,
  iamScenario,
  autoScalingScenario,
  monitoringScenario,
];

if (import.meta.env.DEV) {
  const problems = SCENARIOS.flatMap(validateScenario);
  if (problems.length > 0) console.warn('Escenarios con problemas de integridad:\n' + problems.join('\n'));
}

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

/** Minúsculas y sin acentos, para buscar “version” y encontrar “versión”. */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function searchableText(scenario: Scenario): string {
  const category = SCENARIO_CATEGORIES.find((c) => c.id === scenario.category)?.label ?? '';
  const services = scenario.nodes.map((n) => {
    const s = getService(n.serviceId);
    return `${s.name} ${s.shortName} ${n.label}`;
  });
  return normalizeText([scenario.title, scenario.summary, scenario.description, category, ...services].join(' '));
}

export function filterScenarios(
  scenarios: Scenario[],
  query: string,
  category: ScenarioCategoryId | 'todas',
): Scenario[] {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  return scenarios.filter((scenario) => {
    if (category !== 'todas' && scenario.category !== category) return false;
    if (terms.length === 0) return true;
    const haystack = searchableText(scenario);
    return terms.every((term) => haystack.includes(term));
  });
}
