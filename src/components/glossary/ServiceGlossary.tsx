import { useMemo, useState } from 'react';
import type { ServiceCategory, ServiceId } from '../../types/service';
import { ALL_SERVICES, SERVICE_CATEGORY_LABELS } from '../../data/services';
import { SCENARIOS, normalizeText } from '../../data/scenarios';
import { SearchInput } from '../catalog/SearchInput';
import { EmptyState } from '../catalog/EmptyState';
import { ServiceDetails } from '../panels/ServiceDetails';
import { CATEGORY_COLOR, SERVICE_ICONS } from '../icons/serviceVisuals';

const CATEGORY_ORDER: ServiceCategory[] = [
  'concepto',
  'computo',
  'contenedores',
  'serverless',
  'almacenamiento',
  'base-de-datos',
  'redes',
  'seguridad',
  'administracion',
  'finanzas',
  'soporte',
  'analitica',
  'integracion',
  'aplicaciones',
  'ia',
  'migracion',
  'desarrollo',
  'escritorio',
  'frontend',
  'iot',
  'actor',
];

interface ServiceGlossaryProps {
  onOpenScenario: (id: string) => void;
}

/** Glosario navegable de todas las fichas de servicios y conceptos. */
export function ServiceGlossary({ onOpenScenario }: ServiceGlossaryProps) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<ServiceId>('route53');

  const filtered = useMemo(() => {
    const q = normalizeText(query.trim());
    if (!q) return ALL_SERVICES;
    return ALL_SERVICES.filter((s) => normalizeText(`${s.name} ${s.shortName} ${s.definition}`).includes(q));
  }, [query]);

  const selected = ALL_SERVICES.find((s) => s.id === selectedId) ?? ALL_SERVICES[0];
  const usedIn = SCENARIOS.filter((sc) => sc.nodes.some((n) => n.serviceId === selectedId));

  return (
    <div className="grid grid-cols-1 md:h-full md:min-h-0 md:grid-cols-[320px_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
      <div className="flex min-h-0 flex-col gap-3 border-b border-line p-3 md:border-r md:border-b-0">
        <SearchInput value={query} onChange={setQuery} label="Buscar servicios" placeholder="Buscar servicio o concepto…" />
        <div className="scroll-thin max-h-[40vh] space-y-4 overflow-y-auto md:max-h-none md:flex-1">
          {filtered.length === 0 && <EmptyState title="Ningún servicio coincide" />}
          {CATEGORY_ORDER.map((cat) => {
            const items = filtered.filter((s) => s.category === cat);
            if (items.length === 0) return null;
            return (
              <section key={cat}>
                <h2 className="mb-1.5 px-1 text-[11px] font-semibold tracking-wide uppercase" style={{ color: CATEGORY_COLOR[cat] }}>
                  {SERVICE_CATEGORY_LABELS[cat]}
                </h2>
                <ul className="space-y-0.5">
                  {items.map((s) => {
                    const Icon = SERVICE_ICONS[s.id];
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(s.id)}
                          aria-current={s.id === selectedId ? 'true' : undefined}
                          className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition ${
                            s.id === selectedId ? 'bg-accent/15 text-fg' : 'text-muted hover:bg-panel-2 hover:text-fg'
                          }`}
                        >
                          <Icon size={15} aria-hidden="true" style={{ color: CATEGORY_COLOR[s.category] }} />
                          {s.shortName}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <div className="scroll-thin min-h-0 overflow-y-auto p-4 md:p-6">
        {selected && (
          <div className="max-w-2xl space-y-6">
            <ServiceDetails service={selected} onSelectRelated={setSelectedId} headingLevel="h2" />
            {usedIn.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">Aparece en las simulaciones</h3>
                <ul className="flex flex-wrap gap-2">
                  {usedIn.map((sc) => (
                    <li key={sc.id}>
                      <button
                        type="button"
                        onClick={() => onOpenScenario(sc.id)}
                        className="cursor-pointer rounded-lg border border-line bg-panel px-3 py-1.5 text-sm text-fg transition hover:border-accent"
                      >
                        {sc.title} →
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
