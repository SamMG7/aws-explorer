import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, GraduationCap, Keyboard } from 'lucide-react';
import type { Scenario } from '../../types/scenario';
import type { ServiceId } from '../../types/service';
import type { Theme } from '../../hooks/useTheme';
import { useSimulation } from '../../engine/useSimulation';
import { usePlaybackShortcuts } from '../../hooks/usePlaybackShortcuts';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { readPreference, writePreference } from '../../lib/preferences';
import { SCENARIO_CATEGORIES } from '../../data/categories';
import { ArchitectureCanvas } from '../canvas/ArchitectureCanvas';
import { ExplanationPanel } from '../panels/ExplanationPanel';
import { ServiceInfoPanel } from '../panels/ServiceInfoPanel';
import { DifficultyBadge } from '../catalog/DifficultyBadge';
import { PlaybackControls } from './PlaybackControls';
import { StepTimeline } from './StepTimeline';

function initialSpeed(): number {
  const stored = Number(readPreference('speed'));
  return Number.isFinite(stored) && stored > 0 ? stored : 1;
}

const persistSpeed = (speed: number) => writePreference('speed', String(speed));

interface ScenarioViewerProps {
  scenario: Scenario;
  theme: Theme;
}

export function ScenarioViewer({ scenario, theme }: ScenarioViewerProps) {
  const [speedAtMount] = useState(initialSpeed);
  const { state, step, controls } = useSimulation(scenario, {
    initialSpeed: speedAtMount,
    onSpeedChange: persistSpeed,
  });
  const reducedMotion = usePrefersReducedMotion();
  usePlaybackShortcuts(controls);

  // Selección manual de un nodo; se libera al cambiar de paso o de escenario.
  const [selection, setSelection] = useState<{ serviceId: ServiceId; nodeId: string | null } | null>(null);
  useEffect(() => setSelection(null), [step?.id, scenario.id]);

  const onSelectNode = useCallback((serviceId: ServiceId, nodeId: string) => {
    setSelection((current) => (current?.nodeId === nodeId ? null : { serviceId, nodeId }));
  }, []);
  const onShowService = useCallback((serviceId: ServiceId) => setSelection({ serviceId, nodeId: null }), []);

  const panelServiceId = selection?.serviceId ?? step?.serviceId ?? 'user';
  const categoryLabel = SCENARIO_CATEGORIES.find((c) => c.id === scenario.category)?.label;

  return (
    <div className="grid grid-cols-1 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[minmax(0,1fr)]">
      {/* Columna central */}
      <div className="flex min-w-0 flex-col lg:min-h-0">
        <header className="border-b border-line px-4 py-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>{categoryLabel}</span>
            <DifficultyBadge difficulty={scenario.difficulty} />
            {scenario.certifications.map((c) => (
              <span key={c} className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px]">
                {c}
              </span>
            ))}
          </div>
          <h1 className="mt-1 text-xl font-semibold text-fg">{scenario.title}</h1>
          <p className="mt-0.5 max-w-3xl text-sm text-muted">{scenario.description}</p>
          <details className="group mt-2 max-w-3xl">
            <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 text-xs font-medium text-accent">
              <GraduationCap size={14} aria-hidden="true" /> Objetivos de aprendizaje y simplificaciones
              <ChevronDown size={14} className="transition group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="mt-2 grid gap-3 text-sm sm:grid-cols-2">
              <ul className="list-disc space-y-1 pl-5 text-fg">
                {scenario.objectives.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
              <ul className="list-disc space-y-1 pl-5 text-muted">
                {scenario.simplifications.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </details>
        </header>

        <div className="relative h-[52vh] min-h-[320px] lg:h-auto lg:flex-1">
          <ArchitectureCanvas
            scenario={scenario}
            step={step}
            selectedNodeId={selection?.nodeId ?? null}
            onSelectNode={onSelectNode}
            animate={!reducedMotion}
            speed={state.speed}
            theme={theme}
          />
          {state.status === 'idle' && (
            <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-4">
              <p className="rounded-full border border-line bg-panel/90 px-3 py-1.5 text-xs text-muted shadow-sm backdrop-blur">
                Pulsa <strong className="text-fg">Reproducir</strong> o avanza paso a paso. Haz clic en un servicio para ver su ficha.
              </p>
            </div>
          )}
        </div>

        <footer className="space-y-1 border-t border-line bg-panel px-4 pt-1 pb-3">
          <StepTimeline steps={scenario.steps} state={state} onSelect={controls.goTo} />
          <PlaybackControls state={state} controls={controls} />
          <p className="hidden items-center gap-1.5 text-[11px] text-muted md:flex">
            <Keyboard size={13} aria-hidden="true" /> Atajos: Espacio reproducir/pausar · ← → pasos · R reiniciar
          </p>
        </footer>
      </div>

      {/* Panel de información */}
      <aside
        className="scroll-thin space-y-6 border-t lg:min-h-0 lg:overflow-y-auto border-line bg-panel p-4 lg:border-t-0 lg:border-l"
        aria-label="Panel educativo"
      >
        <ExplanationPanel
          step={step}
          stepNumber={state.stepIndex + 1}
          totalSteps={state.totalSteps}
          onShowService={onShowService}
        />
        <hr className="border-line" />
        <ServiceInfoPanel
          serviceId={panelServiceId}
          pinned={selection !== null}
          onSelect={onShowService}
          onFollowStep={() => setSelection(null)}
        />
      </aside>
    </div>
  );
}
