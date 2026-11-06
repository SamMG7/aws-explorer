import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import { SERVICE_ICONS, TONE_COLOR } from '../icons/serviceVisuals';
import type { GroupVariant } from '../../types/scenario';
import type { GroupFlowNode } from './flowTypes';
import { NodeHandles } from './NodeHandles';

const VARIANT_STYLE: Record<GroupVariant, { color: string; dashed: boolean }> = {
  region: { color: 'var(--muted)', dashed: true },
  vpc: { color: 'var(--cat-redes)', dashed: false },
  'subnet-public': { color: 'var(--ok)', dashed: true },
  'subnet-private': { color: 'var(--accent)', dashed: true },
  asg: { color: 'var(--orange)', dashed: true },
};

/** Contenedor visual (región, VPC, subred, grupo de Auto Scaling). */
function GroupNodeComponent({ data, width, height }: NodeProps<GroupFlowNode>) {
  const variant = VARIANT_STYLE[data.variant];
  const Icon = SERVICE_ICONS[data.serviceId];
  const borderColor = data.active ? TONE_COLOR[data.tone] : variant.color;

  return (
    <div
      className="relative rounded-2xl border-2 transition-colors duration-300"
      style={{
        width,
        height,
        borderColor,
        borderStyle: variant.dashed ? 'dashed' : 'solid',
        background: `color-mix(in srgb, ${variant.color} ${data.active ? 9 : 5}%, transparent)`,
        opacity: data.dimmed ? 0.6 : 1,
      }}
      data-testid={`node-${data.nodeId}`}
    >
      <NodeHandles />
      <button
        type="button"
        onClick={() => data.onSelect(data.serviceId, data.nodeId)}
        className="nodrag nopan absolute top-2 left-2.5 flex max-w-[calc(100%-20px)] cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-left"
        aria-pressed={data.selected}
        aria-label={`${data.label}${data.sublabel ? `, ${data.sublabel}` : ''}. Ver información.`}
        style={{ color: variant.color }}
      >
        <Icon size={14} aria-hidden="true" />
        <span className="truncate text-[12px] font-semibold">{data.label}</span>
        {data.sublabel && <span className="truncate font-mono text-[11px] text-muted">{data.sublabel}</span>}
      </button>

      {data.badges && data.badges.length > 0 && (
        <ul className="absolute bottom-2 left-3 space-y-0.5">
          {data.badges.map((badge) => (
            <li key={badge} className="font-mono text-[10px] text-muted">
              {badge}
            </li>
          ))}
        </ul>
      )}

      {data.status && (
        <span
          className="animate-fade-in absolute right-3 bottom-2 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
          style={{ color: TONE_COLOR[data.status.tone], borderColor: TONE_COLOR[data.status.tone], background: 'var(--panel)' }}
        >
          {data.status.label}
        </span>
      )}
    </div>
  );
}

export const GroupNode = memo(GroupNodeComponent);
