/* =====================================================================
   MAPA TÁCTICO — Hotel / Extracción
   · Gráficos 2.5D: muros con volumen, pisos con textura, mobiliario con sombra
   · Niebla dinámica: se abre donde hay personajes y se cierra al salir
   · Estados: activo · incapacitado · neutralizado · muerto
   ===================================================================== */

const STATUS = {
  activo:       { label: 'Activo',       icon: '●', color: '#34d399', canMove: true,  canAct: true,  vision: true  },
  incapacitado: { label: 'Incapacitado', icon: '!', color: '#f87171', canMove: false, canAct: false, vision: true  },
  neutralizado: { label: 'Neutralizado', icon: 'z', color: '#a5b4c8', canMove: false, canAct: false, vision: false },
  muerto:       { label: 'Muerto',       icon: '✖', color: '#94a3b8', canMove: false, canAct: false, vision: false }
};

const STATE = {
  view: window.innerWidth <= 768 ? 'p4' : 'all',
  gmMode: false,            // "Ver todo": quita la niebla completa
  peek: {},                 // salas exploradas manualmente (se borran con el botón Niebla)
  noise: 0,
  zoom: 1,
  selectedRoom: 'room_408',
  activeToken: 'AU',
  drawerMinimized: false,
  lootMasterCard: false,
  dragState: null,
  lastTrail: { tokenId: 'AU', x1: 185, y1: 390, x2: 205, y2: 278, distMeters: '4.1m' },
  tokens: {
    'AU': { id: 'AU', name: 'Audomaro', role: 'Líder Táctico',     color: '#10b981', hp: 18, maxHp: 18, ammo: 18, reserve: 16, weapon: 'Glock 17 Supresor', x: 205, y: 278, status: 'activo' },
    'AR': { id: 'AR', name: 'Armando',  role: 'Operador / Ganzúa', color: '#38bdf8', hp: 16, maxHp: 16, ammo: 30, reserve: 30, weapon: 'Subfusil MP9',      x: 222, y: 395, status: 'activo' },
    'GZ': { id: 'GZ', name: 'Gonzalo',  role: 'Civil (Herido)',    color: '#f59e0b', hp: 12, maxHp: 14, ammo: 0,  reserve: 0,  weapon: 'Croquis del Hotel', x: 155, y: 425, status: 'activo' }
  },
  enemies: {
    'Z1': { id: 'Z1', name: 'Amenaza 412',        x: 335,  y: 295, status: 'activo' },
    'Z2': { id: 'Z2', name: 'Amenaza Rellano A',  x: 628,  y: 310, status: 'activo' },
    'Z3': { id: 'Z3', name: 'Amenaza Rellano B',  x: 645,  y: 332, status: 'activo' },
    'Z4': { id: 'Z4', name: 'Amenaza Patio A',    x: 1105, y: 240, status: 'activo' },
    'Z5': { id: 'Z5', name: 'Amenaza Patio B',    x: 1148, y: 222, status: 'activo' }
  },
  lastRollHtml: '<span style="color:#94a3b8;">💡 <strong>Táctil y Responsivo:</strong> Arrastra cada ficha (<strong>AU</strong>, <strong>AR</strong>, <strong>GZ</strong>) con el dedo o mouse, o pellizca con 2 dedos para hacer zoom. La niebla se abre sola donde haya personajes.</span>'
};

/* ---------------------------------------------------------------------
   GEOMETRÍA
   kind: (vacío) interior con muros · 'out' exterior con borde · 'walk' pasarela · 'shaft' cubo de escalera
   decor: sala sin ficha de juego (solo ambiente)
   --------------------------------------------------------------------- */
const ROOM_BOUNDS = [
  { id: 'walkway_4p',   name: 'Pasarela Ext.',    x: 38,   y: 320, w: 52,  h: 185, floor: 'grate', kind: 'walk' },
  { id: 'fire_door_4p', name: 'Cortafuegos P4',   x: 94,   y: 106, w: 56,  h: 125, floor: 'conc' },
  { id: 'room_402',     name: 'Cuarto 402',       x: 150,  y: 106, w: 115, h: 125, floor: 'tile' },
  { id: 'room_404',     name: 'Hab. 404',         x: 265,  y: 106, w: 90,  h: 125, floor: 'wood',  decor: true },
  { id: 'room_406',     name: 'Hab. 406',         x: 355,  y: 106, w: 90,  h: 125, floor: 'wood',  decor: true },
  { id: 'elev_4p',      name: 'Elevadores',       x: 445,  y: 106, w: 76,  h: 125, floor: 'haz',   decor: true },
  { id: 'corridor_4p',  name: 'Pasillo 4to Piso', x: 94,   y: 231, w: 427, h: 90,  floor: 'carpet' },
  { id: 'room_408',     name: 'Habitación 408',   x: 94,   y: 321, w: 165, h: 182, floor: 'wood' },
  { id: 'room_410',     name: 'Hab. 410',         x: 259,  y: 321, w: 115, h: 182, floor: 'wood',  decor: true },
  { id: 'room_412',     name: 'Habitación 412',   x: 374,  y: 321, w: 147, h: 182, floor: 'wood' },
  { id: 'stairs_p4_p3', name: 'Escalera P4→P3',   x: 563,  y: 110, w: 189, h: 120, floor: 'conc', kind: 'shaft' },
  { id: 'stairs_p2',    name: 'Descanso Piso 2',  x: 563,  y: 238, w: 189, h: 135, floor: 'conc', kind: 'shaft' },
  { id: 'stairs_p1',    name: 'Base Escalera P1', x: 563,  y: 381, w: 189, h: 118, floor: 'conc', kind: 'shaft' },
  { id: 'dock_pb',      name: 'Muelle de Carga',  x: 810,  y: 108, w: 215, h: 195, floor: 'conc' },
  { id: 'lobby_pb',     name: 'Lobby Principal',  x: 810,  y: 308, w: 265, h: 194, floor: 'marble' },
  { id: 'yard_pb',      name: 'Patio (15m)',      x: 1030, y: 108, w: 180, h: 195, floor: 'asph', kind: 'out' },
  { id: 'pickup_pb',    name: 'Cajón Pickup',     x: 1212, y: 108, w: 162, h: 195, floor: 'asph', kind: 'out' },
  { id: 'gate_pb',      name: 'Caseta Salida',    x: 1080, y: 308, w: 294, h: 194, floor: 'asph', kind: 'out' }
];

// Puertas, ventanas y pasos abiertos. h:1 = muro horizontal (y=c), h:0 = muro vertical (x=c). a..b = hueco.
const DOORS = [
  { h: 1, c: 231, a: 195, b: 220, dir: -1, col: '#f59e0b' },   // 402
  { h: 1, c: 231, a: 108, b: 134, dir: -1, col: '#38bdf8' },   // cortafuegos
  { h: 1, c: 231, a: 296, b: 320, dir: -1, col: '#64748b' },   // 404
  { h: 1, c: 231, a: 386, b: 410, dir: -1, col: '#64748b' },   // 406
  { h: 1, c: 231, a: 470, b: 496, dir: -1, col: '#ef4444' },   // elevadores
  { h: 1, c: 321, a: 174, b: 201, dir: 1,  col: '#10b981' },   // 408
  { h: 1, c: 321, a: 318, b: 342, dir: 1,  col: '#64748b' },   // 410
  { h: 1, c: 321, a: 432, b: 457, dir: 1,  col: '#ef4444' },   // 412
  { h: 0, c: 94,  a: 445, b: 475, dir: 1,  col: '#94a3b8' },   // 408 → pasarela
  { h: 1, c: 503, a: 135, b: 220, t: 'win' },                  // ventana 408
  { h: 0, c: 760, a: 432, b: 478, dir: -1, col: '#10b981' },   // cubo → exterior
  { h: 0, c: 810, a: 205, b: 235, dir: 1,  col: '#38bdf8' },   // servicio → muelle
  { h: 0, c: 1025, a: 130, b: 225, t: 'curtain' },             // cortina del muelle
  { h: 0, c: 1025, a: 248, b: 275, dir: 1, col: '#10b981' },   // puerta peatonal
  { h: 0, c: 1210, a: 135, b: 260, t: 'open' },                // patio ↔ pickup
  { h: 1, c: 305, a: 1270, b: 1320, t: 'open' },               // pickup → caseta
  { h: 1, c: 502, a: 850, b: 1040, t: 'win' }                  // ventanal del lobby
];

