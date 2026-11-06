# AWS Explorer · MVP 0.1

Plataforma educativa interactiva para aprender Amazon Web Services observando arquitecturas en movimiento. Cada simulación muestra un diagrama, anima el flujo de información paso a paso y explica **qué ocurre, por qué, qué servicio interviene y qué pasaría si fallara**.

- Idioma: español · Público inicial: AWS Certified Cloud Practitioner (CLF-C02)
- 100 % estática: sin backend, sin base de datos, sin cuenta de AWS ni credenciales
- Stack: React 19 · TypeScript (estricto) · Vite · Tailwind CSS 4 · React Flow (`@xyflow/react`) · Lucide · Vitest

## Escenarios incluidos

| # | Escenario | Servicios | Pasos |
|---|-----------|-----------|-------|
| 1 | Aplicación web en AWS | Route 53, CloudFront, ALB, EC2, RDS | 10 |
| 2 | Amazon S3 y procesamiento de archivos | S3, IAM, Lambda, CloudWatch | 8 |
| 3 | Amazon VPC y redes privadas | VPC, subredes, Internet Gateway, ALB, EC2, RDS, security groups | 8 |
| 4 | AWS IAM: evaluación de permisos | Rol, política, evaluación, S3, CloudTrail (Allow, Deny explícito, denegación implícita) | 9 |
| 5 | EC2 Auto Scaling | EC2, Auto Scaling, ELB, CloudWatch (scale out y scale in) | 9 |
| 6 | Monitoreo y auditoría | CloudWatch, CloudTrail, AWS Config, GuardDuty (flujos paralelos) | 9 |

Además hay un **glosario de servicios** (pestaña “Servicios”) con 27 fichas: definición, función principal, casos de uso, servicios relacionados, confusiones frecuentes y consideraciones.

## Requisitos

- Node.js 20 o superior (probado con Node 24.18 y npm 11)

## Instalación y desarrollo

```bash
npm install
```

```bash
npm run dev
```

