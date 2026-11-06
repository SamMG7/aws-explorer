import { useEffect, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import type { Scenario, ScenarioStep } from '../types/scenario';
import {
  type Clock,
  type SimulationState,
  SimulationEngine,
  initialStateFor,
} from './simulationEngine';

export interface SimulationControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

export interface UseSimulationResult {
  state: SimulationState;
  step: ScenarioStep | undefined;
  controls: SimulationControls;
}

/**
 * Conecta un único `SimulationEngine` (de vida igual al componente) con React.
 * Al cambiar de escenario se llama a `engine.load`, que cancela la reproducción
 * anterior antes de que el navegador pinte el nuevo escenario.
 */
export function useSimulation(
  scenario: Scenario,
  options: { clock?: Clock; initialSpeed?: number; onSpeedChange?: (speed: number) => void } = {},
): UseSimulationResult {
  const engineRef = useRef<SimulationEngine | null>(null);
  if (engineRef.current === null) {
    engineRef.current = new SimulationEngine(scenario, {
      clock: options.clock,
      speed: options.initialSpeed,
    });
  }
  const engine = engineRef.current;

  const engineState = useSyncExternalStore(engine.subscribe, engine.getState, engine.getState);

  useLayoutEffect(() => {
    if (engine.getState().scenarioId !== scenario.id) {
      engine.load(scenario);
    }
  }, [engine, scenario]);

  // Detiene temporizadores al desmontar.
  useEffect(() => () => engine.dispose(), [engine]);

  const onSpeedChange = options.onSpeedChange;
  const speedRef = useRef(engineState.speed);
  useEffect(() => {
    if (speedRef.current !== engineState.speed) {
      speedRef.current = engineState.speed;
      onSpeedChange?.(engineState.speed);
    }
  }, [engineState.speed, onSpeedChange]);

  // Durante el render en que llega un escenario nuevo (antes del layout effect)
  // se expone un estado inicial coherente, nunca un índice del escenario anterior.
  const state =
    engineState.scenarioId === scenario.id
      ? engineState
      : initialStateFor(scenario, engineState.speed);

  const controls = useMemo<SimulationControls>(
    () => ({
      play: () => engine.play(),
      pause: () => engine.pause(),
      toggle: () => engine.toggle(),
      next: () => engine.next(),
      prev: () => engine.prev(),
      goTo: (index) => engine.goTo(index),
      reset: () => engine.reset(),
      setSpeed: (speed) => engine.setSpeed(speed),
    }),
    [engine],
  );

  return { state, step: scenario.steps[state.stepIndex], controls };
}