const ROOMS = {
  'room_408': {
    id: 'room_408', floor: 'p4',
    title: 'Habitación 408 — Punto de Partida (Barricada)',
    tokenSpot: { x: 190, y: 405 },
    desc: 'Habitación asegurada en el 4to piso con escritorio de madera maciza contra la puerta, cama doble, baño interior y ventana hacia el norte.',
    secret: 'Fase 1: Desmontar en silencio el escritorio y las toallas de la puerta para salir al pasillo alfombrado.',
    actions: [
      { label: 'Desmontar barricada y salir al pasillo', dif: 8, mod: 6, next: 'corridor_4p', ok: 'Barricada retirada sin ruido. El personaje activo sale al corredor.', fail: 'El escritorio raspa el piso (+1 Ruido).', failNoise: 1 }
    ]
  },
  'corridor_4p': {
    id: 'corridor_4p', floor: 'p4',
    title: 'Pasillo Central 4to Piso (Alfombrado)',
    tokenSpot: { x: 205, y: 278 },
    desc: 'Corredor longitudinal con alfombra amortiguadora que conecta las habitaciones 402 a 414 y el bloque de elevadores.',
    secret: 'Frente a la puerta 410 yace en letargo el infectado de la 412. Si alguien tropieza (Fallo), queda incapacitado en el pasillo mientras los demás pueden posicionarse por separado.',
    actions: [
      { label: 'Avanzar en sigilo por la alfombra hacia la 402', dif: 10, mod: 6, next: 'room_402', ok: 'Avance sigiloso exitoso hasta la puerta 402.', fail: '¡Tropiezo en la alfombra! El personaje activo queda incapacitado y genera +1 Ruido.', failNoise: 1, tripOnFail: true },
      { label: 'Neutralización CQC silenciosa en el pasillo', dif: 9, mod: 7, next: 'corridor_4p', neutralize: ['Z1'], ok: 'Amenaza neutralizada en silencio total sin gastar munición.', fail: 'Forcejeo en el suelo (+1 Ruido); el personaje queda incapacitado en su posición.', failNoise: 1, tripOnFail: true }
    ]
  },
  'room_412': {
    id: 'room_412', floor: 'p4',
    title: 'Habitación 412 — Zona de Impactos',
    tokenSpot: { x: 430, y: 405 },
    desc: 'Suite ejecutiva con marcas de impactos balísticos en la entrada y mobiliario derribado.',
    secret: '18 casquillos 9mm percutidos en el umbral. Sin recursos adicionales útiles para la ruta de extracción.',
    actions: []
  },
  'walkway_4p': {
    id: 'walkway_4p', floor: 'p4',
    title: 'Pasarela Exterior de Mantenimiento (Altura: 14m)',
    tokenSpot: { x: 65, y: 395 },
    desc: 'Andador metálico volado en la fachada lateral a 14 metros sobre el nivel de calle.',
    secret: 'Ruta nocturna descartada por riesgo crítico de caída.',
    actions: []
  },
  'room_402': {
    id: 'room_402', floor: 'p4',
    title: 'Habitación 402 — Cuarto de Servicio y Camaristas',
    tokenSpot: { x: 195, y: 165 },
    desc: 'Cuarto técnico con estanterías de blancos, carros de limpieza, productos químicos y cesto industrial de lavandería.',
    secret: 'Botín: Tarjeta Maestra magnética, barra de uña (Daño 3), 2 botellas de cloro y guantes. Peligro oculto en el cesto de ropa sucia (Percepción DIF 10).',
    actions: [
      { label: 'Forzar cerradura con ganzúa (Personaje activo)', dif: 9, mod: 4, next: 'room_402', loot: true, ok: 'Cerradura abierta en 10 segundos sin ruido.', fail: 'La ganzúa se dobla; se fuerza con palanca (+1 Ruido).', failNoise: 1 },
      { label: 'Inspeccionar cesto y asegurar Tarjeta Maestra', dif: 10, mod: 6, next: 'fire_door_4p', loot: true, ok: 'Peligro en el cesto detectado a tiempo. Tarjeta Maestra y herramientas aseguradas.', fail: 'Emboscada desde el cesto (+1 Ruido); el personaje queda incapacitado.', failNoise: 1, tripOnFail: true }
    ]
  },
  'fire_door_4p': {
    id: 'fire_door_4p', floor: 'p4',
    title: 'Puerta Cortafuegos — Acceso al Cubo de Escaleras',
    tokenSpot: { x: 120, y: 165 },
    desc: 'Puerta metálica pesada con barra antipánico que comunica el ala izquierda del 4to piso con el cubo vertical de servicio.',
    secret: 'Ruta limpia que evita por completo los elevadores y el vestíbulo principal.',
    actions: [
      { label: 'Cruzar puerta cortafuegos hacia Escalera P4–P3', dif: 0, mod: 0, next: 'stairs_p4_p3', switchFloorOnMobile: 'stairs', ok: 'El personaje activo cruza hacia el cubo de concreto de la escalera.' }
    ]
  },
  'stairs_p4_p3': {
    id: 'stairs_p4_p3', floor: 'stairs',
    title: 'Cubo de Escalera — Tramo Superior (Piso 4 a Piso 3)',
    tokenSpot: { x: 650, y: 175 },
    desc: 'Rampa de escalones estrechos de concreto armado con barandal tubular metálico y acústica cerrada.',
    secret: 'Descenso asistido a ritmo controlado para evitar resbalones y eco en el cubo vertical.',
    actions: [
      { label: 'Descender hacia el rellano del Piso 2', dif: 8, mod: 6, next: 'stairs_p2', ok: 'Descenso silencioso escalón por escalón hasta el rellano del Piso 2.', fail: '¡Tropezón en los escalones de concreto! (+1 Ruido y queda incapacitado).', failNoise: 1, tripOnFail: true }
    ]
  },
  'stairs_p2': {
    id: 'stairs_p2', floor: 'stairs',
    title: 'Descanso del Piso 2 — Rellano Intermedio',
    tokenSpot: { x: 650, y: 315 },
    desc: 'Plataforma intermedia donde la puerta del 2do piso se encuentra trabada por un carrito de lavandería.',
    secret: 'Dos amenazas bloquean el rellano junto al carrito. Opción A: 2 disparos con supresor (DIF 11). Opción B: Descolgarse por el barandal hacia el Piso 1 (DIF 14).',
    actions: [
      { label: 'Opción A: Doble disparo silenciado (2 balas 9mm)', dif: 11, mod: 6, ammo: 2, next: 'stairs_p1', kill: ['Z2', 'Z3'], ok: 'Dos blancos abatidos en silencio. Paso libre hacia Planta Baja.', fail: 'Un proyectil impacta el metal del carrito (+1 Ruido).', failNoise: 1 },
      { label: 'Opción B: Saltar barandal hacia el tramo del Piso 1', dif: 14, mod: 4, next: 'stairs_p1', ok: 'Maniobra atlética exitosa hacia el nivel inferior.', fail: 'Mal aterrizaje en el descanso (+1 Ruido y queda incapacitado).', failNoise: 1, tripOnFail: true }
    ]
  },
  'stairs_p1': {
    id: 'stairs_p1', floor: 'stairs',
    title: 'Tramo Inferior Piso 1 — Salida a Muelle de Carga',
    tokenSpot: { x: 650, y: 445 },
    desc: 'Base del cubo de escaleras con puerta de servicio directo hacia el muelle trasero.',
    secret: 'Conecta directamente con la Planta Baja sin pisar el Lobby.',
    actions: [
      { label: 'Entrar al Muelle de Carga en Planta Baja', dif: 0, mod: 0, next: 'dock_pb', switchFloorOnMobile: 'pb', ok: 'El personaje activo accede a la plataforma del Muelle de Descarga.' }
    ]
  },
  'dock_pb': {
    id: 'dock_pb', floor: 'pb',
    title: 'Muelle de Descarga Trasero (Planta Baja)',
    tokenSpot: { x: 920, y: 205 },
    desc: 'Andén de concreto para proveedores con cortina metálica enrollable (asegurada con cadena y candado) y puerta peatonal lateral.',
    secret: 'Levantar la cortina metálica suma +2 de Ruido y da 60s. La puerta peatonal lateral es 100% silenciosa si ya tienes la Tarjeta Maestra de la 402.',
    actions: [
      { label: 'Abrir puerta peatonal lateral con Tarjeta Maestra', dif: 8, mod: 6, needCard: true, next: 'yard_pb', ok: 'Puerta lateral desbloqueada sin emitir ruido (+0 Ruido).', fail: 'Bisagra oxidada rechina levemente (+1 Ruido).', failNoise: 1 },
      { label: 'Romper candado y alzar cortina metálica (+2 Ruido)', dif: 9, mod: 4, forceNoise: 2, next: 'yard_pb', ok: 'Cortina abierta (+2 Ruido). Tienen 60 segundos para cruzar los 15m.', fail: 'Golpe metálico fuerte al abrir (+2 Ruido).', failNoise: 2 }
    ]
  },
  'yard_pb': {
    id: 'yard_pb', floor: 'pb',
    title: 'Patio de Maniobras Exterior (Tramo de 15 Metros)',
    tokenSpot: { x: 1125, y: 205 },
    desc: 'Explanada pavimentada de maniobras a cielo abierto entre el andén de descarga y los cajones de estacionamiento.',
    secret: 'Dos amenazas merodean entre el andén y el vehículo estacionado a 15 metros.',
    actions: [
      { label: 'Cruzar los 15 metros tácticamente hasta el vehículo', dif: 11, mod: 6, ammo: 2, next: 'pickup_pb', kill: ['Z4', 'Z5'], ok: 'Corredor de 15m despejado; aborda el vehículo.', fail: 'Tropiezo o contacto hostil a mitad del asfalto (+1 Ruido). El personaje queda incapacitado.', failNoise: 1, tripOnFail: true }
    ]
  },
  'pickup_pb': {
    id: 'pickup_pb', floor: 'pb',
    title: 'Cajón de Estacionamiento — Camioneta Pickup',
    tokenSpot: { x: 1275, y: 195 },
    desc: 'Vehículo tipo Pickup estacionado en batería a 15 metros del muelle, orientado hacia el carril de salida.',
    secret: 'Batería óptima y 3/4 de tanque de combustible. Llaves en posesión del líder.',
    actions: [
      { label: 'Encender motor y maniobrar hacia la Caseta de Salida', dif: 10, mod: 6, next: 'gate_pb', ok: '¡Extracción completada! La pickup esquiva el auto estrellado y sale a la avenida.', fail: 'Roce de lámina en la caseta (+1 Ruido), pero logran salir.', failNoise: 1 }
    ]
  },
  'gate_pb': {
    id: 'gate_pb', floor: 'pb',
    title: 'Caseta de Control y Rampa Vehicular',
    tokenSpot: { x: 1275, y: 390 },
    desc: 'Garita de vigilancia en el acceso del patio con pluma rota y un automóvil civil impactado contra el bolardo.',
    secret: 'Punto final de extracción hacia las vialidades exteriores.',
    actions: []
  },
  'lobby_pb': {
    id: 'lobby_pb', floor: 'pb',
    title: 'Lobby Principal y Recepción (Zona Clausurada)',
    tokenSpot: { x: 940, y: 420 },
    desc: 'Vestíbulo de doble altura con mostrador de recepción, puertas de cristal destrozadas y acceso a elevadores.',
    secret: 'Zona roja de alta letalidad evitada mediante el descenso por el cubo de servicio.',
    actions: []
  }
};

/* =====================================================================
   LÓGICA: salas, visión y estados
   ===================================================================== */
