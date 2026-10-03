/* =============================================================================
   ASAP Gestión de Proyectos 369 — Capa de contenido
   -----------------------------------------------------------------------------
   Todo el contenido editorial del sitio vive en este archivo. Para actualizar
   servicios, ciudades, pines del mapa o el portafolio basta con modificar los
   objetos de abajo: la interfaz se reconstruye sola.
   ========================================================================== */

/* -----------------------------------------------------------------------------
   1. Servicios principales
   -------------------------------------------------------------------------- */
export const SERVICIOS = [
  {
    id: 'pintura',
    num: '01',
    nombre: 'Pintura de fachadas',
    claim: 'Muros y superficies de todo tipo',
    desc: 'Aplicación de pintura en muros y diferentes tipos de superficies como cempanel, Durock, Tablaroca, etc.',
    puntos: ['Cempanel', 'Durock', 'Tablaroca', 'Muros y superficies diversas'],
    icono: '<rect x="3" y="4" width="12" height="5" rx="1"/><path d="M15 6.5h4v4h-6"/><path d="M13 10.5v3.5h-2v6h2"/><path d="M11 14h2"/>'
  },
  {
    id: 'cristales',
    num: '02',
    nombre: 'Lavado de cristales',
    claim: 'Cristal a detalle, a cualquier altura',
    desc: 'Lavado de cristales a detalle de fachadas, domos, parasoles, etc.',
    puntos: ['Fachadas de cristal', 'Domos', 'Parasoles', 'Lavado a detalle'],
    icono: '<path d="M3 4h18v13H3z"/><path d="M12 4v13M3 10.5h18"/><path d="m16.5 20.5 3.5-3.5"/><path d="M6 20.5h4"/>'
  },
  {
    id: 'membrana',
    num: '03',
    nombre: 'Membrana arquitectónica',
    claim: 'Lavado, mantenimiento y tensores',
    desc: 'Lavado de membrana arquitectónica, mantenimiento preventivo y revisión de tensores.',
    puntos: ['Lavado de membrana', 'Mantenimiento preventivo', 'Revisión de tensores'],
    icono: '<path d="M3 15c3-6.5 15-6.5 18 0"/><path d="M3 15v4M21 15v4"/><path d="M8 12.4 6.6 19M16 12.4l1.4 6.6M12 11.6V19"/>'
  },
  {
    id: 'impermeabilizacion',
    num: '04',
    nombre: 'Impermeabilización',
    claim: 'Cubiertas selladas contra la filtración',
    desc: 'Impermeabilización de azoteas, pretiles, domos y juntas, con preparación previa de la superficie y sellado de las penetraciones.',
    puntos: ['Azoteas y cubiertas', 'Pretiles y domos', 'Juntas y penetraciones', 'Preparación de superficie'],
    icono: '<path d="M12 3.4 5 6.1v5.5c0 4.2 2.9 7.3 7 8.4 4.1-1.1 7-4.2 7-8.4V6.1z"/><path d="M12 8.7s2.4 2.3 2.4 3.9a2.4 2.4 0 0 1-4.8 0C9.6 11 12 8.7 12 8.7z"/>'
  },
  {
    id: 'empastado',
    num: '05',
    nombre: 'Empastado de muros',
    claim: 'Del revestimiento al sellado',
    desc: 'Revestimiento de muros, empastado, aplanado, impermeabilizado y sellado.',
    puntos: ['Revestimiento y empastado', 'Aplanado', 'Impermeabilizado', 'Sellado'],
    icono: '<path d="M3 20V6h10v14"/><path d="M3 11h10"/><path d="m16.8 5.4 3.8 3.8-6.2 6.2-3.8-3.8z"/>'
  },
  {
    id: 'estructuras',
    num: '06',
    nombre: 'Restauración de estructuras',
    claim: 'Metal tratado y protegido',
    desc: 'Restauración de estructuras metálicas y aplicación de tratamiento para metales.',
    puntos: ['Estructura metálica', 'Tratamiento para metales', 'Restauración en altura'],
    icono: '<path d="M4 20V6l8-3 8 3v14"/><path d="M4 20h16"/><path d="m4 10 16 6M20 10 4 16"/>'
  },
  {
    id: 'sellado',
    num: '07',
    nombre: 'Sellado de fachadas',
    claim: 'Juntas, grietas y fisuras',
    desc: 'Sellado de fachadas de cristal, alucobond, cempanel y muros prefabricados; sellado de grietas y fisuras.',
    puntos: ['Fachada de cristal', 'Alucobond y cempanel', 'Muros prefabricados', 'Grietas y fisuras'],
    icono: '<path d="M4 8h9l4-3v9l-4-3H4z"/><path d="M4 8v8"/><path d="M18 14v6"/><path d="M18 20a1.8 1.8 0 0 0 0-3.6"/>'
  },
  {
    id: 'fachadas',
    num: '08',
    nombre: 'Restauración de fachadas',
    claim: 'Reemplazo y recuperación de paneles',
    desc: 'Restauración de fachadas y reemplazo de cempanel y muros prefabricados.',
    puntos: ['Restauración de fachada', 'Reemplazo de cempanel', 'Muros prefabricados'],
    icono: '<path d="M4 4h16v16H4z"/><path d="M4 12h16M12 4v16"/><path d="M14.4 18.4 20 12.8"/><path d="M20 16.4v-3.6h-3.6"/>'
  }
];

