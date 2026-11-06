import { type RefObject, useEffect, useMemo, useRef } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  type EdgeTypes,
  type NodeTypes,
  ReactFlow,
  useReactFlow,
} from '@xyflow/react';
import type { Scenario, ScenarioStep } from '../../types/scenario';
import type { ServiceId } from '../../types/service';
import type { Theme } from '../../hooks/useTheme';
import { AWSServiceNode } from './AWSServiceNode';
import { GroupNode } from './GroupNode';
import { AnimatedConnection } from './AnimatedConnection';
import { buildFlowElements } from './buildFlowElements';

const nodeTypes: NodeTypes = { service: AWSServiceNode, group: GroupNode };
const edgeTypes: EdgeTypes = { connection: AnimatedConnection };
const FIT_OPTIONS = { padding: 0.12, maxZoom: 1.1 } as const;

interface ArchitectureCanvasProps {
  scenario: Scenario;
  step: ScenarioStep | undefined;
  selectedNodeId: string | null;
  onSelectNode: (serviceId: ServiceId, nodeId: string) => void;
  animate: boolean;
  speed: number;
  theme: Theme;
}

export function ArchitectureCanvas({
  scenario,
  step,
  selectedNodeId,
  onSelectNode,
  animate,
  speed,
  theme,
}: ArchitectureCanvasProps) {
  const { nodes, edges } = useMemo(
    () => buildFlowElements(scenario, step, { selectedNodeId, onSelect: onSelectNode, animate, speed }),
    [scenario, step, selectedNodeId, onSelectNode, animate, speed],
  );
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="region"
      aria-label={`Diagrama de arquitectura: ${scenario.title}. Usa la rueda o los controles para hacer zoom.`}
    >
      <ReactFlow
        key={scenario.id}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        colorMode={theme}
        fitView
        fitViewOptions={FIT_OPTIONS}
        minZoom={0.25}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: false }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.3} />
        <Controls showInteractive={false} position="bottom-left" aria-label="Controles de zoom del diagrama" />
        <FitOnResize containerRef={containerRef} />
      </ReactFlow>
    </div>
  );
}

/** Reajusta el encuadre cuando cambia el tamaño del contenedor (rotación, paneles, ventana). */
function FitOnResize({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  const { fitView } = useReactFlow();
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => void fitView(FIT_OPTIONS), 150);
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [fitView, containerRef]);

  return null;
}