function detectRoomAt(x, y) {
  for (const b of ROOM_BOUNDS) {
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b;
  }
  return null;
}

const roomLabel = o => { const r = detectRoomAt(o.x, o.y); return r ? r.name : 'En tránsito'; };
const canAct = o => !!STATUS[o.status]?.canAct;
const canMove = o => !!STATUS[o.status]?.canMove;

// Salas sin niebla: donde hay personajes con visión, las exploradas a mano, o todas con "Ver todo".
function visibleRoomIds() {
  const set = new Set();
  if (STATE.gmMode) { ROOM_BOUNDS.forEach(b => set.add(b.id)); return set; }
  Object.values(STATE.tokens).forEach(t => {
    if (!STATUS[t.status].vision) return;
    const r = detectRoomAt(t.x, t.y);
    if (r) set.add(r.id);
  });
  Object.keys(STATE.peek).forEach(id => set.add(id));
  return set;
}
const isRoomVisible = id => visibleRoomIds().has(id);

function firstActiveId() {
  const t = Object.values(STATE.tokens).find(canAct);
  return t ? t.id : null;
}

function setStatus(kind, id, status) {
  const o = kind === 'enemy' ? STATE.enemies[id] : STATE.tokens[id];
  if (!o || !STATUS[status] || o.status === status) return;
  const prev = o.status;
  o.status = status;
  if (kind === 'token') {
    if (status === 'muerto') o.hp = 0;
    else if (prev === 'muerto' && o.hp === 0) o.hp = 1;
    if (STATE.activeToken === id && !canAct(o)) STATE.activeToken = firstActiveId() || id;
  }
  const s = STATUS[status];
  const nm = o.name + (kind === 'token' ? ` [${o.id}]` : '');
  STATE.lastRollHtml = `<span style="color:${s.color};">${s.icon} <strong>${nm}</strong> ahora está <strong>${s.label.toLowerCase()}</strong>.</span>`;
  renderAll();
}

function applyEnemyStates(ids, status) {
  (ids || []).forEach(id => { if (STATE.enemies[id]) STATE.enemies[id].status = status; });
}

/* =====================================================================
   ESTILOS (se inyectan desde aquí: no hay que tocar tu CSS)
   ===================================================================== */
function injectStyles() {
  if (document.getElementById('mapa-extra-css')) return;
  const css = `
  .lbl{paint-order:stroke;stroke:#050b14;stroke-width:3px;stroke-linejoin:round;font-family:monospace;pointer-events:none}
  .room-hit{fill:transparent;cursor:pointer}
  .room-hit:hover{fill:rgba(125,211,252,.07)}
  .fog-cloud{transition:opacity .75s ease;cursor:pointer}
  .fog-cloud.fog-off{opacity:0;pointer-events:none}
  .fog-cloud .mist{animation:mistDrift 7s ease-in-out infinite alternate}
  @keyframes mistDrift{from{opacity:.35}to{opacity:.8}}
  .sel-glow{fill:none;stroke:#fcd34d;stroke-width:3;stroke-dasharray:10 6;animation:selMarch 1.2s linear infinite;pointer-events:none;filter:drop-shadow(0 0 6px rgba(252,211,77,.7))}
  @keyframes selMarch{to{stroke-dashoffset:-32}}
  .incap-ring{animation:incapPulse 1.1s ease-in-out infinite}
  @keyframes incapPulse{0%,100%{opacity:.35}50%{opacity:1}}
  .tok-muerto .token-body,.tok-neutralizado .token-body{opacity:.62}
  .status-select{font:inherit;font-size:10px;font-weight:700;padding:2px 4px;border-radius:5px;background:#0b1220;color:#e2e8f0;border:1px solid rgba(148,163,184,.4);cursor:pointer;max-width:112px}
  .status-select.s-activo{color:#34d399;border-color:#34d399}
  .status-select.s-incapacitado{color:#f87171;border-color:#f87171}
  .status-select.s-neutralizado{color:#a5b4c8;border-color:#a5b4c8}
  .status-select.s-muerto{color:#94a3b8;border-color:#64748b;text-decoration:line-through}
  .enemy-list{margin-top:6px;padding:6px 8px;background:rgba(239,68,68,.08);border-left:3px solid #ef4444;border-radius:4px;font-size:11px;color:#fecaca}
  .enemy-row{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:2px 0}
  `;
  const st = document.createElement('style');
  st.id = 'mapa-extra-css';
  st.textContent = css;
  document.head.appendChild(st);
}

/* =====================================================================
   ARTE 2.5D DEL MAPA (capa estática: se construye una sola vez)
   ===================================================================== */
const FLOOR_FILL = { wood: 'pWood', carpet: 'pCarpet', tile: 'pTile', conc: 'pConc', asph: 'pAsph', marble: 'pMarble', grate: 'pGrate', haz: 'pHaz' };

const SVG_DEFS = `<defs>
  <pattern id="pGridF" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#0f1a2b" stroke-width=".7"/></pattern>
  <pattern id="pGridM" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill="url(#pGridF)"/><path d="M100 0H0V100" fill="none" stroke="#15233a" stroke-width="1.2"/></pattern>
  <pattern id="pWood" width="40" height="28" patternUnits="userSpaceOnUse"><rect width="40" height="28" fill="#1e2c33"/><path d="M0 0H40M0 14H40M13 0V14M29 14V28" stroke="#2b3c47" stroke-width="1"/><path d="M4 7H10M20 21H27" stroke="#243642" stroke-width="1"/></pattern>
  <pattern id="pCarpet" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#19243b"/><path d="M0 6H12M6 0V12" stroke="#1e2c49" stroke-width="1"/><circle cx="6" cy="6" r="1" fill="#2a3d60"/></pattern>
  <pattern id="pTile" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#18323b"/><path d="M0 0H14V14" fill="none" stroke="#0f2530" stroke-width="1"/></pattern>
  <pattern id="pConc" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill="#19232f"/><circle cx="6" cy="9" r="1" fill="#243244"/><circle cx="24" cy="5" r="1.2" fill="#202e3f"/><circle cx="14" cy="27" r="1" fill="#27364b"/><circle cx="31" cy="22" r="1.1" fill="#1f2d3d"/></pattern>
  <pattern id="pAsph" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="#131b27"/><circle cx="5" cy="7" r=".9" fill="#222d3d"/><circle cx="19" cy="14" r="1" fill="#1d2838"/><circle cx="11" cy="24" r=".8" fill="#26334a"/><circle cx="26" cy="26" r="1" fill="#1b2535"/></pattern>
  <pattern id="pMarble" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#1b2433"/><rect width="20" height="20" fill="#232e40"/><rect x="20" y="20" width="20" height="20" fill="#232e40"/><path d="M4 30L16 36M24 6L36 12" stroke="#2e3b51" stroke-width=".8"/></pattern>
  <pattern id="pGrate" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#0d1522"/><path d="M0 4H8" stroke="#2b3b52" stroke-width="1.6"/></pattern>
  <pattern id="pHaz" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="#1a1119"/><rect width="7" height="14" fill="rgba(239,68,68,.2)"/></pattern>
  <pattern id="pSteps" width="12" height="9" patternUnits="userSpaceOnUse"><rect width="12" height="9" fill="#1c2738"/><rect width="12" height="2.5" fill="#42536e"/><rect y="2.5" width="12" height="1" fill="#0a111d"/></pattern>
  <pattern id="pMist" width="70" height="70" patternUnits="userSpaceOnUse"><circle cx="14" cy="18" r="16" fill="#9fb4d6" opacity=".10"/><circle cx="48" cy="40" r="21" fill="#9fb4d6" opacity=".08"/><circle cx="26" cy="58" r="13" fill="#9fb4d6" opacity=".09"/></pattern>
  <radialGradient id="gVig" cx=".5" cy=".5" r=".78"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
  <radialGradient id="gFog" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#1b2740"/><stop offset="1" stop-color="#090e18"/></radialGradient>
  <filter id="fWall" x="-4%" y="-4%" width="108%" height="108%"><feDropShadow dx="2" dy="5" stdDeviation="3" flood-color="#000" flood-opacity=".65"/></filter>
  <filter id="tokenShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".85"/></filter>
</defs>`;

// Hueco de puertas sobre una línea de muro
function edgeSegs(isH, c, a, b) {
  const gaps = DOORS.filter(d => !!d.h === !!isH && Math.abs(d.c - c) <= 6 && d.b > a && d.a < b).sort((p, q) => p.a - q.a);
  const segs = [];
  let cur = a;
  gaps.forEach(g => { if (g.a > cur) segs.push([cur, g.a]); cur = Math.max(cur, g.b); });
  if (cur < b) segs.push([cur, b]);
  return segs;
}

// Muro con volumen: cara lateral oscura (extrusión) + cara superior + filo de luz
function wallLine(x1, y1, x2, y2, t) {
  const hz = y1 === y2;
  const hl = hz
    ? `<line x1="${x1}" y1="${y1 - t / 2 + .8}" x2="${x2}" y2="${y2 - t / 2 + .8}" stroke="#eef4fb" stroke-opacity=".75" stroke-width="1.1"/>`
    : `<line x1="${x1 - t / 2 + .8}" y1="${y1}" x2="${x2 - t / 2 + .8}" y2="${y2}" stroke="#eef4fb" stroke-opacity=".75" stroke-width="1.1"/>`;
  return `<line x1="${x1 + 2}" y1="${y1 + 4}" x2="${x2 + 2}" y2="${y2 + 4}" stroke="#0b1424" stroke-width="${t}" stroke-linecap="square"/>` +
         `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9fb0c6" stroke-width="${t}" stroke-linecap="square"/>` + hl;
}

function wallsFor(x, y, w, h, t) {
  const s = [];
  edgeSegs(1, y, x, x + w).forEach(([p, q]) => s.push([p, y, q, y]));
  edgeSegs(1, y + h, x, x + w).forEach(([p, q]) => s.push([p, y + h, q, y + h]));
  edgeSegs(0, x, y, y + h).forEach(([p, q]) => s.push([x, p, x, q]));
  edgeSegs(0, x + w, y, y + h).forEach(([p, q]) => s.push([x + w, p, x + w, q]));
  return s.map(a => wallLine(...a, t)).join('');
}

