import { useCallback, useEffect, useState } from 'react';

export type AppView = 'simulador' | 'servicios';

export interface Route {
  view: AppView;
  scenarioId: string | null;
}

/** `#/escenario/<id>` · `#/servicios` · `#/` */
export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');
  const [first, second] = path.split('/');
  if (first === 'servicios') return { view: 'servicios', scenarioId: null };
  if (first === 'escenario' && second) return { view: 'simulador', scenarioId: decodeURIComponent(second) };
  return { view: 'simulador', scenarioId: null };
}

export function routeToHash(route: Route): string {
  if (route.view === 'servicios') return '#/servicios';
  return route.scenarioId ? `#/escenario/${encodeURIComponent(route.scenarioId)}` : '#/';
}

/** Enrutado mínimo por hash: enlaces compartibles sin configuración de servidor. */
export function useHashRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    const hash = routeToHash(next);
    if (window.location.hash !== hash) window.location.hash = hash;
    setRoute(next);
  }, []);

  return [route, navigate];
}
