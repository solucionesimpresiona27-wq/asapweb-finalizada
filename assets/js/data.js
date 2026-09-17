/* =============================================================================
   ASAP Gestión de Proyectos 369 — Capa de contenido
   -----------------------------------------------------------------------------
   Todo el contenido editorial del sitio vive en este archivo. Para actualizar
   servicios, ciudades, pines del mapa o el catálogo de proyectos basta con
   modificar los objetos de abajo: la interfaz se reconstruye sola.

   NOTA: los textos, cifras y fichas técnicas son contenido de muestra pensado
   para mostrar el diseño final. Sustitúyelos por la información real de la
   empresa antes de publicar (ver README.md).
   ========================================================================== */

/* -----------------------------------------------------------------------------
   1. Servicios principales
   -------------------------------------------------------------------------- */
export const SERVICIOS = [
  {
    id: 'cristales',
    num: '01',
    nombre: 'Lavado de cristales',
    claim: 'Cristalería impecable a cualquier altura',
    desc: 'Limpieza profesional de ventanería, muro cortina, domos y cancelería con acceso por cuerdas. Retiramos película de contaminación, salitre, residuos de obra y adherencias sin dañar el vidrio ni los sellos perimetrales.',
    puntos: ['Muro cortina y vidrio templado', 'Retiro de salitre y cemento', 'Agua osmotizada sin residuos', 'Limpieza post-obra y mantenimiento'],
    metrica: { valor: '+180k', unidad: 'm² de cristal lavado' },
    icono: '<path d="M3 4h18v13H3z"/><path d="M12 4v13M3 10.5h18"/><path d="m16.5 20.5 3.5-3.5"/><path d="M6 20.5h4"/>'
  },
  {
    id: 'sellado',
    num: '02',
    nombre: 'Sellado',
    claim: 'Barrera continua contra filtraciones',
    desc: 'Retiro y reposición de sellos perimetrales en cristal, juntas constructivas y paneles. Trabajamos con selladores de silicona estructural y poliuretano de grado arquitectónico, con control de espesor y adherencia.',
    puntos: ['Silicona estructural y neutra', 'Juntas constructivas y de dilatación', 'Prueba de estanqueidad', 'Reporte fotográfico por eje'],
    metrica: { valor: '+42 km', unidad: 'de junta sellada' },
    icono: '<path d="M4 8h9l4-3v9l-4-3H4z"/><path d="M4 8v8"/><path d="M18 14v6"/><path d="M18 20a1.8 1.8 0 0 0 0-3.6"/>'
  },
  {
    id: 'pintura',
    num: '03',
    nombre: 'Pintura de fachada',
    claim: 'Color y protección de larga duración',
    desc: 'Preparación de sustrato, aplicación de primarios y recubrimientos acrílicos o elastoméricos sobre concreto, aplanado, EIFS y lámina. Acabado uniforme sin andamios y sin interrumpir la operación del inmueble.',
    puntos: ['Recubrimientos elastoméricos', 'Tratamiento anticarbonatación', 'Control de tonos por lote', 'Garantía por escrito'],
    metrica: { valor: '10 años', unidad: 'de vida útil promedio' },
    icono: '<rect x="3" y="4" width="12" height="5" rx="1"/><path d="M15 6.5h4v4h-6"/><path d="M13 10.5v3.5h-2v6h2"/><path d="M11 14h2"/>'
  },
  {
    id: 'membrana',
    num: '04',
    nombre: 'Lavado de membrana',
    claim: 'Cubiertas limpias, drenaje libre',
    desc: 'Limpieza controlada de membranas prefabricadas, TPO, PVC y acrílicas. Eliminamos biocapa, hongo y sedimento con presión regulada para no comprometer traslapes ni la garantía del sistema.',
    puntos: ['Presión regulada por tipo de manto', 'Desazolve de coladeras', 'Detección de traslapes abiertos', 'Diagnóstico de vida útil restante'],
    metrica: { valor: '0 daños', unidad: 'a traslapes y sellos' },
    icono: '<path d="M3 9.5 12 5l9 4.5"/><path d="M3 9.5V15l9 4.5L21 15V9.5"/><path d="m7.5 12.5.01 3M12 14l.01 3M16.5 12.5l.01 3"/>'
  },
  {
    id: 'estructural',
    num: '05',
    nombre: 'Lavado estructural',
    claim: 'Estructura visible, estructura confiable',
    desc: 'Lavado de estructura metálica, concreto aparente, columnas, trabes, puentes y torres. Dejamos la superficie lista para inspección, aplicación de primario anticorrosivo o recubrimiento intumescente.',
    puntos: ['Estructura metálica y concreto aparente', 'Preparación para anticorrosivo', 'Acceso a geometrías complejas', 'Registro de puntos de corrosión'],
    metrica: { valor: '+120', unidad: 'estructuras atendidas' },
    icono: '<path d="M4 20V6l8-3 8 3v14"/><path d="M4 20h16"/><path d="m4 10 16 6M20 10 4 16"/>'
  },
  {
    id: 'industrial',
    num: '06',
    nombre: 'Lavado industrial',
    claim: 'Planta operando, limpieza avanzando',
    desc: 'Hidrolavado de alta presión en naves, silos, tanques, ductos y áreas de proceso. Planificamos por ventanas de producción, con manejo de residuos y protocolos de acceso a zonas restringidas.',
    puntos: ['Alta presión hasta 4,000 psi', 'Silos, tanques y ductos', 'Manejo y confinamiento de residuos', 'Trabajo en paro programado'],
    metrica: { valor: '24/7', unidad: 'ventanas de operación' },
    icono: '<path d="M3 20V11l5 3V11l5 3V6l8 5v9z"/><path d="M3 20h18"/><path d="M8 20v-3M13 20v-3M18 20v-3"/>'
  },
  {
    id: 'grietas',
    num: '07',
    nombre: 'Reparación de grietas',
    claim: 'Diagnóstico primero, reparación después',
    desc: 'Identificación del origen de la fisura, apertura en “V”, inyección epóxica o de poliuretano y restitución del acabado. Distinguimos entre fisura superficial y movimiento estructural activo.',
    puntos: ['Inyección epóxica y de poliuretano', 'Testigos de movimiento', 'Restitución de aplanado y textura', 'Informe técnico con evidencia'],
    metrica: { valor: '100%', unidad: 'con informe técnico' },
    icono: '<path d="M4 4h16v16H4z"/><path d="m10 4 1.5 5-3 2.5L11 15l-1 5"/><path d="m14 9 3 1.5"/>'
  },
  {
    id: 'impermeabilizado',
    num: '08',
    nombre: 'Impermeabilizado',
    claim: 'Azoteas que no vuelven a gotear',
    desc: 'Sistemas prefabricados, acrílicos y de poliuretano proyectado sobre azotea, pretil, domo y junta. Retiro de sistema anterior, corrección de pendientes y sellado de penetraciones con garantía documentada.',
    puntos: ['Prefabricado, acrílico y PU', 'Corrección de pendientes', 'Sellado de penetraciones', 'Garantía de 5 a 10 años'],
    metrica: { valor: '5–10 años', unidad: 'de garantía' },
    icono: '<path d="M12 3s7 6.2 7 10.6A7 7 0 0 1 5 13.6C5 9.2 12 3 12 3z"/><path d="M9 13.5a3 3 0 0 0 3 3"/>'
  }
];