Abre la URL que muestra Vite (por defecto http://localhost:5173).

## Pruebas y verificación

```bash
npm test
```

```bash
npm run typecheck
```

La suite (Vitest + Testing Library, 57 pruebas) cubre: cambio de escenario, avance y retroceso, pausa y reanudación, reinicio, finalización, cambio de velocidad, cancelación de temporizadores, integridad de los datos de los seis escenarios, construcción del diagrama e integración de la interfaz (catálogo, controles, atajos, buscador, glosario).

## Build de producción

```bash
npm run build
```

Genera `dist/` (verifica tipos y luego compila). Para revisarlo localmente:

```bash
npm run preview
```

## Despliegue en Vercel

El proyecto incluye `vercel.json` (framework Vite, comando `npm run build`, salida `dist`).

1. Sube la carpeta a un repositorio de GitHub, GitLab o Bitbucket.
2. En Vercel: **Add New → Project**, importa el repositorio y acepta la configuración detectada.
3. No se necesitan variables de entorno.

O con la CLI de Vercel:

```bash
npx vercel --prod
```

La navegación usa rutas con hash (`#/escenario/<id>`, `#/servicios`), así que los enlaces compartidos funcionan en cualquier hosting estático.

## Uso

- Elige un escenario en el catálogo (buscador y filtros por categoría).
- **Reproducir / Pausar** (Espacio), **paso anterior / siguiente** (← →), **reiniciar** (R), velocidad 0.5x–2x.
- Haz clic en un segmento de la línea de tiempo para saltar a un paso.
- Haz clic en un nodo para ver la ficha del servicio; “Seguir al paso actual” vuelve a la ficha del paso.
- Zoom y desplazamiento con la rueda, arrastrando el lienzo o con los controles del diagrama.

---

## Arquitectura

```
src/
├── types/            Modelo de datos (Scenario, ScenarioStep, ServiceInfo, SERVICE_IDS)
├── engine/           Motor de simulación (independiente de React y de los escenarios)
│   ├── simulationEngine.ts   Máquina de estados + único temporizador
│   ├── useSimulation.ts      Puente con React (useSyncExternalStore)
│   └── stepView.ts           Normaliza conexiones activas y visibilidad por paso
├── data/
│   ├── services.ts           Fichas educativas (Record<ServiceId, ServiceInfo>)
│   ├── categories.ts
│   ├── validateScenario.ts   Integridad referencial de un escenario
│   └── scenarios/            Un archivo por escenario + registro y búsqueda (index.ts)
├── components/
│   ├── layout/       AppShell, Header
│   ├── catalog/      ScenarioSidebar, ScenarioCard, SearchInput, EmptyState, DifficultyBadge
│   ├── viewer/       ScenarioViewer, PlaybackControls, StepTimeline
│   ├── canvas/       ArchitectureCanvas, AWSServiceNode, GroupNode, AnimatedConnection,
│   │                 buildFlowElements (escenario + paso → nodos/conexiones de React Flow)
│   ├── panels/       ExplanationPanel, ServiceInfoPanel, ServiceDetails
│   ├── glossary/     ServiceGlossary
│   └── icons/        Iconos y colores por servicio/categoría
├── hooks/            useTheme, useHashRoute, usePlaybackShortcuts, usePrefersReducedMotion
└── lib/preferences.ts  localStorage tolerante a fallos (tema y velocidad)
```

### Motor de simulación

`SimulationEngine` es una clase sin dependencias de React ni del contenido. Solo necesita el `id` del escenario y la duración de cada paso.

- **Estados:** `idle` → `playing` ⇄ `paused` → `finished`.
- **Un único temporizador:** es el único lugar de la aplicación que llama a `setTimeout`. Cada transición cancela el temporizador previo antes de programar otro, así que nunca hay más de uno pendiente (lo verifican las pruebas).
- **Pausa precisa:** al pausar guarda el tiempo restante del paso y lo reanuda desde ahí.
- **Velocidad:** cambiarla conserva el progreso proporcional del paso en curso, reproduciendo o en pausa.
- **Cambio de escenario:** `load()` cancela la reproducción y vuelve a `idle`. `useSimulation` lo llama en un `useLayoutEffect`, y mientras tanto entrega un estado inicial coherente para el escenario nuevo, de modo que nunca se pinta un paso del escenario anterior.
- **Reloj inyectable:** las pruebas usan un `FakeClock` determinista.

React se suscribe con `useSyncExternalStore`. Todo lo visual (nodos activos, conexiones animadas, estados, nodos dinámicos) se **deriva** del paso actual en una función pura (`buildFlowElements`), sin temporizadores en los componentes.

### Modelo de datos

Un escenario es un objeto TypeScript (`src/types/scenario.ts`):

- Metadatos: `id`, `title`, `summary`, `description`, `category`, `difficulty`, `certifications`, `estimatedMinutes`, `objectives`, `simplifications`.
- `nodes`: servicios o grupos (región, VPC, subred, grupo de Auto Scaling) con posición **absoluta**; el canvas calcula la posición relativa cuando hay `parentId`. `badges` para reglas de security group o rutas; `dynamic` para nodos que aparecen solo en ciertos pasos.
- `edges`: conexiones con lado de salida y entrada, etiqueta y `hiddenUnlessActive` (p. ej. un intento bloqueado).
- `steps`: `title`, `what`, `why`, `serviceId`, `failure`, `concepts`, `activeNodes`, `activeEdges` (con dirección inversa y tono opcionales), `durationMs`, `tone` (`info`/`ok`/`warn`/`deny`), `nodeStatus`, `showNodes`, `snippet` (JSON de políticas o eventos) y `simplification`.

### Agregar un escenario

1. Crea `src/data/scenarios/mi-escenario.ts` exportando un `Scenario`.
2. Agrégalo al arreglo `SCENARIOS` de `src/data/scenarios/index.ts`.
3. Si usa un servicio nuevo, añade su id a `SERVICE_IDS` (`src/types/service.ts`); TypeScript exigirá su ficha en `services.ts` y su icono en `serviceVisuals.ts`.
4. Ejecuta `npm test`: la prueba de integridad detecta nodos, conexiones o servicios inexistentes, textos faltantes y padres mal declarados. En desarrollo, los problemas también aparecen en la consola.

No hay que tocar el motor ni los componentes.

### Accesibilidad

- Todos los controles son botones nativos con etiqueta accesible y foco visible; los nodos del diagrama también son botones.
- Atajos de teclado que no interfieren con la escritura ni con la activación nativa de botones.
- Panel del paso con `aria-live`; línea de tiempo con `aria-current`.
- `prefers-reduced-motion`: se desactivan las animaciones de paquetes y pulsos y solo queda el resaltado.
- Tokens de color definidos para tema oscuro (predeterminado) y claro.

## Precisión técnica y simplificaciones

El contenido usa la terminología oficial de AWS. Cada escenario declara sus **simplificaciones educativas** (visibles en “Objetivos de aprendizaje y simplificaciones”) y los pasos que simplifican algo lo indican en un recuadro aparte. Las animaciones representan el **flujo lógico** de la información; no reproducen paquetes reales de AWS.

## Limitaciones conocidas

- Contenido revisado con base en documentación pública de AWS, pero **sin revisión externa** por un instructor certificado; los servicios evolucionan y conviene revisarlo periódicamente.
- Diagramas con posiciones fijas definidas a mano; no hay disposición automática.
- En pantallas muy pequeñas el diagrama se ve reducido (se puede hacer zoom); el texto de los nodos no se adapta al zoom.
- El paquete JavaScript pesa ~545 KB (~170 KB gzip) por React Flow; no hay división de código.
- Sin traducción a otros idiomas (todo el contenido está en español dentro de los datos).
- Solo se recuerdan tema y velocidad (localStorage); no hay progreso académico ni cuenta de usuario (fuera del alcance del MVP).
- Los nodos del diagrama no se pueden reordenar arrastrándolos (decisión deliberada para mantener el encuadre de la lección).
- Se probó en Chromium (panel del navegador de escritorio); falta probar en Safari y Firefox, en especial `animateMotion` de SVG.

## Recomendaciones para la versión 0.2

1. **Revisión técnica** del contenido por una persona certificada y referencias a la documentación oficial por paso.
2. **Preguntas de repaso** al final de cada escenario (sin llegar a exámenes completos) y modo “¿qué pasaría si…?” que active la variante de falla de un paso en el diagrama.
3. **Ramas en las simulaciones** (p. ej. cache hit vs. cache miss, Multi-AZ con falla de una AZ) usando el mismo motor con pasos alternativos.
4. Nuevos escenarios para Solutions Architect: VPC peering / Transit Gateway, SQS + SNS, DynamoDB, API Gateway + Lambda, recuperación ante desastres y alta disponibilidad Multi-AZ.
5. División de código (carga diferida de React Flow y de cada escenario) y prueba de rendimiento en móviles de gama baja.
6. Pruebas end-to-end en navegador real (Playwright) y auditoría automática de accesibilidad (axe).
7. Internacionalización (separar textos de los datos estructurales) para ofrecer inglés.
8. Progreso local por escenario (pasos vistos) como antesala de un sistema de progreso con cuenta.
