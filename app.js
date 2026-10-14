const STATE = {
  view: window.innerWidth <= 768 ? 'p4' : 'all',
  gmMode: false,
  noise: 0,
  zoom: 1,
  selectedRoom: 'room_408',
  activeToken: 'AU',
  drawerMinimized: false,
  lootMasterCard: false,
  dragState: null,
  lastTrail: { tokenId: 'AU', x1: 185, y1: 390, x2: 205, y2: 278, distMeters: '4.1m' },
  revealed: {
    'room_408': true,
    'corridor_4p': true,
    'room_412': true,
    'walkway_4p': true,
    'room_402': false,
    'fire_door_4p': false,
    'stairs_p4_p3': false,
    'stairs_p2': false,
    'stairs_p1': false,
    'dock_pb': false,
    'yard_pb': false,
    'pickup_pb': false,
    'lobby_pb': true,
    'gate_pb': false
  },
  tokens: {
    'AU': { id: 'AU', name: 'Audomaro', role: 'Líder Táctico', color: '#10b981', hp: 18, maxHp: 18, ammo: 18, reserve: 16, weapon: 'Glock 17 Supresor', x: 205, y: 278, room: 'Pasillo 4to Piso', tripped: false },
    'AR': { id: 'AR', name: 'Armando', role: 'Operador / Ganzúa', color: '#38bdf8', hp: 16, maxHp: 16, ammo: 30, reserve: 30, weapon: 'Subfusil MP9', x: 222, y: 395, room: 'Habitación 408', tripped: false },
    'GZ': { id: 'GZ', name: 'Gonzalo', role: 'Civil (Herido)', color: '#f59e0b', hp: 12, maxHp: 14, ammo: 0, reserve: 0, weapon: 'Croquis del Hotel', x: 155, y: 425, room: 'Habitación 408', tripped: false }
  },
  enemies: {
    'Z1': { id: 'Z1', name: 'Amenaza 412', x: 335, y: 295 }
  },
  lastRollHtml: '<span style="color:#94a3b8;">💡 <strong> Táctil y Responsivo:</strong> Arrastra cada ficha (<strong>AU</strong>, <strong>AR</strong>, <strong>GZ</strong>) con el dedo o mouse, o pellizca con 2 dedos para hacer zoom.</span>'
};

const ROOM_BOUNDS = [
  { id: 'walkway_4p', name: 'Pasarela Ext.', x: 38, y: 320, w: 52, h: 185 },
  { id: 'fire_door_4p', name: 'Cortafuegos P4', x: 94, y: 106, w: 56, h: 125 },
  { id: 'room_402', name: 'Cuarto 402', x: 150, y: 106, w: 115, h: 125 },
  { id: 'corridor_4p', name: 'Pasillo 4to Piso', x: 94, y: 231, w: 427, h: 90 },
  { id: 'room_408', name: 'Habitación 408', x: 94, y: 321, w: 165, h: 182 },
  { id: 'room_412', name: 'Habitación 412', x: 374, y: 321, w: 147, h: 182 },
  { id: 'stairs_p4_p3', name: 'Escalera P4→P3', x: 563, y: 110, w: 189, h: 120 },
  { id: 'stairs_p2', name: 'Descanso Piso 2', x: 563, y: 238, w: 189, h: 135 },
  { id: 'stairs_p1', name: 'Base Escalera P1', x: 563, y: 381, w: 189, h: 118 },
  { id: 'dock_pb', name: 'Muelle de Carga', x: 810, y: 108, w: 215, h: 195 },
  { id: 'lobby_pb', name: 'Lobby Principal', x: 810, y: 308, w: 265, h: 194 },
  { id: 'yard_pb', name: 'Patio (15m)', x: 1030, y: 108, w: 180, h: 195 },
  { id: 'pickup_pb', name: 'Cajón Pickup', x: 1212, y: 108, w: 162, h: 195 },
  { id: 'gate_pb', name: 'Caseta Salida', x: 1080, y: 308, w: 294, h: 194 }
];