/* -----------------------------------------------------------------------------
   2. Trabajos verticales — técnicas y ventajas
   -------------------------------------------------------------------------- */
export const VERTICALES = {
  ventajas: [
    { k: '01', t: 'Montaje en minutos', d: 'Sin andamio, sin grúa y sin plataforma elevadora: el equipo desciende desde azotea en cuestión de minutos.' },
    { k: '02', t: 'Hasta 60% menos costo', d: 'Se elimina la renta, el montaje y el desmontaje de estructuras auxiliares en obras de mediana y gran altura.' },
    { k: '03', t: 'Cero interrupción', d: 'El inmueble sigue operando: no bloqueamos accesos, cajones de estacionamiento ni áreas comunes.' },
    { k: '04', t: 'Geometrías imposibles', d: 'Volados, cúpulas, fachadas inclinadas, patios interiores y torres con base ocupada.' }
  ],
  tecnicas: [
    { t: 'Acceso por cuerdas', d: 'Doble línea independiente —trabajo y seguridad— con descensor autobloqueante y anticaídas.' },
    { t: 'Sistemas de anclaje', d: 'Anclajes estructurales certificados, contrapesos calculados y líneas de vida temporales.' },
    { t: 'Plan de rescate', d: 'Cada maniobra cuenta con plan de rescate en altura y personal de tierra dedicado.' },
    { t: 'Delimitación de zona', d: 'Acordonamiento, señalización y vigía en la proyección vertical del área de trabajo.' }
  ],
  seguridad: [
    'Procedimientos alineados a la NOM-009-STPS-2011 (trabajos en altura)',
    'Análisis de Riesgos por Puesto de Trabajo (ARPT) por proyecto',
    'Inspección y bitácora de equipo de protección anticaídas',
    'Personal capacitado en trabajos en altura y primeros auxilios',
    'Póliza de responsabilidad civil vigente'
  ]
};

