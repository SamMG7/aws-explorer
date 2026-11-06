import type { Scenario } from '../types/scenario';
import { SERVICES } from './services';

/**
 * Verifica la integridad referencial de un escenario.
 * Devuelve una lista de problemas legibles; una lista vacía significa que es válido.
 * Se usa en las pruebas y, en desarrollo, al cargar el catálogo.
 */
export function validateScenario(scenario: Scenario): string[] {
  const problems: string[] = [];
  const p = (msg: string) => problems.push(`[${scenario.id}] ${msg}`);

  if (!scenario.id.trim()) p('id vacío');
  if (!scenario.title.trim()) p('título vacío');
  if (scenario.objectives.length === 0) p('sin objetivos educativos');
  if (scenario.steps.length === 0) p('sin pasos');

  const nodeIds = new Set<string>();
  const nodeIndex = new Map<string, number>();
  scenario.nodes.forEach((node, index) => {
    if (nodeIds.has(node.id)) p(`nodo duplicado: ${node.id}`);
    nodeIds.add(node.id);
    nodeIndex.set(node.id, index);
    if (!(node.serviceId in SERVICES)) p(`nodo ${node.id}: servicio desconocido ${node.serviceId}`);
    if (node.kind === 'group' && !node.size) p(`grupo ${node.id} sin tamaño`);
  });

  scenario.nodes.forEach((node, index) => {
    if (!node.parentId) return;
    const parentIdx = nodeIndex.get(node.parentId);
    if (parentIdx === undefined) {
      p(`nodo ${node.id}: padre inexistente ${node.parentId}`);
      return;
    }
    const parent = scenario.nodes[parentIdx];
    if (parent && parent.kind !== 'group') p(`nodo ${node.id}: el padre ${node.parentId} no es un grupo`);
    if (parentIdx > index) p(`nodo ${node.id}: el padre ${node.parentId} debe declararse antes`);
  });

  const edgeIds = new Set<string>();
  for (const edge of scenario.edges) {
    if (edgeIds.has(edge.id)) p(`conexión duplicada: ${edge.id}`);
    edgeIds.add(edge.id);
    if (!nodeIds.has(edge.from)) p(`conexión ${edge.id}: origen inexistente ${edge.from}`);
    if (!nodeIds.has(edge.to)) p(`conexión ${edge.id}: destino inexistente ${edge.to}`);
  }

  const dynamicIds = new Set(scenario.nodes.filter((n) => n.dynamic).map((n) => n.id));
  const stepIds = new Set<string>();
  scenario.steps.forEach((step, i) => {
    const where = `paso ${i + 1} (${step.id})`;
    if (stepIds.has(step.id)) p(`${where}: id duplicado`);
    stepIds.add(step.id);
    if (!step.title.trim() || !step.what.trim() || !step.why.trim() || !step.failure.trim()) {
      p(`${where}: faltan textos educativos (título, qué, por qué o falla)`);
    }
    if (!(step.serviceId in SERVICES)) p(`${where}: servicio desconocido ${step.serviceId}`);
    if (!(step.durationMs > 0)) p(`${where}: duración inválida`);
    if (step.activeNodes.length === 0) p(`${where}: no resalta ningún nodo`);

    const visible = new Set(step.showNodes ?? []);
    for (const id of step.activeNodes) {
      if (!nodeIds.has(id)) p(`${where}: nodo activo inexistente ${id}`);
      else if (dynamicIds.has(id) && !visible.has(id)) p(`${where}: nodo dinámico ${id} activo pero oculto`);
    }
    for (const ref of step.activeEdges) {
      const id = typeof ref === 'string' ? ref : ref.id;
      if (!edgeIds.has(id)) p(`${where}: conexión activa inexistente ${id}`);
    }
    for (const id of step.showNodes ?? []) {
      if (!dynamicIds.has(id)) p(`${where}: showNodes incluye ${id}, que no es dinámico`);
    }
    for (const id of Object.keys(step.nodeStatus ?? {})) {
      if (!nodeIds.has(id)) p(`${where}: estado para nodo inexistente ${id}`);
    }
  });

  return problems;
}