/* -----------------------------------------------------------------------------
   2. Trabajos verticales — técnicas y ventajas
   -------------------------------------------------------------------------- */
export const VERTICALES = {
  ventajas: [
    { k: '01', t: 'Montaje en minutos', d: 'Sin andamio, sin grúa y sin plataforma elevadora: el equipo desciende desde azotea en cuestión de minutos.' },
    { k: '02', t: 'Menor costo de acceso', d: 'Se elimina la renta, el montaje y el desmontaje de estructuras auxiliares en obras de mediana y gran altura.' },
    { k: '03', t: 'Cero interrupción', d: 'El inmueble sigue operando: no bloqueamos accesos, cajones de estacionamiento ni áreas comunes.' },
    { k: '04', t: 'Difícil acceso', d: 'Volados, domos, cúpulas, fachadas inclinadas, patios interiores y torres con base ocupada.' }
  ],
  tecnicas: [
    { t: 'Acceso por cuerdas', d: 'Doble línea independiente —trabajo y seguridad— con descensor autobloqueante y anticaídas.' },
    { t: 'Sistemas de anclaje', d: 'Anclajes estructurales, contrapesos calculados y líneas de vida temporales.' },
    { t: 'Plan de rescate', d: 'Cada maniobra cuenta con plan de rescate en altura y personal de tierra dedicado.' },
    { t: 'Delimitación de zona', d: 'Acordonamiento, señalización y vigía en la proyección vertical del área de trabajo.' }
  ],
  seguridad: [
    'Procedimientos alineados a la NOM-009-STPS-2011 (trabajos en altura)',
    'Análisis de riesgos por proyecto antes de cada maniobra',
    'Inspección y bitácora del equipo de protección anticaídas',
    'Personal capacitado en trabajos en altura',
    'Delimitación y señalización del área de trabajo'
  ]
};

/* -----------------------------------------------------------------------------
   3. Cobertura
   -----------------------------------------------------------------------------
   CIUDADES guarda la posición de cada localidad en el sistema del viewBox del
   mapa (0 0 793 498), proyectada desde su latitud y longitud reales. Los
   marcadores del mapa se arman con esto: cada proyecto se coloca en la ciudad
   que trae en `PROYECTOS`, así que basta agregarlo ahí para que aparezca.

   Para sumar una ciudad nueva, calcula sus coordenadas con:
     x =  25.289593 · longitud −  0.456255 · latitud + 2998.2434
     y =  −1.361053 · longitud − 28.023522 · latitud +  782.1887
   -------------------------------------------------------------------------- */