/* -----------------------------------------------------------------------------
   3. Cobertura — ciudades, pines geolocalizados y proyectos por zona
   Las coordenadas `p` están en el sistema del viewBox del mapa (0 0 793 498)
   y fueron proyectadas desde latitud/longitud reales.
   -------------------------------------------------------------------------- */
export const ZONAS = [
  {
    id: 'queretaro',
    ciudad: 'Querétaro',
    estado: 'Querétaro',
    estadoId: 'que',
    desde: '2014',
    resumen: 'Nuestra base de operaciones. Corredor corporativo e industrial con la mayor concentración de obra vertical del Bajío.',
    destacados: ['Corporativos clase A', 'Parques industriales', 'Hospitales y hotelería'],
    pines: [
      { n: 'Santiago de Querétaro', p: [450.0, 341.9], tipo: 'sede' },
      { n: 'Juriquilla',           p: [448.5, 338.7], tipo: 'obra' },
      { n: 'El Marqués',           p: [452.8, 341.9], tipo: 'obra' },
      { n: 'Corregidora',          p: [448.7, 343.2], tipo: 'obra' },
      { n: 'San Juan del Río',     p: [460.1, 346.9], tipo: 'obra' }
    ]
  },
  {
    id: 'vallarta',
    ciudad: 'Puerto Vallarta',
    estado: 'Jalisco',
    estadoId: 'jal',
    desde: '2017',
    resumen: 'Costa del Pacífico. Ambiente salino extremo: nuestros protocolos anticorrosión y de sellado se diseñaron aquí.',
    destacados: ['Hotelería frente al mar', 'Condominios verticales', 'Tratamiento anti-salitre'],
    pines: [
      { n: 'Puerto Vallarta', p: [327.7, 346.6], tipo: 'sede' },
      { n: 'Marina Vallarta', p: [327.2, 346.3], tipo: 'obra' },
      { n: 'Nuevo Vallarta',  p: [326.1, 345.6], tipo: 'obra' }
    ]
  },
  {
    id: 'morelia',
    ciudad: 'Morelia',
    estado: 'Michoacán',
    estadoId: 'mic',
    desde: '2019',
    resumen: 'Patrimonio y obra nueva conviviendo. Intervenciones de bajo impacto en cantera, aplanado histórico y torres recientes.',
    destacados: ['Cantera y patrimonio', 'Obra nueva vertical', 'Retail y educación'],
    pines: [
      { n: 'Morelia',   p: [430.3, 367.8], tipo: 'sede' },
      { n: 'Pátzcuaro', p: [419.7, 373.7], tipo: 'obra' },
      { n: 'Uruapan',   p: [408.3, 377.1], tipo: 'obra' },
      { n: 'Zamora',    p: [402.4, 361.4], tipo: 'obra' }
    ]
  },
  {
    id: 'guadalajara',
    ciudad: 'Guadalajara',
    estado: 'Jalisco',
    estadoId: 'jal',
    desde: '2016',
    resumen: 'Zona Metropolitana. Torres de uso mixto y corporativos de gran altura sobre Puerta de Hierro, Andares y Chapultepec.',
    destacados: ['Torres de uso mixto', 'Gran altura (+100 m)', 'Corporativo y residencial'],
    pines: [
      { n: 'Guadalajara',  p: [375.1, 343.9], tipo: 'sede' },
      { n: 'Zapopan',      p: [374.1, 342.2], tipo: 'obra' },
      { n: 'Tlaquepaque',  p: [376.6, 344.4], tipo: 'obra' },
      { n: 'Tlajomulco',   p: [372.9, 349.2], tipo: 'obra' }
    ]
  }
];