const ROOMS = {
  'room_408': {
    id: 'room_408',
    floor: 'p4',
    title: 'Habitación 408 — Punto de Partida (Barricada)',
    tokenSpot: { x: 190, y: 405 },
    desc: 'Habitación asegurada en el 4to piso con escritorio de madera maciza contra la puerta, cama doble, baño interior y ventana hacia el norte.',
    secret: 'Fase 1: Desmontar en silencio el escritorio y las toallas de la puerta para salir al pasillo alfombrado.',
    actions: [
      { label: 'Desmontar barricada y salir al pasillo', dif: 8, mod: 6, next: 'corridor_4p', ok: 'Barricada retirada sin ruido. El personaje activo sale al corredor.', fail: 'El escritorio raspa el piso (+1 Ruido).', failNoise: 1 }
    ]
  },
  'corridor_4p': {
    id: 'corridor_4p',
    floor: 'p4',
    title: 'Pasillo Central 4to Piso (Alfombrado)',
    tokenSpot: { x: 205, y: 278 },
    desc: 'Corredor longitudinal con alfombra amortiguadora que conecta las habitaciones 402 a 414 y el bloque de elevadores.',
    secret: 'Frente a la puerta 410 yace en letargo el infectado de la 412. Si alguien tropieza (Fallo), queda rezagado en el pasillo mientras los demás pueden posicionarse por separado.',
    actions: [
      { label: 'Avanzar en sigilo por la alfombra hacia la 402', dif: 10, mod: 6, next: 'room_402', ok: 'Avance sigiloso exitoso hasta la puerta 402.', fail: '¡Tropiezo en la alfombra! El personaje activo queda rezagado y genera +1 Ruido.', failNoise: 1, tripOnFail: true },
      { label: 'Neutralización CQC silenciosa en el pasillo', dif: 9, mod: 7, next: 'corridor_4p', ok: 'Amenaza eliminada en silencio total sin gastar munición.', fail: 'Forcejeo en el suelo (+1 Ruido); el personaje queda trabado en su posición.', failNoise: 1, tripOnFail: true }
    ]
  },
  'room_412': {
    id: 'room_412',
    floor: 'p4',
    title: 'Habitación 412 — Zona de Impactos',
    tokenSpot: { x: 430, y: 405 },
    desc: 'Suite ejecutiva con marcas de impactos balísticos en la entrada y mobiliario derribado.',
    secret: '18 casquillos 9mm percutidos en el umbral. Sin recursos adicionales útiles para la ruta de extracción.',
    actions: []
  },
  'walkway_4p': {
    id: 'walkway_4p',
    floor: 'p4',
    title: 'Pasarela Exterior de Mantenimiento (Altura: 14m)',
    tokenSpot: { x: 65, y: 395 },
    desc: 'Andador metálico volado en la fachada lateral a 14 metros sobre el nivel de calle.',
    secret: 'Ruta nocturna descartada por riesgo crítico de caída.',
    actions: []
  },
  'room_402': {
    id: 'room_402',
    floor: 'p4',
    title: 'Habitación 402 — Cuarto de Servicio y Camaristas',
    tokenSpot: { x: 195, y: 165 },
    desc: 'Cuarto técnico con estanterías de blancos, carros de limpieza, productos químicos y cesto industrial de lavandería.',
    secret: 'Botín: Tarjeta Maestra magnética, barra de uña (Daño 3), 2 botellas de cloro y guantes. Peligro oculto en el cesto de ropa sucia (Percepción DIF 10).',
    actions: [
      { label: 'Forzar cerradura con ganzúa (Personaje activo)', dif: 9, mod: 4, next: 'room_402', loot: true, ok: 'Cerradura abierta en 10 segundos sin ruido.', fail: 'La ganzúa se dobla; se fuerza con palanca (+1 Ruido).', failNoise: 1 },
      { label: 'Inspeccionar cesto y asegurar Tarjeta Maestra', dif: 10, mod: 6, next: 'fire_door_4p', loot: true, ok: 'Peligro en el cesto detectado a tiempo. Tarjeta Maestra y herramientas aseguradas.', fail: 'Emboscada desde el cesto (+1 Ruido); el personaje queda retenido.', failNoise: 1, tripOnFail: true }
    ]
  },
  'fire_door_4p': {
    id: 'fire_door_4p',
    floor: 'p4',
    title: 'Puerta Cortafuegos — Acceso al Cubo de Escaleras',
    tokenSpot: { x: 120, y: 165 },
    desc: 'Puerta metálica pesada con barra antipánico que comunica el ala izquierda del 4to piso con el cubo vertical de servicio.',
    secret: 'Ruta limpia que evita por completo los elevadores y el vestíbulo principal.',
    actions: [
      { label: 'Cruzar puerta cortafuegos hacia Escalera P4–P3', dif: 0, mod: 0, next: 'stairs_p4_p3', switchFloorOnMobile: 'stairs', ok: 'El personaje activo cruza hacia el cubo de concreto de la escalera.' }
    ]
  },
  'stairs_p4_p3': {
    id: 'stairs_p4_p3',
    floor: 'stairs',
    title: 'Cubo de Escalera — Tramo Superior (Piso 4 a Piso 3)',
    tokenSpot: { x: 650, y: 175 },
    desc: 'Rampa de escalones estrechos de concreto armado con barandal tubular metálico y acústica cerrada.',
    secret: 'Descenso asistido a ritmo controlado para evitar resbalones y eco en el cubo vertical.',
    actions: [
      { label: 'Descender hacia el rellano del Piso 2', dif: 8, mod: 6, next: 'stairs_p2', ok: 'Descenso silencioso escalón por escalón hasta el rellano del Piso 2.', fail: '¡Tropezón en los escalones de concreto! (+1 Ruido y queda rezagado).', failNoise: 1, tripOnFail: true }
    ]
  },
  'stairs_p2': {
    id: 'stairs_p2',
    floor: 'stairs',
    title: 'Descanso del Piso 2 — Rellano Intermedio',
    tokenSpot: { x: 650, y: 315 },
    desc: 'Plataforma intermedia donde la puerta del 2do piso se encuentra trabada por un carrito de lavandería.',
    secret: 'Dos amenazas bloquean el rellano junto al carrito. Opción A: 2 disparos con supresor (DIF 11). Opción B: Descolgarse por el barandal hacia el Piso 1 (DIF 14).',
    actions: [
      { label: 'Opción A: Doble disparo silenciado (2 balas 9mm)', dif: 11, mod: 6, ammo: 2, next: 'stairs_p1', ok: 'Dos blancos abatidos en silencio. Paso libre hacia Planta Baja.', fail: 'Un proyectil impacta el metal del carrito (+1 Ruido).', failNoise: 1 },
      { label: 'Opción B: Saltar barandal hacia el tramo del Piso 1', dif: 14, mod: 4, next: 'stairs_p1', ok: 'Maniobra atlética exitosa hacia el nivel inferior.', fail: 'Mal aterrizaje en el descanso (+1 Ruido y tropiezo).', failNoise: 1, tripOnFail: true }
    ]
  },
  'stairs_p1': {
    id: 'stairs_p1',
    floor: 'stairs',
    title: 'Tramo Inferior Piso 1 — Salida a Muelle de Carga',
    tokenSpot: { x: 650, y: 445 },
    desc: 'Base del cubo de escaleras con puerta de servicio directo hacia el muelle trasero.',
    secret: 'Conecta directamente con la Planta Baja sin pisar el Lobby.',
    actions: [
      { label: 'Entrar al Muelle de Carga en Planta Baja', dif: 0, mod: 0, next: 'dock_pb', switchFloorOnMobile: 'pb', ok: 'El personaje activo accede a la plataforma del Muelle de Descarga.' }
    ]
  },
  'dock_pb': {
    id: 'dock_pb',
    floor: 'pb',
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
    id: 'yard_pb',
    floor: 'pb',
    title: 'Patio de Maniobras Exterior (Tramo de 15 Metros)',
    tokenSpot: { x: 1125, y: 205 },
    desc: 'Explanada pavimentada de maniobras a cielo abierto entre el andén de descarga y los cajones de estacionamiento.',
    secret: 'Dos amenazas merodean entre el andén y el vehículo estacionado a 15 metros.',
    actions: [
      { label: 'Cruzar los 15 metros tácticamente hasta el vehículo', dif: 11, mod: 6, ammo: 2, next: 'pickup_pb', ok: 'Corredor de 15m despejado; aborda el vehículo.', fail: 'Tropiezo o contacto hostil a mitad del asfalto (+1 Ruido).', failNoise: 1, tripOnFail: true }
    ]
  },
  'pickup_pb': {
    id: 'pickup_pb',
    floor: 'pb',
    title: 'Cajón de Estacionamiento — Camioneta Pickup',
    tokenSpot: { x: 1275, y: 195 },
    desc: 'Vehículo tipo Pickup estacionado en batería a 15 metros del muelle, orientado hacia el carril de salida.',
    secret: 'Batería óptima y 3/4 de tanque de combustible. Llaves en posesión del líder.',
    actions: [
      { label: 'Encender motor y maniobrar hacia la Caseta de Salida', dif: 10, mod: 6, next: 'gate_pb', ok: '¡Extracción completada! La pickup esquiva el auto estrellado y sale a la avenida.', fail: 'Roce de lámina en la caseta (+1 Ruido), pero logran salir.', failNoise: 1 }
    ]
  },
  'gate_pb': {
    id: 'gate_pb',
    floor: 'pb',
    title: 'Caseta de Control y Rampa Vehicular',
    tokenSpot: { x: 1275, y: 390 },
    desc: 'Garita de vigilancia en el acceso del patio con pluma rota y un automóvil civil impactado contra el bolardo.',
    secret: 'Punto final de extracción hacia las vialidades exteriores.',
    actions: []
  },
  'lobby_pb': {
    id: 'lobby_pb',
    floor: 'pb',
    title: 'Lobby Principal y Recepción (Zona Clausurada)',
    tokenSpot: { x: 940, y: 420 },
    desc: 'Vestíbulo de doble altura con mostrador de recepción, puertas de cristal destrozadas y acceso a elevadores.',
    secret: 'Zona roja de alta letalidad evitada mediante el descenso por el cubo de servicio.',
    actions: []
  }
};

function detectRoomAt(x, y) {
  for (const b of ROOM_BOUNDS) {
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
      return b;
    }
  }
  return null;
}