export const CIUDADES = {
  'Guadalajara':     [375.1, 343.9],
  'Puerto Vallarta': [327.7, 346.6],
  'Nuevo Vallarta':  [326.1, 345.6],
  'Morelia':         [430.3, 367.8],
  'Juriquilla':      [448.5, 338.7]
};

/* `estados` acepta varias entidades: la zona de Vallarta abarca Jalisco
   (Puerto Vallarta) y Nayarit (Nuevo Vallarta). `centro` es la ciudad que
   representa a la zona en la vista nacional. */
export const ZONAS = [
  {
    id: 'guadalajara',
    ciudad: 'Guadalajara',
    estado: 'Jalisco',
    estados: ['jal'],
    centro: 'Guadalajara',
    base: true,
    resumen: 'Nuestra base de operaciones. Desde aquí coordinamos el equipo, el material y los programas de trabajo de las cuatro ciudades.',
    destacados: ['Base operativa', 'Coordinación de obra', 'Atención comercial']
  },
  {
    id: 'vallarta',
    ciudad: 'Puerto Vallarta',
    estado: 'Jalisco y Nayarit',
    estados: ['jal', 'nay'],
    centro: 'Puerto Vallarta',
    resumen: 'Costa del Pacífico y la mayor concentración de nuestro portafolio: hotelería, condominios verticales y plazas frente al mar.',
    destacados: ['Hotelería', 'Condominios verticales', 'Plazas comerciales']
  },
  {
    id: 'morelia',
    ciudad: 'Morelia',
    estado: 'Michoacán',
    estados: ['mic'],
    centro: 'Morelia',
    resumen: 'Centro del país. Hospital, plaza comercial y centro corporativo atendidos con acceso por cuerdas.',
    destacados: ['Salud', 'Retail', 'Corporativo']
  },
  {
    id: 'queretaro',
    ciudad: 'Querétaro',
    estado: 'Querétaro',
    estados: ['que'],
    centro: 'Juriquilla',
    resumen: 'Corredor corporativo del Bajío, en la zona de Juriquilla.',
    destacados: ['Corporativo', 'Usos mixtos']
  }
];

/* -----------------------------------------------------------------------------
   4. Portafolio
   Los campos técnicos (anio, superficie, altura, servicios, reto, solucion,
   resultado) son opcionales: la tarjeta y la ficha muestran únicamente los que
   tengan contenido. Al llenarlos, la interfaz se enriquece sola y se activa el
   filtro por servicio.
   -------------------------------------------------------------------------- */
export const PROYECTOS = [
  { id: 'hospiten',        nombre: 'Hospiten',                    zona: 'vallarta',  ciudad: 'Puerto Vallarta', estado: 'Jalisco',    sector: 'Salud',       servicios: [] },
  { id: 'vista-del-sol',   nombre: 'Condominio Vista del Sol',    zona: 'vallarta',  ciudad: 'Puerto Vallarta', estado: 'Jalisco',    sector: 'Residencial', servicios: [] },
  { id: 'westin',          nombre: 'Hotel Westin',                zona: 'vallarta',  ciudad: 'Puerto Vallarta', estado: 'Jalisco',    sector: 'Hotelería',   servicios: [] },
  { id: 'plaza-marina',    nombre: 'Plaza Marina',                zona: 'vallarta',  ciudad: 'Puerto Vallarta', estado: 'Jalisco',    sector: 'Comercial',   servicios: [] },
  { id: 'kristal-grand',   nombre: 'Kristal Grand',               zona: 'vallarta',  ciudad: 'Puerto Vallarta', estado: 'Jalisco',    sector: 'Hotelería',   servicios: [] },
  { id: 'condominio-icon', nombre: 'Condominio Icon',             zona: 'vallarta',  ciudad: 'Puerto Vallarta', estado: 'Jalisco',    sector: 'Residencial', servicios: [] },
  // Ciudad por confirmar: en la lista original este proyecto no traía ubicación.
  { id: 'holiday-inn',     nombre: 'Holiday Inn Express / Select', zona: 'vallarta', ciudad: 'Puerto Vallarta', estado: 'Jalisco',    sector: 'Hotelería',   servicios: [] },
  { id: 'hampton',         nombre: 'Hotel Hampton',               zona: 'vallarta',  ciudad: 'Nuevo Vallarta',  estado: 'Nayarit',    sector: 'Hotelería',   servicios: [] },
  { id: 'centro-capital-mor', nombre: 'Centro Capital',           zona: 'morelia',   ciudad: 'Morelia',         estado: 'Michoacán',  sector: 'Corporativo', servicios: [] },
  { id: 'hospital-victoria',  nombre: 'Hospital Victoria',        zona: 'morelia',   ciudad: 'Morelia',         estado: 'Michoacán',  sector: 'Salud',       servicios: [] },
  { id: 'plaza-las-americas', nombre: 'Plaza Las Américas',       zona: 'morelia',   ciudad: 'Morelia',         estado: 'Michoacán',  sector: 'Comercial',   servicios: [] },
  { id: 'centro-capital-qro', nombre: 'Centro Capital',           zona: 'queretaro', ciudad: 'Juriquilla',      estado: 'Querétaro',  sector: 'Corporativo', servicios: [] }
];

