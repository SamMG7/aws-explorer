# Cobertura del temario CLF-C02

Fuente: [lista oficial de servicios en el alcance del examen AWS Certified Cloud Practitioner (CLF-C02)](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html), consultada el 9-nov-2026. AWS indica que la lista no es exhaustiva y puede cambiar.

El catálogo tiene **157 fichas**. Cada ficha incluye definición, función principal, casos de uso, servicios relacionados, confusiones frecuentes y consideraciones. Tener una ficha no significa que exista una simulación animada para ese servicio: las simulaciones cubren los 6 escenarios del catálogo.

La prueba `src/data/catalog.test.ts` falla si algún servicio de la lista oficial queda sin ficha o si una ficha contiene texto de relleno. Al actualizar la lista oficial, actualiza también esa prueba.

Además de los servicios oficiales, se incluyen conceptos del examen (responsabilidad compartida, Well-Architected, CAF, modelos de precios, etc.) y algunos servicios mencionados con frecuencia en el material de estudio (DataSync, Transfer Family, Snow Family, NAT gateway, network ACL).

## Administración financiera de la nube (8)

- **AWS Budgets**: Herramienta para definir presupuestos de costo, uso o cobertura de reservas y recibir alertas.
- **AWS Cost and Usage Reports (CUR)**: Los informes más detallados de costo y uso de AWS, entregados periódicamente a un bucket S3.
- **AWS Cost Explorer**: Herramienta gráfica para visualizar, filtrar y analizar los costos y el uso de AWS a lo largo del tiempo.
- **AWS Marketplace**: Catálogo digital de software, datos y servicios de proveedores independientes que funcionan en AWS.
- **AWS Pricing Calculator**: Herramienta web gratuita para estimar el costo de una arquitectura antes de desplegarla.
- **Instancias de spot (Spot Instances)**: Capacidad de EC2 no utilizada que se ofrece con grandes descuentos y que AWS puede recuperar con aviso de dos minutos.
- **Instancias reservadas (Reserved Instances)**: Descuento en la facturación a cambio de comprometerse a usar una configuración concreta durante 1 o 3 años.
- **Savings Plans**: Modelo de precios flexible: te comprometes a gastar un monto por hora durante 1 o 3 años a cambio de un descuento.

## Administración y gobierno (16)

- **Amazon CloudWatch**: Servicio de monitoreo y observabilidad: métricas, registros (logs), alarmas y paneles.
- **AWS Auto Scaling**: Servicio que configura el escalado de varios recursos desde un solo lugar mediante planes de escalado.
- **AWS CloudFormation**: Servicio de infraestructura como código: describe los recursos en plantillas YAML o JSON y AWS los crea como una pila (stack).
- **AWS CloudTrail**: Servicio que registra la actividad de la cuenta como eventos: llamadas a la API hechas por usuarios, roles y servicios.
- **AWS Compute Optimizer**: Servicio que analiza el uso de los recursos con machine learning y recomienda tamaños óptimos.
- **AWS Config**: Servicio que registra la configuración de tus recursos, su historial de cambios y evalúa su cumplimiento con reglas.
- **AWS Control Tower**: Servicio que configura y gobierna un entorno de múltiples cuentas (landing zone) siguiendo buenas prácticas.
- **AWS Health Dashboard**: Panel con el estado de los servicios de AWS y los eventos que afectan específicamente a tus recursos.
- **AWS License Manager**: Servicio para administrar y controlar licencias de software de proveedores como Microsoft, Oracle o SAP en AWS y en instalaciones locales.
- **AWS Management Console**: Interfaz web para acceder y administrar los servicios de AWS.
- **AWS Organizations**: Servicio para administrar de forma centralizada varias cuentas de AWS agrupadas en unidades organizativas (OU).
- **AWS Service Catalog**: Servicio para crear catálogos de productos de TI aprobados (plantillas de infraestructura) que los usuarios despliegan por autoservicio.
- **AWS Systems Manager**: Conjunto de herramientas para operar y administrar servidores (nodos) en AWS, en otras nubes y en instalaciones locales.
- **AWS Trusted Advisor**: Servicio que revisa tu cuenta y da recomendaciones según las buenas prácticas de AWS.
- **AWS Well-Architected Tool**: Herramienta gratuita de la consola para revisar cargas de trabajo según el AWS Well-Architected Framework.
- **Service Quotas**: Servicio para consultar y administrar las cuotas (límites) de los servicios de AWS en cada cuenta y región.

## Almacenamiento (9)