/* -----------------------------------------------------------------------------
   4. Catálogo de proyectos
   -------------------------------------------------------------------------- */
export const PROYECTOS = [
  {
    id: 'qro-torre-corporativa',
    nombre: 'Torre Corporativa Central',
    zona: 'queretaro', ciudad: 'Querétaro', anio: '2024',
    servicios: ['cristales', 'sellado'],
    altura: '78 m', niveles: '19 niveles', superficie: '11,400 m²', duracion: '21 días',
    sector: 'Corporativo',
    reto: 'Fachada de muro cortina con película de obra adherida y sellos perimetrales vencidos, con el inmueble ocupado al 90%.',
    solucion: 'Descenso por cuerdas en 4 frentes simultáneos, lavado con agua osmotizada y reposición de 2,300 m lineales de sello estructural.',
    resultado: 'Cero incidentes, cero días de cierre de accesos y recuperación total de transparencia en cristal.',
    destacado: true
  },
  {
    id: 'qro-hospital',
    nombre: 'Hospital Privado Norte',
    zona: 'queretaro', ciudad: 'Juriquilla', anio: '2023',
    servicios: ['impermeabilizado', 'membrana'],
    altura: '24 m', niveles: '6 niveles', superficie: '4,800 m²', duracion: '16 días',
    sector: 'Salud',
    reto: 'Filtraciones en azotea sobre áreas críticas que no podían suspender operación ni tolerar olores de solvente.',
    solucion: 'Retiro de sistema vencido por sectores nocturnos, corrección de pendientes e impermeabilizante acrílico de baja emisión.',
    resultado: 'Quirófanos y terapia intensiva operando sin interrupción durante toda la intervención.'
  },
  {
    id: 'qro-parque-industrial',
    nombre: 'Nave Industrial Automotriz',
    zona: 'queretaro', ciudad: 'El Marqués', anio: '2024',
    servicios: ['industrial', 'estructural'],
    altura: '16 m', niveles: 'Nave tipo', superficie: '22,000 m²', duracion: '12 días',
    sector: 'Industria',
    reto: 'Estructura metálica con polvo de proceso acumulado, previo a auditoría de cliente armadora.',
    solucion: 'Hidrolavado programado en paro de fin de semana, con confinamiento de residuos y secado forzado de líneas críticas.',
    resultado: 'Auditoría aprobada sin observaciones de limpieza estructural.',
    destacado: true
  },
  {
    id: 'qro-plaza',
    nombre: 'Plaza Comercial Sur',
    zona: 'queretaro', ciudad: 'Corregidora', anio: '2022',
    servicios: ['pintura', 'grietas'],
    altura: '12 m', niveles: '3 niveles', superficie: '9,200 m²', duracion: '28 días',
    sector: 'Retail',
    reto: 'Fisuras en aplanado y decoloración desigual en fachada principal con 120 locales en operación.',
    solucion: 'Testigos de movimiento, apertura e inyección de 340 m de fisura y recubrimiento elastomérico en dos tonos.',
    resultado: 'Fachada homologada y sin reaparición de fisura tras dos temporadas de lluvia.'
  },
  {
    id: 'qro-residencial',
    nombre: 'Residencial Vertical Alameda',
    zona: 'queretaro', ciudad: 'San Juan del Río', anio: '2025',
    servicios: ['cristales', 'membrana'],
    altura: '42 m', niveles: '12 niveles', superficie: '6,100 m²', duracion: '9 días',
    sector: 'Residencial',
    reto: 'Entrega de obra con residuos de cemento y silicón sobre cristal y barandal de vidrio.',
    solucion: 'Limpieza post-obra con espátula de precisión, desincrustante de pH controlado y pulido puntual.',
    resultado: 'Entrega liberada en tiempo por la supervisión del desarrollador.'
  },
  {
    id: 'gdl-torre-mixta',
    nombre: 'Torre de Usos Mixtos Poniente',
    zona: 'guadalajara', ciudad: 'Zapopan', anio: '2024',
    servicios: ['cristales', 'sellado', 'estructural'],
    altura: '124 m', niveles: '31 niveles', superficie: '18,600 m²', duracion: '34 días',
    sector: 'Uso mixto',
    reto: 'Gran altura con vientos cruzados vespertinos y hotel operando en los primeros 12 niveles.',
    solucion: 'Ventanas de trabajo matutinas, líneas guía tensadas para control de péndulo y bitácora de viento por hora.',
    resultado: 'Ejecución completa dentro de programa con registro de viento validado por la administración.',
    destacado: true
  },
  {
    id: 'gdl-corporativo',
    nombre: 'Corporativo Financiero',
    zona: 'guadalajara', ciudad: 'Guadalajara', anio: '2023',
    servicios: ['pintura', 'sellado'],
    altura: '64 m', niveles: '16 niveles', superficie: '8,900 m²', duracion: '25 días',
    sector: 'Corporativo',
    reto: 'Recubrimiento con carbonatación avanzada en cara sur y juntas de dilatación abiertas.',
    solucion: 'Tratamiento anticarbonatación, reposición de respaldo y sello en juntas, acabado elastomérico mate.',
    resultado: 'Homogeneidad de color certificada por lote y junta estanca verificada con prueba de agua.'
  },
  {
    id: 'gdl-centro-comercial',
    nombre: 'Centro Comercial Andador',
    zona: 'guadalajara', ciudad: 'Tlaquepaque', anio: '2022',
    servicios: ['membrana', 'impermeabilizado'],
    altura: '18 m', niveles: '2 niveles', superficie: '15,300 m²', duracion: '19 días',
    sector: 'Retail',
    reto: 'Membrana TPO con biocapa y coladeras azolvadas tras temporada de lluvias.',
    solucion: 'Lavado con presión regulada, desazolve integral y reforzamiento de traslapes y penetraciones.',
    resultado: 'Drenaje recuperado al 100% y vida útil del manto extendida sin reemplazo.'
  },
  {
    id: 'gdl-nave',
    nombre: 'Centro Logístico Sur',
    zona: 'guadalajara', ciudad: 'Tlajomulco', anio: '2025',
    servicios: ['industrial', 'pintura'],
    altura: '14 m', niveles: 'Nave tipo', superficie: '26,500 m²', duracion: '22 días',
    sector: 'Logística',
    reto: 'Lámina exterior con oxidación superficial y señalización de seguridad borrada.',
    solucion: 'Hidrolavado, tratamiento de puntos de óxido, primario y esmalte industrial con reposición de señalética.',
    resultado: 'Imagen corporativa restituida en una sola ventana de paro programado.'
  },
  {
    id: 'pv-hotel',
    nombre: 'Hotel Frente al Mar',
    zona: 'vallarta', ciudad: 'Puerto Vallarta', anio: '2024',
    servicios: ['cristales', 'sellado', 'pintura'],
    altura: '52 m', niveles: '14 niveles', superficie: '13,700 m²', duracion: '31 días',
    sector: 'Hotelería',
    reto: 'Salitre incrustado en cristal y herrería, con ocupación hotelera superior al 80% en temporada.',
    solucion: 'Protocolo anti-salitre en tres etapas, sellado perimetral y recubrimiento con inhibidor de corrosión.',
    resultado: 'Cero quejas de huéspedes registradas y liberación anticipada de la fachada norte.',
    destacado: true
  },
  {
    id: 'pv-condominio',
    nombre: 'Condominio Marina',
    zona: 'vallarta', ciudad: 'Marina Vallarta', anio: '2023',
    servicios: ['impermeabilizado', 'grietas'],
    altura: '38 m', niveles: '11 niveles', superficie: '5,400 m²', duracion: '24 días',
    sector: 'Residencial',
    reto: 'Humedad ascendente en pretiles y fisura activa en junta constructiva del núcleo de escaleras.',
    solucion: 'Inyección de poliuretano hidroactivo, membrana de poliuretano proyectado y refuerzo de chaflanes.',
    resultado: 'Dos temporadas de huracanes sin reporte de filtración en las áreas intervenidas.'
  },
  {
    id: 'pv-resort',
    nombre: 'Resort Bahía Norte',
    zona: 'vallarta', ciudad: 'Nuevo Vallarta', anio: '2025',
    servicios: ['estructural', 'pintura'],
    altura: '26 m', niveles: '7 niveles', superficie: '10,100 m²', duracion: '27 días',
    sector: 'Hotelería',
    reto: 'Estructura metálica de palapas y pérgolas con corrosión en nudos y soldaduras.',
    solucion: 'Lavado estructural, remoción mecánica de óxido, primario epóxico y acabado poliuretano marino.',
    resultado: 'Mapa de corrosión entregado al cliente como base de su plan de mantenimiento a 5 años.'
  },
  {
    id: 'mor-centro-historico',
    nombre: 'Edificio Patrimonial Centro',
    zona: 'morelia', ciudad: 'Morelia', anio: '2024',
    servicios: ['estructural', 'grietas'],
    altura: '21 m', niveles: '4 niveles', superficie: '3,200 m²', duracion: '38 días',
    sector: 'Patrimonio',
    reto: 'Cantera rosa con biocapa y juntas erosionadas, bajo criterios de intervención de bajo impacto.',
    solucion: 'Limpieza a baja presión con agua nebulizada, rejunteo con mortero de cal y consolidación puntual.',
    resultado: 'Intervención aprobada por la supervisión especializada del inmueble.',
    destacado: true
  },
  {
    id: 'mor-universidad',
    nombre: 'Campus Universitario',
    zona: 'morelia', ciudad: 'Morelia', anio: '2023',
    servicios: ['cristales', 'membrana'],
    altura: '19 m', niveles: '5 niveles', superficie: '7,600 m²', duracion: '14 días',
    sector: 'Educación',
    reto: 'Seis edificios con calendario académico activo y acceso restringido en horario de clases.',
    solucion: 'Programa por bloques en fin de semana y periodo intersemestral, con vigía permanente en planta baja.',
    resultado: 'Cobertura total del campus sin una sola clase suspendida.'
  },
  {
    id: 'mor-hotel-boutique',
    nombre: 'Hotel Boutique Pátzcuaro',
    zona: 'morelia', ciudad: 'Pátzcuaro', anio: '2022',
    servicios: ['impermeabilizado', 'pintura'],
    altura: '11 m', niveles: '3 niveles', superficie: '2,400 m²', duracion: '18 días',
    sector: 'Hotelería',
    reto: 'Cubierta de teja sobre losa con filtraciones y acabados de cal deteriorados por humedad.',
    solucion: 'Impermeabilización bajo teja, corrección de limahoyas y repintado con pintura mineral transpirable.',
    resultado: 'Estética original preservada con desempeño de sistema moderno.'
  },
  {
    id: 'mor-agroindustrial',
    nombre: 'Planta Agroindustrial',
    zona: 'morelia', ciudad: 'Zamora', anio: '2025',
    servicios: ['industrial', 'estructural'],
    altura: '17 m', niveles: 'Nave + silos', superficie: '19,800 m²', duracion: '15 días',
    sector: 'Agroindustria',
    reto: 'Silos y ductos con residuo orgánico adherido, previo a certificación de inocuidad.',
    solucion: 'Hidrolavado con agua caliente, desinfección posterior y verificación por hisopado en puntos críticos.',
    resultado: 'Certificación obtenida en primera visita del organismo verificador.'
  }
];

