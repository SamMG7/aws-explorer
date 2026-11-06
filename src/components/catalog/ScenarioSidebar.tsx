import { useMemo, useState } from 'react';
import type { Scenario, ScenarioCategoryId } from '../../types/scenario';
import { SCENARIO_CATEGORIES } from '../../data/categories';
import { filterScenarios } from '../../data/scenarios';
import { SearchInput } from './SearchInput';
import { ScenarioCard } from './ScenarioCard';
import { EmptyState } from './EmptyState';

interface ScenarioSidebarProps {
  scenarios: Scenario[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ScenarioSidebar({ scenarios, selectedId, onSelect }: ScenarioSidebarProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ScenarioCategoryId | 'todas'>('todas');

  const filtered = useMemo(() => filterScenarios(scenarios, query, category), [scenarios, query, category]);
  const usedCategories = SCENARIO_CATEGORIES.filter((c) => scenarios.some((s) => s.category === c.id));

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <SearchInput value={query} onChange={setQuery} label="Buscar escenarios" placeholder="Buscar escenario o servicio…" />

      <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-1.5">
        <CategoryChip label="Todas" active={category === 'todas'} onClick={() => setCategory('todas')} />
        {usedCategories.map((c) => (
          <CategoryChip key={c.id} label={c.label} active={category === c.id} onClick={() => setCategory(c.id)} />
        ))}
      </div>

      <p className="text-xs text-muted" aria-live="polite">
        {filtered.length} de {scenarios.length} simulaciones
      </p>

      <ul className="scroll-thin -mr-1 flex-1 space-y-2 overflow-y-auto pr-1">
        {filtered.map((scenario) => (
          <li key={scenario.id}>
            <ScenarioCard
              scenario={scenario}
              index={scenarios.indexOf(scenario)}
              selected={scenario.id === selectedId}
              onSelect={onSelect}
            />
          </li>
        ))}
        {filtered.length === 0 && (
          <li>
            <EmptyState
              title="Sin resultados"
              description="Prueba con otro término, por ejemplo “S3”, “IAM” o “redes”."
              action={
                <button
                  type="button"
                  className="cursor-pointer text-xs text-accent hover:underline"
                  onClick={() => {
                    setQuery('');
                    setCategory('todas');
                  }}
                >
                  Limpiar filtros
                </button>
              }
            />
          </li>
        )}
      </ul>
    </div>
  );
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] transition ${
        active ? 'border-accent bg-accent/15 text-fg' : 'border-line text-muted hover:text-fg'
      }`}
    >
      {label}
    </button>
  );
}