- **Almacén de instancias de EC2 (instance store)**: Discos físicos conectados al servidor que aloja la instancia EC2, que ofrecen almacenamiento temporal en bloque.
- **Amazon Elastic Block Store (EBS)**: Volúmenes de almacenamiento en bloque persistentes que se adjuntan a instancias EC2, como un disco duro virtual.
- **Amazon Elastic File System (EFS)**: Sistema de archivos NFS administrado y elástico que pueden montar al mismo tiempo muchas instancias y contenedores Linux.
- **Amazon FSx**: Familia de sistemas de archivos de terceros totalmente administrados: Windows File Server, Lustre, NetApp ONTAP y OpenZFS.
- **Amazon S3 Glacier**: Clases de almacenamiento de S3 de bajo costo para archivo a largo plazo: Glacier Instant Retrieval, Glacier Flexible Retrieval y Glacier Deep Archive.
- **Amazon Simple Storage Service (S3)**: Almacenamiento de objetos con alta durabilidad, organizado en buckets.
- **AWS Backup**: Servicio centralizado para definir, programar y auditar respaldos de varios servicios de AWS.
- **AWS Elastic Disaster Recovery**: Servicio que replica continuamente servidores locales o en la nube hacia AWS para recuperarlos rápidamente tras un desastre.
- **AWS Storage Gateway**: Servicio de almacenamiento híbrido que da a las aplicaciones locales acceso a almacenamiento en AWS mediante un dispositivo virtual o físico.

## Analítica (7)

- **Amazon Athena**: Servicio de consultas interactivas sin servidor que analiza datos guardados en Amazon S3 con SQL estándar.
- **Amazon EMR**: Plataforma administrada de big data para ejecutar marcos como Apache Spark, Hadoop, Hive y Presto.
- **Amazon Kinesis**: Familia de servicios para recopilar, procesar y analizar datos en streaming en tiempo real (Kinesis Data Streams y Kinesis Video Streams, junto con Amazon Data Firehose).
- **Amazon OpenSearch Service**: Servicio administrado para desplegar y operar clústeres de OpenSearch (y versiones heredadas de Elasticsearch).
- **Amazon Quick**: Servicio de inteligencia empresarial y visualización de datos de AWS, con paneles interactivos y funciones de IA generativa. Incluye las capacidades conocidas antes como Amazon QuickSight.
- **Amazon Redshift**: Almacén de datos (data warehouse) en la nube, administrado, con almacenamiento en columnas y procesamiento paralelo.
- **AWS Glue**: Servicio sin servidor de integración de datos: descubre, cataloga, prepara y transforma datos (ETL).

## Aplicaciones empresariales (2)

- **Amazon Connect**: Centro de contacto omnicanal en la nube, de pago por uso.
- **Amazon Simple Email Service (SES)**: Servicio de correo electrónico en la nube para enviar y recibir correos a gran escala.

## Bases de datos (6)

- **Amazon Aurora**: Motor de base de datos relacional de AWS compatible con MySQL y PostgreSQL, disponible dentro de Amazon RDS.
- **Amazon DocumentDB (compatible con MongoDB)**: Base de datos de documentos JSON totalmente administrada y compatible con la API de MongoDB.
- **Amazon DynamoDB**: Base de datos NoSQL de clave-valor y documentos, sin servidor y totalmente administrada.
- **Amazon ElastiCache**: Servicio de caché en memoria administrado, compatible con Valkey, Redis OSS y Memcached.
- **Amazon Neptune**: Base de datos de grafos totalmente administrada para datos muy conectados.
- **Amazon Relational Database Service (RDS)**: Servicio administrado de bases de datos relacionales (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server y Db2; Aurora es un motor relacionado).

## Computación para usuarios finales (3)

- **Amazon AppStream 2.0**: Servicio que transmite aplicaciones de escritorio desde AWS a un navegador web.
- **Amazon WorkSpaces**: Escritorios virtuales administrados (DaaS) con Windows o Linux.
- **Amazon WorkSpaces Secure Browser**: Servicio que da acceso a sitios internos y aplicaciones SaaS mediante un navegador aislado que se ejecuta en AWS.

## Cómputo (7)

- **Amazon EC2 Auto Scaling**: Servicio que mantiene y ajusta automáticamente la cantidad de instancias EC2 de un grupo de Auto Scaling.
- **Amazon Elastic Compute Cloud (EC2)**: Servicio de máquinas virtuales (instancias) con capacidad redimensionable.
- **Amazon Lightsail**: Servicio simplificado de servidores virtuales, bases de datos y almacenamiento con planes de precio mensual fijo.
- **AWS Batch**: Servicio que planifica y ejecuta trabajos de procesamiento por lotes a cualquier escala.
- **AWS Elastic Beanstalk**: Servicio tipo PaaS: subes el código de la aplicación y Beanstalk aprovisiona y administra EC2, balanceo de carga, Auto Scaling y monitoreo.
- **AWS Lambda**: Servicio de cómputo sin servidor (serverless) que ejecuta código en respuesta a eventos.
- **AWS Outposts**: Familia de soluciones que instala infraestructura de AWS, administrada por AWS, en el centro de datos del cliente.

