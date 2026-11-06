import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getSmoothStepPath } from '@xyflow/react';
import { TONE_COLOR } from '../icons/serviceVisuals';
import type { ConnectionEdge } from './flowTypes';

/**
 * Conexión entre servicios. Cuando está activa:
 *  - se resalta con el color del tono del paso,
 *  - un trazo discontinuo se desplaza en la dirección del flujo,
 *  - un “paquete” (círculo) recorre la ruta (representación educativa, no tráfico real).
 * Con movimiento reducido solo se resalta, sin animación.
 */
function AnimatedConnectionComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  markerStart,
}: EdgeProps<ConnectionEdge>) {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 14,
  });

  const active = data?.active ?? false;
  const reverse = data?.reverse ?? false;
  const color = active ? TONE_COLOR[data?.tone ?? 'info'] : 'var(--line)';
  const travelSeconds = 1.8 / Math.max(0.25, data?.speed ?? 1);
  const animate = active && (data?.animate ?? true);
  const dashedDeny = active && data?.tone === 'deny';

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        markerStart={markerStart}
        style={{
          stroke: color,
          strokeWidth: active ? 2.5 : 1.5,
          opacity: data?.dimmed ? 0.35 : 1,
          strokeDasharray: dashedDeny ? '6 5' : undefined,
          transition: 'stroke 300ms, opacity 300ms',
        }}
      />
      {animate && (
        <>
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.35}
            className={`edge-flow ${reverse ? 'reverse' : ''}`}
            aria-hidden="true"
          />
          <circle r={5} fill={color} aria-hidden="true">
            <animateMotion
              dur={`${travelSeconds}s`}
              repeatCount="indefinite"
              path={path}
              keyPoints={reverse ? '1;0' : '0;1'}
              keyTimes="0;1"
              calcMode="linear"
            />
          </circle>
        </>
      )}
      {active && data?.label && (
        <EdgeLabelRenderer>
          {/* El transform va en el contenedor; la animación de entrada en el hijo para no sobrescribirlo. */}
          <div
            className="nodrag nopan pointer-events-none absolute"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`, zIndex: 10 }}
          >
            <div
              className="animate-fade-in rounded-md border px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap"
              style={{ background: 'var(--panel)', borderColor: color, color: 'var(--fg)' }}
            >
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const AnimatedConnection = memo(AnimatedConnectionComponent);