function curbsFor(b) {
  const s = [];
  edgeSegs(1, b.y, b.x, b.x + b.w).forEach(([p, q]) => s.push([p, b.y, q, b.y]));
  edgeSegs(1, b.y + b.h, b.x, b.x + b.w).forEach(([p, q]) => s.push([p, b.y + b.h, q, b.y + b.h]));
  edgeSegs(0, b.x, b.y, b.y + b.h).forEach(([p, q]) => s.push([b.x, p, b.x, q]));
  edgeSegs(0, b.x + b.w, b.y, b.y + b.h).forEach(([p, q]) => s.push([b.x + b.w, p, b.x + b.w, q]));
  return s.map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6b7c94" stroke-width="2.2" stroke-dasharray="7 4"/>`).join('');
}

function doorArt(d) {
  const w = d.b - d.a;
  if (d.t === 'open') return '';
  if (d.t === 'win') {
    return d.h
      ? `<line x1="${d.a}" y1="${d.c}" x2="${d.b}" y2="${d.c}" stroke="#7dd3fc" stroke-width="4.5" stroke-opacity=".85"/><line x1="${d.a}" y1="${d.c - 1}" x2="${d.b}" y2="${d.c - 1}" stroke="#e0f2fe" stroke-width="1"/>`
      : `<line x1="${d.c}" y1="${d.a}" x2="${d.c}" y2="${d.b}" stroke="#7dd3fc" stroke-width="4.5" stroke-opacity=".85"/>`;
  }
  if (d.t === 'curtain') {
    return `<line x1="${d.c}" y1="${d.a}" x2="${d.c}" y2="${d.b}" stroke="#7f1d1d" stroke-width="8" stroke-linecap="square"/>` +
           `<line x1="${d.c}" y1="${d.a}" x2="${d.c}" y2="${d.b}" stroke="#ef4444" stroke-width="5" stroke-dasharray="4 3"/>`;
  }
  const s = d.dir || 1;
  if (d.h) {
    return `<path d="M ${d.a} ${d.c} L ${d.a} ${d.c + s * w} A ${w} ${w} 0 0 ${s > 0 ? 0 : 1} ${d.b} ${d.c}" fill="${d.col}" fill-opacity=".08" stroke="${d.col}" stroke-width="1.2" stroke-dasharray="3 2"/>` +
           `<line x1="${d.a}" y1="${d.c}" x2="${d.a}" y2="${d.c + s * w}" stroke="${d.col}" stroke-width="3.2" stroke-linecap="round"/>`;
  }
  return `<path d="M ${d.c} ${d.a} L ${d.c + s * w} ${d.a} A ${w} ${w} 0 0 ${s > 0 ? 1 : 0} ${d.c} ${d.b}" fill="${d.col}" fill-opacity=".08" stroke="${d.col}" stroke-width="1.2" stroke-dasharray="3 2"/>` +
         `<line x1="${d.c}" y1="${d.a}" x2="${d.c + s * w}" y2="${d.a}" stroke="${d.col}" stroke-width="3.2" stroke-linecap="round"/>`;
}

// Bloque con volumen (mobiliario): cara lateral + cara superior + brillo
const blk = (x, y, w, h, top, side, d = 4, rx = 3, extra = '') =>
  `<g ${extra}><rect x="${x}" y="${y + d}" width="${w}" height="${h}" rx="${rx}" fill="${side}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${top}"/><rect x="${x + 1.5}" y="${y + 1.2}" width="${w - 3}" height="2" rx="1" fill="#fff" opacity=".14"/></g>`;
const bed = (x, y, w, h, col) => blk(x, y, w, h, col, '#08141c', 5, 4) +
  `<rect x="${x + 4}" y="${y + 5}" width="14" height="${h / 2 - 7}" rx="3" fill="#dbeafe" opacity=".9"/><rect x="${x + 4}" y="${y + h / 2 + 2}" width="14" height="${h / 2 - 7}" rx="3" fill="#dbeafe" opacity=".9"/><path d="M${x + 24} ${y + 4}V${y + h - 4}M${x + 38} ${y + 4}V${y + h - 4}" stroke="#fff" stroke-opacity=".12"/>`;
const toilet = (x, y) => `<rect x="${x - 6}" y="${y - 14}" width="12" height="6" rx="2" fill="#cbd5e1"/><ellipse cx="${x}" cy="${y}" rx="7" ry="9.5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/><ellipse cx="${x}" cy="${y + 1}" rx="4" ry="6" fill="#94a3b8" opacity=".5"/>`;
const sink = (x, y) => `<rect x="${x}" y="${y}" width="18" height="24" rx="3" fill="#cbd5e1" stroke="#94a3b8"/><ellipse cx="${x + 9}" cy="${y + 12}" rx="5.5" ry="8" fill="#64748b" opacity=".6"/>`;
const lamp = (x, y) => `<circle cx="${x}" cy="${y}" r="28" fill="#fde68a" opacity=".05"/><circle cx="${x}" cy="${y}" r="3" fill="#fde68a" opacity=".75"/>`;
const T = (x, y, size, txt, fill, extra = '') => `<text class="lbl" x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra.includes('text-anchor') ? '' : 'text-anchor="middle"'} ${extra}>${txt}</text>`;
const flight = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#pSteps)" stroke="#55677f" stroke-width="1.5"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#gVig)" opacity=".7"/>`;
const chevrons = (x, y, col) => [0, 9, 18].map(i => `<path d="M${x - 7} ${y + i}l7 6l7 -6" fill="none" stroke="${col}" stroke-width="1.6" opacity="${1 - i / 40}"/>`).join('');

