import { MarkerType } from '@xyflow/react';
import type { Scenario, ScenarioStep } from '../../types/scenario';
import type { ServiceId } from '../../types/service';
import { activeEdgeMap, isEdgeVisible, isNodeVisible } from '../../engine/stepView';
import { TONE_COLOR } from '../icons/serviceVisuals';
import type { AppFlowNode, ConnectionEdge } from './flowTypes';

export interface BuildOptions {
  selectedNodeId: string | null;
  onSelect: (serviceId: ServiceId, nodeId: string) => void;
  animate: boolean;
  speed: number;
}

/**
 * Traduce (escenario + paso actual) a nodos y conexiones de React Flow.
 * Función pura: toda la información visual se deriva del paso activo.
 */
export function buildFlowElements(
  scenario: Scenario,
  step: ScenarioStep | undefined,
  options: BuildOptions,
): { nodes: AppFlowNode[]; edges: ConnectionEdge[] } {
  const activeNodes = new Set(step?.activeNodes ?? []);
  const edgeInfo = activeEdgeMap(step);
  const tone = step?.tone ?? 'info';
  const absolute = new Map(scenario.nodes.map((n) => [n.id, n.position]));

  const visibleNodes = new Set<string>();
  const nodes: AppFlowNode[] = scenario.nodes.map((node) => {
    const visible = isNodeVisible(node, step);
    if (visible) visibleNodes.add(node.id);
    const parentPos = node.parentId ? absolute.get(node.parentId) : undefined;
    const position = parentPos
      ? { x: node.position.x - parentPos.x, y: node.position.y - parentPos.y }
      : node.position;
    const active = activeNodes.has(node.id);
    const base = {
      nodeId: node.id,
      label: node.label,
      sublabel: node.sublabel,
      serviceId: node.serviceId,
      active,
      dimmed: node.kind === 'service' && activeNodes.size > 0 && !active,
      selected: options.selectedNodeId === node.id,
      tone,
      status: step?.nodeStatus?.[node.id],
      badges: node.badges,
      onSelect: options.onSelect,
    };

    if (node.kind === 'group') {
      return {
        id: node.id,
        type: 'group',
        position,
        parentId: node.parentId,
        hidden: !visible,
        draggable: false,
        selectable: false,
        focusable: false,
        width: node.size?.width,
        height: node.size?.height,
        style: { width: node.size?.width, height: node.size?.height },
        zIndex: 0,
        data: { ...base, variant: node.variant ?? 'region' },
      };
    }
    return {
      id: node.id,
      type: 'service',
      position,
      parentId: node.parentId,
      hidden: !visible,
      draggable: false,
      selectable: false,
      focusable: false,
      zIndex: 2,
      data: base,
    };
  });

  const edges: ConnectionEdge[] = scenario.edges.map((edge) => {
    const info = edgeInfo.get(edge.id);
    const active = info !== undefined;
    const edgeTone = info?.tone ?? tone;
    const marker = active
      ? { type: MarkerType.ArrowClosed, width: 16, height: 16, color: TONE_COLOR[edgeTone] }
      : undefined;
    return {
      id: edge.id,
      type: 'connection',
      source: edge.from,
      target: edge.to,
      sourceHandle: `s-${edge.fromSide ?? 'right'}`,
      targetHandle: `t-${edge.toSide ?? 'left'}`,
      hidden: !isEdgeVisible(edge, visibleNodes, active),
      selectable: false,
      focusable: false,
      zIndex: active ? 3 : 1,
      markerEnd: active && !info.reverse ? marker : undefined,
      markerStart: active && info.reverse ? marker : undefined,
      data: {
        label: edge.label,
        active,
        reverse: info?.reverse ?? false,
        tone: edgeTone,
        dimmed: edgeInfo.size > 0 && !active,
        animate: options.animate,
        speed: options.speed,
      },
    };
  });

  return { nodes, edges };
}
