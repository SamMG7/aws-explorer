import type { ServiceId, ServiceInfo } from '../../types/service';

export type CatalogEntry = Omit<ServiceInfo, 'id'>;

/**
 * Declara fichas del catálogo sin repetir el id. TypeScript exige que cada
 * clave sea un `ServiceId` válido; `services.ts` exige que no falte ninguno.
 */
export function defineServices<K extends ServiceId>(entries: Record<K, CatalogEntry>): Record<K, ServiceInfo> {
  const out = {} as Record<K, ServiceInfo>;
  for (const id of Object.keys(entries) as K[]) out[id] = { id, ...entries[id] };
  return out;
}