/* -----------------------------------------------------------------------------
   5. Proceso de trabajo
   -------------------------------------------------------------------------- */
export const PROCESO = [
  { n: '01', t: 'Levantamiento técnico', d: 'Visita a sitio, medición de superficies, identificación de patologías y revisión de puntos de anclaje disponibles en azotea.', dur: 'Día 1–2' },
  { n: '02', t: 'Propuesta y alcance', d: 'Presupuesto por partida, programa de obra, fichas técnicas de material y alcance firmado antes de mover un solo equipo.', dur: 'Día 3–5' },
  { n: '03', t: 'Plan de seguridad', d: 'Análisis de riesgos, plan de rescate en altura, delimitación de zonas y entrega de documentación al administrador del inmueble.', dur: 'Previo al arranque' },
  { n: '04', t: 'Ejecución controlada', d: 'Frentes simultáneos, bitácora diaria con evidencia fotográfica y avance medido en m² contra programa.', dur: 'Obra' },
  { n: '05', t: 'Entrega y garantía', d: 'Recorrido de aceptación, memoria fotográfica antes/después, carta garantía y plan de mantenimiento recomendado.', dur: 'Cierre' }
];

/* -----------------------------------------------------------------------------
   6. Indicadores
   -------------------------------------------------------------------------- */