## Concepto (22)

- **Alta disponibilidad**: Diseño que minimiza el tiempo de inactividad cuando falla un componente.
- **Autenticación multifactor (MFA)**: Exigir, además de la contraseña, un segundo factor: una aplicación de autenticación, una llave de seguridad física o una clave de acceso (passkey).
- **AWS Cloud Adoption Framework (AWS CAF)**: Marco de AWS para planificar y acelerar la transformación digital con la nube.
- **AWS Well-Architected Framework**: Conjunto de buenas prácticas de AWS organizado en seis pilares.
- **CapEx frente a OpEx**: CapEx es la inversión inicial en activos (comprar servidores); OpEx es el gasto operativo variable (pagar por uso).
- **Cifrado en tránsito y en reposo**: Proteger los datos mientras viajan por la red (en tránsito, normalmente con TLS) y mientras están almacenados (en reposo).
- **Elasticidad**: Capacidad de aumentar y reducir recursos automáticamente según la demanda en cada momento.
- **Escalabilidad**: Capacidad de un sistema de atender más carga agregando recursos.
- **IaaS, PaaS y SaaS**: Modelos de servicio en la nube según cuánto administra el proveedor: infraestructura, plataforma o software completo.
- **Infraestructura como código (IaC)**: Definir y administrar la infraestructura mediante archivos de texto versionables en lugar de configuraciones manuales.
- **Lógica de evaluación de políticas**: Proceso con el que AWS decide si permite o deniega cada solicitud autenticada.
- **Modelo de responsabilidad compartida**: Reparto de las tareas de seguridad: AWS es responsable de la seguridad DE la nube y el cliente de la seguridad EN la nube.
- **Modelos de implementación de la nube**: Formas de desplegar recursos: nube (pública), local u on-premises (nube privada) e híbrida.
- **Planes de AWS Support**: Niveles de soporte con distinto alcance y precio: Basic (incluido), Developer, Business, Enterprise On-Ramp y Enterprise.
- **Precios de transferencia de datos**: Costos que dependen de hacia dónde viajan los datos: de Internet a AWS, de AWS a Internet, entre regiones o entre zonas de disponibilidad.
- **Principio de mínimo privilegio**: Conceder a cada identidad solo los permisos necesarios para su tarea y nada más.
- **Recursos de la cuenta**: Conjunto de recursos desplegados en la cuenta: instancias EC2, security groups, buckets S3, etc.
- **Región de AWS**: Ubicación geográfica que agrupa varias zonas de disponibilidad (AZ) aisladas entre sí y conectadas con baja latencia.
- **RTO y RPO**: RTO (objetivo de tiempo de recuperación): cuánto tiempo puede estar caído el servicio. RPO (objetivo de punto de recuperación): cuántos datos, medidos en tiempo, se pueden perder.
- **Tolerancia a fallos**: Capacidad de seguir funcionando sin interrupción aunque fallen uno o varios componentes.
- **Ubicación de borde (edge location)**: Centro de datos de la red global de AWS, más numeroso que las regiones, ubicado cerca de los usuarios finales.
- **Zona de disponibilidad (AZ)**: Uno o más centros de datos con energía, red y conectividad redundantes dentro de una región, aislados de las demás zonas.

## Contenedores (3)

- **Amazon Elastic Container Registry (ECR)**: Registro administrado para almacenar, compartir y desplegar imágenes de contenedores.
- **Amazon Elastic Container Service (ECS)**: Orquestador de contenedores propio de AWS, totalmente administrado.
- **Amazon Elastic Kubernetes Service (EKS)**: Servicio administrado de Kubernetes: AWS opera el plano de control de alta disponibilidad.

## Frontend web y móvil (1)

- **AWS Amplify**: Conjunto de herramientas y servicios para construir, desplegar y alojar aplicaciones web y móviles full-stack.

## Herramientas para desarrolladores (4)

- **AWS CodeBuild**: Servicio de integración continua totalmente administrado que compila código, ejecuta pruebas y genera paquetes.
- **AWS CodePipeline**: Servicio de entrega continua que automatiza las etapas para publicar software.
- **AWS Command Line Interface (CLI)**: Herramienta de línea de comandos unificada para administrar servicios de AWS.
- **AWS X-Ray**: Servicio de trazabilidad distribuida que sigue cada solicitud a través de los componentes de una aplicación.

