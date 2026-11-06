import type { ServiceCategory, ServiceId, ServiceInfo } from '../types/service';

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  actor: 'Actor',
  redes: 'Redes y entrega de contenido',
  computo: 'Cómputo',
  almacenamiento: 'Almacenamiento',
  'base-de-datos': 'Bases de datos',
  seguridad: 'Seguridad, identidad y cumplimiento',
  administracion: 'Administración y gobierno',
  concepto: 'Concepto',
};

/**
 * Fichas educativas. El tipo `Record<ServiceId, ServiceInfo>` obliga a que
 * exista una ficha por cada id declarado en `SERVICE_IDS`.
 */
export const SERVICES: Record<ServiceId, ServiceInfo> = {
  // ------------------------------------------------------------- actores
  user: {
    id: 'user',
    name: 'Usuario / cliente',
    shortName: 'Usuario',
    category: 'actor',
    definition:
      'Persona o aplicación cliente (navegador, app móvil, script) que inicia una solicitud hacia la arquitectura.',
    mainFunction: 'Origen de las solicitudes que la arquitectura debe atender.',
    useCases: ['Navegar a un sitio web', 'Llamar a una API', 'Subir un archivo'],
    related: ['route53', 'cloudfront', 's3'],
    confusions: [
      'Un “usuario” de la aplicación no es necesariamente un usuario de IAM: la mayoría de los usuarios finales nunca tienen credenciales de AWS.',
    ],
    considerations: [
      'La experiencia del usuario depende de la latencia de toda la cadena: DNS, red, procesamiento y base de datos.',
    ],
  },
  admin: {
    id: 'admin',
    name: 'Administrador de la cuenta',
    shortName: 'Administrador',
    category: 'actor',
    definition:
      'Persona o proceso automatizado con permisos para cambiar recursos mediante la consola, la AWS CLI, los SDK o herramientas de infraestructura como código.',
    mainFunction: 'Realiza llamadas a las API de AWS que crean, modifican o eliminan recursos.',
    useCases: ['Modificar un security group', 'Crear un bucket', 'Cambiar una política IAM'],
    related: ['iam', 'cloudtrail', 'config'],
    confusions: [
      'Toda acción en la consola de AWS termina siendo una llamada a la API; por eso CloudTrail puede registrarla.',
    ],
    considerations: [
      'Aplica el principio de privilegio mínimo y evita usar el usuario raíz para tareas diarias.',
    ],
  },
  internet: {
    id: 'internet',
    name: 'Internet',
    shortName: 'Internet',
    category: 'actor',
    definition: 'Red pública desde donde llegan clientes legítimos y también tráfico malicioso.',
    mainFunction: 'Representa cualquier origen externo a la VPC.',
    useCases: ['Clientes de una aplicación pública', 'Escaneos y ataques automatizados'],
    related: ['igw', 'security-group', 'guardduty'],
    confusions: [
      'Que un recurso esté en una VPC no lo hace accesible desde internet: se necesitan IP pública, ruta al Internet Gateway y reglas que lo permitan.',
    ],
    considerations: ['Asume que cualquier puerto expuesto a 0.0.0.0/0 será escaneado.'],
  },
  'ops-team': {
    id: 'ops-team',
    name: 'Equipo de operaciones y seguridad',
    shortName: 'Equipo Ops/Sec',
    category: 'actor',
    definition: 'Personas responsables de la disponibilidad, el cumplimiento y la seguridad del entorno.',
    mainFunction: 'Recibe alarmas y hallazgos, investiga y corrige.',
    useCases: ['Atender una alarma de CPU', 'Investigar un hallazgo de GuardDuty', 'Revisar incumplimientos de Config'],
    related: ['cloudwatch', 'cloudtrail', 'guardduty', 'config'],
    confusions: [
      'Detectar no es corregir: estos servicios informan, y la corrección la hace una persona o una automatización configurada explícitamente.',
    ],
    considerations: ['Las notificaciones suelen enviarse con Amazon SNS o reglas de Amazon EventBridge.'],
  },
  'aws-resources': {
    id: 'aws-resources',
    name: 'Recursos de la cuenta',
    shortName: 'Recursos',
    category: 'concepto',
    definition: 'Conjunto de recursos desplegados en la cuenta: instancias EC2, security groups, buckets S3, etc.',
    mainFunction: 'Son el objeto del monitoreo, la auditoría y la detección de amenazas.',
    useCases: ['Instancias que generan métricas', 'Recursos cuya configuración cambia'],
    related: ['ec2', 's3', 'security-group'],
    confusions: [],
    considerations: ['Etiquetar recursos (tags) facilita filtrar métricas, costos y reglas de cumplimiento.'],
  },
  'aws-region': {
    id: 'aws-region',
    name: 'Región de AWS',
    shortName: 'Región',
    category: 'concepto',
    definition:
      'Ubicación geográfica que agrupa varias zonas de disponibilidad (AZ) aisladas entre sí y conectadas con baja latencia.',
    mainFunction: 'Delimita dónde se ejecutan y almacenan la mayoría de los recursos.',
    useCases: ['Cumplir requisitos de residencia de datos', 'Acercar la aplicación a los usuarios'],
    related: ['vpc', 'cloudfront', 'route53'],
    confusions: [
      'Route 53, CloudFront e IAM son servicios globales; EC2, RDS o una VPC existen dentro de una región concreta.',
      'Una región no es una zona de disponibilidad: cada región tiene varias AZ.',
    ],
    considerations: ['Los precios y la disponibilidad de servicios varían entre regiones.'],
  },

  // --------------------------------------------------------------- redes
  route53: {
    id: 'route53',
    name: 'Amazon Route 53',
    shortName: 'Route 53',
    category: 'redes',
    definition: 'Servicio de DNS administrado, escalable y de alta disponibilidad. También registra dominios y hace comprobaciones de estado.',
    mainFunction: 'Responder consultas DNS de forma autoritativa para tus dominios mediante zonas alojadas (hosted zones).',
    useCases: [
      'Apuntar www.ejemplo.com a una distribución de CloudFront o a un balanceador con un registro alias',
      'Enrutar por latencia, geolocalización o conmutación por error (failover)',
      'Registrar dominios',
    ],
    related: ['cloudfront', 'alb', 's3'],
    confusions: [
      'Route 53 no transporta el tráfico de la aplicación: solo responde a qué dirección debe conectarse el cliente.',
      'Un registro alias es una extensión de Route 53 que apunta a recursos de AWS; a diferencia de un CNAME, puede usarse en el ápice de la zona (ejemplo.com).',
    ],
    considerations: [
      'Las respuestas DNS se almacenan en caché según el TTL, por lo que los cambios no son instantáneos para todos los clientes.',
    ],
    docsUrl: 'https://aws.amazon.com/route53/',
  },
  cloudfront: {
    id: 'cloudfront',
    name: 'Amazon CloudFront',
    shortName: 'CloudFront',
    category: 'redes',
    definition: 'Red de entrega de contenido (CDN) que sirve contenido desde ubicaciones de borde (edge locations) cercanas al usuario.',
    mainFunction: 'Reducir latencia y carga sobre el origen almacenando en caché respuestas y manteniendo conexiones optimizadas hacia el origen.',
    useCases: [
      'Acelerar sitios web y APIs',
      'Servir archivos estáticos desde S3',
      'Terminar HTTPS en el borde e integrar AWS WAF y AWS Shield',
    ],
    related: ['s3', 'alb', 'route53'],
    confusions: [
      'CloudFront no es un balanceador de carga: no reparte tráfico entre instancias, lo envía al origen configurado.',
      'Diferencia con AWS Global Accelerator: Global Accelerator optimiza la red para TCP/UDP con IP estáticas y no almacena contenido en caché.',
    ],
    considerations: [
      'Qué se cachea y por cuánto tiempo depende de las políticas de caché y de cabeceras como Cache-Control.',
      'El contenido dinámico o personalizado normalmente se reenvía al origen (cache miss).',
    ],
    docsUrl: 'https://aws.amazon.com/cloudfront/',
  },
  alb: {
    id: 'alb',
    name: 'Application Load Balancer (Elastic Load Balancing)',
    shortName: 'ALB',
    category: 'redes',
    definition: 'Balanceador de carga de capa 7 (HTTP/HTTPS) de Elastic Load Balancing.',
    mainFunction: 'Recibir solicitudes en listeners y distribuirlas entre destinos sanos de un grupo de destino (target group), según reglas.',
    useCases: [
      'Repartir tráfico entre instancias EC2 en varias AZ',
      'Enrutar por ruta (/api) o por host (api.ejemplo.com)',
      'Integrarse con EC2 Auto Scaling para registrar instancias nuevas',
    ],
    related: ['ec2', 'autoscaling', 'cloudfront', 'security-group'],
    confusions: [
      'Network Load Balancer trabaja en capa 4 (TCP/UDP/TLS) y ofrece IP estáticas; ALB entiende HTTP (rutas, cabeceras, host).',
      'Un balanceador no escala la cantidad de instancias: eso lo hace EC2 Auto Scaling.',
    ],
    considerations: [
      'Un ALB requiere subredes en al menos dos zonas de disponibilidad.',
      'Las comprobaciones de estado (health checks) determinan qué destinos reciben tráfico.',
    ],
    docsUrl: 'https://aws.amazon.com/elasticloadbalancing/',
  },
  vpc: {
    id: 'vpc',
    name: 'Amazon Virtual Private Cloud (VPC)',
    shortName: 'VPC',
    category: 'redes',
    definition: 'Red virtual lógicamente aislada dentro de una región, con un rango de direcciones IP (CIDR) que tú defines.',
    mainFunction: 'Controlar el direccionamiento, las subredes, el enrutamiento y la seguridad de red de tus recursos.',
    useCases: ['Separar capas públicas y privadas', 'Conectar con redes locales vía VPN o Direct Connect'],
    related: ['subnet-public', 'subnet-private', 'igw', 'security-group'],
    confusions: [
      'Una VPC abarca todas las AZ de su región; una subred vive en una sola AZ.',
      'La VPC por sí sola no da acceso a internet: hace falta un Internet Gateway y rutas.',
    ],
    considerations: ['Planifica el CIDR para evitar solapamientos si luego conectarás otras redes.'],
    docsUrl: 'https://aws.amazon.com/vpc/',
  },
  'subnet-public': {
    id: 'subnet-public',
    name: 'Subred pública',
    shortName: 'Subred pública',
    category: 'redes',
    definition: 'Subred cuya tabla de rutas tiene una ruta hacia un Internet Gateway (por ejemplo 0.0.0.0/0 → igw).',
    mainFunction: 'Alojar recursos que deben ser alcanzables desde internet, como balanceadores públicos.',
    useCases: ['Application Load Balancer público', 'NAT gateway', 'Bastion host (si se usa)'],
    related: ['igw', 'vpc', 'subnet-private'],
    confusions: [
      'Lo que hace “pública” a una subred es su tabla de rutas, no su nombre.',
      'Un recurso en subred pública además necesita IP pública (o ser un servicio como ALB con IP públicas) para recibir tráfico de internet.',
    ],
    considerations: ['Coloca en subredes públicas solo lo indispensable.'],
  },
  'subnet-private': {
    id: 'subnet-private',
    name: 'Subred privada',
    shortName: 'Subred privada',
    category: 'redes',
    definition: 'Subred sin ruta directa hacia un Internet Gateway.',
    mainFunction: 'Alojar servidores de aplicación y bases de datos que no deben ser alcanzables directamente desde internet.',
    useCases: ['Instancias de aplicación', 'Bases de datos RDS', 'Funciones Lambda conectadas a la VPC'],
    related: ['subnet-public', 'vpc', 'security-group'],
    confusions: [
      'Para que una subred privada salga a internet (actualizaciones), se usa un NAT gateway en una subred pública; el NAT no permite conexiones entrantes iniciadas desde internet.',
    ],
    considerations: ['Para acceder a servicios de AWS sin pasar por internet existen los VPC endpoints.'],
  },
  igw: {
    id: 'igw',
    name: 'Internet Gateway',
    shortName: 'Internet Gateway',
    category: 'redes',
    definition: 'Componente de la VPC, redundante y escalado horizontalmente, que permite la comunicación entre la VPC e internet.',
    mainFunction: 'Ser el destino de las rutas hacia internet y traducir direcciones para recursos con IP pública.',
    useCases: ['Dar salida y entrada a internet a subredes públicas'],
    related: ['vpc', 'subnet-public'],
    confusions: [
      'No es un firewall: no filtra tráfico. El filtrado lo hacen security groups y network ACL.',
      'Diferencia con NAT gateway: el NAT permite solo conexiones salientes desde subredes privadas.',
    ],
    considerations: ['Solo se puede adjuntar un Internet Gateway por VPC.'],
  },
  'security-group': {
    id: 'security-group',
    name: 'Security group',
    shortName: 'Security group',
    category: 'seguridad',
    definition: 'Firewall virtual con estado (stateful) asociado a interfaces de red de recursos como EC2, RDS o un ALB.',
    mainFunction: 'Permitir tráfico entrante y saliente según reglas de protocolo, puerto y origen/destino.',
    useCases: [
      'Permitir 443 desde internet solo hacia el ALB',
      'Permitir el puerto de la app solo desde el security group del ALB',
      'Permitir el puerto de la base de datos solo desde el security group de la app',
    ],
    related: ['vpc', 'ec2', 'rds', 'alb'],
    confusions: [
      'Los security groups solo tienen reglas de PERMITIR; todo lo no permitido se bloquea.',
      'Network ACL: actúan a nivel de subred, no tienen estado (stateless) y admiten reglas de permitir y denegar.',
    ],
    considerations: [
      'Al ser stateful, el tráfico de respuesta a una conexión permitida se autoriza automáticamente.',
      'Una regla puede referenciar a otro security group como origen en lugar de un rango IP.',
    ],
  },

  // -------------------------------------------------------------- cómputo
  ec2: {
    id: 'ec2',
    name: 'Amazon Elastic Compute Cloud (EC2)',
    shortName: 'EC2',
    category: 'computo',
    definition: 'Servicio de máquinas virtuales (instancias) con capacidad redimensionable.',
    mainFunction: 'Ejecutar sistemas operativos y aplicaciones con control total del servidor.',
    useCases: ['Servidores web y de aplicación', 'Cargas que requieren un SO o software específico'],
    related: ['autoscaling', 'alb', 'rds', 'security-group'],
    confusions: [
      'En EC2 tú administras el sistema operativo y los parches (modelo de responsabilidad compartida); en Lambda, AWS administra los servidores.',
    ],
    considerations: [
      'Modelos de compra: On-Demand, Savings Plans, instancias reservadas y Spot.',
      'Una instancia vive en una sola AZ; la alta disponibilidad se logra con varias instancias en varias AZ.',
    ],
    docsUrl: 'https://aws.amazon.com/ec2/',
  },
  lambda: {
    id: 'lambda',
    name: 'AWS Lambda',
    shortName: 'Lambda',
    category: 'computo',
    definition: 'Servicio de cómputo sin servidor (serverless) que ejecuta código en respuesta a eventos.',
    mainFunction: 'Ejecutar funciones bajo demanda sin aprovisionar ni administrar servidores; se cobra por solicitudes y duración.',
    useCases: ['Procesar archivos subidos a S3', 'Backends de API con API Gateway', 'Tareas programadas con EventBridge'],
    related: ['s3', 'cloudwatch', 'iam-role'],
    confusions: [
      '“Sin servidor” no significa que no haya servidores, sino que AWS los administra.',
      'Lambda tiene un tiempo máximo de ejecución de 15 minutos por invocación; procesos más largos encajan mejor en otros servicios.',
    ],
    considerations: [
      'Los permisos de la función provienen de su rol de ejecución (execution role).',
      'Quién puede invocarla se controla con su política basada en recursos.',
    ],
    docsUrl: 'https://aws.amazon.com/lambda/',
  },
  autoscaling: {
    id: 'autoscaling',
    name: 'Amazon EC2 Auto Scaling',
    shortName: 'EC2 Auto Scaling',
    category: 'computo',
    definition: 'Servicio que mantiene y ajusta automáticamente la cantidad de instancias EC2 de un grupo de Auto Scaling.',
    mainFunction: 'Aumentar (scale out) o reducir (scale in) la capacidad entre un mínimo y un máximo, y reemplazar instancias no sanas.',
    useCases: [
      'Responder a picos de demanda',
      'Mantener siempre un número mínimo de instancias sanas',
      'Escalar por horario (scheduled scaling)',
    ],
    related: ['ec2', 'alb', 'cloudwatch'],
    confusions: [
      'Escalado horizontal (más instancias) frente a vertical (instancia más grande): Auto Scaling hace escalado horizontal.',
      'Elastic Load Balancing reparte el tráfico; Auto Scaling decide cuántas instancias hay.',
    ],
    considerations: [
      'Las instancias se crean a partir de una plantilla de lanzamiento (launch template).',
      'Con target tracking defines un valor objetivo (p. ej. 50 % de CPU) y el servicio crea y administra las alarmas de CloudWatch.',
    ],
    docsUrl: 'https://aws.amazon.com/ec2/autoscaling/',
  },

  // ----------------------------------------------- almacenamiento y bases
  s3: {
    id: 's3',
    name: 'Amazon Simple Storage Service (S3)',
    shortName: 'S3',
    category: 'almacenamiento',
    definition: 'Almacenamiento de objetos con alta durabilidad, organizado en buckets.',
    mainFunction: 'Guardar y recuperar cualquier cantidad de datos como objetos (archivo + metadatos) identificados por una clave.',
    useCases: ['Archivos de usuarios', 'Sitios estáticos', 'Respaldos y data lakes'],
    related: ['iam', 'lambda', 'cloudfront'],
    confusions: [
      'S3 es almacenamiento de objetos; Amazon EBS es almacenamiento en bloque para una instancia y Amazon EFS es un sistema de archivos compartido.',
      'Los “directorios” de S3 son prefijos de la clave del objeto.',
    ],
    considerations: [
      'S3 Standard está diseñado para 99,999999999 % (11 nueves) de durabilidad.',
      'El bloqueo de acceso público (Block Public Access) está activado por defecto en buckets nuevos.',
      'Clases de almacenamiento como S3 Standard-IA o S3 Glacier reducen costos para datos poco consultados.',
    ],
    docsUrl: 'https://aws.amazon.com/s3/',
  },
  rds: {
    id: 'rds',
    name: 'Amazon Relational Database Service (RDS)',
    shortName: 'RDS',
    category: 'base-de-datos',
    definition: 'Servicio administrado de bases de datos relacionales (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server y Db2; Aurora es un motor relacionado).',
    mainFunction: 'Ejecutar una base de datos relacional delegando en AWS respaldos, parches y alta disponibilidad.',
    useCases: ['Datos transaccionales de una aplicación web', 'Sistemas que requieren SQL y relaciones'],
    related: ['ec2', 'security-group', 'subnet-private'],
    confusions: [
      'Multi-AZ es para alta disponibilidad (réplica en espera); las réplicas de lectura (read replicas) son para escalar lecturas.',
      'Amazon DynamoDB es NoSQL clave-valor; RDS es relacional.',
    ],
    considerations: [
      'No tienes acceso al sistema operativo del servidor de base de datos.',
      'Ubícala en subredes privadas y limita el acceso con security groups.',
    ],
    docsUrl: 'https://aws.amazon.com/rds/',
  },

  // ------------------------------------------------------------ seguridad
  iam: {
    id: 'iam',
    name: 'AWS Identity and Access Management (IAM)',
    shortName: 'IAM',
    category: 'seguridad',
    definition: 'Servicio global para controlar quién puede autenticarse y qué acciones puede realizar sobre qué recursos.',
    mainFunction: 'Administrar identidades (usuarios, grupos, roles) y políticas de permisos.',
    useCases: ['Dar a una aplicación permisos mínimos sobre un bucket', 'Federar usuarios corporativos', 'Exigir MFA'],
    related: ['iam-role', 'iam-policy', 'policy-evaluation', 'cloudtrail'],
    confusions: [
      'Autenticación (¿quién eres?) no es autorización (¿qué puedes hacer?).',
      'AWS IAM Identity Center es la forma recomendada de dar acceso a personas en varias cuentas; IAM define los permisos subyacentes.',
    ],
    considerations: ['IAM no tiene costo adicional.', 'Privilegio mínimo: concede solo lo necesario.'],
    docsUrl: 'https://aws.amazon.com/iam/',
  },
  'iam-role': {
    id: 'iam-role',
    name: 'Rol de IAM',
    shortName: 'Rol IAM',
    category: 'seguridad',
    definition: 'Identidad de IAM sin credenciales permanentes que puede ser asumida por usuarios, servicios o aplicaciones.',
    mainFunction: 'Entregar credenciales temporales (a través de AWS STS) con los permisos de sus políticas.',
    useCases: ['Rol de una instancia EC2 (instance profile)', 'Rol de ejecución de Lambda', 'Acceso entre cuentas'],
    related: ['iam', 'iam-policy', 'ec2', 'lambda'],
    confusions: [
      'Un rol tiene dos tipos de política: la de confianza (quién puede asumirlo) y las de permisos (qué puede hacer).',
      'Usar roles evita guardar claves de acceso de larga duración en el código.',
    ],
    considerations: ['Las credenciales temporales caducan y se renuevan automáticamente en EC2 y Lambda.'],
  },
  'iam-policy': {
    id: 'iam-policy',
    name: 'Política de IAM',
    shortName: 'Política IAM',
    category: 'seguridad',
    definition: 'Documento JSON con declaraciones (statements) que combinan Effect, Action, Resource y opcionalmente Condition.',
    mainFunction: 'Definir permisos que AWS evalúa en cada solicitud.',
    useCases: ['Permitir s3:GetObject sobre un prefijo', 'Denegar explícitamente acciones destructivas'],
    related: ['iam', 'iam-role', 'policy-evaluation'],
    confusions: [
      'Políticas basadas en identidad (adjuntas a usuarios/roles) frente a políticas basadas en recursos (como la política de un bucket).',
      'Políticas administradas por AWS, administradas por el cliente e insertadas (inline).',
    ],
    considerations: ['Usa IAM Access Analyzer para validar políticas y detectar accesos externos.'],
  },
  'policy-evaluation': {
    id: 'policy-evaluation',
    name: 'Lógica de evaluación de políticas',
    shortName: 'Evaluación',
    category: 'concepto',
    definition: 'Proceso con el que AWS decide si permite o deniega cada solicitud autenticada.',
    mainFunction: 'Combinar todas las políticas aplicables y llegar a una decisión: permitir o denegar.',
    useCases: ['Explicar por qué una acción devuelve AccessDenied'],
    related: ['iam-policy', 'iam-role', 'cloudtrail'],
    confusions: [
      'Denegación implícita: si ninguna política permite la acción, se deniega.',
      'Denegación explícita: un “Effect: Deny” aplicable gana siempre, aunque exista un Allow.',
    ],
    considerations: [
      'Además de las políticas de identidad y de recursos pueden aplicar SCP de AWS Organizations, límites de permisos (permissions boundaries) y políticas de sesión.',
    ],
  },
  guardduty: {
    id: 'guardduty',
    name: 'Amazon GuardDuty',
    shortName: 'GuardDuty',
    category: 'seguridad',
    definition: 'Servicio de detección de amenazas que analiza continuamente fuentes de datos de AWS en busca de actividad maliciosa o anómala.',
    mainFunction: 'Generar hallazgos (findings) sobre posibles amenazas: instancias comprometidas, credenciales usadas de forma anómala, reconocimiento, etc.',
    useCases: ['Detectar intentos de fuerza bruta SSH', 'Detectar comunicación con IP maliciosas conocidas', 'Detectar uso anómalo de credenciales'],
    related: ['cloudtrail', 'cloudwatch', 'config'],
    confusions: [
      'GuardDuty detecta, no bloquea: la respuesta se automatiza aparte (por ejemplo con EventBridge).',
      'Analiza flujos independientes de eventos de administración de CloudTrail, VPC Flow Logs y registros DNS sin que tengas que habilitarlos tú.',
      'Amazon Inspector busca vulnerabilidades en software; GuardDuty busca comportamiento sospechoso.',
    ],
    considerations: ['Se habilita por región y por cuenta, y no requiere agentes para sus fuentes de datos base.'],
    docsUrl: 'https://aws.amazon.com/guardduty/',
  },

  // ------------------------------------------------------- administración
  cloudwatch: {
    id: 'cloudwatch',
    name: 'Amazon CloudWatch',
    shortName: 'CloudWatch',
    category: 'administracion',
    definition: 'Servicio de monitoreo y observabilidad: métricas, registros (logs), alarmas y paneles.',
    mainFunction: 'Responder “¿cómo se está comportando mi sistema?” con datos de rendimiento y salud.',
    useCases: ['Alarma cuando la CPU supera un umbral', 'Centralizar logs de Lambda', 'Paneles operativos'],
    related: ['autoscaling', 'lambda', 'cloudtrail'],
    confusions: [
      'CloudWatch mide el comportamiento (métricas/logs); CloudTrail registra quién llamó a qué API.',
      'Una alarma puede disparar acciones (SNS, Auto Scaling, acciones de EC2), pero no “arregla” nada por sí misma.',
    ],
    considerations: [
      'EC2 envía métricas básicas cada 5 minutos; el monitoreo detallado (1 minuto) tiene costo.',
      'La memoria y el disco de EC2 requieren el agente de CloudWatch.',
    ],
    docsUrl: 'https://aws.amazon.com/cloudwatch/',
  },
  cloudtrail: {
    id: 'cloudtrail',
    name: 'AWS CloudTrail',
    shortName: 'CloudTrail',
    category: 'administracion',
    definition: 'Servicio que registra la actividad de la cuenta como eventos: llamadas a la API hechas por usuarios, roles y servicios.',
    mainFunction: 'Responder “¿quién hizo qué, cuándo y desde dónde?” para auditoría e investigación.',
    useCases: ['Auditoría de cumplimiento', 'Investigar quién modificó un security group', 'Analizar errores AccessDenied'],
    related: ['cloudwatch', 'config', 'iam'],
    confusions: [
      'El historial de eventos guarda 90 días de eventos de administración; para conservar más o incluir eventos de datos se crea un trail (o un event data store de CloudTrail Lake).',
      'Las operaciones sobre objetos de S3 (GetObject, PutObject, DeleteObject) son eventos de datos: no se registran a menos que los configures.',
    ],
    considerations: ['Un trail puede entregar los registros a un bucket S3 y a CloudWatch Logs.'],
    docsUrl: 'https://aws.amazon.com/cloudtrail/',
  },
  config: {
    id: 'config',
    name: 'AWS Config',
    shortName: 'AWS Config',
    category: 'administracion',
    definition: 'Servicio que registra la configuración de tus recursos, su historial de cambios y evalúa su cumplimiento con reglas.',
    mainFunction: 'Responder “¿cómo estaba configurado este recurso y cumple mis reglas?”.',
    useCases: ['Detectar security groups con SSH abierto a internet', 'Ver la línea de tiempo de cambios de un recurso', 'Auditorías de cumplimiento'],
    related: ['cloudtrail', 'cloudwatch', 'security-group'],
    confusions: [
      'Config guarda el estado de la configuración; CloudTrail guarda la llamada a la API que la cambió. Se complementan.',
      'Las reglas de Config evalúan y marcan NON_COMPLIANT; la corrección automática requiere configurar acciones de remediación.',
    ],
    considerations: ['Se cobra por elemento de configuración registrado y por evaluación de reglas.'],
    docsUrl: 'https://aws.amazon.com/config/',
  },
};

export function getService(id: ServiceId): ServiceInfo {
  return SERVICES[id];
}

export const ALL_SERVICES: ServiceInfo[] = Object.values(SERVICES);
