import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ServiceId, ServiceInfo } from '../../types/service';
import { SERVICE_CATEGORY_LABELS, getService } from '../../data/services';
import { CATEGORY_COLOR, SERVICE_ICONS } from '../icons/serviceVisuals';

interface ServiceDetailsProps {
  service: ServiceInfo;
  onSelectRelated?: (id: ServiceId) => void;
  headingLevel?: 'h2' | 'h3';
}

/** Ficha educativa reutilizable (panel lateral y glosario). */
export function ServiceDetails({ service, onSelectRelated, headingLevel = 'h3' }: ServiceDetailsProps) {
  const Icon = SERVICE_ICONS[service.id];
  const color = CATEGORY_COLOR[service.category];
  const Heading = headingLevel;

  return (
    <article className="space-y-3.5">
      <header className="flex items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
          aria-hidden="true"
        >
          <Icon size={21} />
        </span>
        <div className="min-w-0">
          <Heading className="text-base leading-snug font-semibold text-fg">{service.name}</Heading>
          <p className="text-xs" style={{ color }}>
            {SERVICE_CATEGORY_LABELS[service.category]}
          </p>
        </div>
      </header>

      <p className="text-sm leading-relaxed text-fg">{service.definition}</p>

      <Section title="Función principal">
        <p>{service.mainFunction}</p>
      </Section>

      <List title="Casos de uso" items={service.useCases} />
      <List title="Confusiones frecuentes y diferencias" items={service.confusions} marker="≠" />
      <List title="Consideraciones importantes" items={service.considerations} marker="!" />

      {service.related.length > 0 && (
        <Section title="Servicios relacionados">
          <ul className="flex flex-wrap gap-1.5">
            {service.related.map((id) => {
              const related = getService(id);
              return (
                <li key={id}>
                  {onSelectRelated ? (
                    <button
                      type="button"
                      onClick={() => onSelectRelated(id)}
                      className="cursor-pointer rounded-md border border-line bg-panel-2 px-2 py-0.5 text-xs text-fg transition hover:border-accent"
                    >
                      {related.shortName}
                    </button>
                  ) : (
                    <span className="rounded-md border border-line bg-panel-2 px-2 py-0.5 text-xs text-fg">{related.shortName}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {service.docsUrl && (
        <a
          href={service.docsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
        >
          Página oficial del servicio <ExternalLink size={12} aria-hidden="true" />
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </a>
      )}
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="text-sm leading-relaxed text-fg">
      <h4 className="mb-1 text-xs font-semibold tracking-wide text-muted uppercase">{title}</h4>
      {children}
    </div>
  );
}

function List({ title, items, marker = '•' }: { title: string; items: string[]; marker?: string }) {
  if (items.length === 0) return null;
  return (
    <Section title={title}>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="w-3 shrink-0 text-center font-mono text-muted" aria-hidden="true">
              {marker}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