function buildStaticArt() {
  const floors = ROOM_BOUNDS.map(b =>
    `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="url(#${FLOOR_FILL[b.floor]})"/>` +
    `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="url(#gVig)"/>`).join('');

  const slabs = `
    <rect x="84" y="96" width="447" height="417" rx="5" fill="#070d17" stroke="#1b2a42" stroke-width="2"/>
    <rect x="549" y="96" width="217" height="417" rx="5" fill="#070d17" stroke="#1b2a42" stroke-width="2"/>
    <rect x="800" y="96" width="585" height="417" rx="6" fill="#0a111b" stroke="#1b2a42" stroke-width="2"/>
    <path d="M766 205H810V235H766ZM766 432H772V478H766Z" fill="none"/>
    <path d="M760 432 L790 432 L790 330 L800 300 L800 205 L810 205 L810 235 L796 235 L796 300 L780 330 L780 478 L760 478 Z" fill="#141d2b" opacity=".95"/>`;

  // Muros: edificio P4, cubo de escalera y salas interiores
  const inner = ROOM_BOUNDS.filter(b => !b.kind);
  const walls = wallsFor(90, 102, 435, 405, 8) + wallsFor(555, 102, 205, 405, 8) + inner.map(b => wallsFor(b.x, b.y, b.w, b.h, 5)).join('') +
    // baño de la 408 y baños de 410 / 412
    wallLine(94, 389, 152, 389, 4) + wallLine(152, 321, 152, 389, 4) +
    wallLine(259, 376, 304, 376, 4) + wallLine(304, 321, 304, 376, 4) +
    wallLine(374, 376, 420, 376, 4) + wallLine(420, 321, 420, 376, 4);
  const curbs = ROOM_BOUNDS.filter(b => b.kind === 'out').map(curbsFor).join('') +
    `<rect x="805" y="102" width="575" height="405" rx="4" fill="none" stroke="#64748b" stroke-width="2.5" stroke-dasharray="2 5"/>`;
  const doors = DOORS.map(doorArt).join('');

  /* ---------- NIVEL 4 ---------- */
  const p4 = `
    ${T(45, 72, 13, 'PLANTA ARQUITECTÓNICA — NIVEL 4 (ALA NORTE)', '#38bdf8', 'font-weight="bold" text-anchor="start"')}
    ${T(45, 88, 9.5, 'COTA +14.00m • MUROS DE CONCRETO Y TABLARROCA • ARRASTRE TÁCTIL ACTIVO', '#64748b', 'text-anchor="start"')}
    <!-- Pasarela exterior -->
    <line x1="40" y1="322" x2="40" y2="503" stroke="#94a3b8" stroke-width="2.5"/><line x1="88" y1="322" x2="88" y2="503" stroke="#94a3b8" stroke-width="2.5"/>
    ${[345, 375, 405, 435, 465, 495].map(y => `<line x1="40" y1="${y}" x2="88" y2="${y}" stroke="#334155" stroke-width="1.2"/>`).join('')}
    <rect x="30" y="320" width="10" height="185" fill="url(#gVig)" opacity=".9"/>
    <text class="lbl" x="64" y="405" font-size="9" fill="#94a3b8" text-anchor="middle" transform="rotate(-90 64 405)">PASARELA EXT. (+14m)</text>
    <!-- Cortafuegos -->
    ${flight(102, 116, 40, 55)}
    ${T(122, 192, 8.5, 'PUERTA', '#38bdf8', 'font-weight="bold"')}${T(122, 203, 8, 'CORTAFUEGOS', '#38bdf8')}
    <!-- 402: servicio -->
    ${blk(156, 112, 65, 14, '#2a3a52', '#0c1522', 4, 2)}${T(188, 122, 7.5, 'ESTANTERÍA', '#aab8cc')}
    ${blk(156, 145, 28, 45, '#3a2e18', '#120d05', 5, 2, '')}<rect x="159" y="148" width="22" height="39" rx="2" fill="none" stroke="#f59e0b" stroke-width="1.2"/>${T(170, 172, 9, '💳🔧', '#fcd34d')}
    <circle cx="242" cy="136" r="15" fill="#0b1018"/><circle cx="242" cy="133" r="14" fill="#2b2418" stroke="#8b6b34" stroke-width="2.2"/><circle cx="242" cy="133" r="9" fill="#17110a" stroke="#5a4521"/>${T(242, 136, 6.5, 'CESTO', '#d7c9a6')}
    ${T(208, 218, 10, 'CUARTO 402', '#fcd34d', 'font-weight="bold"')}
    <!-- 404 / 406 -->
    ${bed(285, 114, 48, 36, '#1c3340')}${T(310, 196, 9.5, 'HAB. 404', '#5b6b82')}
    ${bed(375, 114, 48, 36, '#1c3340')}${T(400, 196, 9.5, 'HAB. 406', '#5b6b82')}
    <!-- Elevadores -->
    <rect x="452" y="116" width="28" height="46" rx="2" fill="#2a3446" stroke="#64748b"/><rect x="486" y="116" width="28" height="46" rx="2" fill="#2a3446" stroke="#64748b"/>
    <path d="M452 116L480 162M480 116L452 162M486 116L514 162M514 116L486 162" stroke="#7f1d1d" stroke-width="1.2"/>
    ${T(483, 184, 8.5, 'ELEVADORES', '#f87171', 'font-weight="bold"')}${T(483, 195, 7.5, '(BLOQUEADOS)', '#fca5a5')}
    <!-- Pasillo -->
    <rect x="110" y="262" width="395" height="30" rx="4" fill="#26407a" opacity=".32"/><rect x="110" y="262" width="395" height="30" rx="4" fill="none" stroke="#3b5fa8" stroke-width="1" opacity=".45"/>
    ${[150, 250, 350, 450].map(x => lamp(x, 276)).join('')}
    ${T(275, 248, 9, 'PASILLO CENTRAL ALFOMBRADO — PISO 4', '#7488a6')}
    <!-- 408 -->
    ${toilet(112, 349)}${sink(130, 326)}${T(123, 382, 7, 'BAÑO', '#7aa0aa')}
    ${bed(104, 410, 68, 54, '#1b5662')}${T(142, 478, 7.5, 'CAMA', '#6ee7b7')}
    ${blk(172, 323, 46, 14, '#8a5a2b', '#2a1807', 4, 2)}${T(195, 333, 7, 'ESCRITORIO', '#fef3c7', 'font-weight="bold"')}
    ${T(195, 362, 11, 'HAB. 408', '#34d399', 'font-weight="bold"')}${T(178, 494, 8, '══ VENTANA EXTERIOR ══', '#7dd3fc')}
    <!-- 410 -->
    ${toilet(281, 345)}${bed(285, 415, 58, 48, '#1c3340')}${T(316, 395, 10, 'HAB. 410', '#5b6b82')}
    <!-- 412 -->
    ${toilet(397, 349)}
    <g transform="rotate(14 450 400)">${blk(425, 385, 55, 35, '#3a1d28', '#12060b', 4, 2)}</g>
    ${[[435, 340], [442, 344], [448, 338], [439, 350]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#d4a017"/><circle cx="${x - .7}" cy="${y - .7}" r=".9" fill="#fff6c9"/>`).join('')}
    <circle cx="378" cy="450" r="2" fill="#050a12"/><circle cx="383" cy="442" r="1.6" fill="#050a12"/><circle cx="380" cy="462" r="1.8" fill="#050a12"/>
    ${T(448, 368, 10.5, 'HAB. 412', '#f87171', 'font-weight="bold"')}${T(448, 455, 8, '18 Casquillos 9mm', '#fca5a5')}`;

  /* ---------- CUBO DE ESCALERA ---------- */
  const st = `
    ${T(560, 72, 13, 'CUBO DE ESCALERA (P4→P1)', '#f59e0b', 'font-weight="bold" text-anchor="start"')}
    ${T(560, 88, 9.5, 'TIRO VERTICAL DE CONCRETO ARMADO', '#64748b', 'text-anchor="start"')}
    ${flight(575, 122, 75, 90)}${flight(662, 122, 75, 90)}
    <line x1="656" y1="118" x2="656" y2="216" stroke="#cbd5e1" stroke-width="3"/><line x1="656" y1="118" x2="656" y2="216" stroke="#475569" stroke-width="1" transform="translate(1.5 2)"/>
    ${chevrons(612, 150, '#bae6fd')}${chevrons(700, 150, '#bae6fd')}
    ${T(656, 226, 10, 'TRAMO P4 → P3', '#bae6fd', 'font-weight="bold"')}
    <line x1="566" y1="234" x2="749" y2="234" stroke="#cbd5e1" stroke-width="2.5"/><line x1="566" y1="236.5" x2="749" y2="236.5" stroke="#475569" stroke-width="1.5"/>
    ${flight(662, 250, 75, 110)}${chevrons(700, 280, '#fca5a5')}
    <g transform="rotate(-12 583 300)">${blk(566, 275, 34, 52, '#3b4a61', '#0f1724', 5, 3)}<rect x="570" y="279" width="26" height="44" rx="2" fill="none" stroke="#f59e0b" stroke-width="1.3"/></g>
    ${T(588, 342, 7, 'CARRITO', '#fde68a')}${T(645, 262, 10, 'DESCANSO PISO 2', '#f87171', 'font-weight="bold"')}
    <line x1="566" y1="377" x2="749" y2="377" stroke="#cbd5e1" stroke-width="2.5"/><line x1="566" y1="379.5" x2="749" y2="379.5" stroke="#475569" stroke-width="1.5"/>
    ${flight(575, 392, 162, 65)}${chevrons(656, 410, '#a7f3d0')}
    ${T(658, 482, 9.5, 'SALIDA A MUELLE (PB) ➔', '#34d399', 'font-weight="bold"')}
    <path class="route-path" d="M 122 106 L 122 95 L 655 95 L 655 110" fill="none" stroke="#38bdf8" stroke-width="2"/>
    <path class="route-path" d="M 760 455 L 790 455 L 790 220 L 810 220" fill="none" stroke="#10b981" stroke-width="2.5"/>`;

  /* ---------- PLANTA BAJA ---------- */
  const pb = `
    ${T(805, 72, 13, 'PLANTA BAJA — MUELLE DE CARGA, LOBBY Y PATIO EXTERIOR', '#10b981', 'font-weight="bold" text-anchor="start"')}
    ${T(805, 88, 9.5, 'COTA ±0.00m • DISTANCIA MUELLE A VEHÍCULO: 15.00 METROS', '#64748b', 'text-anchor="start"')}
    <!-- Muelle -->
    <rect x="812" y="294" width="211" height="7" fill="#eab308" opacity=".35"/>
    ${blk(822, 120, 32, 32, '#7a5a2e', '#2a1b09', 5, 2)}<path d="M822 120L854 152M854 120L822 152" stroke="#4a3517" stroke-width="1.2"/>
    ${blk(860, 120, 32, 32, '#7a5a2e', '#2a1b09', 5, 2)}<path d="M860 120L892 152M892 120L860 152" stroke="#4a3517" stroke-width="1.2"/>
    <text class="lbl" x="1012" y="178" font-size="8" fill="#fca5a5" text-anchor="middle" transform="rotate(-90 1012 178)">CORTINA ACERO (+2 RUIDO)</text>
    ${T(915, 205, 11, 'MUELLE DE CARGA', '#fcd34d', 'font-weight="bold"')}${T(915, 268, 8.5, 'Puerta Peatonal Lateral ➔', '#34d399')}
    <!-- Lobby -->
    <path d="M846 372 Q 934 330 1030 372 L 1030 400 Q 934 362 846 400Z" fill="#2b3550" stroke="#64748b" stroke-width="1.5"/>
    <path d="M846 372 Q 934 330 1030 372" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2"/>
    <polygon points="880,440 905,432 925,448 899,462" fill="#3a2a2a" stroke="#f87171" stroke-width="1"/><polygon points="980,455 1004,448 1012,466 986,470" fill="#3a2a2a" stroke="#f87171" stroke-width="1"/>
    ${T(942, 418, 11.5, 'LOBBY PRINCIPAL', '#f87171', 'font-weight="bold"')}${T(942, 488, 8.5, '[ZONA COLAPSADA — EVITADA]', '#fca5a5')}
    <!-- Patio -->
    ${[130, 280].map(y => `<line x1="1034" y1="${y}" x2="1206" y2="${y}" stroke="#eab308" stroke-width="1.5" stroke-dasharray="14 10" opacity=".45"/>`).join('')}
    <line x1="1032" y1="195" x2="1205" y2="195" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5 4"/>
    <path d="M1042 189l-8 6l8 6M1196 189l8 6l-8 6" fill="none" stroke="#38bdf8" stroke-width="1.6"/>
    ${T(1118, 186, 9.5, '15.00 m', '#7dd3fc', 'font-weight="bold"')}${T(1118, 152, 9.5, 'PATIO DE MANIOBRAS', '#94a3b8')}
    <!-- Pickup -->
    ${[135, 245].map(y => `<line x1="1235" y1="${y}" x2="1355" y2="${y}" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 4"/>`).join('')}
    <g transform="translate(1248 152)">
      <rect x="2" y="6" width="92" height="44" rx="8" fill="#000" opacity=".4"/>
      <rect x="0" y="0" width="92" height="44" rx="8" fill="#047857" stroke="#6ee7b7" stroke-width="1.8"/>
      <rect x="62" y="5" width="26" height="34" rx="2" fill="#064e3b" stroke="#34d399"/><path d="M62 22H88" stroke="#34d399" stroke-opacity=".4"/>
      <path d="M18 4 L36 8 L36 36 L18 40 Z" fill="#0f172a" stroke="#6ee7b7"/><rect x="36" y="6" width="24" height="32" rx="2" fill="#059669" stroke="#6ee7b7"/>
      <rect x="6" y="-3" width="14" height="6" rx="2" fill="#0b1220"/><rect x="6" y="41" width="14" height="6" rx="2" fill="#0b1220"/><rect x="66" y="-3" width="14" height="6" rx="2" fill="#0b1220"/><rect x="66" y="41" width="14" height="6" rx="2" fill="#0b1220"/>
      <circle cx="3" cy="10" r="3" fill="#fde68a"/><circle cx="3" cy="34" r="3" fill="#fde68a"/>
    </g>
    ${T(1294, 222, 9.5, 'PICKUP (3/4 TANQUE)', '#34d399', 'font-weight="bold"')}
    <!-- Caseta -->
    ${blk(1135, 375, 52, 52, '#2a3a52', '#0c1522', 6, 4)}<rect x="1130" y="370" width="62" height="10" rx="2" fill="#475569"/>${T(1161, 404, 7.5, 'CASETA', '#fcd34d')}
    <g transform="rotate(28 1216 404)">${blk(1182, 388, 68, 32, '#5a1f22', '#1a0708', 4, 6)}<rect x="1190" y="392" width="20" height="22" rx="3" fill="#1b0b0d" opacity=".7"/></g>
    <line x1="1196" y1="326" x2="1260" y2="334" stroke="#eab308" stroke-width="4" stroke-dasharray="8 6"/>
    ${T(1235, 452, 8.5, 'Auto Colisionado en Salida', '#fca5a5')}
    <path class="route-path" d="M 1295 245 L 1295 485" fill="none" stroke="#10b981" stroke-width="3"/>
    ${T(1332, 485, 9, 'SALIDA VIAL ▼', '#34d399', 'font-weight="bold"')}`;

  const hits = ROOM_BOUNDS.filter(b => ROOMS[b.id]).map(b =>
    `<rect class="room-hit" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" onclick="selectRoom('${b.id}')"/>`).join('');

  return `${SVG_DEFS}
    <rect x="0" y="0" width="1420" height="600" rx="12" fill="url(#pGridM)" stroke="#293b56" stroke-width="2"/>
    ${slabs}${floors}${p4}${st}${pb}
    <g filter="url(#fWall)">${walls}</g>${curbs}${doors}${hits}`;
}

