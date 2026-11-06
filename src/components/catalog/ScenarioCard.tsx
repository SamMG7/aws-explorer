import { Clock, ListOrdered } from 'lucide-react';
import type { Scenario } from '../../types/scenario';
import { getService } from '../../data/services';
import { CATEGORY_COLOR, SERVICE_ICONS } from '../icons/serviceVisuals';
import { DifficultyBadge } from './DifficultyBadge';

interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
  selected: boolean;
  onSelect: (id: string) => void;
}

/** Servicios distintos del escenario (sin actores ni grupos genéricos), para la vista previa. */
function previewServices(scenario: Scenario) {
  const seen = new Set<string>();
  return scenario.nodes
    .map((n) => n.serviceId)
    .filter((id) => {
      const cat = getService(id).category;
      if (cat === 'actor' || cat === 'concepto' || seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .slice(0, 6);
}

export function ScenarioCard({ scenario, index, selected, onSelect }: ScenarioCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(scenario.id)}
      aria-current={selected ? 'true' : undefined}
      className={`group w-full cursor-pointer rounded-xl border p-3 text-left transition ${
        selected ? 'border-accent bg-accent/10' : 'border-line bg-panel hover:border-muted'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">{String(index + 1).padStart(2, '0')}</span>
        <DifficultyBadge difficulty={scenario.difficulty} />
      </div>
      <h3 className="mt-1 text-sm leading-snug font-semibold text-fg">{scenario.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{scenario.summary}</p>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <ul className="flex -space-x-1" aria-label="Servicios incluidos">
          {previewServices(scenario).map((id) => {
            const service = getService(id);
            const Icon = SERVICE_ICONS[id];
            const color = CATEGORY_COLOR[service.category];
            return (
              <li
                key={id}
                title={service.shortName}
                className="flex size-6 items-center justify-center rounded-md border border-panel"
                style={{ background: `color-mix(in srgb, ${color} 22%, var(--panel))`, color }}
              >
                <Icon size={13} aria-hidden="true" />
                <span className="sr-only">{service.shortName}</span>
              </li>
            );
          })}
        </ul>
        <span className="flex items-center gap-2.5 text-[11px] text-muted">
          <span className="flex items-center gap-1">
            <ListOrdered size={12} aria-hidden="true" />
            {scenario.steps.length} pasos
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />~{scenario.estimatedMinutes} min
          </span>
        </span>
      </div>
    </button>
  );
}