function syncFloorButtons() {
  document.querySelectorAll('.floor-pill').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-view-${STATE.view}`);
  if (activeBtn) activeBtn.classList.add('active');
}

function renderAll() {
  syncFloorButtons();
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
    if (i <= STATE.noise) {
      d.classList.add(STATE.noise <= 2 ? 'on-low' : (STATE.noise <= 4 ? 'on-mid' : 'on-high'));
    }
    d.onclick = () => { STATE.noise = (STATE.noise === i ? i - 1 : i); renderNoise(); };
    box.appendChild(d);
  }
  document.getElementById('noise-txt').textContent = `${STATE.noise}/6`;
}

function toggleFOW() {
  STATE.gmMode = !STATE.gmMode;
  const btn = document.getElementById('gm-btn');
  if (STATE.gmMode) {
    btn.classList.add('gm-on');
    btn.textContent = '🔓 Todo';
  } else {
    btn.classList.remove('gm-on');
    btn.textContent = '👁️ Niebla';
  }
  renderBlueprintSVG();
  renderDrawer();
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
  if (STATE.dragState) return;
  STATE.selectedRoom = roomId;
  STATE.drawerMinimized = false;
  document.getElementById('context-drawer').classList.remove('minimized');
  document.body.classList.remove('drawer-is-minimized');
  renderBlueprintSVG();
  renderDrawer();
}

function moveSingleTokenToRoom(tokenId, roomId) {
  const r = ROOMS[roomId];
  const t = STATE.tokens[tokenId];
  if (!r || !t) return;
  if (t.tripped) {
    STATE.lastRollHtml = `<span style="color:#f87171;">⚠️ <strong>${t.name}</strong> tiene el estado <em>Tropezó / Anclado</em>. Tócalo abajo para desbloquearlo o arrástralo manualmente.</span>`;
    renderDrawer();
    return;
  }
  const offsets = { 'AU': { dx: -14, dy: -6 }, 'AR': { dx: 14, dy: -6 }, 'GZ': { dx: 0, dy: 16 } };
  const off = offsets[tokenId] || { dx: 0, dy: 0 };
  const oldX = t.x, oldY = t.y;
  t.x = r.tokenSpot.x + off.dx;
  t.y = r.tokenSpot.y + off.dy;
  t.room = r.title.split('—')[0].trim();
  const distPx = Math.hypot(t.x - oldX, t.y - oldY);
  STATE.lastTrail = { tokenId, x1: oldX, y1: oldY, x2: t.x, y2: t.y, distMeters: (distPx * 0.045).toFixed(1) + 'm' };
  STATE.revealed[roomId] = true;
  STATE.selectedRoom = roomId;
  if (window.innerWidth <= 768 && STATE.view !== 'all' && r.floor !== STATE.view) {
    STATE.view = r.floor;
  }
  STATE.lastRollHtml = `<span style="color:#34d399;">👣 <strong>${t.name} [${t.id}]</strong> se desplazó individualmente a <strong>${t.room}</strong> (${STATE.lastTrail.distMeters}).</span>`;
  renderAll();
}

function moveGroupToRoom(roomId) {
  const r = ROOMS[roomId];
  if (!r) return;
  STATE.revealed[roomId] = true;
  const moved = [];
  const stayed = [];
  const offsets = { 'AU': { dx: -16, dy: -8 }, 'AR': { dx: 16, dy: -8 }, 'GZ': { dx: 0, dy: 18 } };
  Object.values(STATE.tokens).forEach(t => {
    if (t.tripped) {
      stayed.push(t.name);
    } else {
      const off = offsets[t.id] || { dx: 0, dy: 0 };
      t.x = r.tokenSpot.x + off.dx;
      t.y = r.tokenSpot.y + off.dy;
      t.room = r.title.split('—')[0].trim();
      moved.push(t.name);
    }
  });
  STATE.selectedRoom = roomId;
  if (window.innerWidth <= 768 && STATE.view !== 'all' && r.floor !== STATE.view) {
    STATE.view = r.floor;
  }
  STATE.lastRollHtml = `<span style="color:#38bdf8;">👥 Avanzaron: <strong>${moved.join(', ') || 'Ninguno'}</strong>.${stayed.length ? ` <span style="color:#f87171;">Rezagados: <strong>${stayed.join(', ')}</strong>.</span>` : ''}</span>`;
  renderAll();
}

function toggleTripState(tokenId, evt) {
  if (evt) evt.stopPropagation();
  const t = STATE.tokens[tokenId];
  if (!t) return;
  t.tripped = !t.tripped;
  STATE.lastRollHtml = t.tripped
    ? `<span style="color:#f87171;">⚠️ <strong>${t.name} [${t.id}]</strong> marcado como <strong>Tropezó / Rezagado</strong> en ${t.room}.</span>`
    : `<span style="color:#34d399;">✓ <strong>${t.name} [${t.id}]</strong> se reincorpora y vuelve a tener movilidad normal.</span>`;
  renderAll();
}

function revealRoom(roomId, evt) {
  if (evt) evt.stopPropagation();
  STATE.revealed[roomId] = true;
  STATE.selectedRoom = roomId;
  renderAll();
}

function renderSquadBar() {
  const bar = document.getElementById('squad-bar');
  bar.innerHTML = Object.values(STATE.tokens).map(t => {
    const pct = Math.round((t.hp / t.maxHp) * 100);
    return `
      <div class="token-card ${STATE.activeToken === t.id ? 'active-token' : ''} ${t.tripped ? 'tripped-card' : ''}" onclick="STATE.activeToken='${t.id}';renderAll();">
        <div class="token-head">
          <span class="token-callsign"><span class="token-dot" style="background:${t.color};"></span>[${t.id}] ${t.name}</span>
          <span style="font-family:var(--font-mono);font-size:9.5px;color:#34d399;">${t.hp}/${t.maxHp}</span>
        </div>
        <div class="token-loc-badge">
          <span>📍 ${t.room}</span>
          <span class="coord-txt" style="color:#94a3b8;">(${Math.round(t.x)},${Math.round(t.y)})</span>
        </div>
        <div class="token-sub">
          <button class="trip-toggle-btn ${t.tripped ? 'is-tripped' : ''}" onclick="toggleTripState('${t.id}', event)">
            ${t.tripped ? '⚠️ Tropezó' : '🏃 Móvil'}
          </button>
          ${t.ammo > 0 ? `<strong style="color:#fbbf24;">🔫 ${t.ammo}+${t.reserve}</strong>` : `<span>Croquis</span>`}
        </div>
        <div class="mini-hp-bar"><div class="mini-hp-fill" style="width:${pct}%;background:${t.color};"></div></div>
      </div>
    `;
  }).join('');
}

function renderDrawer() {
  const r = ROOMS[STATE.selectedRoom];
  if (!r) return;
  const activeChar = STATE.tokens[STATE.activeToken];
  const isRev = STATE.gmMode || STATE.revealed[r.id];
  document.getElementById('drawer-title').textContent = `📍 ${r.title}`;

  let html = `
    <p class="drawer-desc">${r.desc}</p>
    <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;">
      <button class="hud-btn" style="flex:1;border-color:${activeChar.color};color:#fff;" onclick="moveSingleTokenToRoom('${activeChar.id}', '${r.id}')">
        🚶 Mover solo a ${activeChar.name} [${activeChar.id}]
      </button>
      <button class="hud-btn" onclick="moveGroupToRoom('${r.id}')">
        👥 Mover Grupo
      </button>
      ${!isRev ? `<button class="hud-btn gm-on" style="width:100%;" onclick="revealRoom('${r.id}')">🔍 Explorar Habitación</button>` : ''}
    </div>
  `;

  if (isRev) {
    html += `
      <div style="margin-top:6px;padding:7px 9px;background:rgba(245,158,11,0.09);border-left:3px solid var(--accent-amber);border-radius:4px;font-size:11px;color:#fde68a;">
        <strong>Detalle Táctico:</strong> ${r.secret}
      </div>
    `;
  } else {
    html += `
      <div style="margin-top:6px;padding:7px 9px;background:rgba(168,85,247,0.1);border:1px dashed #a855f7;border-radius:6px;font-size:11px;color:#e9d5ff;text-align:center;">
        🔒 <strong>Interior cubierto por Niebla de Guerra</strong><br>Arrastra una ficha dentro o toca Explorar para revelarla.
      </div>
    `;
  }

  if (r.actions && r.actions.length > 0) {
    html += `<div style="margin-top:6px;">`;
    r.actions.forEach((a, idx) => {
      html += `
        <button class="action-btn" onclick="runAction('${r.id}', ${idx})">
          <span>▸ [${activeChar.id}] ${a.label}</span>
          <span style="color:var(--accent-amber);flex-shrink:0;">${a.dif > 0 ? 'DIF ' + a.dif : 'IR'}</span>
        </button>
      `;
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

  if (a.needCard && !STATE.lootMasterCard) {
    STATE.lastRollHtml = `<span style="color:#f87171;">❌ Requiere la <strong>Tarjeta Maestra</strong> del cuarto 402 para abrir esta puerta sin ruido.</span>`;
    renderDrawer();
    return;
  }

  STATE.revealed[roomId] = true;
  if (a.loot) STATE.lootMasterCard = true;
  if (a.ammo && activeChar.ammo >= a.ammo) activeChar.ammo -= a.ammo;

  if (a.dif === 0) {
    if (a.switchFloorOnMobile && window.innerWidth <= 768) {
      STATE.view = a.switchFloorOnMobile;
    }
    if (a.next) moveSingleTokenToRoom(activeChar.id, a.next);
    STATE.lastRollHtml = `<span style="color:#38bdf8;">✓ [${activeChar.name}] ${a.ok}</span>`;
    renderAll();
    return;
  }

  const d10 = Math.floor(Math.random() * 10) + 1;
  const total = d10 + a.mod;
  const win = (d10 === 10) || (d10 !== 1 && total >= a.dif);

  if (a.forceNoise) {
    STATE.noise = Math.min(6, STATE.noise + a.forceNoise);
  } else if (!win && a.failNoise) {
    STATE.noise = Math.min(6, STATE.noise + a.failNoise);
  }

  if (win) {
    activeChar.tripped = false;
    if (a.next) moveSingleTokenToRoom(activeChar.id, a.next);
  } else if (a.tripOnFail) {
    activeChar.tripped = true;
  }

  const color = win ? '#34d399' : '#f87171';
  STATE.lastRollHtml = `
    <div style="color:${color};font-weight:800;">🎲 [${activeChar.name}] 1d10 (${d10}) + ${a.mod} = ${total} vs DIF ${a.dif} — ${win ? 'ÉXITO' : 'FALLO / TROPIEZO'}</div>
    <div style="color:#e2e8f0;margin-top:2px;">${win ? a.ok : a.fail}</div>
  `;
  renderAll();
}

function shroudOverlay(roomId, x, y, w, h, label) {
  if (STATE.gmMode || STATE.revealed[roomId]) return '';
  return `
    <g onclick="revealRoom('${roomId}', event)">
      <rect class="fow-shroud" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>
      <circle cx="${x + w/2}" cy="${y + h/2 - 8}" r="14" fill="#111827" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="${x + w/2}" y="${y + h/2 - 4}" fill="#fbbf24" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">?</text>
      <text x="${x + w/2}" y="${y + h/2 + 18}" fill="#fde68a" font-family="monospace" font-size="9.5" text-anchor="middle" font-weight="bold">${label}</text>
    </g>
  `;
}

function renderBlueprintSVG() {
  const stage = document.getElementById('map-stage');

  let vb = "0 25 1480 650";
  if (STATE.view === 'p4') vb = "20 50 520 480";
  else if (STATE.view === 'stairs') vb = "535 50 250 480";
  else if (STATE.view === 'pb') vb = "790 50 605 480";

  const rev402 = STATE.gmMode || STATE.revealed['room_402'];
  const revP2 = STATE.gmMode || STATE.revealed['stairs_p2'];
  const revYard = STATE.gmMode || STATE.revealed['yard_pb'];

  let trailSvg = '';
  if (STATE.dragState) {
    const ds = STATE.dragState;
    const t = STATE.tokens[ds.tokenId] || STATE.enemies[ds.tokenId];
    const col = t ? (t.color || '#ef4444') : '#38bdf8';
    const distMeters = (Math.hypot(ds.curX - ds.startX, ds.curY - ds.startY) * 0.045).toFixed(1) + 'm';
    trailSvg = `
      <g pointer-events="none">
        <line x1="${ds.startX}" y1="${ds.startY}" x2="${ds.curX}" y2="${ds.curY}" stroke="${col}" stroke-width="2.5" stroke-dasharray="5 4"/>
        <circle cx="${ds.startX}" cy="${ds.startY}" r="5" fill="${col}" opacity="0.6"/>
        <rect x="${(ds.startX + ds.curX)/2 - 24}" y="${(ds.startY + ds.curY)/2 - 18}" width="48" height="16" rx="4" fill="#090d14" stroke="${col}" stroke-width="1"/>
        <text x="${(ds.startX + ds.curX)/2}" y="${(ds.startY + ds.curY)/2 - 7}" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle" font-weight="bold">${distMeters}</text>
      </g>
    `;
  } else if (STATE.lastTrail) {
    const lt = STATE.lastTrail;
    const t = STATE.tokens[lt.tokenId];
    const col = t ? t.color : '#10b981';
    trailSvg = `
      <g pointer-events="none" opacity="0.82">
        <line x1="${lt.x1}" y1="${lt.y1}" x2="${lt.x2}" y2="${lt.y2}" stroke="${col}" stroke-width="2" stroke-dasharray="4 4"/>
        <circle cx="${lt.x1}" cy="${lt.y1}" r="4" fill="none" stroke="${col}" stroke-width="1.5"/>
        <rect x="${(lt.x1 + lt.x2)/2 - 26}" y="${(lt.y1 + lt.y2)/2 - 9}" width="52" height="15" rx="4" fill="#090d14" stroke="${col}" stroke-width="1"/>
        <text x="${(lt.x1 + lt.x2)/2}" y="${(lt.y1 + lt.y2)/2 + 1.5}" fill="${col}" font-family="monospace" font-size="8.5" text-anchor="middle" font-weight="bold">${lt.tokenId}: ${lt.distMeters}</text>
      </g>
    `;
  }

  const z1 = STATE.enemies.Z1;

  const svg = `
  <svg id="main-svg" class="arch-blueprint" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="bpGridFine" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#111c2d" stroke-width="0.7"/>
      </pattern>
      <pattern id="bpGridMajor" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="url(#bpGridFine)"/>
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#192940" stroke-width="1.2"/>
      </pattern>
      <pattern id="carpetTex" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#121c2c"/>
        <circle cx="4" cy="4" r="0.8" fill="#1e2f48"/>
      </pattern>
      <pattern id="stairSteps" width="12" height="10" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="12" y2="0" stroke="#334155" stroke-width="1.5"/>
      </pattern>
      <pattern id="hazardStripe" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="12" fill="rgba(239,68,68,0.18)"/>
      </pattern>
      <filter id="tokenShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.85"/>
      </filter>
    </defs>

    <!-- MAIN ARCHITECTURAL SHEET BACKGROUND -->
    <rect x="0" y="0" width="1420" height="600" rx="12" fill="url(#bpGridMajor)" stroke="#293b56" stroke-width="2"/>

    <!-- SECTOR 1: PLANTA PISO 4 (X: 30 .. 525) -->
    <g id="layer-p4">
      <text x="45" y="72" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">PLANTA ARQUITECTÓNICA — NIVEL 4 (ALA NORTE)</text>
      <text x="45" y="88" fill="#64748b" font-family="monospace" font-size="9.5">COTA +14.00m • MUROS DE CONCRETO Y TABLARROCA • ARRASTRE TÁCTIL ACTIVO</text>

      <!-- EXTERIOR WALKWAY 14M -->
      <g onclick="selectRoom('walkway_4p')">
        <rect class="arch-room ${STATE.selectedRoom==='walkway_4p'?'selected-room':''}" x="38" y="320" width="52" height="185" fill="#0b121c" stroke="#475569" stroke-width="2" stroke-dasharray="5 3"/>
        <line x1="38" y1="350" x2="90" y2="350" stroke="#1e293b" stroke-width="1"/>
        <line x1="38" y1="380" x2="90" y2="380" stroke="#1e293b" stroke-width="1"/>
        <line x1="38" y1="410" x2="90" y2="410" stroke="#1e293b" stroke-width="1"/>
        <line x1="38" y1="440" x2="90" y2="440" stroke="#1e293b" stroke-width="1"/>
        <text x="64" y="405" fill="#64748b" font-family="monospace" font-size="9" text-anchor="middle" transform="rotate(-90 64 405)">PASARELA EXT. (COTA +14m)</text>
      </g>

      <rect x="90" y="102" width="435" height="405" fill="#0d1522" stroke="#94a3b8" stroke-width="4"/>

      <!-- FIRE DOOR BAY -->
      <g onclick="selectRoom('fire_door_4p')">
        <rect class="arch-room ${STATE.selectedRoom==='fire_door_4p'?'selected-room':''}" x="94" y="106" width="56" height="125" fill="#101c2e" stroke="#38bdf8" stroke-width="2"/>
        <rect x="102" y="116" width="40" height="55" fill="url(#stairSteps)" stroke="#475569" stroke-width="1"/>
        <path d="M 110 231 L 110 208 A 23 23 0 0 1 133 231" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2 2"/>
        <text x="122" y="192" fill="#38bdf8" font-family="monospace" font-size="8.5" text-anchor="middle" font-weight="bold">PUERTA</text>
        <text x="122" y="203" fill="#38bdf8" font-family="monospace" font-size="8" text-anchor="middle">CORTAFUEGOS</text>
      </g>

      <!-- ROOM 402 -->
      <g onclick="selectRoom('room_402')">
        <rect class="arch-room ${STATE.selectedRoom==='room_402'?'selected-room':''}" x="150" y="106" width="115" height="125" fill="#121d2d" stroke="#64748b" stroke-width="2.5"/>
        <rect x="156" y="112" width="65" height="14" fill="#1e293b" stroke="#475569" stroke-width="1"/>
        <text x="188" y="122" fill="#94a3b8" font-family="monospace" font-size="7.5" text-anchor="middle">ESTANTERÍA</text>
        <rect x="156" y="145" width="28" height="45" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
        <text x="170" y="170" fill="#fcd34d" font-family="monospace" font-size="7.5" text-anchor="middle">💳🔧</text>
        <circle cx="242" cy="132" r="14" fill="#1e293b" stroke="${rev402 ? '#ef4444' : '#64748b'}" stroke-width="1.5"/>
        <text x="242" y="135" fill="#cbd5e1" font-family="monospace" font-size="7" text-anchor="middle">CESTO</text>
        <path d="M 195 231 L 195 206 A 25 25 0 0 1 220 231" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="208" y="218" fill="#fcd34d" font-family="monospace" font-size="10" text-anchor="middle" font-weight="bold">CUARTO 402</text>
      </g>
      ${shroudOverlay('room_402', 150, 106, 115, 125, 'CUARTO 402')}

      <!-- ROOM 404, 406, ELEVATORS -->
      <g>
        <rect x="265" y="106" width="90" height="125" fill="#0d1420" stroke="#334155" stroke-width="2"/>
        <rect x="285" y="114" width="48" height="36" rx="2" fill="#131c2b" stroke="#263449" stroke-width="1"/>
        <rect x="290" y="116" width="18" height="10" fill="#1e293b"/>
        <rect x="310" y="116" width="18" height="10" fill="#1e293b"/>
        <text x="310" y="195" fill="#475569" font-family="monospace" font-size="9.5" text-anchor="middle">HAB. 404</text>

        <rect x="355" y="106" width="90" height="125" fill="#0d1420" stroke="#334155" stroke-width="2"/>
        <rect x="375" y="114" width="48" height="36" rx="2" fill="#131c2b" stroke="#263449" stroke-width="1"/>
        <text x="400" y="195" fill="#475569" font-family="monospace" font-size="9.5" text-anchor="middle">HAB. 406</text>

        <rect x="445" y="106" width="76" height="125" fill="url(#hazardStripe)" stroke="#7f1d1d" stroke-width="2"/>
        <line x1="445" y1="106" x2="521" y2="231" stroke="#7f1d1d" stroke-width="1"/>
        <line x1="521" y1="106" x2="445" y2="231" stroke="#7f1d1d" stroke-width="1"/>
        <text x="483" y="168" fill="#f87171" font-family="monospace" font-size="8.5" text-anchor="middle" font-weight="bold">ELEVADORES</text>
        <text x="483" y="180" fill="#fca5a5" font-family="monospace" font-size="7.5" text-anchor="middle">(BLOQUEADOS)</text>
      </g>

      <!-- CENTRAL CORRIDOR PISO 4 -->
      <g onclick="selectRoom('corridor_4p')">
        <rect class="arch-room ${STATE.selectedRoom==='corridor_4p'?'selected-room':''}" x="94" y="231" width="427" height="90" fill="url(#carpetTex)" stroke="#475569" stroke-width="2"/>
        <text x="275" y="248" fill="#64748b" font-family="monospace" font-size="9" text-anchor="middle">PASILLO CENTRAL ALFOMBRADO — PISO 4</text>
      </g>

      <!-- ROOM 408 -->
      <g onclick="selectRoom('room_408')">
        <rect class="arch-room ${STATE.selectedRoom==='room_408'?'selected-room':''}" x="94" y="321" width="165" height="182" fill="#102129" stroke="#10b981" stroke-width="3"/>
        <rect x="94" y="321" width="58" height="68" fill="#0c1722" stroke="#334155" stroke-width="1.5"/>
        <ellipse cx="112" cy="345" rx="8" ry="11" fill="none" stroke="#475569" stroke-width="1.2"/>
        <rect x="130" y="325" width="18" height="26" fill="none" stroke="#475569" stroke-width="1.2"/>
        <text x="123" y="380" fill="#475569" font-family="monospace" font-size="7" text-anchor="middle">BAÑO</text>

        <rect x="172" y="323" width="46" height="14" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="195" y="333" fill="#fef3c7" font-family="monospace" font-size="7" text-anchor="middle" font-weight="bold">ESCRITORIO</text>
        <path d="M 174 321 L 174 348 A 27 27 0 0 0 201 321" fill="none" stroke="#10b981" stroke-width="1.5"/>

        <rect x="104" y="410" width="68" height="54" rx="3" fill="#152c38" stroke="#34d399" stroke-width="1.2"/>
        <rect x="108" y="415" width="14" height="20" rx="2" fill="#1e3a4a"/>
        <rect x="108" y="439" width="14" height="20" rx="2" fill="#1e3a4a"/>
        <text x="142" y="440" fill="#6ee7b7" font-family="monospace" font-size="7.5" text-anchor="middle">CAMA</text>

        <rect x="135" y="499" width="85" height="6" fill="#38bdf8" stroke="#bae6fd" stroke-width="1"/>
        <text x="195" y="362" fill="#34d399" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">HAB. 408</text>
        <text x="195" y="488" fill="#7dd3fc" font-family="monospace" font-size="8" text-anchor="middle">══ VENTANA EXTERIOR ══</text>
      </g>

      <!-- ROOM 410 -->
      <g>
        <rect x="259" y="321" width="115" height="182" fill="#0d1420" stroke="#334155" stroke-width="2"/>
        <rect x="259" y="321" width="45" height="55" fill="#0a1019" stroke="#263449" stroke-width="1"/>
        <rect x="285" y="415" width="58" height="48" rx="2" fill="#131c2b" stroke="#263449" stroke-width="1"/>
        <path d="M 318 321 L 318 345 A 24 24 0 0 0 342 321" fill="none" stroke="#475569" stroke-width="1.2"/>
        <text x="316" y="395" fill="#64748b" font-family="monospace" font-size="10" text-anchor="middle">HAB. 410</text>
      </g>

      <!-- ROOM 412 -->
      <g onclick="selectRoom('room_412')">
        <rect class="arch-room ${STATE.selectedRoom==='room_412'?'selected-room':''}" x="374" y="321" width="147" height="182" fill="#1c1118" stroke="#ef4444" stroke-width="2"/>
        <rect x="374" y="321" width="46" height="55" fill="#140c12" stroke="#475569" stroke-width="1"/>
        <rect x="425" y="385" width="55" height="35" transform="rotate(14 450 400)" fill="#29151e" stroke="#f87171" stroke-width="1"/>
        <circle cx="435" cy="340" r="2" fill="#fbbf24"/>
        <circle cx="442" cy="344" r="2" fill="#fbbf24"/>
        <circle cx="448" cy="338" r="2" fill="#fbbf24"/>
        <circle cx="439" cy="350" r="2" fill="#fbbf24"/>
        <path d="M 432 321 L 432 346 A 25 25 0 0 0 457 321" fill="none" stroke="#ef4444" stroke-width="1.5"/>
        <text x="448" y="368" fill="#f87171" font-family="monospace" font-size="10.5" text-anchor="middle" font-weight="bold">HAB. 412</text>
        <text x="448" y="455" fill="#fca5a5" font-family="monospace" font-size="8" text-anchor="middle">18 Casquillos 9mm</text>
      </g>
    </g>

    <!-- SECTOR 2: TIRO DE ESCALERA DE PROVEEDORES (X: 555 .. 765) -->
    <g id="layer-stairs">
      <text x="560" y="72" fill="#f59e0b" font-family="monospace" font-size="13" font-weight="bold">CUBO DE ESCALERA (P4→P1)</text>
      <text x="560" y="88" fill="#64748b" font-family="monospace" font-size="9.5">TIRO VERTICAL DE CONCRETO ARMADO</text>

      <rect x="555" y="102" width="205" height="405" fill="#0d1420" stroke="#94a3b8" stroke-width="4"/>

      <!-- UPPER FLIGHT -->
      <g onclick="selectRoom('stairs_p4_p3')">
        <rect class="arch-room ${STATE.selectedRoom==='stairs_p4_p3'?'selected-room':''}" x="563" y="110" width="189" height="120" fill="#111c2b" stroke="#38bdf8" stroke-width="2"/>
        <rect x="575" y="122" width="75" height="90" fill="url(#stairSteps)" stroke="#475569" stroke-width="1.5"/>
        <rect x="662" y="122" width="75" height="90" fill="url(#stairSteps)" stroke="#475569" stroke-width="1.5"/>
        <line x1="656" y1="120" x2="656" y2="215" stroke="#94a3b8" stroke-width="3"/>
        <text x="658" y="168" fill="#bae6fd" font-family="monospace" font-size="10" text-anchor="middle" font-weight="bold">TRAMO P4 → P3</text>
      </g>
      ${shroudOverlay('stairs_p4_p3', 563, 110, 189, 120, 'ESCALERA P4-P3')}

      <!-- MIDDLE LANDING -->
      <g onclick="selectRoom('stairs_p2')">
        <rect class="arch-room ${STATE.selectedRoom==='stairs_p2'?'selected-room':''}" x="563" y="238" width="189" height="135" fill="#1a121b" stroke="#ef4444" stroke-width="2.5"/>
        <rect x="566" y="275" width="34" height="52" rx="3" fill="#334155" stroke="#f59e0b" stroke-width="1.5" transform="rotate(-12 583 300)"/>
        <text x="588" y="303" fill="#fde68a" font-family="monospace" font-size="7" text-anchor="middle">CARRITO</text>
        <rect x="662" y="250" width="75" height="110" fill="url(#stairSteps)" stroke="#475569" stroke-width="1.5"/>
        <text x="645" y="262" fill="#f87171" font-family="monospace" font-size="10" text-anchor="middle" font-weight="bold">DESCANSO PISO 2</text>
        ${revP2 ? `
          <circle cx="628" cy="310" r="8" fill="#991b1b" stroke="#f87171" stroke-width="1.5"/>
          <circle cx="645" cy="332" r="8" fill="#991b1b" stroke="#f87171" stroke-width="1.5"/>
          <text x="635" y="355" fill="#fca5a5" font-family="monospace" font-size="8" text-anchor="middle">2 Amenazas en Rellano</text>
        ` : ''}
      </g>
      ${shroudOverlay('stairs_p2', 563, 238, 189, 135, 'DESCANSO PISO 2')}

      <!-- LOWER FLIGHT -->
      <g onclick="selectRoom('stairs_p1')">
        <rect class="arch-room ${STATE.selectedRoom==='stairs_p1'?'selected-room':''}" x="563" y="381" width="189" height="118" fill="#0f2229" stroke="#10b981" stroke-width="2"/>
        <rect x="575" y="392" width="162" height="65" fill="url(#stairSteps)" stroke="#475569" stroke-width="1.5"/>
        <path d="M 752 455 L 728 455 A 24 24 0 0 1 752 431" fill="none" stroke="#10b981" stroke-width="1.5"/>
        <text x="658" y="482" fill="#34d399" font-family="monospace" font-size="9.5" text-anchor="middle" font-weight="bold">SALIDA A MUELLE (PB) ➔</text>
      </g>
      ${shroudOverlay('stairs_p1', 563, 381, 189, 118, 'BASE ESCALERA P1')}

      <path class="route-path" d="M 122 106 L 122 95 L 655 95 L 655 110" fill="none" stroke="#38bdf8" stroke-width="2"/>
      <path class="route-path" d="M 752 455 L 820 220" fill="none" stroke="#10b981" stroke-width="2.5"/>
    </g>

    <!-- SECTOR 3: PLANTA BAJA Y PATIO DE MANIOBRAS (X: 800 .. 1385) -->
    <g id="layer-pb">
      <text x="805" y="72" fill="#10b981" font-family="monospace" font-size="13" font-weight="bold">PLANTA BAJA — MUELLE DE CARGA, LOBBY Y PATIO EXTERIOR</text>
      <text x="805" y="88" fill="#64748b" font-family="monospace" font-size="9.5">COTA ±0.00m • DISTANCIA MUELLE A VEHÍCULO: 15.00 METROS</text>

      <rect x="805" y="102" width="575" height="405" fill="#090f17" stroke="#64748b" stroke-width="3"/>

      <!-- LOADING DOCK BAY -->
      <g onclick="selectRoom('dock_pb')">
        <rect class="arch-room ${STATE.selectedRoom==='dock_pb'?'selected-room':''}" x="810" y="108" width="215" height="195" fill="#141e2e" stroke="#f59e0b" stroke-width="3"/>
        <rect x="822" y="120" width="32" height="32" fill="#1e293b" stroke="#475569" stroke-width="1"/>
        <rect x="860" y="120" width="32" height="32" fill="#1e293b" stroke="#475569" stroke-width="1"/>
        <line x1="1025" y1="130" x2="1025" y2="225" stroke="#ef4444" stroke-width="6" stroke-dasharray="6 3"/>
        <text x="1012" y="178" fill="#fca5a5" font-family="monospace" font-size="8" text-anchor="middle" transform="rotate(-90 1012 178)">CORTINA ACERO (+2 RUIDO)</text>
        <path d="M 1025 275 L 1052 275 A 27 27 0 0 0 1025 248" fill="none" stroke="#10b981" stroke-width="2"/>
        <text x="915" y="205" fill="#fcd34d" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">MUELLE DE CARGA</text>
        <text x="915" y="268" fill="#34d399" font-family="monospace" font-size="8.5" text-anchor="middle">Puerta Peatonal Lateral ➔</text>
      </g>
      ${shroudOverlay('dock_pb', 810, 108, 215, 195, 'MUELLE DE CARGA')}

      <!-- LOBBY PRINCIPAL -->
      <g onclick="selectRoom('lobby_pb')">
        <rect class="arch-room ${STATE.selectedRoom==='lobby_pb'?'selected-room':''}" x="810" y="308" width="265" height="194" fill="url(#hazardStripe)" stroke="#ef4444" stroke-width="2.5"/>
        <path d="M 850 360 Q 940 390 1010 350" fill="none" stroke="#f87171" stroke-width="4"/>
        <text x="942" y="415" fill="#f87171" font-family="monospace" font-size="11.5" text-anchor="middle" font-weight="bold">LOBBY PRINCIPAL</text>
        <text x="942" y="432" fill="#fca5a5" font-family="monospace" font-size="8.5" text-anchor="middle">[ZONA COLAPSADA — EVITADA]</text>
      </g>

      <!-- ASPHALT MANEUVERING COURTYARD -->
      <g onclick="selectRoom('yard_pb')">
        <rect class="arch-room ${STATE.selectedRoom==='yard_pb'?'selected-room':''}" x="1030" y="108" width="180" height="195" fill="#0d1520" stroke="#38bdf8" stroke-width="2"/>
        <line x1="1032" y1="195" x2="1205" y2="195" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5 4"/>
        <text x="1118" y="186" fill="#7dd3fc" font-family="monospace" font-size="9.5" text-anchor="middle" font-weight="bold">◄── 15.00m ──►</text>
        <text x="1118" y="132" fill="#94a3b8" font-family="monospace" font-size="9.5" text-anchor="middle">PATIO DE MANIOBRAS</text>
        ${revYard ? `
          <circle cx="1105" cy="240" r="8" fill="#991b1b" stroke="#f87171" stroke-width="1.5"/>
          <circle cx="1148" cy="222" r="8" fill="#991b1b" stroke="#f87171" stroke-width="1.5"/>
        ` : ''}
      </g>
      ${shroudOverlay('yard_pb', 1030, 108, 180, 195, 'PATIO (15m)')}

      <!-- PARKING BAY & PICKUP TRUCK -->
      <g onclick="selectRoom('pickup_pb')">
        <rect class="arch-room ${STATE.selectedRoom==='pickup_pb'?'selected-room':''}" x="1212" y="108" width="162" height="195" fill="#0c1d24" stroke="#10b981" stroke-width="2.5"/>
        <line x1="1235" y1="135" x2="1355" y2="135" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>
        <line x1="1235" y1="245" x2="1355" y2="245" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>
        <g transform="translate(1248, 152)">
          <rect x="0" y="0" width="92" height="44" rx="7" fill="#065f46" stroke="#34d399" stroke-width="2"/>
          <path d="M 18 4 L 34 8 L 34 36 L 18 40 Z" fill="#0f172a" stroke="#6ee7b7" stroke-width="1"/>
          <rect x="34" y="6" width="24" height="32" rx="2" fill="#047857" stroke="#6ee7b7" stroke-width="1"/>
          <rect x="60" y="5" width="28" height="34" fill="#064e3b" stroke="#34d399" stroke-width="1"/>
          <text x="46" y="60" fill="#34d399" font-family="monospace" font-size="9.5" text-anchor="middle" font-weight="bold">PICKUP (3/4 TANQUE)</text>
        </g>
      </g>
      ${shroudOverlay('pickup_pb', 1212, 108, 162, 195, 'CAJÓN PICKUP')}

      <!-- EXIT GATE BOOTH -->
      <g onclick="selectRoom('gate_pb')">
        <rect class="arch-room ${STATE.selectedRoom==='gate_pb'?'selected-room':''}" x="1080" y="308" width="294" height="194" fill="#101722" stroke="#475569" stroke-width="2"/>
        <rect x="1135" y="375" width="52" height="52" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <text x="1161" y="404" fill="#fcd34d" font-family="monospace" font-size="7.5" text-anchor="middle">CASETA</text>
        <rect x="1182" y="388" width="68" height="32" rx="5" transform="rotate(28 1216 404)" fill="#451a1c" stroke="#f87171" stroke-width="1.8"/>
        <text x="1235" y="452" fill="#fca5a5" font-family="monospace" font-size="8.5" text-anchor="middle">Auto Colisionado en Salida</text>
        <path class="route-path" d="M 1295 245 L 1295 485" fill="none" stroke="#10b981" stroke-width="3"/>
        <text x="1332" y="485" fill="#34d399" font-family="monospace" font-size="9" text-anchor="middle" font-weight="bold">SALIDA VIAL ▼</text>
      </g>
      ${shroudOverlay('gate_pb', 1080, 308, 294, 194, 'CASETA DE SALIDA')}
    </g>

    <!-- MOVEMENT VECTOR / TRAIL LINE -->
    ${trailSvg}

    <!-- DRAGGABLE THREAT TOKEN Z1 IN CORRIDOR -->
    <g class="char-token-svg" data-token-id="Z1" transform="translate(${z1.x}, ${z1.y})" filter="url(#tokenShadow)" onmousedown="startTokenDrag(event, 'Z1')" ontouchstart="startTokenDrag(event, 'Z1')">
      <circle cx="0" cy="0" r="24" fill="transparent"/>
      <circle class="radar-ring" cx="0" cy="0" r="10" fill="none" stroke="#ef4444" stroke-width="1.8"/>
      <circle class="token-outer" cx="0" cy="0" r="11" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>
      <text x="0" y="3.5" fill="#fff" font-family="monospace" font-size="8.5" text-anchor="middle" font-weight="bold">Z1</text>
      <text x="0" y="-14" fill="#fca5a5" font-family="monospace" font-size="8" text-anchor="middle">Amenaza</text>
    </g>

    <!-- INDIVIDUALLY DRAGGABLE CHARACTER TOKENS (AU, AR, GZ) WITH ENLARGED TOUCH TARGET -->
    ${Object.values(STATE.tokens).map(t => {
      const isSel = STATE.activeToken === t.id;
      return `
        <g class="char-token-svg" data-token-id="${t.id}" transform="translate(${t.x}, ${t.y})" filter="url(#tokenShadow)" onmousedown="startTokenDrag(event, '${t.id}')" ontouchstart="startTokenDrag(event, '${t.id}')">
          <circle cx="0" cy="0" r="24" fill="transparent"/>
          ${isSel ? `<circle cx="0" cy="0" r="19" fill="none" stroke="${t.color}" stroke-width="1.5" stroke-dasharray="3 2"/>` : ''}
          ${t.tripped ? `<circle cx="0" cy="0" r="22" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 2"/>` : ''}
          <circle class="token-outer" cx="0" cy="0" r="14" fill="#090d14" stroke="${t.tripped ? '#ef4444' : t.color}" stroke-width="3"/>
          <circle cx="0" cy="0" r="9.5" fill="${t.color}33"/>
          <text x="0" y="3.5" fill="#fff" font-family="monospace" font-size="9.5" text-anchor="middle" font-weight="bold">${t.id}</text>
          ${t.tripped ? `<text x="0" y="-18" fill="#fca5a5" font-family="monospace" font-size="8" text-anchor="middle" font-weight="bold">⚠️ TROPEZÓ</text>` : ''}
        </g>
      `;
    }).join('')}

  </svg>
  `;

  stage.innerHTML = svg;
}

/* ============================================================================
   MOUSE + TOUCH + PINCH-TO-ZOOM + INDIVIDUAL TOKEN DRAGGING ENGINE
   ============================================================================ */

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

  if (STATE.tokens[tokenId]) {
    STATE.activeToken = tokenId;
  }

  STATE.dragState = {
    tokenId,
    startX: t.x,
    startY: t.y,
    curX: t.x,
    curY: t.y
  };
  renderSquadBar();
}

const vp = document.getElementById('map-viewport');

// Desktop mouse pan
vp.addEventListener('mousedown', e => {
  if (e.target.closest('.char-token-svg')) return;
  isPanning = true;
  vp.classList.add('panning');
  startPanX = e.clientX - panX;
  startPanY = e.clientY - panY;
});

window.addEventListener('mousemove', e => {
  if (STATE.dragState) {
    const svgPt = clientToSVGCoords(e.clientX, e.clientY);
    const ds = STATE.dragState;
    ds.curX = Math.max(25, Math.min(1395, svgPt.x));
    ds.curY = Math.max(55, Math.min(560, svgPt.y));
    const t = STATE.tokens[ds.tokenId] || STATE.enemies[ds.tokenId];
    if (t) {
      t.x = ds.curX;
      t.y = ds.curY;
    }
    renderBlueprintSVG();
    return;
  }
  if (!isPanning) return;
  panX = e.clientX - startPanX;
  panY = e.clientY - startPanY;
  updateStageTransform();
});

function finishTokenOrPan() {
  if (STATE.dragState) {
    const ds = STATE.dragState;
    const t = STATE.tokens[ds.tokenId] || STATE.enemies[ds.tokenId];
    const distPx = Math.hypot(ds.curX - ds.startX, ds.curY - ds.startY);
    const distMeters = (distPx * 0.045).toFixed(1) + 'm';

    if (STATE.tokens[ds.tokenId]) {
      const detected = detectRoomAt(t.x, t.y);
      if (detected) {
        t.room = detected.name;
        STATE.selectedRoom = detected.id;
        STATE.revealed[detected.id] = true;
      } else {
        t.room = 'En tránsito';
      }
      STATE.lastTrail = {
        tokenId: ds.tokenId,
        x1: ds.startX,
        y1: ds.startY,
        x2: ds.curX,
        y2: ds.curY,
        distMeters
      };
      STATE.lastRollHtml = `<span style="color:#34d399;">✋ Arrastraste a <strong>${t.name} [${t.id}]</strong> hasta <strong>${t.room}</strong> (${distMeters}).</span>`;
    } else {
      STATE.lastRollHtml = `<span style="color:#f87171;">✋ Posición de <strong>${t.name}</strong> actualizada (${distMeters}).</span>`;
    }

    STATE.dragState = null;
    renderAll();
  }
  isPanning = false;
  initialPinchDist = null;
  vp.classList.remove('panning');
}

window.addEventListener('mouseup', finishTokenOrPan);

// Mobile & Tablet Touch Pan + Pinch-to-Zoom + Token Drag
vp.addEventListener('touchstart', e => {
  if (e.target.closest('.char-token-svg')) return;
  if (e.touches.length === 2) {
    isPanning = false;
    initialPinchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
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
    const touch = e.touches[0];
    const svgPt = clientToSVGCoords(touch.clientX, touch.clientY);
    const ds = STATE.dragState;
    ds.curX = Math.max(25, Math.min(1395, svgPt.x));
    ds.curY = Math.max(55, Math.min(560, svgPt.y));
    const t = STATE.tokens[ds.tokenId] || STATE.enemies[ds.tokenId];
    if (t) {
      t.x = ds.curX;
      t.y = ds.curY;
    }
    renderBlueprintSVG();
    return;
  }
  if (e.touches.length === 2 && initialPinchDist) {
    if (e.cancelable) e.preventDefault();
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const scale = dist / initialPinchDist;
    STATE.zoom = Math.max(0.55, Math.min(2.4, initialPinchZoom * scale));
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

window.addEventListener('resize', () => {
  renderBlueprintSVG();
});

window.addEventListener('DOMContentLoaded', renderAll);
