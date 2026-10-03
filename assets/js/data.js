/* =============================================================================
   ASAP Gestión de Proyectos 369 — Capa de contenido
   -----------------------------------------------------------------------------
   Todo el contenido editorial del sitio vive en este archivo. Para actualizar
   servicios, ubicaciones del mapa y de la sección de proyectos, indicadores
   o textos basta con modificar los objetos de abajo: la interfaz se
   reconstruye sola.
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
   3. Dónde hemos trabajado — mapa y sección de proyectos
   -----------------------------------------------------------------------------
   ENTIDADES son los estados, en el orden de los botones del mapa y de los
   filtros. Su `id` es la clave del estado en el mapa (assets/js/map-paths.js).

   UBICACIONES alimenta el mapa, la sección de proyectos, el selector de
   ciudad del formulario, el pie de página y los indicadores. Cada una lleva:
     · estado — id de ENTIDADES. Es el estado que se ilumina al elegirla.
     · lat, lon — coordenadas reales, como referencia.
     · xy — su lugar en el mapa (viewBox 0 0 793 498). Se proyecta con
         x =  25.289593 · lon −  0.456255 · lat + 2998.2434
         y =  −1.361053 · lon − 28.023522 · lat +  782.1887
       y se corrige a mano cuando el contorno simplificado del mapa no
       coincide con la costa real: el punto siempre debe quedar dentro de
       su propio estado. En la bahía de Banderas el mapa dibuja la costa
       unos 30 km al norte, por eso Bucerías, Nuevo Vallarta y los demás
       puntos de Nayarit se movieron hasta su lado del límite con Jalisco.
     · tipo — opcional, cuando no es una ciudad: 'Región' o 'Municipio'.
     · base — la base de operaciones.
   -------------------------------------------------------------------------- */
export const ENTIDADES = [
  { id: 'jal', nombre: 'Jalisco' },
  { id: 'nay', nombre: 'Nayarit' },
  { id: 'col', nombre: 'Colima' },
  { id: 'sin', nombre: 'Sinaloa' },
  { id: 'mic', nombre: 'Michoacán' },
  { id: 'que', nombre: 'Querétaro' },
  { id: 'cmx', nombre: 'Ciudad de México' },
  { id: 'nle', nombre: 'Nuevo León' },
  { id: 'roo', nombre: 'Quintana Roo' }
];

export const UBICACIONES = [
  { id: 'manzanillo',          nombre: 'Manzanillo',          estado: 'col', lat: 19.0522, lon: -104.3158, xy: [354.1, 380.3] },
  { id: 'colima',              nombre: 'Colima',              estado: 'col', lat: 19.2452, lon: -103.7241, xy: [366.3, 384.0] },
  { id: 'bahia-de-banderas',   nombre: 'Bahía de Banderas',   estado: 'nay', lat: 20.8019, lon: -105.2470, xy: [328.1, 333.2], tipo: 'Municipio' },
  { id: 'melaque',             nombre: 'Melaque',             estado: 'jal', lat: 19.2228, lon: -104.7027, xy: [343.6, 374.7] },
  { id: 'monterrey',           nombre: 'Monterrey',           estado: 'nle', lat: 25.6866, lon: -100.3161, xy: [449.6, 198.9] },
  { id: 'puerto-vallarta',     nombre: 'Puerto Vallarta',     estado: 'jal', lat: 20.6534, lon: -105.2253, xy: [330.2, 339.0] },
  { id: 'guadalajara',         nombre: 'Guadalajara',         estado: 'jal', lat: 20.6597, lon: -103.3496, xy: [375.1, 343.9], base: true },
  { id: 'queretaro',           nombre: 'Querétaro',           estado: 'que', lat: 20.5888, lon: -100.3899, xy: [450.0, 341.9] },
  { id: 'morelia',             nombre: 'Morelia',             estado: 'mic', lat: 19.7060, lon: -101.1950, xy: [430.1, 367.7] },
  { id: 'cancun',              nombre: 'Cancún',              estado: 'roo', lat: 21.1619, lon:  -86.8515, xy: [785.5, 315.3] },
  { id: 'cdmx',                nombre: 'Ciudad de México',    estado: 'cmx', lat: 19.4326, lon:  -99.1332, xy: [482.3, 372.5] },
  { id: 'mazatlan',            nombre: 'Mazatlán',            estado: 'sin', lat: 23.2494, lon: -106.4111, xy: [302.7, 270.3] },
  { id: 'riviera-nayarit',     nombre: 'Riviera Nayarit',     estado: 'nay', lat: 20.8689, lon: -105.4407, xy: [324.7, 331.9], tipo: 'Región' },
  { id: 'tepic',               nombre: 'Tepic',               estado: 'nay', lat: 21.5045, lon: -104.8946, xy: [335.7, 322.3] },
  { id: 'cruz-de-huanacaxtle', nombre: 'Cruz de Huanacaxtle', estado: 'nay', lat: 20.7517, lon: -105.3800, xy: [323.7, 333.4] },
  // en la lista llegó como «Plaza del Carmen»; se tomó como Playa del Carmen
  { id: 'playa-del-carmen',    nombre: 'Playa del Carmen',    estado: 'roo', lat: 20.6296, lon:  -87.0739, xy: [786.8, 322.6] },
  { id: 'nuevo-vallarta',      nombre: 'Nuevo Vallarta',      estado: 'nay', lat: 20.6986, lon: -105.2981, xy: [326.6, 333.8] },
  { id: 'bucerias',            nombre: 'Bucerías',            estado: 'nay', lat: 20.7560, lon: -105.3340, xy: [324.7, 334.0] }
];

/* Ayudas para leer las listas de arriba */
export const entidad = id => ENTIDADES.find(e => e.id === id);
export const ubicacionesDe = estadoId => UBICACIONES.filter(u => u.estado === estadoId);

/* -----------------------------------------------------------------------------
   4. Proyecto en curso — tarjeta de la portada
   -----------------------------------------------------------------------------
   Es lo que aparece sobre el video del recuadro: «Proyecto en curso», la
   ciudad y el estado, el servicio que se está ejecutando y la barra de
   avance animada.

   · `ciudad` y `estado` se escriben a mano.
   · `servicio` es el texto de la segunda línea; déjalo en null para ocultarla.
   · Si en algún momento no quieres anunciar ninguno, pon `mostrar: false`:
     la tarjeta vuelve al texto genérico de trabajos verticales.
   -------------------------------------------------------------------------- */
export const OBRA_ACTIVA = {
  mostrar: true,
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
const enLista = l => l.length > 1 ? `${l.slice(0, -1).join(', ')} y ${l[l.length - 1]}` : l.join('');

export const METRICAS = [
  { v: SERVICIOS.length, suf: '', t: 'Especialidades', d: 'Fachada, cristal, membrana y estructura bajo un mismo responsable de obra.' },
  { v: UBICACIONES.length, suf: '', t: 'Ubicaciones', d: 'Ciudades y destinos donde hemos ejecutado trabajos verticales.' },
  { v: ENTIDADES.length, suf: '', t: 'Estados', d: `${enLista(ENTIDADES.map(e => e.nombre))}.` },
  { v: 2, suf: '', t: 'Litorales', d: 'Del Pacífico, de Mazatlán a Manzanillo, al Caribe de Cancún y Playa del Carmen.' }
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
