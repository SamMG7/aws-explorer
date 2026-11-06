import { describe, expect, it } from 'vitest';
import { buildFlowElements } from './buildFlowElements';
import { getScenario } from '../../data/scenarios';

const options = { selectedNodeId: null, onSelect: () => {}, animate: true, speed: 1 };

describe('buildFlowElements', () => {
  it('marca como activos los nodos y conexiones del paso', () => {
    const scenario = getScenario('aplicacion-web')!;
    const step = scenario.steps.find((s) => s.id === 'dns-consulta')!;
    const { nodes, edges } = buildFlowElements(scenario, step, options);

    expect(nodes.find((n) => n.id === 'route53')?.data.active).toBe(true);
    expect(nodes.find((n) => n.id === 'rds')?.data.active).toBe(false);
    expect(nodes.find((n) => n.id === 'rds')?.data.dimmed).toBe(true);
    expect(edges.find((e) => e.id === 'user-route53')?.data?.active).toBe(true);
    expect(edges.find((e) => e.id === 'ec2a-rds')?.data?.active).toBe(false);
  });

  it('respeta la dirección inversa (respuestas)', () => {
    const scenario = getScenario('aplicacion-web')!;
    const step = scenario.steps.find((s) => s.id === 'dns-respuesta')!;
    const edge = buildFlowElements(scenario, step, options).edges.find((e) => e.id === 'user-route53')!;
    expect(edge.data?.reverse).toBe(true);
    expect(edge.markerStart).toBeDefined();
    expect(edge.markerEnd).toBeUndefined();
  });

  it('convierte posiciones absolutas en relativas al grupo padre', () => {
    const scenario = getScenario('aplicacion-web')!;
    const { nodes } = buildFlowElements(scenario, scenario.steps[0], options);
    const alb = nodes.find((n) => n.id === 'alb')!;
    expect(alb.parentId).toBe('region');
    expect(alb.position).toEqual({ x: 30, y: 150 });
  });

  it('oculta nodos dinámicos y sus conexiones hasta que el paso los muestra', () => {
    const scenario = getScenario('ec2-auto-scaling')!;
    const first = buildFlowElements(scenario, scenario.steps[0], options);
    expect(first.nodes.find((n) => n.id === 'ec2-3')?.hidden).toBe(true);
    expect(first.edges.find((e) => e.id === 'alb-ec2-3')?.hidden).toBe(true);

    const launch = scenario.steps.find((s) => s.id === 'lanzamiento')!;
    const later = buildFlowElements(scenario, launch, options);
    expect(later.nodes.find((n) => n.id === 'ec2-3')?.hidden).toBe(false);
    expect(later.nodes.find((n) => n.id === 'ec2-3')?.data.status?.label).toBe('Pending');
  });

  it('las conexiones hiddenUnlessActive solo aparecen cuando están activas', () => {
    const scenario = getScenario('vpc-redes-privadas')!;
    const normal = buildFlowElements(scenario, scenario.steps[0], options);
    expect(normal.edges.find((e) => e.id === 'internet-ec2-blocked')?.hidden).toBe(true);
    const blocked = scenario.steps.find((s) => s.id === 'bloqueo')!;
    const edge = buildFlowElements(scenario, blocked, options).edges.find((e) => e.id === 'internet-ec2-blocked')!;
    expect(edge.hidden).toBe(false);
    expect(edge.data?.tone).toBe('deny');
  });
});