// Niebla: una nube por sala. Se abre con clases CSS (transición suave)
function buildFogLayer() {
  return ROOM_BOUNDS.map(b => {
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    const fs = Math.max(6.5, Math.min(9.5, (b.w - 8) / (b.name.length * 0.68)));
    return `<g class="fog-cloud" data-room="${b.id}" onclick="revealRoom('${b.id}', event)">
      <rect x="${b.x + 3}" y="${b.y + 3}" width="${b.w - 6}" height="${b.h - 6}" rx="8" fill="url(#gFog)" opacity=".97"/>
      <rect class="mist" x="${b.x + 3}" y="${b.y + 3}" width="${b.w - 6}" height="${b.h - 6}" rx="8" fill="url(#pMist)"/>
      <circle cx="${cx}" cy="${cy - 8}" r="14" fill="#0b1220" stroke="#a78bfa" stroke-width="1.5"/>
      <text x="${cx}" y="${cy - 3.5}" fill="#c4b5fd" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">?</text>
      <text class="lbl" x="${cx}" y="${cy + 18}" fill="#ddd6fe" font-size="${fs.toFixed(1)}" text-anchor="middle" font-weight="bold">${b.name.toUpperCase()}</text>
    </g>`;
  }).join('');
}

/* =====================================================================
   CAPAS DINÁMICAS (selección, amenazas, personajes, trayectoria)
   ===================================================================== */
function ensureSvg() {
  let svg = document.getElementById('main-svg');
  if (svg) return svg;
  document.getElementById('map-stage').innerHTML =
    `<svg id="main-svg" class="arch-blueprint" viewBox="0 25 1480 650" xmlns="http://www.w3.org/2000/svg">
      <g id="L-static">${buildStaticArt()}</g>
      <g id="L-select"></g><g id="L-enemies"></g>
      <g id="L-fog">${buildFogLayer()}</g>
      <g id="L-trail"></g><g id="L-chars"></g>
    </svg>`;
  return document.getElementById('main-svg');
}

function viewBoxFor(view) {
  return { p4: '20 50 520 480', stairs: '535 50 250 480', pb: '790 50 605 480' }[view] || '0 25 1480 650';
}

function tokenArt(o, kind) {
  const st = STATUS[o.status];
  const isChar = kind === 'char';
  const col = isChar ? o.color : '#ef4444';
  const sel = isChar && STATE.activeToken === o.id;
  const dim = o.status === 'muerto' || o.status === 'neutralizado';
  const ring = o.status === 'incapacitado' ? '#ef4444' : (dim ? '#64748b' : col);
  return `
    <g class="char-token-svg tok-${o.status}" data-token-id="${o.id}" transform="translate(${o.x}, ${o.y})" filter="url(#tokenShadow)"
       onmousedown="startTokenDrag(event, '${o.id}')" ontouchstart="startTokenDrag(event, '${o.id}')">
      <circle cx="0" cy="0" r="24" fill="transparent"/>
      ${isChar && st.vision ? `<circle cx="0" cy="0" r="46" fill="${col}" opacity=".06" pointer-events="none"/><circle cx="0" cy="0" r="30" fill="${col}" opacity=".09" pointer-events="none"/>` : ''}
      ${o.status === 'incapacitado' ? `<circle class="incap-ring" cx="0" cy="0" r="22" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-dasharray="4 3"/>` : ''}
      ${sel ? `<circle cx="0" cy="0" r="19" fill="none" stroke="${col}" stroke-width="1.6" stroke-dasharray="3 2"/>` : ''}
      <g class="token-body">
        <ellipse cx="0" cy="9" rx="13" ry="5" fill="#000" opacity=".45"/>
        ${!isChar ? `<circle class="radar-ring" cx="0" cy="0" r="12" fill="none" stroke="#ef4444" stroke-width="1.6"/>` : ''}
        <circle class="token-outer" cx="0" cy="0" r="${isChar ? 14 : 12}" fill="${isChar ? '#090d14' : '#4a1111'}" stroke="${ring}" stroke-width="${isChar ? 3 : 2.2}"/>
        <circle cx="0" cy="0" r="${isChar ? 9.5 : 8.5}" fill="${dim ? '#334155' : col}" opacity="${isChar ? .35 : .55}"/>
        <path d="M-8 -5.5 A 9.5 9.5 0 0 1 3 -9.5" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.6" stroke-linecap="round"/>
        <text x="0" y="3.5" fill="#fff" font-family="monospace" font-size="${isChar ? 9.5 : 8.5}" text-anchor="middle" font-weight="bold">${o.id}</text>
      </g>
      ${o.status !== 'activo' ? `<g><circle cx="11" cy="-11" r="6.5" fill="#0b1220" stroke="${st.color}" stroke-width="1.5"/><text x="11" y="-7.6" fill="${st.color}" font-family="monospace" font-size="${o.status === 'muerto' ? 8 : 9}" text-anchor="middle" font-weight="bold">${st.icon}</text></g>` : ''}
      ${!isChar ? `<text class="lbl" x="0" y="-17" fill="#fca5a5" font-size="8" text-anchor="middle">${dim ? st.label : 'Amenaza'}</text>` : ''}
      ${isChar && o.status !== 'activo' ? `<text class="lbl" x="0" y="-19" fill="${st.color}" font-size="8" text-anchor="middle" font-weight="bold">${st.label.toUpperCase()}</text>` : ''}
    </g>`;
}

function renderSelection() {
  const b = ROOM_BOUNDS.find(r => r.id === STATE.selectedRoom);
  document.getElementById('L-select').innerHTML = b
    ? `<rect class="sel-glow" x="${b.x + 1}" y="${b.y + 1}" width="${b.w - 2}" height="${b.h - 2}" rx="6"/>` : '';
}

function renderTrail() {
  let html = '';
  if (STATE.dragState) {
    const ds = STATE.dragState;
    const t = STATE.tokens[ds.tokenId] || STATE.enemies[ds.tokenId];
    const col = t ? (t.color || '#ef4444') : '#38bdf8';
    const dist = (Math.hypot(ds.curX - ds.startX, ds.curY - ds.startY) * 0.045).toFixed(1) + 'm';
    const mx = (ds.startX + ds.curX) / 2, my = (ds.startY + ds.curY) / 2;
    html = `<g pointer-events="none">
      <line x1="${ds.startX}" y1="${ds.startY}" x2="${ds.curX}" y2="${ds.curY}" stroke="${col}" stroke-width="2.5" stroke-dasharray="5 4"/>
      <circle cx="${ds.startX}" cy="${ds.startY}" r="5" fill="${col}" opacity=".6"/>
      <rect x="${mx - 24}" y="${my - 18}" width="48" height="16" rx="4" fill="#090d14" stroke="${col}"/>
      <text x="${mx}" y="${my - 7}" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle" font-weight="bold">${dist}</text></g>`;
  } else if (STATE.lastTrail) {
    const lt = STATE.lastTrail;
    const t = STATE.tokens[lt.tokenId];
    const col = t ? t.color : '#10b981';
    const mx = (lt.x1 + lt.x2) / 2, my = (lt.y1 + lt.y2) / 2;
    html = `<g pointer-events="none" opacity=".82">
      <line x1="${lt.x1}" y1="${lt.y1}" x2="${lt.x2}" y2="${lt.y2}" stroke="${col}" stroke-width="2" stroke-dasharray="4 4"/>
      <circle cx="${lt.x1}" cy="${lt.y1}" r="4" fill="none" stroke="${col}" stroke-width="1.5"/>
      <rect x="${mx - 26}" y="${my - 9}" width="52" height="15" rx="4" fill="#090d14" stroke="${col}"/>
      <text x="${mx}" y="${my + 1.5}" fill="${col}" font-family="monospace" font-size="8.5" text-anchor="middle" font-weight="bold">${lt.tokenId}: ${lt.distMeters}</text></g>`;
  }
  document.getElementById('L-trail').innerHTML = html;
}

function updateFogDOM() {
  const vis = visibleRoomIds();
  document.querySelectorAll('#L-fog .fog-cloud').forEach(g => g.classList.toggle('fog-off', vis.has(g.dataset.room)));
}

function renderBlueprintSVG() {
  const svg = ensureSvg();
  svg.setAttribute('viewBox', viewBoxFor(STATE.view));
  renderSelection();
  document.getElementById('L-enemies').innerHTML = Object.values(STATE.enemies).map(e => tokenArt(e, 'enemy')).join('');
  document.getElementById('L-chars').innerHTML = Object.values(STATE.tokens).map(t => tokenArt(t, 'char')).join('');
  renderTrail();
  updateFogDOM();
}