export const METRICAS = [
  { v: 350, suf: '+', t: 'Proyectos entregados', d: 'En corporativo, industria, hotelería y patrimonio.' },
  { v: 180, suf: 'k m²', t: 'Superficie intervenida', d: 'Fachada, cubierta y estructura.' },
  { v: 12,  suf: ' años', t: 'De operación continua', d: 'Desde nuestra primera fachada en Querétaro.' },
  { v: 0,   suf: '', t: 'Incidentes incapacitantes', d: 'Resultado de un sistema de seguridad sin atajos.', esCero: true }
];

/* -----------------------------------------------------------------------------
   7. Empresa
   -------------------------------------------------------------------------- */
export const EMPRESA = {
  nombre: 'ASAP Gestión de Proyectos 369',
  corto: 'ASAP 369',
  tel: '+52 442 000 0000',
  telHref: '+524420000000',
  email: 'contacto@asap369.mx',
  wa: '524420000000',
  dir: 'Santiago de Querétaro, Querétaro, México',
  horario: 'Lunes a viernes · 8:00 – 18:00 h',
  mision: 'Preservar el valor de la infraestructura de nuestros clientes mediante servicios de mantenimiento en altura ejecutados con rigor técnico, seguridad sin concesiones y una gestión de proyecto que respeta el tiempo, el presupuesto y la operación del inmueble.',
  vision: 'Ser la empresa de referencia en gestión de mantenimiento vertical en México: el estándar con el que se comparan los demás en seguridad, acabado y cumplimiento, con presencia consolidada en los principales corredores urbanos e industriales del país.',
  valores: [
    { t: 'Seguridad primero', d: 'Ninguna maniobra justifica un riesgo evitable. Si no es seguro, no se ejecuta.' },
    { t: 'Rigor técnico', d: 'Diagnóstico antes que propuesta; ficha técnica antes que promesa.' },
    { t: 'Palabra cumplida', d: 'El programa firmado es el programa entregado.' },
    { t: 'Respeto al cliente', d: 'Su operación no se detiene por nuestro trabajo.' }
  ],
  fundador: {
    cargo: 'Fundador y Director General',
    saludo: 'Mensaje de nuestro fundador',
    parrafos: [
      'ASAP nació de una convicción simple: en México hacía falta una empresa que tratara el mantenimiento de fachadas con la misma seriedad con la que se trata la obra que las levantó. Durante años vimos edificios extraordinarios deteriorarse por trabajos improvisados, sin diagnóstico, sin protocolo y —lo más grave— sin seguridad para quien los ejecuta.',
      'Empezamos con una cuerda, un arnés y un compromiso: que cada persona que sube a trabajar con nosotros baje completa, todos los días. Ese compromiso es el que ordena todo lo demás: la capacitación, el equipo que compramos, los tiempos que ofrecemos y los trabajos que decidimos no tomar.',
      'Hoy operamos en cuatro ciudades y seguimos midiendo el éxito de la misma forma: por la confianza del cliente que nos vuelve a llamar y por el número de personas que regresan a casa sin un rasguño. Si su inmueble necesita atención, nos dará mucho gusto subir a verlo.'
    ]
  }
};