/* -----------------------------------------------------------------------------
   4b. Proyecto en curso — tarjeta de la portada
   -----------------------------------------------------------------------------
   Es lo que aparece sobre el video del recuadro: «Proyecto en curso», la
   ciudad y el estado, el servicio que se está ejecutando y la barra de
   avance animada.

   · `ciudad` y `estado` se escriben a mano. Si prefieres tomarlos de un
     proyecto del portafolio, pon su `id` en `proyecto` y deja esos dos en null.
   · `servicio` es el texto de la segunda línea; déjalo en null para ocultarla.
   · Si en algún momento no quieres anunciar ninguno, pon `mostrar: false`:
     la tarjeta vuelve al texto genérico de trabajos verticales.
   -------------------------------------------------------------------------- */
export const OBRA_ACTIVA = {
  mostrar: true,
  proyecto: null,              // id de PROYECTOS, o null para usar ciudad y estado
  ciudad: 'Guadalajara',
  estado: 'Jalisco',
  servicio: 'Pintura de fachadas'
};

/* -----------------------------------------------------------------------------
   5. Proceso de trabajo
   -------------------------------------------------------------------------- */
export const PROCESO = [
  { n: '01', t: 'Levantamiento técnico', d: 'Visita a sitio, medición de superficies, identificación de patologías y revisión de puntos de anclaje disponibles en azotea.', dur: 'Paso 1' },
  { n: '02', t: 'Propuesta y alcance', d: 'Presupuesto por partida, programa de trabajo y alcance acordado antes de mover un solo equipo.', dur: 'Paso 2' },
  { n: '03', t: 'Plan de seguridad', d: 'Análisis de riesgos, plan de rescate en altura, delimitación de zonas y documentación para el administrador del inmueble.', dur: 'Previo al arranque' },
  { n: '04', t: 'Ejecución controlada', d: 'Frentes simultáneos, bitácora diaria con evidencia fotográfica y avance medido contra programa.', dur: 'Obra' },
  { n: '05', t: 'Entrega', d: 'Recorrido de aceptación, memoria fotográfica antes y después, y plan de mantenimiento recomendado.', dur: 'Cierre' }
];

/* -----------------------------------------------------------------------------
   6. Indicadores
   Se calculan a partir del contenido de este archivo: no hay cifras sueltas
   que actualizar por separado.
   -------------------------------------------------------------------------- */