/* =====================================================================
   INTERFAZ (HUD, escuadrón, cajón de la sala)
   ===================================================================== */
function syncFloorButtons() {
  document.querySelectorAll('.floor-pill').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-view-${STATE.view}`);
  if (activeBtn) activeBtn.classList.add('active');
}

// Botón "Niebla" = vuelve a cubrir todo el mapa. "Ver todo" se crea junto a él para el modo director.
function syncGmButtons() {
  const fog = document.getElementById('gm-btn');
  if (!fog) return;
  fog.classList.remove('gm-on');
  fog.textContent = '🌫️ Niebla';
  fog.title = 'Vuelve a cubrir el mapa: solo se ven las salas con personajes';
  let all = document.getElementById('gm-reveal-btn');
  if (!all) {
    all = document.createElement('button');
    all.id = 'gm-reveal-btn';
    all.className = fog.className;
    all.onclick = toggleReveal;
    fog.insertAdjacentElement('afterend', all);
  }
  all.classList.toggle('gm-on', STATE.gmMode);
  all.textContent = STATE.gmMode ? '🔓 Ver todo: SÍ' : '🔒 Ver todo';
}

function renderAll() {
  syncFloorButtons();
  syncGmButtons();
  renderNoise();
  renderSquadBar();
  renderBlueprintSVG();
  renderDrawer();
}

function renderNoise() {
  const box = document.getElementById('noise-pips');
  box.innerHTML = '';
  for (let i = 1; i <= 6; i++) {
    const d = document.createElement('div');
    d.className = 'pip';
    if (i <= STATE.noise) d.classList.add(STATE.noise <= 2 ? 'on-low' : (STATE.noise <= 4 ? 'on-mid' : 'on-high'));
    d.onclick = () => { STATE.noise = (STATE.noise === i ? i - 1 : i); renderNoise(); };
    box.appendChild(d);
  }
  document.getElementById('noise-txt').textContent = `${STATE.noise}/6`;
}

function toggleFOW() {
  STATE.gmMode = false;
  STATE.peek = {};
  STATE.lastRollHtml = '<span style="color:#c4b5fd;">🌫️ <strong>Niebla restablecida.</strong> Solo se ven las salas donde hay personajes con visión.</span>';
  renderAll();
}

function toggleReveal() {
  STATE.gmMode = !STATE.gmMode;
  renderAll();
}

function switchView(v) {
  STATE.view = v;
  resetCamera();
  syncFloorButtons();
  renderBlueprintSVG();
}

function zoomBy(factor) {
  STATE.zoom = Math.max(0.55, Math.min(2.4, STATE.zoom * factor));
  updateStageTransform();
}

function resetCamera() {
  STATE.zoom = 1;
  panX = 0;
  panY = 0;
  updateStageTransform();
}

function toggleDrawer() {
  STATE.drawerMinimized = !STATE.drawerMinimized;
  const dr = document.getElementById('context-drawer');
  dr.classList.toggle('minimized', STATE.drawerMinimized);
  document.body.classList.toggle('drawer-is-minimized', STATE.drawerMinimized);
  document.getElementById('drawer-toggle-lbl').textContent = STATE.drawerMinimized ? '[Expandir ▲]' : '[Minimizar ▼]';
}

function selectRoom(roomId) {
  if (STATE.dragState || !ROOMS[roomId]) return;
  STATE.selectedRoom = roomId;
  STATE.drawerMinimized = false;
  document.getElementById('context-drawer').classList.remove('minimized');
  document.body.classList.remove('drawer-is-minimized');
  renderBlueprintSVG();
  renderDrawer();
}

function selectToken(id) {
  STATE.activeToken = id;
  renderAll();
}

function statusSelect(kind, id, current) {
  const opts = Object.entries(STATUS).map(([k, s]) => `<option value="${k}" ${k === current ? 'selected' : ''}>${s.icon} ${s.label}</option>`).join('');
  return `<select class="status-select s-${current}" onclick="event.stopPropagation()" onmousedown="event.stopPropagation()" ontouchstart="event.stopPropagation()" onchange="setStatus('${kind}','${id}',this.value)">${opts}</select>`;
}

function moveSingleTokenToRoom(tokenId, roomId) {
  const r = ROOMS[roomId];
  const t = STATE.tokens[tokenId];
  if (!r || !t) return;
  if (!canMove(t)) {
    STATE.lastRollHtml = `<span style="color:#f87171;">⚠️ <strong>${t.name}</strong> está <em>${STATUS[t.status].label.toLowerCase()}</em> y no puede moverse. Cambia su estado abajo o arrástralo manualmente.</span>`;
    renderDrawer();
    return;
  }
  const offsets = { 'AU': { dx: -14, dy: -6 }, 'AR': { dx: 14, dy: -6 }, 'GZ': { dx: 0, dy: 16 } };
  const off = offsets[tokenId] || { dx: 0, dy: 0 };
  const oldX = t.x, oldY = t.y;
  t.x = r.tokenSpot.x + off.dx;
  t.y = r.tokenSpot.y + off.dy;
  const distPx = Math.hypot(t.x - oldX, t.y - oldY);
  STATE.lastTrail = { tokenId, x1: oldX, y1: oldY, x2: t.x, y2: t.y, distMeters: (distPx * 0.045).toFixed(1) + 'm' };
  STATE.selectedRoom = roomId;
  if (window.innerWidth <= 768 && STATE.view !== 'all' && r.floor !== STATE.view) STATE.view = r.floor;
  STATE.lastRollHtml = `<span style="color:#34d399;">👣 <strong>${t.name} [${t.id}]</strong> se desplazó individualmente a <strong>${roomLabel(t)}</strong> (${STATE.lastTrail.distMeters}).</span>`;
  renderAll();
}

function moveGroupToRoom(roomId) {
  const r = ROOMS[roomId];
  if (!r) return;
  const moved = [], stayed = [];
  const offsets = { 'AU': { dx: -16, dy: -8 }, 'AR': { dx: 16, dy: -8 }, 'GZ': { dx: 0, dy: 18 } };
  Object.values(STATE.tokens).forEach(t => {
    if (!canMove(t)) { stayed.push(`${t.name} (${STATUS[t.status].label.toLowerCase()})`); return; }
    const off = offsets[t.id] || { dx: 0, dy: 0 };
    t.x = r.tokenSpot.x + off.dx;
    t.y = r.tokenSpot.y + off.dy;
    moved.push(t.name);
  });
  STATE.selectedRoom = roomId;
  if (window.innerWidth <= 768 && STATE.view !== 'all' && r.floor !== STATE.view) STATE.view = r.floor;
  STATE.lastRollHtml = `<span style="color:#38bdf8;">👥 Avanzaron: <strong>${moved.join(', ') || 'Ninguno'}</strong>.${stayed.length ? ` <span style="color:#f87171;">Se quedan: <strong>${stayed.join(', ')}</strong>.</span>` : ''}</span>`;
  renderAll();
}

// "Explorar": abre la sala a mano. Se vuelve a cubrir con el botón Niebla.
function revealRoom(roomId, evt) {
  if (evt) evt.stopPropagation();
  STATE.peek[roomId] = true;
  if (ROOMS[roomId]) STATE.selectedRoom = roomId;
  renderAll();
}

function renderSquadBar() {
  const bar = document.getElementById('squad-bar');
  bar.innerHTML = Object.values(STATE.tokens).map(t => {
    const pct = Math.round((t.hp / t.maxHp) * 100);
    return `
      <div class="token-card ${STATE.activeToken === t.id ? 'active-token' : ''} ${t.status === 'incapacitado' ? 'tripped-card' : ''}" style="${t.status === 'muerto' ? 'opacity:.6;' : ''}" onclick="selectToken('${t.id}')">
        <div class="token-head">
          <span class="token-callsign"><span class="token-dot" style="background:${t.color};"></span>[${t.id}] ${t.name}</span>
          <span style="font-family:var(--font-mono);font-size:9.5px;color:#34d399;">${t.hp}/${t.maxHp}</span>
        </div>
        <div class="token-loc-badge">
          <span>📍 ${roomLabel(t)}</span>
          <span class="coord-txt" style="color:#94a3b8;">(${Math.round(t.x)},${Math.round(t.y)})</span>
        </div>
        <div class="token-sub">
          ${statusSelect('token', t.id, t.status)}
          ${t.ammo > 0 ? `<strong style="color:#fbbf24;">🔫 ${t.ammo}+${t.reserve}</strong>` : `<span>Croquis</span>`}
        </div>
        <div class="mini-hp-bar"><div class="mini-hp-fill" style="width:${pct}%;background:${t.color};"></div></div>
      </div>`;
  }).join('');
}

function renderDrawer() {
  const r = ROOMS[STATE.selectedRoom];
  if (!r) return;
  const activeChar = STATE.tokens[STATE.activeToken];
  const isRev = isRoomVisible(r.id);
  document.getElementById('drawer-title').textContent = `📍 ${r.title}`;

  let html = `
    <p class="drawer-desc">${r.desc}</p>
    <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;">
      <button class="hud-btn" style="flex:1;border-color:${activeChar.color};color:#fff;" onclick="moveSingleTokenToRoom('${activeChar.id}', '${r.id}')">
        🚶 Mover solo a ${activeChar.name} [${activeChar.id}]
      </button>
      <button class="hud-btn" onclick="moveGroupToRoom('${r.id}')">👥 Mover Grupo</button>
      ${!isRev ? `<button class="hud-btn gm-on" style="width:100%;" onclick="revealRoom('${r.id}')">🔍 Explorar Habitación</button>` : ''}
    </div>`;

  if (isRev) {
    html += `
      <div style="margin-top:6px;padding:7px 9px;background:rgba(245,158,11,0.09);border-left:3px solid var(--accent-amber,#f59e0b);border-radius:4px;font-size:11px;color:#fde68a;">
        <strong>Detalle Táctico:</strong> ${r.secret}
      </div>`;
    const here = Object.values(STATE.enemies).filter(e => { const d = detectRoomAt(e.x, e.y); return d && d.id === r.id; });
    if (here.length) {
      html += `<div class="enemy-list"><strong>☠ Amenazas en la sala</strong>${here.map(e =>
        `<div class="enemy-row"><span>[${e.id}] ${e.name}</span>${statusSelect('enemy', e.id, e.status)}</div>`).join('')}</div>`;
    }
  } else {
    html += `
      <div style="margin-top:6px;padding:7px 9px;background:rgba(168,85,247,0.1);border:1px dashed #a855f7;border-radius:6px;font-size:11px;color:#e9d5ff;text-align:center;">
        🌫️ <strong>Interior cubierto por Niebla de Guerra</strong><br>Mueve un personaje hasta aquí o toca Explorar para verla.
      </div>`;
  }

  if (r.actions && r.actions.length > 0) {
    html += `<div style="margin-top:6px;">`;
    r.actions.forEach((a, idx) => {
      html += `
        <button class="action-btn" onclick="runAction('${r.id}', ${idx})" ${canAct(activeChar) ? '' : 'style="opacity:.55;"'}>
          <span>▸ [${activeChar.id}] ${a.label}</span>
          <span style="color:var(--accent-amber,#f59e0b);flex-shrink:0;">${a.dif > 0 ? 'DIF ' + a.dif : 'IR'}</span>
        </button>`;
    });
    html += `</div>`;
  }

  html += `<div class="dice-banner" style="margin-top:6px;">${STATE.lastRollHtml}</div>`;
  document.getElementById('drawer-body').innerHTML = html;
}

function runAction(roomId, idx) {
  const r = ROOMS[roomId];
  const a = r.actions[idx];
  const activeChar = STATE.tokens[STATE.activeToken];
  if (!a || !activeChar) return;

  if (!canAct(activeChar)) {
    STATE.lastRollHtml = `<span style="color:#f87171;">❌ <strong>${activeChar.name}</strong> está <em>${STATUS[activeChar.status].label.toLowerCase()}</em> y no puede actuar. Cambia su estado o elige a otro personaje.</span>`;
    renderDrawer();
    return;
  }
  if (a.needCard && !STATE.lootMasterCard) {
    STATE.lastRollHtml = `<span style="color:#f87171;">❌ Requiere la <strong>Tarjeta Maestra</strong> del cuarto 402 para abrir esta puerta sin ruido.</span>`;
    renderDrawer();
    return;
  }

  if (a.loot) STATE.lootMasterCard = true;
  if (a.ammo && activeChar.ammo >= a.ammo) activeChar.ammo -= a.ammo;

  if (a.dif === 0) {
    if (a.switchFloorOnMobile && window.innerWidth <= 768) STATE.view = a.switchFloorOnMobile;
    if (a.next) moveSingleTokenToRoom(activeChar.id, a.next);
    STATE.lastRollHtml = `<span style="color:#38bdf8;">✓ [${activeChar.name}] ${a.ok}</span>`;
    renderAll();
    return;
  }

  const d10 = Math.floor(Math.random() * 10) + 1;
  const total = d10 + a.mod;
  const win = (d10 === 10) || (d10 !== 1 && total >= a.dif);

  if (a.forceNoise) STATE.noise = Math.min(6, STATE.noise + a.forceNoise);
  else if (!win && a.failNoise) STATE.noise = Math.min(6, STATE.noise + a.failNoise);

  let extra = '';
  if (win) {
    if (a.neutralize) { applyEnemyStates(a.neutralize, 'neutralizado'); extra = `<div style="color:#a5b4c8;">z Neutralizado: ${a.neutralize.join(', ')}</div>`; }
    if (a.kill) { applyEnemyStates(a.kill, 'muerto'); extra = `<div style="color:#94a3b8;">✖ Abatidos: ${a.kill.join(', ')}</div>`; }
    if (a.next) moveSingleTokenToRoom(activeChar.id, a.next);
  } else if (a.tripOnFail) {
    activeChar.status = 'incapacitado';
    if (STATE.activeToken === activeChar.id) STATE.activeToken = firstActiveId() || activeChar.id;
  }

  const color = win ? '#34d399' : '#f87171';
  STATE.lastRollHtml = `
    <div style="color:${color};font-weight:800;">🎲 [${activeChar.name}] 1d10 (${d10}) + ${a.mod} = ${total} vs DIF ${a.dif} — ${win ? 'ÉXITO' : (a.tripOnFail ? 'FALLO — INCAPACITADO' : 'FALLO')}</div>
    <div style="color:#e2e8f0;margin-top:2px;">${win ? a.ok : a.fail}</div>${extra}`;
  renderAll();
}

/* =====================================================================
   ENTRADA: pan, zoom con pellizco y arrastre de fichas (mouse + táctil)
   ===================================================================== */
let isPanning = false;
let startPanX = 0, startPanY = 0, panX = 0, panY = 0;
let initialPinchDist = null;
let initialPinchZoom = 1;

function updateStageTransform() {
  document.getElementById('map-stage').style.transform = `translate(${panX}px, ${panY}px) scale(${STATE.zoom})`;
}

function clientToSVGCoords(clientX, clientY) {
  const svg = document.getElementById('main-svg');
  if (!svg) return { x: 0, y: 0 };
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  return pt.matrixTransform(ctm.inverse());
}

function startTokenDrag(evt, tokenId) {
  evt.stopPropagation();
  if (evt.cancelable) evt.preventDefault();
  const t = STATE.tokens[tokenId] || STATE.enemies[tokenId];
  if (!t) return;
  if (STATE.tokens[tokenId]) STATE.activeToken = tokenId;
  STATE.dragState = { tokenId, startX: t.x, startY: t.y, curX: t.x, curY: t.y };
  renderSquadBar();
}

// Mientras se arrastra solo se mueve la ficha, la trayectoria y la niebla (sin redibujar el mapa)
function dragTo(clientX, clientY) {
  const ds = STATE.dragState;
  if (!ds) return;
  const p = clientToSVGCoords(clientX, clientY);
  ds.curX = Math.max(25, Math.min(1395, p.x));
  ds.curY = Math.max(55, Math.min(560, p.y));
  const t = STATE.tokens[ds.tokenId] || STATE.enemies[ds.tokenId];
  if (t) { t.x = ds.curX; t.y = ds.curY; }
  const g = document.querySelector(`.char-token-svg[data-token-id="${ds.tokenId}"]`);
  if (g) g.setAttribute('transform', `translate(${ds.curX}, ${ds.curY})`);
  renderTrail();
  updateFogDOM();
}

const vp = document.getElementById('map-viewport');

vp.addEventListener('mousedown', e => {
  if (e.target.closest('.char-token-svg')) return;
  isPanning = true;
  vp.classList.add('panning');
  startPanX = e.clientX - panX;
  startPanY = e.clientY - panY;
});

window.addEventListener('mousemove', e => {
  if (STATE.dragState) { dragTo(e.clientX, e.clientY); return; }
  if (!isPanning) return;
  panX = e.clientX - startPanX;
  panY = e.clientY - startPanY;
  updateStageTransform();
});

function finishTokenOrPan() {
  if (STATE.dragState) {
    const ds = STATE.dragState;
    const isChar = !!STATE.tokens[ds.tokenId];
    const t = isChar ? STATE.tokens[ds.tokenId] : STATE.enemies[ds.tokenId];
    const distPx = Math.hypot(ds.curX - ds.startX, ds.curY - ds.startY);
    const distMeters = (distPx * 0.045).toFixed(1) + 'm';
    const detected = detectRoomAt(t.x, t.y);

    if (distPx < 4) {
      // toque simple: abre la ficha de la sala donde está
      if (detected && ROOMS[detected.id]) STATE.selectedRoom = detected.id;
      STATE.dragState = null;
      renderAll();
    } else {
      if (isChar) {
        if (detected && ROOMS[detected.id]) STATE.selectedRoom = detected.id;
        STATE.lastTrail = { tokenId: ds.tokenId, x1: ds.startX, y1: ds.startY, x2: ds.curX, y2: ds.curY, distMeters };
        STATE.lastRollHtml = `<span style="color:#34d399;">✋ Arrastraste a <strong>${t.name} [${t.id}]</strong> hasta <strong>${roomLabel(t)}</strong> (${distMeters}).</span>`;
      } else {
        STATE.lastRollHtml = `<span style="color:#f87171;">✋ Posición de <strong>${t.name}</strong> actualizada (${distMeters}).</span>`;
      }
      STATE.dragState = null;
      renderAll();
    }
  }
  isPanning = false;
  initialPinchDist = null;
  vp.classList.remove('panning');
}

window.addEventListener('mouseup', finishTokenOrPan);

vp.addEventListener('touchstart', e => {
  if (e.target.closest('.char-token-svg')) return;
  if (e.touches.length === 2) {
    isPanning = false;
    initialPinchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    initialPinchZoom = STATE.zoom;
  } else if (e.touches.length === 1) {
    isPanning = true;
    startPanX = e.touches[0].clientX - panX;
    startPanY = e.touches[0].clientY - panY;
  }
}, { passive: true });

window.addEventListener('touchmove', e => {
  if (STATE.dragState && e.touches[0]) {
    if (e.cancelable) e.preventDefault();
    dragTo(e.touches[0].clientX, e.touches[0].clientY);
    return;
  }
  if (e.touches.length === 2 && initialPinchDist) {
    if (e.cancelable) e.preventDefault();
    const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    STATE.zoom = Math.max(0.55, Math.min(2.4, initialPinchZoom * (dist / initialPinchDist)));
    updateStageTransform();
    return;
  }
  if (isPanning && e.touches.length === 1) {
    panX = e.touches[0].clientX - startPanX;
    panY = e.touches[0].clientY - startPanY;
    updateStageTransform();
  }
}, { passive: false });

window.addEventListener('touchend', finishTokenOrPan);
window.addEventListener('resize', renderBlueprintSVG);

window.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  renderAll();
});
