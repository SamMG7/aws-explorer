import { useCallback, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { SCENARIOS, getScenario } from './data/scenarios';
import { useTheme } from './hooks/useTheme';
import { useHashRoute } from './hooks/useHashRoute';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/layout/Header';
import { ScenarioSidebar } from './components/catalog/ScenarioSidebar';
import { ScenarioViewer } from './components/viewer/ScenarioViewer';
import { ServiceGlossary } from './components/glossary/ServiceGlossary';
import { EmptyState } from './components/catalog/EmptyState';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [route, navigate] = useHashRoute();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fallback = SCENARIOS[0];
  const scenario = (route.scenarioId ? getScenario(route.scenarioId) : undefined) ?? fallback;
  const unknownScenario = route.scenarioId !== null && getScenario(route.scenarioId) === undefined;

  const selectScenario = useCallback(
    (id: string) => {
      navigate({ view: 'simulador', scenarioId: id });
      setDrawerOpen(false);
    },
    [navigate],
  );
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const isSimulator = route.view === 'simulador';

  return (
    <AppShell
      header={
        <Header
          view={route.view}
          onNavigate={(view) => navigate({ view, scenarioId: view === 'simulador' ? (scenario?.id ?? null) : null })}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenCatalog={isSimulator ? () => setDrawerOpen(true) : undefined}
        />
      }
      sidebar={
        isSimulator && scenario ? (
          <ScenarioSidebar scenarios={SCENARIOS} selectedId={scenario.id} onSelect={selectScenario} />
        ) : undefined
      }
      sidebarOpen={drawerOpen}
      onCloseSidebar={closeDrawer}
    >
      {isSimulator ? (
        scenario ? (
          <>
            {unknownScenario && (
              <p role="alert" className="border-b border-line bg-warn/10 px-4 py-2 text-xs text-fg">
                No existe el escenario “{route.scenarioId}”. Se muestra “{scenario.title}”.
              </p>
            )}
            <ReactFlowProvider>
              <ScenarioViewer scenario={scenario} theme={theme} />
            </ReactFlowProvider>
          </>
        ) : (
          <div className="p-6">
            <EmptyState title="No hay escenarios disponibles" />
          </div>
        )
      ) : (
        <ServiceGlossary onOpenScenario={selectScenario} />
      )}
    </AppShell>
  );
}
