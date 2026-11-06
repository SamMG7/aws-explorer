import { describe, expect, it } from 'vitest';
import { SCENARIOS, filterScenarios, getScenario } from './scenarios';
import { validateScenario } from './validateScenario';
import { SERVICES } from './services';
import { SCENARIO_CATEGORIES } from './categories';
import { SERVICE_IDS } from '../types/service';
import type { Scenario } from '../types/scenario';

describe('catálogo de escenarios', () => {
  it('contiene los seis escenarios del MVP', () => {
    expect(SCENARIOS.map((s) => s.id)).toEqual([
      'aplicacion-web',
      's3-procesamiento',
      'vpc-redes-privadas',
      'iam-evaluacion',
      'ec2-auto-scaling',
      'monitoreo-auditoria',
    ]);
  });

  it('los ids de escenario son únicos', () => {
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(SCENARIOS.length);
  });

  it.each(SCENARIOS.map((s) => [s.id, s] as const))('%s pasa la validación de integridad', (_id, scenario) => {
    expect(validateScenario(scenario)).toEqual([]);
  });

  it.each(SCENARIOS.map((s) => [s.id, s] as const))('%s tiene contenido educativo completo', (_id, scenario) => {
    expect(scenario.steps.length).toBeGreaterThanOrEqual(5);
    expect(scenario.objectives.length).toBeGreaterThan(0);
    expect(scenario.simplifications.length).toBeGreaterThan(0);
    expect(SCENARIO_CATEGORIES.some((c) => c.id === scenario.category)).toBe(true);
    for (const step of scenario.steps) {
      expect(step.concepts.length, `${scenario.id}/${step.id}`).toBeGreaterThan(0);
    }
  });

  it('el escenario IAM incluye un caso permitido y uno denegado', () => {
    const iam = getScenario('iam-evaluacion')!;
    const tones = iam.steps.map((s) => s.tone);
    expect(tones).toContain('ok');
    expect(tones).toContain('deny');
  });

  it('el escenario de Auto Scaling agrega instancias dinámicamente', () => {
    const asg = getScenario('ec2-auto-scaling')!;
    expect(asg.nodes.some((n) => n.dynamic)).toBe(true);
    expect(asg.steps.some((s) => (s.showNodes?.length ?? 0) > 0)).toBe(true);
  });
});

describe('fichas de servicios', () => {
  it('hay una ficha completa por cada servicio declarado', () => {
    for (const id of SERVICE_IDS) {
      const service = SERVICES[id];
      expect(service.id).toBe(id);
      expect(service.definition.length).toBeGreaterThan(20);
      expect(service.mainFunction.length).toBeGreaterThan(10);
      for (const related of service.related) expect(SERVICE_IDS).toContain(related);
    }
  });
});

describe('validateScenario detecta datos rotos', () => {
  it('reporta referencias inexistentes', () => {
    const base = getScenario('aplicacion-web')!;
    const broken: Scenario = {
      ...base,
      edges: [...base.edges, { id: 'roto', from: 'user', to: 'no-existe' }],
      steps: [{ ...base.steps[0]!, activeEdges: ['fantasma'], activeNodes: ['nadie'] }],
    };
    const problems = validateScenario(broken);
    expect(problems.some((p) => p.includes('no-existe'))).toBe(true);
    expect(problems.some((p) => p.includes('fantasma'))).toBe(true);
    expect(problems.some((p) => p.includes('nadie'))).toBe(true);
  });
});

describe('búsqueda', () => {
  it('ignora mayúsculas y acentos y busca por servicio', () => {
    expect(filterScenarios(SCENARIOS, 'LAMBDA', 'todas').map((s) => s.id)).toContain('s3-procesamiento');
    expect(filterScenarios(SCENARIOS, 'evaluacion', 'todas').map((s) => s.id)).toContain('iam-evaluacion');
  });

  it('filtra por categoría', () => {
    expect(filterScenarios(SCENARIOS, '', 'redes').map((s) => s.id)).toEqual(['vpc-redes-privadas']);
  });

  it('devuelve lista vacía si nada coincide', () => {
    expect(filterScenarios(SCENARIOS, 'kubernetes mainframe', 'todas')).toEqual([]);
  });
});