## Integración de aplicaciones (4)

- **Amazon EventBridge**: Bus de eventos sin servidor que recibe eventos de servicios de AWS, aplicaciones propias y SaaS, y los envía a destinos según reglas.
- **Amazon Simple Notification Service (SNS)**: Servicio de mensajería de publicación/suscripción (pub/sub) totalmente administrado.
- **Amazon Simple Queue Service (SQS)**: Servicio de colas de mensajes totalmente administrado.
- **AWS Step Functions**: Servicio de orquestación visual que coordina pasos de un flujo de trabajo como una máquina de estados.

## Internet de las cosas (IoT) (1)

- **AWS IoT Core**: Servicio administrado que conecta dispositivos IoT con la nube de forma segura mediante MQTT, HTTPS y otros protocolos.

## Machine learning e IA (9)

- **Amazon Comprehend**: Servicio de procesamiento de lenguaje natural (NLP) que extrae información de textos.
- **Amazon Lex**: Servicio para crear interfaces conversacionales (chatbots y bots de voz) con reconocimiento de voz y comprensión del lenguaje.
- **Amazon Polly**: Servicio que convierte texto en voz realista (text-to-speech).
- **Amazon Q**: Asistente de IA generativa de AWS para el trabajo empresarial (Amazon Q Business) y para el desarrollo de software (Amazon Q Developer).
- **Amazon Rekognition**: Servicio de visión artificial que analiza imágenes y video.
- **Amazon SageMaker AI**: Servicio totalmente administrado para preparar datos y crear, entrenar y desplegar modelos de machine learning.
- **Amazon Textract**: Servicio que extrae texto, escritura a mano, formularios y tablas de documentos escaneados.
- **Amazon Transcribe**: Servicio de reconocimiento automático de voz que convierte audio en texto (speech-to-text).
- **Amazon Translate**: Servicio de traducción automática neuronal entre decenas de idiomas.

## Migración y transferencia (9)

- **AWS Application Discovery Service**: Servicio que recopila información de configuración, uso y dependencias de los servidores locales.
- **AWS Application Migration Service (MGN)**: Servicio principal de AWS para migraciones “lift-and-shift” (rehost) de servidores a AWS.
- **AWS Database Migration Service (DMS)**: Servicio para migrar y replicar bases de datos hacia AWS de forma rápida y segura.
- **AWS DataSync**: Servicio de transferencia de datos en línea que copia archivos y objetos entre almacenamiento local, otras nubes y AWS.
- **AWS Migration Hub**: Ubicación central para descubrir, planificar y seguir el avance de las migraciones a AWS.
- **AWS Schema Conversion Tool (SCT)**: Herramienta que convierte el esquema y el código de una base de datos de un motor a otro.
- **AWS Snow Family**: Dispositivos físicos resistentes que AWS envía al cliente para transferir datos sin conexión y procesar datos en ubicaciones remotas.
- **AWS Transfer Family**: Servicio administrado de transferencia de archivos mediante SFTP, FTPS, FTP y AS2 directamente hacia S3 o EFS.
- **Migration Evaluator**: Servicio que analiza el entorno local para construir un caso de negocio de migración a AWS.

## Redes y entrega de contenido (17)

