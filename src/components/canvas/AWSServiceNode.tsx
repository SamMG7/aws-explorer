import { memo, type CSSProperties } from 'react';
import type { NodeProps } from '@xyflow/react';
import { getService } from '../../data/services';
import { CATEGORY_COLOR, SERVICE_ICONS, TONE_COLOR } from '../icons/serviceVisuals';
import type { ServiceFlowNode } from './flowTypes';
import { NodeHandles } from './NodeHandles';

function AWSServiceNodeComponent({ data }: NodeProps<ServiceFlowNode>) {
  const service = getService(data.serviceId);
  const Icon = SERVICE_ICONS[data.serviceId];
  const categoryColor = CATEGORY_COLOR[service.category];
  const toneColor = TONE_COLOR[data.tone];

  const style = {
    '--pulse-color': toneColor,
    borderColor: data.active ? toneColor : data.selected ? 'var(--accent)' : 'var(--line)',
    opacity: data.dimmed ? 0.45 : 1,
  } as CSSProperties;

  return (
    <div
      className={`relative w-[188px] rounded-xl border-2 bg-panel transition-[opacity,border-color] duration-300 ${data.active ? 'node-active' : ''}`}
      style={style}
      data-active={data.active || undefined}
      data-testid={`node-${data.nodeId}`}
    >
      <NodeHandles />
      <button
        type="button"
        onClick={() => data.onSelect(data.serviceId, data.nodeId)}
        className="nodrag nopan flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] p-2.5 text-left"
        aria-pressed={data.selected}
        aria-label={`${data.label}${data.sublabel ? `, ${data.sublabel}` : ''}${data.active ? ' (activo en este paso)' : ''}. Ver información del servicio.`}
      >
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `color-mix(in srgb, ${categoryColor} 18%, transparent)`, color: categoryColor }}
          aria-hidden="true"
        >
          <Icon size={20} strokeWidth={1.9} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-semibold leading-tight text-fg">{data.label}</span>
          {data.sublabel && <span className="mt-0.5 block truncate text-[11px] leading-tight text-muted">{data.sublabel}</span>}
        </span>
      </button>

      {data.badges && data.badges.length > 0 && (
        <ul className="space-y-1 border-t border-line px-2.5 py-2">
          {data.badges.map((badge) => (
            <li key={badge} className="font-mono text-[10px] leading-snug text-muted">
              {badge}
            </li>
          ))}
        </ul>
      )}

      {data.status && (
        <span
          className="animate-fade-in pointer-events-none absolute -top-3 right-2 rounded-full border px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap"
          style={{
            color: TONE_COLOR[data.status.tone],
            borderColor: TONE_COLOR[data.status.tone],
            background: 'var(--panel)',
          }}
        >
          {data.status.label}
        </span>
      )}
    </div>
  );
}

export const AWSServiceNode = memo(AWSServiceNodeComponent);
