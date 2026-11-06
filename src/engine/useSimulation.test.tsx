import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSimulation } from './useSimulation';
import { FakeClock } from '../test/fakeClock';
import { SCENARIOS } from '../data/scenarios';
import type { Scenario } from '../types/scenario';

const [first, second] = SCENARIOS as [Scenario, Scenario];

describe('useSimulation', () => {
  it('expone el paso actual y avanza con el motor', () => {
    const clock = new FakeClock();
    const { result } = renderHook(() => useSimulation(first, { clock }));
    expect(result.current.step?.id).toBe(first.steps[0]!.id);

    act(() => result.current.controls.play());
    act(() => clock.advance(first.steps[0]!.durationMs));
    expect(result.current.state.stepIndex).toBe(1);
    expect(result.current.step?.id).toBe(first.steps[1]!.id);
  });

  it('al cambiar de escenario cancela la reproducción y empieza desde el inicio', () => {
    const clock = new FakeClock();
    const { result, rerender } = renderHook(({ scenario }) => useSimulation(scenario, { clock }), {
      initialProps: { scenario: first },
    });

    act(() => result.current.controls.play());
    act(() => clock.advance(first.steps[0]!.durationMs + 10));
    expect(result.current.state.stepIndex).toBe(1);

    rerender({ scenario: second });
    expect(result.current.state).toMatchObject({ scenarioId: second.id, stepIndex: 0, status: 'idle' });
    expect(result.current.step?.id).toBe(second.steps[0]!.id);
    expect(clock.pending).toBe(0);

    act(() => clock.advance(60_000));
    expect(result.current.state.stepIndex).toBe(0);
  });

  it('al desmontar no deja temporizadores pendientes', () => {
    const clock = new FakeClock();
    const { result, unmount } = renderHook(() => useSimulation(first, { clock }));
    act(() => result.current.controls.play());
    expect(clock.pending).toBe(1);
    unmount();
    expect(clock.pending).toBe(0);
  });

  it('avisa los cambios de velocidad para persistirlos', () => {
    const clock = new FakeClock();
    const speeds: number[] = [];
    const { result } = renderHook(() => useSimulation(first, { clock, onSpeedChange: (s) => speeds.push(s) }));
    act(() => result.current.controls.setSpeed(2));
    expect(speeds).toEqual([2]);
  });
});
