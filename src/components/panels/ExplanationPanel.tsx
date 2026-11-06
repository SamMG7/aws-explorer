import { AlertTriangle, CircleHelp, Info, Lightbulb, Target } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ScenarioStep } from '../../types/scenario';
import type { ServiceId } from '../../types/service';
import { getService } from '../../data/services';
import { SERVICE_ICONS, TONE_COLOR, TONE_LABEL } from '../icons/serviceVisuals';

interface ExplanationPanelProps {
  step: ScenarioStep | undefined;
  stepNumber: number;
  totalSteps: number;
  onShowService: (serviceId: ServiceId) => void;
}

/** Explica el paso activo: qué ocurre, por qué, qué servicio interviene y qué pasaría si falla. */
export function ExplanationPanel({ step, stepNumber, totalSteps, onShowService }: ExplanationPanelProps) {
  if (!step) return null;
  const service = getService(step.serviceId);
  const Icon = SERVICE_ICONS[step.serviceId];
  const tone = step.tone ?? 'info';

  return (
    <section aria-labelledby="step-title" aria-live="polite" className="animate-fade-in space-y-4" key={step.id}>
      <header>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="font-mono">
            Paso {stepNumber}/{totalSteps}
          </span>
          {tone !== 'info' && (
            <span
              className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
              style={{ color: TONE_COLOR[tone], borderColor: TONE_COLOR[tone] }}
            >
              {TONE_LABEL[tone]}
            </span>
          )}
        </div>
        <h2 id="step-title" className="mt-1 text-lg leading-snug font-semibold text-fg">
          {step.title}
        </h2>
      </header>

      <Block icon={<Info size={15} />} title="¿Qué está ocurriendo?">
        {step.what}
      </Block>
      <Block icon={<Target size={15} />} title="¿Por qué ocurre?">
        {step.why}
      </Block>

      <div>
        <h3 className="mb-1.5 text-xs font-semibold tracking-wide text-muted uppercase">Servicio que interviene</h3>
        <button
          type="button"
          onClick={() => onShowService(step.serviceId)}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-line bg-panel-2 px-3 py-2 text-left text-sm transition hover:border-accent"
        >
          <Icon size={16} aria-hidden="true" className="text-cyan" />
          <span className="font-medium text-fg">{service.name}</span>
          <span className="ml-auto text-xs text-accent">Ver ficha</span>
        </button>
      </div>

      <Block icon={<AlertTriangle size={15} />} title="¿Y si no está disponible o está mal configurado?" accent="var(--warn)">
        {step.failure}
      </Block>

      {step.snippet && (
        <figure>
          <figcaption className="mb-1.5 text-xs font-semibold tracking-wide text-muted uppercase">{step.snippet.title}</figcaption>
          <pre className="scroll-thin overflow-x-auto rounded-lg border border-line bg-app p-3 font-mono text-[11.5px] leading-relaxed text-fg">
            <code>{step.snippet.content}</code>
          </pre>
        </figure>
      )}

      {step.concepts.length > 0 && (
        <div>
          <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted uppercase">
            <Lightbulb size={14} aria-hidden="true" /> Conceptos clave
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {step.concepts.map((concept) => (
              <li key={concept} className="rounded-md border border-line bg-panel-2 px-2 py-0.5 text-xs text-fg">
                {concept}
              </li>
            ))}
          </ul>
        </div>
      )}

      {step.simplification && (
        <p className="flex gap-2 rounded-lg border border-dashed border-line p-3 text-xs leading-relaxed text-muted">
          <CircleHelp size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-fg">Simplificación educativa: </strong>
            {step.simplification}
          </span>
        </p>
      )}
    </section>
  );
}

function Block({ icon, title, children, accent }: { icon: ReactNode; title: string; children: ReactNode; accent?: string }) {
  return (
    <div>
      <h3
        className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase"
        style={{ color: accent ?? 'var(--cyan)' }}
      >
        <span aria-hidden="true">{icon}</span>
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-fg">{children}</p>
    </div>
  );
}