- **Amazon API Gateway**: Servicio administrado para crear, publicar, proteger y monitorear API REST, HTTP y WebSocket.
- **Amazon CloudFront**: Red de entrega de contenido (CDN) que sirve contenido desde ubicaciones de borde (edge locations) cercanas al usuario.
- **Amazon Route 53**: Servicio de DNS administrado, escalable y de alta disponibilidad. También registra dominios y hace comprobaciones de estado.
- **Amazon Virtual Private Cloud (VPC)**: Red virtual lógicamente aislada dentro de una región, con un rango de direcciones IP (CIDR) que tú defines.
- **Application Load Balancer (Elastic Load Balancing)**: Balanceador de carga de capa 7 (HTTP/HTTPS) de Elastic Load Balancing.
- **AWS Client VPN**: Servicio VPN administrado, basado en OpenVPN, para que usuarios individuales accedan a recursos de AWS y locales.
- **AWS Direct Connect**: Conexión de red física y dedicada entre las instalaciones del cliente y AWS, que no pasa por Internet público.
- **AWS Global Accelerator**: Servicio de red que asigna dos direcciones IP estáticas anycast y dirige el tráfico de los usuarios por la red global de AWS.
- **AWS PrivateLink**: Tecnología que conecta una VPC de forma privada con servicios de AWS, de otras cuentas o de terceros mediante endpoints de interfaz.
- **AWS Site-to-Site VPN**: Conexión VPN IPsec entre una red local (customer gateway) y una VPC o un Transit Gateway en AWS.
- **AWS Transit Gateway**: Concentrador de red regional que interconecta muchas VPC y redes locales en un modelo de estrella (hub-and-spoke).
- **AWS VPN**: Familia de servicios de redes privadas virtuales cifradas: AWS Site-to-Site VPN y AWS Client VPN.
- **Internet Gateway**: Componente de la VPC, redundante y escalado horizontalmente, que permite la comunicación entre la VPC e internet.
- **NAT gateway**: Servicio administrado de traducción de direcciones que se coloca en una subred pública de la VPC.
- **Network ACL (lista de control de acceso de red)**: Firewall opcional sin estado (stateless) que filtra el tráfico que entra y sale de una subred.
- **Subred privada**: Subred sin ruta directa hacia un Internet Gateway.
- **Subred pública**: Subred cuya tabla de rutas tiene una ruta hacia un Internet Gateway (por ejemplo 0.0.0.0/0 → igw).

## Seguridad, identidad y cumplimiento (21)

- **Amazon Cognito**: Servicio de identidad para aplicaciones web y móviles: registro, inicio de sesión y control de acceso de usuarios finales.
- **Amazon Detective**: Servicio que analiza y visualiza datos de seguridad para investigar el origen de hallazgos y actividades sospechosas.
- **Amazon GuardDuty**: Servicio de detección de amenazas que analiza continuamente fuentes de datos de AWS en busca de actividad maliciosa o anómala.
- **Amazon Inspector**: Servicio automatizado de administración de vulnerabilidades.
- **Amazon Macie**: Servicio que usa machine learning y coincidencia de patrones para descubrir datos sensibles en Amazon S3.
- **AWS Artifact**: Portal de autoservicio con los informes de cumplimiento y los acuerdos de AWS.
- **AWS Certificate Manager (ACM)**: Servicio para aprovisionar, administrar y renovar certificados SSL/TLS.
- **AWS CloudHSM**: Módulos de seguridad de hardware (HSM) dedicados, de un solo inquilino, en la nube de AWS.
- **AWS Directory Service**: Servicio de directorios administrados: AWS Managed Microsoft AD, AD Connector y Simple AD.
- **AWS Firewall Manager**: Servicio para administrar de forma central reglas de firewall en todas las cuentas de AWS Organizations.
- **AWS IAM Identity Center**: Servicio recomendado para administrar el acceso de las personas de la organización a varias cuentas de AWS y aplicaciones.
- **AWS Identity and Access Management (IAM)**: Servicio global para controlar quién puede autenticarse y qué acciones puede realizar sobre qué recursos.
- **AWS Key Management Service (KMS)**: Servicio administrado para crear y controlar claves criptográficas usadas para proteger datos.
- **AWS Resource Access Manager (RAM)**: Servicio para compartir recursos de forma segura entre cuentas de AWS o dentro de AWS Organizations.
- **AWS Secrets Manager**: Servicio para guardar, recuperar y rotar secretos como contraseñas de bases de datos y claves de API.
- **AWS Security Hub**: Servicio que centraliza y prioriza los hallazgos de seguridad de varios servicios y evalúa la cuenta frente a estándares.
- **AWS Shield**: Servicio de protección contra ataques de denegación de servicio distribuidos (DDoS).
- **AWS WAF**: Firewall de aplicaciones web que filtra solicitudes HTTP/HTTPS según reglas.
- **Política de IAM**: Documento JSON con declaraciones (statements) que combinan Effect, Action, Resource y opcionalmente Condition.
- **Rol de IAM**: Identidad de IAM sin credenciales permanentes que puede ser asumida por usuarios, servicios o aplicaciones.
- **Security group**: Firewall virtual con estado (stateful) asociado a interfaces de red de recursos como EC2, RDS o un ALB.

## Serverless (1)

- **AWS Fargate**: Motor de cómputo sin servidor para contenedores, compatible con ECS y EKS.

## Soporte y habilitación (3)

- **AWS Partner Network (APN)**: Programa global de empresas consultoras y de tecnología que ayudan a los clientes a construir y operar en AWS.
- **AWS re:Post**: Comunidad oficial de preguntas y respuestas de AWS, moderada por AWS y por expertos de la comunidad.
- **AWS Support**: Servicio de soporte técnico y de cuenta de AWS, ofrecido en distintos planes.
