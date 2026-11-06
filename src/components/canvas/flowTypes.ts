import type { Edge, Node } from '@xyflow/react';
import type { GroupVariant, NodeStatus, Tone } from '../../types/scenario';
import type { ServiceId } from '../../types/service';

interface BaseNodeData extends Record<string, unknown> {
  nodeId: string;
  label: string;
  sublabel?: string;
  serviceId: ServiceId;
  active: boolean;
  dimmed: boolean;
  selected: boolean;
  tone: Tone;
  status?: NodeStatus;
  badges?: string[];
  onSelect: (serviceId: ServiceId, nodeId: string) => void;
}

export type ServiceNodeData = BaseNodeData;

export interface GroupNodeData extends BaseNodeData {
  variant: GroupVariant;
}

export type ServiceFlowNode = Node<ServiceNodeData, 'service'>;
export type GroupFlowNode = Node<GroupNodeData, 'group'>;
export type AppFlowNode = ServiceFlowNode | GroupFlowNode;

export interface ConnectionData extends Record<string, unknown> {
  label?: string;
  active: boolean;
  reverse: boolean;
  tone: Tone;
  dimmed: boolean;
  animate: boolean;
  speed: number;
}

export type ConnectionEdge = Edge<ConnectionData, 'connection'>;