export const METRICAS = [
  { v: SERVICIOS.length, suf: '', t: 'Especialidades', d: 'Fachada, cristal, membrana y estructura bajo un mismo responsable de obra.' },
  { v: PROYECTOS.length, suf: '', t: 'Proyectos en portafolio', d: 'Hotelería, salud, comercial, residencial y corporativo.' },
  { v: ZONAS.length, suf: '', t: 'Ciudades atendidas', d: 'Guadalajara, Puerto Vallarta, Morelia y Querétaro.' },
  { v: 4, suf: '', t: 'Estados', d: 'Jalisco, Nayarit, Michoacán y Querétaro.' }
];

/* -----------------------------------------------------------------------------
   7. Empresa
   -------------------------------------------------------------------------- */
export const EMPRESA = {
  nombre: 'ASAP Gestión de Proyectos 369',
  email: 'aserrano@asapgp.com.mx',
  telefonos: [
    { ciudad: 'Guadalajara', display: '33 1323 0878', href: '+523313230878' },
    { ciudad: 'Puerto Vallarta', display: '322 383 5244', href: '+523223835244' }
  ],
  dir: 'Guadalajara, Jalisco, México',

  intro: 'En ASAP nos adaptamos a las necesidades de nuestros clientes, ya sean particulares, empresas o instituciones. Nuestra filosofía se basa en la confianza, el profesionalismo y el compromiso con nuestros clientes.',

  mision: 'Ofrecer servicios de trabajos verticales con rapidez y profesionalismo, garantizando resultados de calidad «ASAP» para cada proyecto, sin comprometer la calidad de nuestros servicios. Nos dedicamos a construir relaciones de confianza con nuestros clientes; aspiramos a ser el socio confiable que te acompañe en el logro de nuevas alturas.',

  vision: 'Ser líderes en soluciones de trabajos de altura y difícil acceso, ofreciendo servicios seguros y eficientes que superen las expectativas de nuestros clientes.',

  valores: [
    { t: 'Confianza', d: 'Construimos relaciones de largo plazo: buscamos ser el socio al que se vuelve a llamar.' },
    { t: 'Profesionalismo', d: 'Rapidez sin comprometer la calidad, en cada proyecto y en cada maniobra.' },
    { t: 'Compromiso', d: 'Nos adaptamos a lo que cada cliente necesita, sea particular, empresa o institución.' }
  ],

  fundador: {
    cargo: 'Fundador y Director General',
    mensaje: 'En ASAP entendemos que cada proyecto es único, por lo que trabajamos de la mano con nuestros clientes para ofrecer soluciones personalizadas que superen sus expectativas. ¡Déjanos ayudarte a alcanzar nuevas alturas!'
  }
};

/* -----------------------------------------------------------------------------
   8. Cintas animadas
   ⚠ TODOS LOS NOMBRES DE ESTAS LISTAS SON FICTICIOS: están solo para mostrar
   el diseño. Sustitúyelos por los proveedores y clientes reales antes de
   publicar el sitio, o quedará dicho que se trabajó con empresas inventadas.

   rotulo:   el título que acompaña a la cinta.
   posicion: 'arriba' o 'abajo' — dónde va el título respecto a la cinta.
   nombres:  lo que corre en la cinta; se repite solo hasta llenar la pantalla.
   sentido:  -1 corre hacia la izquierda, 1 hacia la derecha.
   estilo:   'llena' (letra sólida) o 'hueca' (solo el contorno).
   -------------------------------------------------------------------------- */
export const CINTAS = [
  {
    rotulo: 'Proveedores',
    posicion: 'arriba',
    nombres: [
      'Andesita Recubrimientos', 'Cordal Equipos de Altura', 'Prisma Impermeables',
      'Tensa Membranas', 'Lumbre Pinturas', 'Alcor Anclajes'
    ],
    sentido: -1,
    estilo: 'llena'
  },
  {
    rotulo: 'Con quienes hemos trabajado',
    posicion: 'abajo',
    nombres: [
      'Hotel Bahía Serena', 'Torre Alcázar', 'Plaza Cantera',
      'Clínica Santa Brisa', 'Residencial Los Agaves', 'Desarrollos Cumbre Alta'
    ],
    sentido: 1,
    estilo: 'hueca'
  }
];
