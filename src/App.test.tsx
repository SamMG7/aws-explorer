import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { SCENARIOS } from './data/scenarios';

function catalog() {
  // En escritorio el catálogo es el <aside> con esta etiqueta.
  return screen.getAllByRole('complementary', { name: 'Catálogo de escenarios' })[0]!;
}

describe('App (integración)', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('muestra los seis escenarios en el catálogo', () => {
    render(<App />);
    const cards = within(catalog()).getAllByRole('heading', { level: 3 });
    expect(cards.map((c) => c.textContent)).toEqual(SCENARIOS.map((s) => s.title));
  });

  it('cambia de escenario desde el catálogo y reinicia la simulación', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Reproducir \(Espacio\)/ }));
    act(() => vi.advanceTimersByTime(SCENARIOS[0]!.steps[0]!.durationMs + 50));
    expect(screen.getByRole('heading', { level: 2, name: SCENARIOS[0]!.steps[1]!.title })).toBeInTheDocument();

    fireEvent.click(within(catalog()).getByRole('button', { name: /Amazon VPC y redes privadas/ }));
    expect(screen.getByRole('heading', { level: 1, name: 'Amazon VPC y redes privadas' })).toBeInTheDocument();
    const vpc = SCENARIOS.find((s) => s.id === 'vpc-redes-privadas')!;
    expect(screen.getByRole('heading', { level: 2, name: vpc.steps[0]!.title })).toBeInTheDocument();
    expect(screen.getByText('Listo para iniciar')).toBeInTheDocument();

    // La reproducción anterior no debe seguir avanzando.
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByRole('heading', { level: 2, name: vpc.steps[0]!.title })).toBeInTheDocument();
  });

  it('los controles de paso actualizan el panel educativo', () => {
    render(<App />);
    const steps = SCENARIOS[0]!.steps;
    fireEvent.click(screen.getByRole('button', { name: /Paso siguiente/ }));
    expect(screen.getByRole('heading', { level: 2, name: steps[1]!.title })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Paso anterior/ }));
    expect(screen.getByRole('heading', { level: 2, name: steps[0]!.title })).toBeInTheDocument();
  });

  it('los atajos de teclado controlan la reproducción', () => {
    render(<App />);
    const steps = SCENARIOS[0]!.steps;
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { level: 2, name: steps[1]!.title })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'r' });
    expect(screen.getByRole('heading', { level: 2, name: steps[0]!.title })).toBeInTheDocument();
  });

  it('el buscador filtra y muestra un estado vacío', () => {
    render(<App />);
    const search = within(catalog()).getByRole('searchbox', { name: 'Buscar escenarios' });
    fireEvent.change(search, { target: { value: 'zzzz' } });
    expect(within(catalog()).getByText('Sin resultados')).toBeInTheDocument();
  });

  it('navega al glosario de servicios', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Servicios' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Amazon Route 53' })).toBeInTheDocument();
  });
});
