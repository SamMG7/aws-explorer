import { getService } from '../../data/services';
import type { ServiceId } from '../../types/service';
import { ServiceDetails } from './ServiceDetails';

interface ServiceInfoPanelProps {
  serviceId: ServiceId;
  /** `true` si el usuario eligió el servicio (clic en nodo); `false` si sigue al paso activo. */
  pinned: boolean;
  onSelect: (id: ServiceId) => void;
  onFollowStep: () => void;
}

export function ServiceInfoPanel({ serviceId, pinned, onSelect, onFollowStep }: ServiceInfoPanelProps) {
  return (
    <section aria-labelledby="service-panel-title" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 id="service-panel-title" className="text-xs font-semibold tracking-wide text-muted uppercase">
          {pinned ? 'Servicio seleccionado' : 'Servicio del paso actual'}
        </h2>
        {pinned && (
          <button type="button" onClick={onFollowStep} className="cursor-pointer text-xs text-accent hover:underline">
            Seguir al paso actual
          </button>
        )}
      </div>
      <ServiceDetails service={getService(serviceId)} onSelectRelated={onSelect} />
    </section>
  );
}
