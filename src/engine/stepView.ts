import type { ScenarioEdge, ScenarioNode, ScenarioStep, Tone } from '../types/scenario';

export interface ActiveEdgeInfo {
  reverse: boolean;
  tone: Tone;
}

/** Normaliza `activeEdges` del paso a un mapa id → dirección y tono. */
export function activeEdgeMap(step: ScenarioStep | undefined): Map<string, ActiveEdgeInfo> {
  const map = new Map<string, ActiveEdgeInfo>();
  if (!step) return map;
  const stepTone = step.tone ?? 'info';
  for (const ref of step.activeEdges) {
    if (typeof ref === 'string') map.set(ref, { reverse: false, tone: stepTone });
    else map.set(ref.id, { reverse: ref.reverse ?? false, tone: ref.tone ?? stepTone });
  }
  return map;
}

export function isNodeVisible(node: ScenarioNode, step: ScenarioStep | undefined): boolean {
  if (!node.dynamic) return true;
  return step?.showNodes?.includes(node.id) ?? false;
}

export function isEdgeVisible(
  edge: ScenarioEdge,
  visibleNodes: ReadonlySet<string>,
  active: boolean,
): boolean {
  if (!visibleNodes.has(edge.from) || !visibleNodes.has(edge.to)) return false;
  if (edge.hiddenUnlessActive && !active) return false;
  return true;
}
