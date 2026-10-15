/* ============================================================================
   ARCHITECTURAL GEOMETRY, WALKABLE ROOMS & INTERACTIVE DOORS (OPEN/CLOSE)
   ============================================================================ */

const FLOOR_ROOMS = {
  'p4': [
    { id: 'walkway_4p', name: 'Pasarela Ext. (14m)', floor: 'p4', x: 50, y: 290, w: 75, h: 210, isStairs: false },
    { id: 'fire_door_4p', name: 'Escalera Proveedores (P4)', floor: 'p4', x: 125, y: 80, w: 110, h: 130, isStairs: true },
    { id: 'room_402', name: 'Cuarto Servicio 402', floor: 'p4', x: 235, y: 80, w: 175, h: 130, isStairs: false },
    { id: 'room_404', name: 'Habitación 404', floor: 'p4', x: 410, y: 80, w: 145, h: 130, isStairs: false },
    { id: 'room_406', name: 'Habitación 406', floor: 'p4', x: 555, y: 80, w: 145, h: 130, isStairs: false },
    { id: 'elevators_4p', name: 'Elevadores (Bloqueados)', floor: 'p4', x: 700, y: 80, w: 160, h: 130, isStairs: false },
    { id: 'corridor_4p', name: 'Pasillo 4to Piso', floor: 'p4', x: 125, y: 210, w: 735, h: 95, isStairs: false },
    { id: 'room_408', name: 'Habitación 408', floor: 'p4', x: 125, y: 305, w: 245, h: 195, isStairs: false },
    { id: 'room_410', name: 'Habitación 410', floor: 'p4', x: 370, y: 305, w: 225, h: 195, isStairs: false },
    { id: 'room_412', name: 'Habitación 412', floor: 'p4', x: 595, y: 305, w: 265, h: 195, isStairs: false }
  ],
  'p2': [
    { id: 'stairs_p4_p3', name: 'Escalera Tramo P4→P3', floor: 'p2', x: 125, y: 85, w: 235, h: 390, isStairs: true },
    { id: 'stairs_p2', name: 'Descanso Piso 2', floor: 'p2', x: 360, y: 85, w: 250, h: 390, isStairs: false },
    { id: 'stairs_p1', name: 'Escalera Salida a P1/PB', floor: 'p2', x: 610, y: 85, w: 240, h: 390, isStairs: true }
  ],
  'pb': [
    { id: 'stairs_exit_pb', name: 'Escalera Proveedores (PB)', floor: 'pb', x: 70, y: 85, w: 120, h: 195, isStairs: true },
    { id: 'dock_pb', name: 'Muelle de Carga', floor: 'pb', x: 190, y: 85, w: 230, h: 195, isStairs: false },
    { id: 'lobby_pb', name: 'Lobby Principal (Colapsado)', floor: 'pb', x: 70, y: 280, w: 350, h: 215, isStairs: false },
    { id: 'yard_pb', name: 'Patio de Maniobras (15m)', floor: 'pb', x: 420, y: 85, w: 220, h: 195, isStairs: false },
    { id: 'pickup_pb', name: 'Cajón Pickup Lázaras', floor: 'pb', x: 640, y: 85, w: 220, h: 195, isStairs: false },
    { id: 'gate_pb', name: 'Caseta de Salida Vial', floor: 'pb', x: 420, y: 280, w: 440, h: 215, isStairs: false }
  ]
};

// Interactive Doors: Each portal has an `id`, `isOpen` state, `orient` ('h' or 'v'), and 3D leaf geometry
const FLOOR_PORTALS = {
  'p4': [
    { id: 'door_408', x: 220, y: 292, w: 52, h: 26, a: 'room_408', b: 'corridor_4p', label: 'Puerta 408', orient: 'h', isOpen: false, swing: 'M 224 305 L 224 342 A 37 37 0 0 0 261 305' },
    { id: 'win_408', x: 112, y: 365, w: 26, h: 55, a: 'room_408', b: 'walkway_4p', label: 'Ventana Pasarela', orient: 'v', isOpen: false, swing: '' },
    { id: 'door_402', x: 285, y: 197, w: 50, h: 26, a: 'room_402', b: 'corridor_4p', label: 'Puerta Servicio 402', orient: 'h', isOpen: false, swing: 'M 290 210 L 290 175 A 35 35 0 0 1 325 210' },
    { id: 'door_fire_p4', x: 155, y: 197, w: 50, h: 26, a: 'fire_door_4p', b: 'corridor_4p', label: 'Puerta Cortafuegos', orient: 'h', isOpen: false, swing: 'M 160 210 L 160 175 A 35 35 0 0 1 195 210' },
    { id: 'door_402_stairs', x: 222, y: 125, w: 26, h: 48, a: 'room_402', b: 'fire_door_4p', label: 'Acceso Mantenimiento', orient: 'v', isOpen: false, swing: 'M 235 128 L 203 128 A 32 32 0 0 0 235 160' },
    { id: 'door_410', x: 455, y: 292, w: 48, h: 26, a: 'room_410', b: 'corridor_4p', label: 'Puerta 410', orient: 'h', isOpen: false, swing: 'M 460 305 L 460 338 A 33 33 0 0 0 493 305' },
    { id: 'door_412', x: 675, y: 292, w: 50, h: 26, a: 'room_412', b: 'corridor_4p', label: 'Puerta 412 (Baleada)', orient: 'h', isOpen: true, swing: 'M 680 305 L 680 340 A 35 35 0 0 0 715 305' },
    { id: 'door_404', x: 460, y: 197, w: 46, h: 26, a: 'room_404', b: 'corridor_4p', label: 'Puerta 404', orient: 'h', isOpen: false, swing: 'M 465 210 L 465 178 A 32 32 0 0 1 497 210' },
    { id: 'door_406', x: 605, y: 197, w: 46, h: 26, a: 'room_406', b: 'corridor_4p', label: 'Puerta 406', orient: 'h', isOpen: false, swing: 'M 610 210 L 610 178 A 32 32 0 0 1 642 210' }
  ],
  'p2': [
    { id: 'pass_p3_p2', x: 345, y: 215, w: 30, h: 90, a: 'stairs_p4_p3', b: 'stairs_p2', label: 'Paso Rellano P2', orient: 'v', isOpen: true, swing: '' },
    { id: 'pass_p2_p1', x: 595, y: 215, w: 30, h: 90, a: 'stairs_p2', b: 'stairs_p1', label: 'Bajada a P1', orient: 'v', isOpen: true, swing: '' }
  ],
  'pb': [
    { id: 'door_stairs_pb', x: 175, y: 150, w: 30, h: 65, a: 'stairs_exit_pb', b: 'dock_pb', label: 'Puerta Escalera PB', orient: 'v', isOpen: false, swing: 'M 190 155 L 226 155 A 36 36 0 0 1 190 191' },
    { id: 'door_dock_yard', x: 405, y: 125, w: 30, h: 135, a: 'dock_pb', b: 'yard_pb', label: 'Puerta Peatonal / Cortina', orient: 'v', isOpen: false, swing: 'M 420 245 L 454 245 A 34 34 0 0 0 420 211' },
    { id: 'pass_yard_pickup', x: 625, y: 115, w: 30, h: 145, a: 'yard_pb', b: 'pickup_pb', label: 'Tramo 15m Asfalto', orient: 'v', isOpen: true, swing: '' },
    { id: 'pass_pickup_gate', x: 695, y: 265, w: 95, h: 30, a: 'pickup_pb', b: 'gate_pb', label: 'Carril de Escape', orient: 'h', isOpen: true, swing: '' },
    { id: 'pass_yard_gate', x: 490, y: 265, w: 80, h: 30, a: 'yard_pb', b: 'gate_pb', label: 'Paso Patio Sur', orient: 'h', isOpen: true, swing: '' }
  ]
};

const ROOM_DETAILS = {
  'room_408': {
    title: 'Habitación 408 — Refugio Inicial (Piso 4)',
    desc: 'Suite con duela de madera 3D, baño cerámico, cama King y escritorio de caoba bloqueando la puerta norte.',
    secret: 'Fase 1: Abre la Puerta 408 (tocando su ícono 🔒 en el mapa o el botón de abajo) para salir al pasillo alfombrado.',
    actions: [
      { label: 'Desmontar barricada, abrir Puerta 408 y salir', dif: 8, mod: 6, openDoorId: 'door_408', targetRoom: 'corridor_4p', tx: 245, ty: 260, ok: 'Barricada retirada en silencio; Puerta 408 abierta y cruza al pasillo.', fail: 'El escritorio rechina (+1 Ruido), pero logran abrir la Puerta 408.', failNoise: 1 }
    ]
  },
  'corridor_4p': {
    title: 'Pasillo Central Alfombrado (Piso 4)',
    desc: 'Corredor con alfombra tejida en relieve que comunica todas las suites con el Cuarto de Servicio 402 y la Escalera.',
    secret: 'Frente a la puerta 410 yace en letargo el infectado de la 412. Abre la Puerta 402 o la Puerta Cortafuegos para avanzar.',
    actions: [
      { label: 'Avanzar en sigilo y abrir Cuarto 402', dif: 10, mod: 6, openDoorId: 'door_402', targetRoom: 'room_402', tx: 310, ty: 155, ok: 'Avance silencioso; Puerta 402 abierta.', fail: '¡Tropiezo en la alfombra! (+1 Ruido y queda rezagado).', failNoise: 1, tripOnFail: true },
      { label: 'Neutralización CQC silenciosa en el pasillo', dif: 9, mod: 7, targetRoom: 'corridor_4p', tx: 390, ty: 255, ok: 'Amenaza del pasillo neutralizada con cuchillo D2 sin ruido.', fail: 'Forcejeo en el suelo (+1 Ruido).', failNoise: 1, tripOnFail: true }
    ]
  },
  'room_402': {
    title: 'Cuarto de Servicio 402 (Piso 4)',
    desc: 'Bodega de camaristas con piso de cemento pulido, estanterías metálicas 3D, tarja y cesto industrial de blancos.',
    secret: 'Botín: Tarjeta Maestra, barra de uña, cloro y guantes. Peligro oculto en el cesto de ropa sucia (Percepción DIF 10).',
    actions: [
      { label: 'Inspeccionar cesto, tomar Tarjeta y abrir paso a Escalera', dif: 10, mod: 6, loot: true, openDoorId: 'door_402_stairs', targetRoom: 'room_402', tx: 295, ty: 140, ok: 'Emboscada detectada, Tarjeta Maestra asegurada y puerta a Escalera abierta.', fail: 'Susto en el cesto (+1 Ruido), pero aseguran la Tarjeta Maestra.', failNoise: 1 }
    ]
  },
  'fire_door_4p': {
    title: 'Cubo de Escalera de Proveedores (Acceso Piso 4)',
    desc: 'Tiro vertical de concreto armado con barandal tubular. Los personajes aquí son visibles al cambiar a Pisos 3–2.',
    secret: 'Conecta el Piso 4 con los Pisos 3–2 y la Planta Baja evitando el Lobby.',
    actions: [
      { label: '▼ Bajar con este personaje a Pisos 3–2 (Escalera)', dif: 0, mod: 0, changeFloorTo: 'p2', targetRoom: 'stairs_p4_p3', tx: 235, ty: 250, ok: 'El personaje desciende por el cubo de concreto hacia los Pisos 3–2.' }
    ]
  },
  'walkway_4p': { title: 'Pasarela Exterior de Mantenimiento (+14m)', desc: 'Rejilla metálica suspendida sobre el vacío.', secret: 'Ruta nocturna descartada por riesgo de caída.', actions: [] },
  'room_410': { title: 'Habitación 410 (Piso 4)', desc: 'Suite ejecutiva intermedia.', secret: 'Frente a su entrada descansaba el objetivo de la 412.', actions: [] },
  'room_412': { title: 'Habitación 412 — Escena del Contrato Roto', desc: 'Muebles volcados, impactos balísticos y 18 casquillos 9mm en el piso.', secret: 'La puerta de la 412 quedó abierta tras el tiroteo inicial.', actions: [] },
  'room_404': { title: 'Habitación 404 (Piso 4)', desc: 'Suite ejecutiva norte.', secret: 'Puerta cerrada.', actions: [] },
  'room_406': { title: 'Habitación 406 (Piso 4)', desc: 'Suite ejecutiva norte.', secret: 'Puerta cerrada.', actions: [] },
  'elevators_4p': { title: 'Núcleo de Elevadores (Clausurado)', desc: 'Foso de ascensores conectado al Lobby.', secret: 'Evitado por protocolo táctico.', actions: [] },

  'stairs_p4_p3': {
    title: 'Escalera de Proveedores — Tramo Superior (P4 → P3)',
    desc: 'Rampa de peldaños de concreto con eco acústico cerrado.',
    secret: 'Arrastra tus figuras hacia la derecha para entrar al Descanso del Piso 2.',
    actions: [
      { label: 'Avanzar en descenso asistido al Descanso Piso 2', dif: 8, mod: 6, targetRoom: 'stairs_p2', tx: 470, ty: 260, ok: 'Descenso silencioso hasta el rellano del Piso 2.', fail: 'Resbalón en el escalón (+1 Ruido).', failNoise: 1, tripOnFail: true },
      { label: '▲ Subir de regreso al Piso 4', dif: 0, mod: 0, changeFloorTo: 'p4', targetRoom: 'fire_door_4p', tx: 180, ty: 150, ok: 'El personaje regresa a la puerta cortafuegos del Piso 4.' }
    ]
  },
  'stairs_p2': {
    title: 'Descanso del Piso 2 — Encuentro Crítico',
    desc: 'Plataforma intermedia obstruida por un carrito de lavandería volcado.',
    secret: 'Dos errantes en el rellano. Opción A: 2 tiros silenciados (DIF 11). Opción B: Salto de barandal hacia la salida P1 (DIF 14).',
    actions: [
      { label: 'Opción A: 2 Disparos Silenciados Glock 17 (DIF 11)', dif: 11, mod: 6, ammo: 2, targetRoom: 'stairs_p1', tx: 720, ty: 260, ok: 'Dos impactos limpios al cráneo; avanzan al tramo final P1.', fail: 'Un tiro roza el carrito (+1 Ruido).', failNoise: 1 },
      { label: 'Opción B: Saltar barandal hacia el tramo P1 (DIF 14)', dif: 14, mod: 4, targetRoom: 'stairs_p1', tx: 720, ty: 260, ok: 'Salto atlético exitoso al tramo inferior.', fail: 'Mal aterrizaje (+1 Ruido y tropiezo).', failNoise: 1, tripOnFail: true }
    ]
  },
  'stairs_p1': {
    title: 'Escalera Tramo Inferior (P1 → Salida a Planta Baja)',
    desc: 'Base del cubo vertical con puerta metálica hacia el Muelle de Descarga.',
    secret: 'Los personajes aquí son visibles al cambiar a la pestaña Planta Baja.',
    actions: [
      { label: '▼ Salir al Muelle de Carga en Planta Baja', dif: 0, mod: 0, changeFloorTo: 'pb', targetRoom: 'stairs_exit_pb', tx: 130, ty: 185, ok: 'El personaje desemboca en el acceso de Planta Baja.' }
    ]
  },

  'stairs_exit_pb': {
    title: 'Acceso de Escalera en Planta Baja',
    desc: 'Vestíbulo de concreto que desemboca en el Muelle de Descarga.',
    secret: 'Abre la Puerta Escalera PB para ingresar al Muelle de Carga.',
    actions: [
      { label: '▲ Subir de regreso a Pisos 3–2 (Escalera)', dif: 0, mod: 0, changeFloorTo: 'p2', targetRoom: 'stairs_p1', tx: 720, ty: 260, ok: 'El personaje vuelve al tramo inferior de la escalera.' }
    ]
  },
  'dock_pb': {
    title: 'Muelle de Descarga Trasero (Planta Baja)',
    desc: 'Plataforma logística con tarimas de madera 3D, cortina metálica enrollable y puerta peatonal.',
    secret: 'Puerta peatonal lateral: 0 Ruido con Tarjeta Maestra. Cortina metálica: +2 Ruido y 60 segundos límite.',
    actions: [
      { label: 'Abrir Puerta Peatonal con Tarjeta Maestra y salir', dif: 8, mod: 6, needCard: true, openDoorId: 'door_dock_yard', targetRoom: 'yard_pb', tx: 520, ty: 185, ok: 'Puerta abierta sin ruido; salen al Patio de Maniobras.', fail: 'Rechinido leve (+1 Ruido).', failNoise: 1 },
      { label: 'Levantar Cortina de Acero Manual (+2 Ruido)', dif: 9, mod: 4, forceNoise: 2, openDoorId: 'door_dock_yard', targetRoom: 'yard_pb', tx: 520, ty: 185, ok: 'Cortina abierta (+2 Ruido). ¡60s para cruzar el patio!', fail: 'Estruendo metálico (+2 Ruido).', failNoise: 2 }
    ]
  },
  'yard_pb': {
    title: 'Patio de Maniobras Exterior (15 Metros)',
    desc: 'Explanada de asfalto en relieve bajo el sol de 38°C con jardineras perimetrales.',
    secret: 'Dos civiles infectados merodean entre el andén y la Pickup.',
    actions: [
      { label: 'Cruzar los 15m hasta el Cajón de la Pickup', dif: 11, mod: 6, ammo: 2, targetRoom: 'pickup_pb', tx: 745, ty: 185, ok: 'Amenazas abatidas; alcanzan la Pickup.', fail: 'Tropiezo en el asfalto (+1 Ruido).', failNoise: 1, tripOnFail: true }
    ]
  },
  'pickup_pb': {
    title: 'Cajón de Estacionamiento — Camioneta Pickup',
    desc: 'Pickup doble cabina 3D estacionada a 15 metros del muelle (3/4 tanque de gasolina, batería óptima).',
    secret: 'Objetivo primario de extracción. Llaves en posesión de Audomaro.',
    actions: [
      { label: 'Arrancar Pickup y salir por la Caseta Vial', dif: 10, mod: 6, targetRoom: 'gate_pb', tx: 745, ty: 390, ok: '¡MISIÓN 1 COMPLETADA! La Pickup rebasa la caseta y sale a la avenida.', fail: 'Roce contra el auto colisionado (+1 Ruido), pero logran salir.', failNoise: 1 }
    ]
  },
  'gate_pb': { title: 'Caseta de Salida y Vehículo Colisionado', desc: 'Garita de vigilancia con pluma rota y sedán estrellado.', secret: 'Salida hacia el Periférico Norte de Mérida.', actions: [] },
  'lobby_pb': { title: 'Lobby Principal del Hotel (Zona Roja Clausurada)', desc: 'Vestíbulo de mármol con cristales rotos y recepción devastada.', secret: 'Aislado del muelle por muro estructural.', actions: [] }
};

const STATE = {
  currentFloor: 'p4',
  fogActive: true,
  isoView: false,
  noise: 0,
  zoom: 1,
  selectedRoom: 'room_408',
  activeToken: 'AU',
  drawerMinimized: false,
  lootMasterCard: false,
  dragState: null,
  tokens: {
    'AU': { id: 'AU', name: 'Audomaro', color: '#10b981', hp: 18, maxHp: 18, ammo: 18, reserve: 16, floor: 'p4', roomId: 'room_408', roomName: 'Habitación 408', x: 225, y: 372, angle: -90, tripped: false, inStairs: false },
    'AR': { id: 'AR', name: 'Armando', color: '#38bdf8', hp: 16, maxHp: 16, ammo: 30, reserve: 30, floor: 'p4', roomId: 'room_408', roomName: 'Habitación 408', x: 295, y: 395, angle: -110, tripped: false, inStairs: false },
    'GZ': { id: 'GZ', name: 'Gonzalo', color: '#f59e0b', hp: 12, maxHp: 14, ammo: 0, reserve: 0, floor: 'p4', roomId: 'room_408', roomName: 'Habitación 408', x: 255, y: 448, angle: -85, tripped: false, inStairs: false }
  },
  lastRollHtml: '<span style="color:#94a3b8;">💡 <strong>Puertas Interactivas y Figuras 3D:</strong> Toca cualquier puerta (<strong>🔒/🔓</strong>) para abrirla o cerrarla. Una puerta cerrada bloquea el paso.</span>'
};

/* ============================================================================
   DOOR OPEN / CLOSE CONTROLLER & REAL COLLISION ENGINE
   ============================================================================ */

function toggleDoorById(floor, doorId, evt) {
  if (evt) evt.stopPropagation();
  const portals = FLOOR_PORTALS[floor] || [];
  const p = portals.find(d => d.id === doorId);
  if (!p) return;
  p.isOpen = !p.isOpen;
  STATE.lastRollHtml = p.isOpen
    ? `<span style="color:#34d399;">🔓 <strong>${p.label}</strong> ABIERTA. Ahora puedes arrastrar a los personajes a través del umbral.</span>`
    : `<span style="color:#f87171;">🔒 <strong>${p.label}</strong> CERRADA. El paso a través de esta puerta ha quedado bloqueado.</span>`;
  renderAll();
}

function getRoomById(floor, roomId) {
  const list = FLOOR_ROOMS[floor] || [];
  return list.find(r => r.id === roomId) || null;
}

function pointInRect(x, y, r, pad = 12) {
  return x >= r.x + pad && x <= r.x + r.w - pad && y >= r.y + pad && y <= r.y + r.h - pad;
}

function pointInPortal(x, y, p) {
  return x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h;
}

function evaluateWalkableStep(floor, currentRoomId, x, y) {
  const rooms = FLOOR_ROOMS[floor] || [];
  const portals = FLOOR_PORTALS[floor] || [];
  const curRoom = rooms.find(r => r.id === currentRoomId);

  if (curRoom && pointInRect(x, y, curRoom, 11)) {
    return { allowed: true, newRoomId: curRoom.id, blockedByClosedDoor: null };
  }

  for (const p of portals) {
    if (p.a === currentRoomId || p.b === currentRoomId) {
      const otherId = p.a === currentRoomId ? p.b : p.a;
      const otherRoom = rooms.find(r => r.id === otherId);
      const px = p.x + p.w / 2;
      const py = p.y + p.h / 2;
      const nearPortal = pointInPortal(x, y, p) || (otherRoom && pointInRect(x, y, otherRoom, 11) && Math.hypot(x - px, y - py) <= Math.max(p.w, p.h) + 28);

      if (nearPortal) {
        // Check if the door is OPEN! If closed, block movement and report which door blocked it!
        if (!p.isOpen) {
          return { allowed: false, newRoomId: currentRoomId, blockedByClosedDoor: p.label };
        }
        if (otherRoom && pointInRect(x, y, otherRoom, 4)) {
          return { allowed: true, newRoomId: otherRoom.id, blockedByClosedDoor: null };
        }
        return { allowed: true, newRoomId: currentRoomId, blockedByClosedDoor: null };
      }
    }
  }

  return { allowed: false, newRoomId: currentRoomId, blockedByClosedDoor: null };
}

function moveTokenWithCollision(token, targetX, targetY) {
  const floor = STATE.currentFloor;
  let cx = token.x;
  let cy = token.y;
  let cRoom = token.roomId;

  const dx = targetX - cx;
  const dy = targetY - cy;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.5) return { hitWall: false, closedDoorName: null };

  token.angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const steps = Math.min(60, Math.ceil(dist / 3));
  const stepX = dx / steps;
  const stepY = dy / steps;
  let hitWall = false;
  let closedDoorName = null;

  for (let i = 1; i <= steps; i++) {
    const nx = cx + stepX;
    const ny = cy + stepY;
    const check = evaluateWalkableStep(floor, cRoom, nx, ny);
    if (check.allowed) {
      cx = nx;
      cy = ny;
      cRoom = check.newRoomId;
    } else {
      if (check.blockedByClosedDoor) closedDoorName = check.blockedByClosedDoor;
      const checkX = evaluateWalkableStep(floor, cRoom, cx + stepX, cy);
      if (checkX.allowed) {
        cx += stepX;
        cRoom = checkX.newRoomId;
      } else {
        if (checkX.blockedByClosedDoor) closedDoorName = checkX.blockedByClosedDoor;
        const checkY = evaluateWalkableStep(floor, cRoom, cx, cy + stepY);
        if (checkY.allowed) {
          cy += stepY;
          cRoom = checkY.newRoomId;
        } else {
          if (checkY.blockedByClosedDoor) closedDoorName = checkY.blockedByClosedDoor;
          hitWall = true;
          break;
        }
      }
    }
  }

  token.x = cx;
  token.y = cy;
  token.roomId = cRoom;
  token.floor = floor;
  const roomObj = getRoomById(floor, cRoom);
  if (roomObj) {
    token.roomName = roomObj.name;
    token.inStairs = !!roomObj.isStairs;
  }
  return { hitWall, closedDoorName };
}

/* ============================================================================
   FLOOR VISIBILITY & DYNAMIC PRESENCE-BASED LIGHTING/FOG
   ============================================================================ */

function isTokenVisibleOnFloor(t, floor) {
  if (t.floor === floor) return true;
  if (t.inStairs) return true;
  return false;
}

function getTokenRenderCoords(t, floor) {
  if (t.floor === floor) {
    return { x: t.x, y: t.y, roomId: t.roomId };
  }
  if (floor === 'p4') return { x: 180, y: 145, roomId: 'fire_door_4p' };
  if (floor === 'p2') {
    return t.floor === 'p4'
      ? { x: 235, y: 245, roomId: 'stairs_p4_p3' }
      : { x: 720, y: 245, roomId: 'stairs_p1' };
  }
  if (floor === 'pb') return { x: 130, y: 185, roomId: 'stairs_exit_pb' };
  return { x: t.x, y: t.y, roomId: t.roomId };
}

function isRoomVisible(floor, roomId) {
  if (!STATE.fogActive) return true;
  for (const t of Object.values(STATE.tokens)) {
    if (isTokenVisibleOnFloor(t, floor)) {
      const pos = getTokenRenderCoords(t, floor);
      if (pos.roomId === roomId) return true;
    }
  }
  return false;
}

/* ============================================================================
   FAITHFUL CHARACTER MINIATURES (SVG PORTRAITS & TOP-DOWN 3D FIGURES)
   Based on the exact survivor dossier:
   - AU (Audomaro): 1.88m, 92kg athletic/muscular, tactical vest, scar on left shoulder, Glock 17 + long suppressor
   - AR (Armando): 1.83m, 78kg agile/wiry, loose urban jacket, crossbody sling bag, B&T MP9 SMG with clear mag
   - GZ (Gonzalo): 1.69m, 84kg stocky/sedentary, polo shirt, thick-framed glasses, bandaged right calf, blueprint roll
   ============================================================================ */

function getAvatarPortraitSVG(id) {
  if (id === 'AU') {
    return `<svg class="char-avatar-svg" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="15" fill="#064e3b"/>
      <path d="M 6 30 Q 16 21 26 30" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
      <circle cx="16" cy="13" r="6.5" fill="#d6a886"/>
      <path d="M 10 10 Q 16 6 22 10" fill="#1c1917"/>
      <rect x="21" y="16" width="8" height="3" rx="1" fill="#475569"/>
    </svg>`;
  }
  if (id === 'AR') {
    return `<svg class="char-avatar-svg" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="15" fill="#0c4a6e"/>
      <path d="M 7 30 Q 16 22 25 30" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
      <line x1="10" y1="22" x2="22" y2="30" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="16" cy="13" r="6" fill="#dfb391"/>
      <path d="M 10 11 Q 16 5 23 11" fill="#27272a"/>
    </svg>`;
  }
  return `<svg class="char-avatar-svg" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="15" fill="#78350f"/>
    <path d="M 5 30 Q 16 20 27 30" fill="#0284c7" stroke="#f59e0b" stroke-width="1.5"/>
    <circle cx="16" cy="13.5" r="6.8" fill="#e5b899"/>
    <rect x="10.5" y="11.5" width="4.5" height="3.2" rx="1" fill="none" stroke="#111827" stroke-width="1.4"/>
    <rect x="17" y="11.5" width="4.5" height="3.2" rx="1" fill="none" stroke="#111827" stroke-width="1.4"/>
    <line x1="15" y1="13" x2="17" y2="13" stroke="#111827" stroke-width="1.2"/>
  </svg>`;
}

function renderDetailedCharacterFigure(t, pos, isSel, stairTag) {
  const ang = t.angle || -90;
  let figureBody = '';

  if (t.id === 'AU') {
    // AUDOMARO: Broad 1.88m/92kg muscular shoulders, tactical vest, left shoulder scar, extended arms holding Glock 17 + long suppressor
    figureBody = `
      <g transform="rotate(${ang})">
        <!-- Flashlight 800lm tactical beam -->
        <path d="M 4 0 L 105 -42 A 112 112 0 0 1 105 42 Z" fill="url(#coneGrad)" opacity="0.62" pointer-events="none"/>
        <!-- Boots / Legs stride -->
        <ellipse cx="-5" cy="-10" rx="5" ry="3.5" fill="#1c1917"/>
        <ellipse cx="4" cy="10" rx="5" ry="3.5" fill="#1c1917"/>
        <!-- Broad Muscular Torso & Tactical Vest -->
        <path d="M -9 -16 C -3 -19, 5 -18, 9 -13 L 9 13 C 5 18, -3 19, -9 16 Z" fill="#111827" stroke="#10b981" stroke-width="1.8"/>
        <!-- Tactical IFAK Pouch & Vest Straps -->
        <rect x="-11" y="-8" width="5" height="16" rx="2" fill="#064e3b" stroke="#34d399" stroke-width="0.9"/>
        <!-- Left Shoulder Bullet Scar Mark -->
        <path d="M -2 -14 L 3 -11 M 2 -14 L -2 -11" stroke="#f87171" stroke-width="1.3"/>
        <!-- Muscular Arms in CQC / Two-Handed Pistol Stance -->
        <path d="M 4 -12 Q 13 -8 16 -2" fill="none" stroke="#1f2937" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M 4 12 Q 13 6 16 1" fill="none" stroke="#1f2937" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Nitrile/Leather Gloves -->
        <circle cx="16" cy="-1" r="2.8" fill="#090d14"/>
        <!-- Glock 17 Gen 5 + Threaded Suppressor -->
        <rect x="15" y="-2.2" width="8" height="3.2" rx="1" fill="#334155" stroke="#94a3b8" stroke-width="0.6"/>
        <rect x="23" y="-1.6" width="9" height="2" rx="0.8" fill="#0f172a" stroke="#64748b" stroke-width="0.6"/>
        <!-- Head with 3D shading & short military cut -->
        <circle cx="0" cy="0" r="8.2" fill="url(#skinGrad)" stroke="#1c1917" stroke-width="1.2"/>
        <path d="M -7 -5 Q -2 -9 4 -6 Q -1 -2 -7 -5 Z" fill="#18181b"/>
      </g>
    `;
  } else if (t.id === 'AR') {
    // ARMANDO: Agile 1.83m/78kg wiry build, urban jacket, crossbody sling bag (mariconera), B&T MP9 SMG with clear 30-rd magazine
    figureBody = `
      <g transform="rotate(${ang})">
        <path d="M 4 0 L 90 -34 A 96 96 0 0 1 90 34 Z" fill="url(#coneGrad)" opacity="0.48" pointer-events="none"/>
        <!-- Sneakers / Agile stance -->
        <ellipse cx="-6" cy="-9" rx="4.5" ry="3" fill="#334155"/>
        <ellipse cx="5" cy="9" rx="4.5" ry="3" fill="#334155"/>
        <!-- Slimmer Urban Jacket Torso -->
        <rect x="-8" y="-14" width="15" height="28" rx="7" fill="#1e293b" stroke="#38bdf8" stroke-width="1.8"/>
        <!-- Crossbody Sling Bag (Riñonera/Mariconera cruzada) -->
        <line x1="-6" y1="-12" x2="6" y2="12" stroke="#d97706" stroke-width="3.2" stroke-linecap="round"/>
        <rect x="-2" y="4" width="7" height="5" rx="1.5" fill="#78350f" stroke="#f59e0b" stroke-width="0.8"/>
        <!-- Arms holding B&T MP9 Submachine Gun -->
        <path d="M 3 -11 Q 12 -7 14 -1" fill="none" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        <path d="M 3 11 Q 11 6 16 2" fill="none" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
        <!-- Compact B&T MP9 + Transparent 30rd Magazine sticking out -->
        <rect x="13" y="-2" width="11" height="3.6" rx="1" fill="#0f172a" stroke="#7dd3fc" stroke-width="0.7"/>
        <rect x="16" y="-7.5" width="2.6" height="6" rx="0.6" fill="#fde047" opacity="0.85" stroke="#ca8a04" stroke-width="0.5"/>
        <!-- Head with tousled street hair -->
        <circle cx="0" cy="0" r="7.6" fill="url(#skinGrad)" stroke="#1c1917" stroke-width="1.1"/>
        <path d="M -7 -4 Q 0 -9 6 -3 Q 1 -1 -7 -4 Z" fill="#090d14"/>
      </g>
    `;
  } else {
    // GONZALO: 1.69m, 84kg stocky/rounded abdominal build, blue polo shirt, thick-framed glasses, white bandage on right leg, holding floorplan croquis
    figureBody = `
      <g transform="rotate(${ang})">
        <path d="M 4 0 L 65 -26 A 70 70 0 0 1 65 26 Z" fill="url(#coneGrad)" opacity="0.35" pointer-events="none"/>
        <!-- Right leg with white compressive bandage & slip-on loafer -->
        <ellipse cx="-3" cy="11" rx="5" ry="3.8" fill="#f8fafc" stroke="#ef4444" stroke-width="1.2"/>
        <ellipse cx="-4" cy="-10" rx="4.5" ry="3.2" fill="#451a03"/>
        <!-- Stocky Rounded Torso (84kg) in Polo Shirt -->
        <ellipse cx="0" cy="0" rx="10.5" ry="15.5" fill="#0369a1" stroke="#f59e0b" stroke-width="1.8"/>
        <!-- Polo Collar -->
        <path d="M 3 -6 L 8 -2 L 3 6" fill="none" stroke="#e0f2fe" stroke-width="1.5"/>
        <!-- Arms holding rolled-up hotel blueprint croquis -->
        <path d="M 2 -12 Q 10 -9 12 -4" fill="none" stroke="#e5b899" stroke-width="3.8" stroke-linecap="round"/>
        <path d="M 2 12 Q 10 9 12 4" fill="none" stroke="#e5b899" stroke-width="3.8" stroke-linecap="round"/>
        <rect x="10" y="-6" width="4.5" height="12" rx="1.5" fill="#fef3c7" stroke="#d97706" stroke-width="0.9"/>
        <!-- Head + Thick-framed Paste Glasses (-3.50 diopters) -->
        <circle cx="0" cy="0" r="8" fill="url(#skinGrad)" stroke="#1c1917" stroke-width="1.1"/>
        <!-- Eyeglasses frames on front of face -->
        <rect x="5.2" y="-5.2" width="3" height="4.2" rx="0.8" fill="#e0f2fe" stroke="#090d14" stroke-width="1.3"/>
        <rect x="5.2" y="1" width="3" height="4.2" rx="0.8" fill="#e0f2fe" stroke="#090d14" stroke-width="1.3"/>
        <line x1="6.8" y1="-1" x2="6.8" y2="1" stroke="#090d14" stroke-width="1.3"/>
      </g>
    `;
  }

  return `
    <g class="char-token-svg" data-token-id="${t.id}" transform="translate(${pos.x}, ${pos.y})" filter="url(#tokenShadow)" onmousedown="startTokenDrag(event, '${t.id}')" ontouchstart="startTokenDrag(event, '${t.id}')">
      <!-- Enlarged touch hit circle for mobile -->
      <circle cx="0" cy="0" r="28" fill="transparent"/>
      <!-- 3D Miniature Base Pedestal Ring -->
      <ellipse cx="0" cy="2" rx="18" ry="18" fill="rgba(9, 13, 20, 0.75)" stroke="${t.tripped ? '#ef4444' : t.color}" stroke-width="${isSel ? '3' : '1.8'}"/>
      ${isSel ? `<circle cx="0" cy="0" r="22" fill="none" stroke="${t.color}" stroke-width="1.6" stroke-dasharray="4 2"/>` : ''}
      ${t.tripped ? `<circle cx="0" cy="0" r="25" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4 2"/>` : ''}

      ${figureBody}

      <!-- Floating Callsign Tag -->
      <g transform="translate(0, 23)" pointer-events="none">
        <rect x="-15" y="-7" width="30" height="13" rx="4" fill="#090d14" stroke="${t.color}" stroke-width="1.2"/>
        <text x="0" y="2.5" fill="#fff" font-family="monospace" font-size="8.5" text-anchor="middle" font-weight="bold">${t.id}</text>
      </g>
      ${stairTag ? `<text x="0" y="38" fill="#38bdf8" font-family="monospace" font-size="8.5" text-anchor="middle" font-weight="bold">${stairTag}</text>` : ''}
      ${t.tripped ? `<text x="0" y="-22" fill="#fca5a5" font-family="monospace" font-size="8.5" text-anchor="middle" font-weight="bold">⚠️ TROPEZÓ</text>` : ''}
    </g>
  `;
}

function renderZombieFigure(x, y, rot, label = '') {
  return `
    <g transform="translate(${x}, ${y})" filter="url(#tokenShadow)" pointer-events="none">
      <circle class="radar-ring" cx="0" cy="0" r="10" fill="none" stroke="#ef4444" stroke-width="1.8"/>
      <g transform="rotate(${rot})">
        <!-- Blood pool under feet -->
        <ellipse cx="-2" cy="1" rx="15" ry="12" fill="rgba(127, 29, 29, 0.55)"/>
        <!-- Tattered suit shoulders -->
        <path d="M -8 -14 C -2 -16, 6 -15, 9 -10 L 8 11 C 4 15, -3 16, -8 13 Z" fill="#27272a" stroke="#991b1b" stroke-width="1.6"/>
        <!-- Outstretched grasping arms -->
        <path d="M 3 -11 Q 12 -9 16 -5" fill="none" stroke="#64748b" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M 3 11 Q 13 8 17 4" fill="none" stroke="#64748b" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Bullet wounds on chest -->
        <circle cx="2" cy="-4" r="1.6" fill="#dc2626"/>
        <circle cx="-1" cy="3" r="1.8" fill="#dc2626"/>
        <circle cx="3" cy="5" r="1.4" fill="#dc2626"/>
        <!-- Pale necrotic head with milky white eyes -->
        <circle cx="1" cy="0" r="7.5" fill="#94a3b8" stroke="#334155" stroke-width="1.2"/>
        <circle cx="6" cy="-2.5" r="1.3" fill="#f8fafc"/>
        <circle cx="6" cy="2.5" r="1.3" fill="#f8fafc"/>
      </g>
      ${label ? `<text x="0" y="-17" fill="#fca5a5" font-family="monospace" font-size="8.5" text-anchor="middle" font-weight="bold">${label}</text>` : ''}
    </g>
  `;
}

/* ============================================================================
   UI RENDERERS
   ============================================================================ */

function renderAll() {
  renderNoise();
  renderFloorBadges();
  renderSquadBar();
  renderBlueprintSVG();
  renderDrawer();
}

function renderFloorBadges() {
  ['p4', 'p2', 'pb'].forEach(fl => {
    const btn = document.getElementById(`tab-${fl}`);
    if (btn) btn.classList.toggle('active', STATE.currentFloor === fl);
    const count = Object.values(STATE.tokens).filter(t => isTokenVisibleOnFloor(t, fl)).length;
    const badge = document.getElementById(`badge-${fl}`);
    if (badge) {
      badge.style.display = count > 0 ? 'inline-block' : 'none';
      badge.textContent = count;
    }
  });
}

function switchFloorTab(fl) {
  STATE.currentFloor = fl;
  const visibleChar = Object.values(STATE.tokens).find(t => isTokenVisibleOnFloor(t, fl));
  if (visibleChar) {
    STATE.selectedRoom = getTokenRenderCoords(visibleChar, fl).roomId;
  } else {
    const defaults = { 'p4': 'room_408', 'p2': 'stairs_p4_p3', 'pb': 'stairs_exit_pb' };
    STATE.selectedRoom = defaults[fl];
  }
  renderAll();
}

function toggleFog() {
  STATE.fogActive = !STATE.fogActive;
  const btn = document.getElementById('fog-btn');
  if (STATE.fogActive) {
    btn.classList.remove('gm-on');
    btn.textContent = '👁️ Niebla';
  } else {
    btn.classList.add('gm-on');
    btn.textContent = '🔓 Todo';
  }
  renderAll();
}

function toggleIsoView() {
  STATE.isoView = !STATE.isoView;
  const btn = document.getElementById('iso-btn');
  btn.classList.toggle('iso-on', STATE.isoView);
  btn.textContent = STATE.isoView ? '📐 Vista 2D' : '🧊 Cámara 3D';
  updateStageTransform();
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

function renderSquadBar() {
  const bar = document.getElementById('squad-bar');
  bar.innerHTML = Object.values(STATE.tokens).map(t => {
    const pct = Math.round((t.hp / t.maxHp) * 100);
    const flLabel = t.floor === 'p4' ? 'P4' : (t.floor === 'p2' ? 'P2-3' : 'PB');
    return `
      <div class="token-card ${STATE.activeToken === t.id ? 'active-token' : ''} ${t.tripped ? 'tripped-card' : ''}" onclick="focusCharacter('${t.id}')">
        <div class="token-head">
          <span class="token-callsign">${getAvatarPortraitSVG(t.id)}<span>[${t.id}] ${t.name}</span></span>
          <span style="font-family:var(--font-mono);font-size:9.5px;color:#34d399;">${t.hp}/${t.maxHp}</span>
        </div>
        <div class="token-loc-badge">
          <span>📍 ${t.roomName}</span>
          <strong style="color:#fcd34d;">[${flLabel}${t.inStairs ? '•ESC' : ''}]</strong>
        </div>
        <div class="token-sub">
          <button class="trip-toggle-btn ${t.tripped ? 'is-tripped' : ''}" onclick="toggleTripState('${t.id}', event)">
            ${t.tripped ? '⚠️ Tropezó' : '🏃 Móvil'}
          </button>
          ${t.ammo > 0 ? `<strong style="color:#fbbf24;">🔫 ${t.ammo}+${t.reserve}</strong>` : `<span>👓 Croquis</span>`}
        </div>
        <div class="mini-hp-bar"><div class="mini-hp-fill" style="width:${pct}%;background:${t.color};"></div></div>
      </div>
    `;
  }).join('');
}

function focusCharacter(tokenId) {
  STATE.activeToken = tokenId;
  const t = STATE.tokens[tokenId];
  if (t && STATE.currentFloor !== t.floor) {
    STATE.currentFloor = t.floor;
  }
  if (t) STATE.selectedRoom = t.roomId;
  renderAll();
}

function toggleTripState(tokenId, evt) {
  if (evt) evt.stopPropagation();
  const t = STATE.tokens[tokenId];
  if (!t) return;
  t.tripped = !t.tripped;
  STATE.lastRollHtml = t.tripped
    ? `<span style="color:#f87171;">⚠️ <strong>${t.name} [${t.id}]</strong> marcado como <strong>Tropezó / Anclado</strong> en ${t.roomName}.</span>`
    : `<span style="color:#34d399;">✓ <strong>${t.name} [${t.id}]</strong> recuperó el equilibrio y puede desplazarse.</span>`;
  renderAll();
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

function renderDrawer() {
  const fl = STATE.currentFloor;
  const rInfo = ROOM_DETAILS[STATE.selectedRoom];
  if (!rInfo) return;
  const activeChar = STATE.tokens[STATE.activeToken];
  const visible = isRoomVisible(fl, STATE.selectedRoom);

  document.getElementById('drawer-title').textContent = `📍 ${rInfo.title}`;

  // Connected doors for this room so user can also toggle them from the panel on mobile
  const roomDoors = (FLOOR_PORTALS[fl] || []).filter(p => p.a === STATE.selectedRoom || p.b === STATE.selectedRoom);
  const doorsHtml = roomDoors.length > 0 ? `
    <div style="margin-top:4px;">
      <div style="font-family:var(--font-mono);font-size:9.5px;color:#94a3b8;margin-bottom:3px;">PUERTAS Y ACCESOS DEL SECTOR (TOCA PARA ABRIR/CERRAR):</div>
      <div>
        ${roomDoors.map(d => `
          <button class="door-chip-btn ${d.isOpen ? 'open' : 'closed'}" onclick="toggleDoorById('${fl}', '${d.id}', event)">
            <span>${d.isOpen ? '🔓' : '🔒'} ${d.label}: ${d.isOpen ? 'ABIERTA' : 'CERRADA'}</span>
          </button>
        `).join('')}
      </div>
    </div>
  ` : '';

  if (!visible) {
    document.getElementById('drawer-body').innerHTML = `
      <div style="padding:10px;background:rgba(15,23,42,0.9);border:1px dashed #64748b;border-radius:6px;font-size:11.5px;color:#94a3b8;text-align:center;">
        🌑 <strong>Sector en Penumbra (Sin Visión Directa)</strong><br>
        Abre la puerta conectada y arrastra una figura hacia este sector para iluminarlo.
      </div>
      ${doorsHtml}
      <div class="dice-banner" style="margin-top:6px;">${STATE.lastRollHtml}</div>
    `;
    return;
  }

  let html = `
    <p class="drawer-desc">${rInfo.desc}</p>
    ${doorsHtml}
    <div style="margin-top:4px;padding:7px 9px;background:rgba(245,158,11,0.09);border-left:3px solid var(--accent-amber);border-radius:4px;font-size:11px;color:#fde68a;">
      <strong>Detalle Táctico:</strong> ${rInfo.secret}
    </div>
  `;

  if (rInfo.actions && rInfo.actions.length > 0) {
    html += `<div style="margin-top:4px;">`;
    rInfo.actions.forEach((a, idx) => {
      html += `
        <button class="action-btn" onclick="runAction('${STATE.selectedRoom}', ${idx})">
          <span>▸ [${activeChar.id}] ${a.label}</span>
          <span style="color:var(--accent-amber);flex-shrink:0;">${a.dif > 0 ? 'DIF ' + a.dif : 'MOVER'}</span>
        </button>
      `;
    });
    html += `</div>`;
  }

  html += `<div class="dice-banner" style="margin-top:6px;">${STATE.lastRollHtml}</div>`;
  document.getElementById('drawer-body').innerHTML = html;
}

function runAction(roomId, idx) {
  const fl = STATE.currentFloor;
  const rInfo = ROOM_DETAILS[roomId];
  const a = rInfo.actions[idx];
  const activeChar = STATE.tokens[STATE.activeToken];
  if (!a || !activeChar) return;

  if (activeChar.tripped) {
    STATE.lastRollHtml = `<span style="color:#f87171;">⚠️ <strong>${activeChar.name}</strong> tropezó y está anclado. Desbloquéalo en su tarjeta inferior primero.</span>`;
    renderDrawer();
    return;
  }

  if (a.needCard && !STATE.lootMasterCard) {
    STATE.lastRollHtml = `<span style="color:#f87171;">❌ Requiere la <strong>Tarjeta Maestra</strong> del Cuarto 402 para abrir la puerta peatonal sin ruido.</span>`;
    renderDrawer();
    return;
  }

  if (a.loot) STATE.lootMasterCard = true;
  if (a.ammo && activeChar.ammo >= a.ammo) activeChar.ammo -= a.ammo;

  // Automatically open associated door if specified
  if (a.openDoorId) {
    const p = (FLOOR_PORTALS[fl] || []).find(d => d.id === a.openDoorId);
    if (p) p.isOpen = true;
  }

  if (a.dif === 0) {
    if (a.changeFloorTo) {
      activeChar.floor = a.changeFloorTo;
      STATE.currentFloor = a.changeFloorTo;
    }
    if (a.targetRoom) {
      activeChar.roomId = a.targetRoom;
      activeChar.x = a.tx;
      activeChar.y = a.ty;
      const ro = getRoomById(activeChar.floor, a.targetRoom);
      if (ro) {
        activeChar.roomName = ro.name;
        activeChar.inStairs = !!ro.isStairs;
      }
      STATE.selectedRoom = a.targetRoom;
    }
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
    if (a.targetRoom) {
      activeChar.roomId = a.targetRoom;
      activeChar.x = a.tx;
      activeChar.y = a.ty;
      const ro = getRoomById(activeChar.floor, a.targetRoom);
      if (ro) {
        activeChar.roomName = ro.name;
        activeChar.inStairs = !!ro.isStairs;
      }
      STATE.selectedRoom = a.targetRoom;
    }
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

/* ============================================================================
   3D-RENDERED TEXTURES, INTERACTIVE 3D DOORS & VOLUMETRIC FURNITURE
   ============================================================================ */

function buildOrganicFogMask(floor, visibleTokens) {
  if (!STATE.fogActive) return '';
  const rooms = FLOOR_ROOMS[floor] || [];

  const litRoomsSvg = rooms.filter(r => isRoomVisible(floor, r.id)).map(r => `
    <rect x="${r.x - 6}" y="${r.y - 6}" width="${r.w + 12}" height="${r.h + 12}" rx="14" fill="white" filter="url(#softEdgeBlur)"/>
  `).join('');

  const tokenHalosSvg = visibleTokens.map(t => {
    const pos = getTokenRenderCoords(t, floor);
    return `<circle cx="${pos.x}" cy="${pos.y}" r="145" fill="url(#flashlightMaskGrad)"/>`;
  }).join('');

  return `
    <mask id="organicFogMask">
      <rect x="0" y="0" width="920" height="540" fill="#d8dee9"/>
      <g fill="black">
        ${litRoomsSvg}
        ${tokenHalosSvg}
      </g>
    </mask>
    <rect x="0" y="0" width="920" height="540" rx="14" fill="#02050a" opacity="0.92" mask="url(#organicFogMask)" pointer-events="none"/>
  `;
}

// Renders interactive 3D doors that physically swing open or shut when clicked/tapped!
function renderInteractive3DDoors(floor) {
  const portals = FLOOR_PORTALS[floor] || [];
  return portals.map(p => {
    if (!isRoomVisible(floor, p.a) && !isRoomVisible(floor, p.b)) return '';
    const cx = p.x + p.w / 2;
    const cy = p.y + p.h / 2;
    const isH = p.orient === 'h';

    // 3D Door Frame Jambs + Physical Leaf (Closed vs Swung Open 90 deg)
    let doorLeafSvg = '';
    if (p.isOpen) {
      // Open threshold glow + swung open 3D wooden/metal door leaf
      doorLeafSvg = `
        <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="3" fill="rgba(16, 185, 129, 0.22)" stroke="#10b981" stroke-width="1.4" stroke-dasharray="4 2"/>
        ${p.swing ? `<path d="${p.swing}" fill="rgba(16, 185, 129, 0.10)" stroke="#34d399" stroke-width="1.5" stroke-dasharray="3 2"/>` : ''}
        ${isH
          ? `<rect x="${p.x + 2}" y="${cy}" width="6" height="32" rx="1.5" fill="url(#wood3DGrad)" stroke="#fbbf24" stroke-width="1" filter="url(#propShadow)"/>`
          : `<rect x="${cx}" y="${p.y + 2}" width="32" height="6" rx="1.5" fill="url(#wood3DGrad)" stroke="#fbbf24" stroke-width="1" filter="url(#propShadow)"/>`
        }
      `;
    } else {
      // Closed solid 3D door leaf blocking the wall opening + brass handle
      doorLeafSvg = `
        <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="3" fill="rgba(239, 68, 68, 0.18)"/>
        ${isH
          ? `<rect x="${p.x + 3}" y="${cy - 4}" width="${p.w - 6}" height="8" rx="2" fill="url(#wood3DGrad)" stroke="#f59e0b" stroke-width="1.4" filter="url(#propShadow)"/>`
          : `<rect x="${cx - 4}" y="${p.y + 3}" width="8" height="${p.h - 6}" rx="2" fill="url(#wood3DGrad)" stroke="#f59e0b" stroke-width="1.4" filter="url(#propShadow)"/>`
        }
      `;
    }

    return `
      <g class="door-interactive" onclick="toggleDoorById('${floor}', '${p.id}', event)" title="Toca para abrir o cerrar ${p.label}">
        <!-- Enlarged touch hit target for mobile thumbs -->
        <rect x="${p.x - 8}" y="${p.y - 8}" width="${p.w + 16}" height="${p.h + 16}" fill="transparent"/>
        ${doorLeafSvg}
        <!-- Interactive Lock / Unlock Badge on Door -->
        <circle cx="${cx}" cy="${cy}" r="9.5" fill="${p.isOpen ? '#064e3b' : '#450a0a'}" stroke="${p.isOpen ? '#34d399' : '#f87171'}" stroke-width="1.5" filter="url(#propShadow)"/>
        <text x="${cx}" y="${cy + 3.5}" font-size="9" text-anchor="middle">${p.isOpen ? '🔓' : '🔒'}</text>
      </g>
    `;
  }).join('');
}

// 3D Extruded Wall Helper (draws shadow, 3D vertical bevel, and lit concrete top cap)
function draw3DRoomWalls(x, y, w, h, strokeTop = '#94a3b8') {
  return `
    <g pointer-events="none">
      <!-- Deep Interior Ambient Occlusion Shadow -->
      <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" fill="none" stroke="rgba(0,0,0,0.68)" stroke-width="8" filter="url(#softEdgeBlur)"/>
      <!-- 3D Extruded Wall Side Face (Dark Slate Bevel) -->
      <rect x="${x}" y="${y + 4}" width="${w}" height="${h}" fill="none" stroke="#1e293b" stroke-width="9"/>
      <!-- 3D Lit Top Wall Cap -->
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${strokeTop}" stroke-width="5"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#e2e8f0" stroke-width="1" opacity="0.4"/>
    </g>
  `;
}

// 3D Volumetric Bed with quilted mattress, shaded pillows & side tables
function drawBed(x, y, w, h, colorCabecera = '#451a03', colorColcha = '#0f766e') {
  return `
    <g filter="url(#wallShadow)">
      <!-- 3D Nightstands with Glowing Warm Lamp -->
      <rect x="${x - 18}" y="${y + 4}" width="15" height="15" rx="3" fill="url(#wood3DGrad)" stroke="#92400e" stroke-width="1"/>
      <circle cx="${x - 10.5}" cy="${y + 11.5}" r="5.5" fill="url(#lampGlowGrad)"/>
      <rect x="${x + w + 3}" y="${y + 4}" width="15" height="15" rx="3" fill="url(#wood3DGrad)" stroke="#92400e" stroke-width="1"/>
      <!-- 3D Extruded Bed Base -->
      <rect x="${x}" y="${y + 4}" width="${w}" height="${h}" rx="6" fill="#0f172a"/>
      <!-- Quilted Mattress -->
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="url(#mattressGrad)" stroke="#64748b" stroke-width="1.5"/>
      <!-- 3D Carved Wood Headboard -->
      <rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="11" rx="3" fill="url(#wood3DGrad)" stroke="#b45309" stroke-width="1"/>
      <!-- 3D Shaded Pillows -->
      <rect x="${x + 7}" y="${y + 12}" width="${w/2 - 10}" height="15" rx="6" fill="url(#pillowGrad)" stroke="#94a3b8" stroke-width="0.8"/>
      <rect x="${x + w/2 + 3}" y="${y + 12}" width="${w/2 - 10}" height="15" rx="6" fill="url(#pillowGrad)" stroke="#94a3b8" stroke-width="0.8"/>
      <!-- 3D Duvet / Folded Blanket with Specular Creases -->
      <path d="M ${x+2} ${y+31} Q ${x+w/2} ${y+26} ${x+w-2} ${y+32} L ${x+w-2} ${y+h-3} Q ${x+w/2} ${y+h+1} ${x+2} ${y+h-3} Z" fill="${colorColcha}" stroke="#042f2e" stroke-width="1"/>
      <path d="M ${x+6} ${y+42} Q ${x+w/2} ${y+36} ${x+w-6} ${y+44}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
      <path d="M ${x+8} ${y+56} Q ${x+w/2} ${y+51} ${x+w-8} ${y+58}" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="2"/>
    </g>
  `;
}

function drawBathroom(x, y, w, h) {
  return `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#bathTiles3D)"/>
      ${draw3DRoomWalls(x, y, w, h, '#64748b')}
      <!-- Walk-in Glass Shower with Metallic Drain -->
      <rect x="${x + 6}" y="${y + 6}" width="32" height="32" rx="3" fill="rgba(56, 189, 248, 0.16)" stroke="#bae6fd" stroke-width="1.5"/>
      <circle cx="${x + 22}" cy="${y + 22}" r="3.5" fill="#334155" stroke="#94a3b8" stroke-width="0.8"/>
      <!-- 3D Porcelain Toilet -->
      <g filter="url(#propShadow)">
        <rect x="${x + w - 23}" y="${y + 6}" width="17" height="9" rx="2.5" fill="url(#pillowGrad)" stroke="#94a3b8" stroke-width="1"/>
        <ellipse cx="${x + w - 14.5}" cy="${y + 22}" rx="8" ry="10" fill="url(#pillowGrad)" stroke="#94a3b8" stroke-width="1"/>
        <ellipse cx="${x + w - 14.5}" cy="${y + 22}" rx="5" ry="6.5" fill="#cbd5e1"/>
      </g>
      <!-- Marble Vanity Counter & Sink -->
      <g filter="url(#propShadow)">
        <rect x="${x + 6}" y="${y + h - 20}" width="40" height="14" rx="3" fill="#1e293b" stroke="#64748b" stroke-width="1.2"/>
        <ellipse cx="${x + 26}" cy="${y + h - 13}" rx="9.5" ry="5.5" fill="url(#pillowGrad)" stroke="#94a3b8" stroke-width="0.8"/>
      </g>
    </g>
  `;
}

function drawFoliageCluster(cx, cy, r) {
  return `
    <g filter="url(#wallShadow)" opacity="0.9" pointer-events="none">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#treeGradDark)"/>
      <circle cx="${cx - r*0.32}" cy="${cy - r*0.24}" r="${r*0.72}" fill="url(#treeGradMid)"/>
      <circle cx="${cx + r*0.28}" cy="${cy + r*0.22}" r="${r*0.65}" fill="url(#treeGradMid)"/>
      <circle cx="${cx - r*0.12}" cy="${cy - r*0.15}" r="${r*0.42}" fill="#34d399" opacity="0.45"/>
    </g>
  `;
}

function renderBlueprintSVG() {
  const stage = document.getElementById('map-stage');
  const fl = STATE.currentFloor;
  const visibleTokens = Object.values(STATE.tokens).filter(t => isTokenVisibleOnFloor(t, fl));
  let floorContent = '';

  if (fl === 'p4') {
    const sel = FLOOR_ROOMS.p4.find(r => r.id === STATE.selectedRoom);
    floorContent = `
      ${drawFoliageCluster(28, 120, 24)}
      ${drawFoliageCluster(32, 240, 19)}
      ${drawFoliageCluster(892, 160, 25)}
      ${drawFoliageCluster(888, 440, 21)}

      <text x="50" y="42" fill="#38bdf8" font-family="monospace" font-size="14" font-weight="bold">PLANTA PISO 4 — ALA NORTE DEL HOTEL (TEXTURAS 3D Y PUERTAS INTERACTIVAS)</text>
      <text x="50" y="60" fill="#94a3b8" font-family="monospace" font-size="10">TOCA CUALQUIER PUERTA (🔒/🔓) PARA ABRIRLA O CERRARLA • ARRASTRA LAS FIGURAS DE AUDOMARO, ARMANDO Y GONZALO</text>

      <!-- PASARELA EXTERIOR 14M -->
      <g class="room-hit" onclick="selectRoom('walkway_4p')">
        <rect x="50" y="290" width="75" height="210" rx="4" fill="url(#metalGrate)" stroke="#64748b" stroke-width="3.5" filter="url(#wallShadow)"/>
        <line x1="54" y1="290" x2="54" y2="500" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8 4"/>
        <text x="88" y="395" fill="#cbd5e1" font-family="monospace" font-size="9.5" text-anchor="middle" transform="rotate(-90 88 395)">PASARELA METÁLICA (+14m)</text>
      </g>

      <!-- BUILDING EXTERIOR 3D SHELL -->
      <rect x="119" y="74" width="747" height="432" rx="10" fill="#020408" filter="url(#wallShadow)"/>
      <rect x="125" y="80" width="735" height="420" rx="4" fill="#0f172a"/>

      <!-- ESCALERA PROVEEDORES (P4) -->
      <g class="room-hit" onclick="selectRoom('fire_door_4p')">
        <rect x="125" y="80" width="110" height="130" fill="url(#concrete3D)"/>
        ${draw3DRoomWalls(125, 80, 110, 130, '#38bdf8')}
        <rect x="136" y="90" width="88" height="62" rx="2" fill="url(#stairSteps3D)" stroke="#64748b" stroke-width="2" filter="url(#propShadow)"/>
        <line x1="180" y1="90" x2="180" y2="152" stroke="#38bdf8" stroke-width="3.5"/>
        <circle cx="180" cy="152" r="4.5" fill="#38bdf8"/>
        <text x="180" y="172" fill="#38bdf8" font-family="monospace" font-size="10" text-anchor="middle" font-weight="bold">CUBO ESCALERA</text>
        <text x="180" y="185" fill="#bae6fd" font-family="monospace" font-size="8" text-anchor="middle">Bajada a Pisos 3–2</text>
      </g>

      <!-- CUARTO DE SERVICIO 402 -->
      <g class="room-hit" onclick="selectRoom('room_402')">
        <rect x="235" y="80" width="175" height="130" fill="url(#concrete3D)"/>
        ${draw3DRoomWalls(235, 80, 175, 130, '#94a3b8')}
        <g filter="url(#wallShadow)">
          <rect x="245" y="88" width="105" height="22" rx="3" fill="#334155" stroke="#94a3b8" stroke-width="1.2"/>
          <rect x="250" y="91" width="22" height="15" rx="2" fill="url(#pillowGrad)"/>
          <rect x="276" y="91" width="22" height="15" rx="2" fill="url(#pillowGrad)"/>
          <circle cx="315" cy="99" r="5.5" fill="#fde047" stroke="#ca8a04" stroke-width="1"/>
          <circle cx="329" cy="99" r="5.5" fill="#fde047" stroke="#ca8a04" stroke-width="1"/>
        </g>
        <g filter="url(#wallShadow)">
          <rect x="246" y="122" width="48" height="44" rx="4" fill="url(#wood3DGrad)" stroke="#b45309" stroke-width="1.5"/>
          <rect x="253" y="130" width="15" height="10" rx="1.5" fill="#38bdf8" stroke="#fff" stroke-width="0.9"/>
          <path d="M 275 130 L 285 155 Q 287 160 280 160" fill="none" stroke="#ef4444" stroke-width="3.2" stroke-linecap="round"/>
        </g>
        <g filter="url(#wallShadow)">
          <circle cx="376" cy="118" r="22" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
          <circle cx="376" cy="118" r="17" fill="#0f172a"/>
          <path d="M 365 114 Q 376 104 386 116 Q 380 129 368 122 Z" fill="url(#pillowGrad)"/>
          <text x="376" y="150" fill="#fca5a5" font-family="monospace" font-size="7.5" text-anchor="middle" font-weight="bold">CESTO ROPA</text>
        </g>
        <text x="325" y="190" fill="#fde68a" font-family="monospace" font-size="10.5" text-anchor="middle" font-weight="bold">SERVICIO 402</text>
      </g>

      <!-- HABITACIÓN 404 -->
      <g class="room-hit" onclick="selectRoom('room_404')">
        <rect x="410" y="80" width="145" height="130" fill="url(#wood3DPlanks)"/>
        ${draw3DRoomWalls(410, 80, 145, 130, '#64748b')}
        ${drawBed(452, 88, 66, 56, '#451a03', '#1e293b')}
        ${drawBathroom(410, 80, 34, 58)}
        <text x="485" y="185" fill="#94a3b8" font-family="monospace" font-size="10" text-anchor="middle">SUITE 404</text>
      </g>

      <!-- HABITACIÓN 406 -->
      <g class="room-hit" onclick="selectRoom('room_406')">
        <rect x="555" y="80" width="145" height="130" fill="url(#wood3DPlanks)"/>
        ${draw3DRoomWalls(555, 80, 145, 130, '#64748b')}
        ${drawBed(597, 88, 66, 56, '#451a03', '#1e293b')}
        ${drawBathroom(555, 80, 34, 58)}
        <text x="630" y="185" fill="#94a3b8" font-family="monospace" font-size="10" text-anchor="middle">SUITE 406</text>
      </g>

      <!-- ELEVADORES BLOQUEADOS -->
      <g class="room-hit" onclick="selectRoom('elevators_4p')">
        <rect x="700" y="80" width="160" height="130" fill="#181218"/>
        ${draw3DRoomWalls(700, 80, 160, 130, '#991b1b')}
        <rect x="715" y="92" width="56" height="58" fill="#05080d" stroke="#475569" stroke-width="2.5"/>
        <line x1="715" y1="92" x2="771" y2="150" stroke="#991b1b" stroke-width="2"/>
        <rect x="785" y="92" width="56" height="58" fill="#05080d" stroke="#475569" stroke-width="2.5"/>
        <line x1="785" y1="92" x2="841" y2="150" stroke="#991b1b" stroke-width="2"/>
        <text x="780" y="180" fill="#f87171" font-family="monospace" font-size="10" text-anchor="middle" font-weight="bold">ELEVADORES (CLAUSURADOS)</text>
      </g>

      <!-- PASILLO CENTRAL ALFOMBRADO -->
      <g class="room-hit" onclick="selectRoom('corridor_4p')">
        <rect x="125" y="210" width="735" height="95" fill="url(#carpet3D)"/>
        <rect x="135" y="220" width="715" height="75" rx="4" fill="none" stroke="rgba(245, 158, 11, 0.28)" stroke-width="2"/>
        <path d="M 695 295 Q 640 265 560 275 T 490 272" fill="none" stroke="rgba(153, 27, 27, 0.65)" stroke-width="6.5" stroke-linecap="round"/>
        <circle cx="515" cy="268" r="9" fill="rgba(127, 29, 29, 0.7)"/>
        <circle cx="665" cy="285" r="12" fill="rgba(127, 29, 29, 0.7)"/>
        ${drawFoliageCluster(142, 286, 10)}
        ${drawFoliageCluster(842, 228, 10)}

        ${isRoomVisible('p4', 'corridor_4p') ? renderZombieFigure(480, 272, -155, 'Infectado 412 (En Letargo)') : ''}
      </g>

      <!-- HABITACIÓN 408 (REFUGIO INICIAL) -->
      <g class="room-hit" onclick="selectRoom('room_408')">
        <rect x="125" y="305" width="245" height="195" fill="url(#wood3DPlanks)"/>
        ${draw3DRoomWalls(125, 305, 245, 195, '#10b981')}
        ${drawBathroom(125, 305, 82, 82)}
        <rect x="148" y="396" width="128" height="92" rx="8" fill="#17253b" stroke="#38bdf8" stroke-width="1.2" opacity="0.8"/>
        ${drawBed(162, 405, 92, 74, '#451a03', '#0f766e')}
        <g filter="url(#wallShadow)">
          <circle cx="328" cy="435" r="17" fill="url(#wood3DGrad)" stroke="#b45309" stroke-width="1.5"/>
          <rect x="294" y="425" width="13" height="19" rx="5" fill="#334155" stroke="#64748b" stroke-width="1"/>
          <rect x="348" y="425" width="13" height="19" rx="5" fill="#334155" stroke="#64748b" stroke-width="1"/>
          <rect x="321" y="430" width="9" height="7" rx="1.5" fill="#ef4444"/>
          <circle cx="335" cy="438" r="3.2" fill="#38bdf8"/>
        </g>
        <!-- Solid Mahogany Desk Barricading Door 408 -->
        <g filter="url(#wallShadow)" transform="rotate(-4 246 322)">
          <rect x="214" y="313" width="64" height="18" rx="3" fill="url(#wood3DGrad)" stroke="#f59e0b" stroke-width="1.8"/>
          <text x="246" y="325" fill="#fef3c7" font-family="monospace" font-size="7" text-anchor="middle" font-weight="bold">ESCRITORIO</text>
        </g>
        <rect x="165" y="496" width="120" height="7" rx="2" fill="#38bdf8" stroke="#e0f2fe" stroke-width="1.2"/>
        <text x="315" y="352" fill="#34d399" font-family="monospace" font-size="11.5" text-anchor="middle" font-weight="bold">SUITE 408</text>
      </g>

      <!-- HABITACIÓN 410 -->
      <g class="room-hit" onclick="selectRoom('room_410')">
        <rect x="370" y="305" width="225" height="195" fill="url(#wood3DPlanks)"/>
        ${draw3DRoomWalls(370, 305, 225, 195, '#64748b')}
        ${drawBathroom(370, 305, 76, 78)}
        ${drawBed(435, 408, 86, 72, '#3f271d', '#1e3a5f')}
        <text x="515" y="352" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">SUITE 410</text>
      </g>

      <!-- HABITACIÓN 412 -->
      <g class="room-hit" onclick="selectRoom('room_412')">
        <rect x="595" y="305" width="265" height="195" fill="url(#wood3DPlanks)"/>
        ${draw3DRoomWalls(595, 305, 265, 195, '#991b1b')}
        ${drawBathroom(595, 305, 76, 78)}
        <g transform="rotate(8 745 430)">
          ${drawBed(700, 398, 86, 72, '#450a0a', '#7f1d1d')}
        </g>
        <path d="M 675 335 Q 705 355 690 380 Q 665 365 675 335 Z" fill="rgba(153, 27, 27, 0.72)"/>
        <circle cx="682" cy="325" r="2.2" fill="#fbbf24"/>
        <circle cx="690" cy="331" r="2.2" fill="#fbbf24"/>
        <circle cx="698" cy="322" r="2.2" fill="#fbbf24"/>
        <circle cx="705" cy="336" r="2.2" fill="#fbbf24"/>
        <text x="755" y="352" fill="#f87171" font-family="monospace" font-size="11.5" text-anchor="middle" font-weight="bold">SUITE 412</text>
      </g>

      ${sel ? `<rect class="selected-outline" x="${sel.x+3}" y="${sel.y+3}" width="${sel.w-6}" height="${sel.h-6}" rx="4"/>` : ''}
    `;
  } else if (fl === 'p2') {
    const sel = FLOOR_ROOMS.p2.find(r => r.id === STATE.selectedRoom);
    floorContent = `
      <text x="50" y="42" fill="#f59e0b" font-family="monospace" font-size="14" font-weight="bold">PISOS 3 Y 2 — TIRO VERTICAL DE ESCALERA DE PROVEEDORES</text>
      <text x="50" y="60" fill="#94a3b8" font-family="monospace" font-size="10">CONCRETO ARMADO 3D • BARANDALES METÁLICOS • RELLANO INTERMEDIO DEL PISO 2</text>

      <rect x="121" y="81" width="733" height="398" rx="8" fill="#020408" filter="url(#wallShadow)"/>

      <!-- TRAMO P4 -> P3 -->
      <g class="room-hit" onclick="selectRoom('stairs_p4_p3')">
        <rect x="125" y="85" width="235" height="390" fill="url(#concrete3D)"/>
        ${draw3DRoomWalls(125, 85, 235, 390, '#38bdf8')}
        <rect x="145" y="110" width="195" height="150" rx="3" fill="url(#stairSteps3D)" stroke="#64748b" stroke-width="2.5" filter="url(#wallShadow)"/>
        <line x1="242" y1="110" x2="242" y2="260" stroke="#38bdf8" stroke-width="4.5"/>
        <text x="242" y="315" fill="#38bdf8" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">RAMPA PISO 4 → PISO 3</text>
      </g>

      <!-- DESCANSO PISO 2 -->
      <g class="room-hit" onclick="selectRoom('stairs_p2')">
        <rect x="360" y="85" width="250" height="390" fill="url(#concrete3D)"/>
        ${draw3DRoomWalls(360, 85, 250, 390, '#ef4444')}
        <g filter="url(#wallShadow)" transform="rotate(-14 425 140)">
          <rect x="385" y="115" width="76" height="48" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/>
          <path d="M 392 122 Q 425 112 452 128 Q 440 155 400 148 Z" fill="url(#pillowGrad)"/>
        </g>
        ${renderZombieFigure(485, 215, 25, 'Errante 1')}
        ${renderZombieFigure(528, 252, -35, 'Errante 2')}
        <text x="485" y="335" fill="#f87171" font-family="monospace" font-size="12.5" text-anchor="middle" font-weight="bold">DESCANSO PISO 2</text>
      </g>

      <!-- TRAMO SALIDA P1 / PB -->
      <g class="room-hit" onclick="selectRoom('stairs_p1')">
        <rect x="610" y="85" width="240" height="390" fill="url(#concrete3D)"/>
        ${draw3DRoomWalls(610, 85, 240, 390, '#10b981')}
        <rect x="632" y="110" width="195" height="150" rx="3" fill="url(#stairSteps3D)" stroke="#64748b" stroke-width="2.5" filter="url(#wallShadow)"/>
        <line x1="730" y1="110" x2="730" y2="260" stroke="#10b981" stroke-width="4.5"/>
        <text x="730" y="315" fill="#34d399" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">BAJADA A PISO 1 / PB</text>
      </g>

      ${sel ? `<rect class="selected-outline" x="${sel.x+3}" y="${sel.y+3}" width="${sel.w-6}" height="${sel.h-6}" rx="4"/>` : ''}
    `;
  } else if (fl === 'pb') {
    const sel = FLOOR_ROOMS.pb.find(r => r.id === STATE.selectedRoom);
    floorContent = `
      ${drawFoliageCluster(445, 62, 20)}
      ${drawFoliageCluster(615, 58, 24)}
      ${drawFoliageCluster(885, 130, 22)}
      ${drawFoliageCluster(885, 310, 25)}
      ${drawFoliageCluster(880, 465, 22)}

      <text x="50" y="42" fill="#10b981" font-family="monospace" font-size="14" font-weight="bold">PLANTA BAJA — MUELLE DE CARGA, LOBBY Y PATIO EXTERIOR (COTA ±0.00m)</text>
      <text x="50" y="60" fill="#94a3b8" font-family="monospace" font-size="10">ABRE LA PUERTA DEL MUELLE (🔒/🔓) PARA SALIR AL PATIO • PICKUP 3D A 15 METROS</text>

      <rect x="66" y="81" width="798" height="418" rx="8" fill="#020408" filter="url(#wallShadow)"/>

      <!-- SALIDA ESCALERA PB -->
      <g class="room-hit" onclick="selectRoom('stairs_exit_pb')">
        <rect x="70" y="85" width="120" height="195" fill="url(#concrete3D)"/>
        ${draw3DRoomWalls(70, 85, 120, 195, '#38bdf8')}
        <rect x="82" y="98" width="94" height="68" rx="2" fill="url(#stairSteps3D)" stroke="#38bdf8" stroke-width="1.8" filter="url(#propShadow)"/>
        <text x="130" y="212" fill="#38bdf8" font-family="monospace" font-size="10.5" text-anchor="middle" font-weight="bold">ESCALERA PB</text>
      </g>

      <!-- MUELLE DE CARGA -->
      <g class="room-hit" onclick="selectRoom('dock_pb')">
        <rect x="190" y="85" width="230" height="195" fill="url(#concrete3D)"/>
        ${draw3DRoomWalls(190, 85, 230, 195, '#f59e0b')}
        <g filter="url(#wallShadow)">
          <rect x="206" y="98" width="44" height="44" rx="3" fill="url(#wood3DGrad)" stroke="#b45309" stroke-width="1.5"/>
          <line x1="206" y1="112" x2="250" y2="112" stroke="#451a03" stroke-width="2"/>
          <line x1="206" y1="126" x2="250" y2="126" stroke="#451a03" stroke-width="2"/>
          <rect x="260" y="98" width="40" height="40" rx="3" fill="#475569" stroke="#94a3b8" stroke-width="1.2"/>
        </g>
        <text x="305" y="182" fill="#fcd34d" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">MUELLE DE CARGA</text>
      </g>

      <!-- LOBBY PRINCIPAL -->
      <g class="room-hit" onclick="selectRoom('lobby_pb')">
        <rect x="70" y="280" width="350" height="215" fill="#181016"/>
        ${draw3DRoomWalls(70, 280, 350, 215, '#ef4444')}
        <path d="M 115 335 Q 245 375 365 330" fill="none" stroke="url(#wood3DGrad)" stroke-width="8" stroke-linecap="round" filter="url(#wallShadow)"/>
        <text x="245" y="388" fill="#f87171" font-family="monospace" font-size="12.5" text-anchor="middle" font-weight="bold">LOBBY PRINCIPAL (COLAPSADO)</text>
      </g>

      <!-- PATIO DE MANIOBRAS 15M -->
      <g class="room-hit" onclick="selectRoom('yard_pb')">
        <rect x="420" y="85" width="220" height="195" fill="url(#asphalt3D)"/>
        ${draw3DRoomWalls(420, 85, 220, 195, '#38bdf8')}
        <line x1="432" y1="175" x2="628" y2="175" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 4"/>
        <text x="530" y="165" fill="#7dd3fc" font-family="monospace" font-size="10.5" text-anchor="middle" font-weight="bold">◄── 15.00 METROS ──►</text>
        ${renderZombieFigure(508, 225, 15, 'Infectado')}
        ${renderZombieFigure(562, 208, -40, 'Infectado')}
      </g>

      <!-- CAJÓN PICKUP -->
      <g class="room-hit" onclick="selectRoom('pickup_pb')">
        <rect x="640" y="85" width="220" height="195" fill="url(#asphalt3D)"/>
        ${draw3DRoomWalls(640, 85, 220, 195, '#10b981')}
        <path d="M 665 118 L 835 118 M 665 228 L 835 228" stroke="#facc15" stroke-width="2" stroke-dasharray="8 4" opacity="0.7"/>
        <g transform="translate(682, 136)" filter="url(#wallShadow)">
          <rect x="14" y="-5" width="22" height="7" rx="2" fill="#090d14"/>
          <rect x="92" y="-5" width="22" height="7" rx="2" fill="#090d14"/>
          <rect x="14" y="56" width="22" height="7" rx="2" fill="#090d14"/>
          <rect x="92" y="56" width="22" height="7" rx="2" fill="#090d14"/>
          <rect x="0" y="0" width="132" height="58" rx="12" fill="url(#truckBodyGrad)" stroke="#34d399" stroke-width="2.2"/>
          <path d="M 35 7 Q 42 29 35 51 L 48 47 L 48 11 Z" fill="#0f172a" stroke="#7dd3fc" stroke-width="1.2"/>
          <rect x="48" y="9" width="36" height="40" rx="4" fill="#065f46" stroke="#6ee7b7" stroke-width="1.2"/>
          <rect x="88" y="7" width="38" height="44" rx="3" fill="#022c22" stroke="#10b981" stroke-width="1.2"/>
          <circle cx="3" cy="12" r="3.5" fill="#fef08a"/>
          <circle cx="3" cy="46" r="3.5" fill="#fef08a"/>
          <text x="66" y="78" fill="#34d399" font-family="monospace" font-size="10.5" text-anchor="middle" font-weight="bold">🛻 PICKUP LÁZARAS (3/4 TANQUE)</text>
        </g>
      </g>

      <!-- CASETA DE SALIDA -->
      <g class="room-hit" onclick="selectRoom('gate_pb')">
        <rect x="420" y="280" width="440" height="215" fill="url(#asphalt3D)"/>
        ${draw3DRoomWalls(420, 280, 440, 215, '#475569')}
        <g filter="url(#wallShadow)">
          <rect x="528" y="348" width="68" height="68" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/>
          <rect x="536" y="356" width="52" height="52" fill="#0f172a"/>
          <text x="562" y="386" fill="#fcd34d" font-family="monospace" font-size="8.5" text-anchor="middle" font-weight="bold">CASETA</text>
        </g>
        <g transform="rotate(26 648 386)" filter="url(#wallShadow)">
          <rect x="600" y="365" width="94" height="42" rx="9" fill="#450a0a" stroke="#f87171" stroke-width="2"/>
          <rect x="622" y="370" width="42" height="32" rx="4" fill="#1e293b" stroke="#94a3b8" stroke-width="1"/>
        </g>
        <text x="655" y="452" fill="#fca5a5" font-family="monospace" font-size="10" text-anchor="middle">Sedán Colisionado en Salida Vial</text>
      </g>

      ${sel ? `<rect class="selected-outline" x="${sel.x+3}" y="${sel.y+3}" width="${sel.w-6}" height="${sel.h-6}" rx="4"/>` : ''}
    `;
  }

  const tokensSvg = visibleTokens.map(t => {
    const pos = getTokenRenderCoords(t, fl);
    const isSel = STATE.activeToken === t.id;
    const stairTag = (t.floor !== fl && t.inStairs) ? ' (En Escalera)' : '';
    return renderDetailedCharacterFigure(t, pos, isSel, stairTag);
  }).join('');

  const emptyFloorNotice = visibleTokens.length === 0 ? `
    <g pointer-events="none">
      <rect x="230" y="235" width="460" height="54" rx="8" fill="rgba(9, 13, 20, 0.92)" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="460" y="258" fill="#fde68a" font-family="monospace" font-size="11.5" text-anchor="middle" font-weight="bold">NINGÚN PERSONAJE SE ENCUENTRA EN ESTE PISO ACTUALMENTE</text>
      <text x="460" y="276" fill="#94a3b8" font-family="monospace" font-size="9.5" text-anchor="middle">Mueve al menos un personaje a la Escalera de Proveedores para verlo y desplazarlo aquí</text>
    </g>
  ` : '';

  stage.innerHTML = `
    <svg id="main-svg" class="arch-blueprint" viewBox="0 0 920 540" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- 3D SHADED HARDWOOD FLOOR PLANKS -->
        <pattern id="wood3DPlanks" width="48" height="20" patternUnits="userSpaceOnUse">
          <rect width="48" height="10" fill="url(#plankGrad1)"/>
          <rect y="10" width="48" height="10" fill="url(#plankGrad2)"/>
          <line x1="0" y1="0" x2="48" y2="0" stroke="#0c0a09" stroke-width="1.4"/>
          <line x1="0" y1="10" x2="48" y2="10" stroke="#0c0a09" stroke-width="1.4"/>
          <line x1="24" y1="0" x2="24" y2="10" stroke="#0c0a09" stroke-width="1.2"/>
          <line x1="10" y1="10" x2="10" y2="20" stroke="#0c0a09" stroke-width="1.2"/>
        </pattern>
        <linearGradient id="plankGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#2e231d"/>
          <stop offset="50%" stop-color="#241b16"/>
          <stop offset="100%" stop-color="#1a1310"/>
        </linearGradient>
        <linearGradient id="plankGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#271e19"/>
          <stop offset="50%" stop-color="#1f1713"/>
          <stop offset="100%" stop-color="#16100d"/>
        </linearGradient>

        <!-- 3D BEVELED CERAMIC BATHROOM TILES -->
        <pattern id="bathTiles3D" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#0d2230"/>
          <rect x="1" y="1" width="13.5" height="13.5" rx="1.5" fill="url(#tileBevelGrad)"/>
        </pattern>
        <linearGradient id="tileBevelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1b3b52"/>
          <stop offset="100%" stop-color="#0f2536"/>
        </linearGradient>

        <!-- 3D WOVEN HOTEL CORRIDOR CARPET -->
        <pattern id="carpet3D" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#121826"/>
          <path d="M 7 1 L 13 7 L 7 13 L 1 7 Z" fill="#1a2438" stroke="#283652" stroke-width="0.9"/>
          <circle cx="7" cy="7" r="1.5" fill="#38bdf8" opacity="0.22"/>
        </pattern>

        <!-- 3D POLISHED INDUSTRIAL CONCRETE -->
        <pattern id="concrete3D" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect width="32" height="32" fill="#151d28"/>
          <rect x="0.5" y="0.5" width="31" height="31" fill="none" stroke="#1e293b" stroke-width="0.8"/>
          <circle cx="9" cy="11" r="1.2" fill="#263449"/>
          <circle cx="23" cy="21" r="1.5" fill="#0f172a"/>
        </pattern>

        <!-- 3D WEATHERED EXTERIOR ASPHALT -->
        <pattern id="asphalt3D" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect width="32" height="32" fill="#0b1119"/>
          <circle cx="7" cy="9" r="1.1" fill="#1e293b"/>
          <circle cx="21" cy="6" r="0.9" fill="#334155"/>
          <circle cx="15" cy="24" r="1.4" fill="#06090f"/>
          <circle cx="27" cy="20" r="1.1" fill="#1e293b"/>
        </pattern>

        <!-- 3D CONCRETE STAIR TREADS WITH SHADOW -->
        <pattern id="stairSteps3D" width="12" height="11" patternUnits="userSpaceOnUse">
          <rect width="12" height="8" fill="#243247"/>
          <rect y="8" width="12" height="3" fill="#090d14"/>
          <line x1="0" y1="0" x2="12" y2="0" stroke="#64748b" stroke-width="1.2"/>
        </pattern>

        <pattern id="metalGrate" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#090d14"/>
          <path d="M 0 4 L 4 0 L 8 4 L 4 8 Z" fill="none" stroke="#334155" stroke-width="1"/>
        </pattern>

        <!-- 3D MATERIAL GRADIENTS FOR FURNITURE & MINIATURES -->
        <linearGradient id="wood3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#92400e"/>
          <stop offset="50%" stop-color="#78350f"/>
          <stop offset="100%" stop-color="#451a03"/>
        </linearGradient>
        <linearGradient id="mattressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
        <radialGradient id="pillowGrad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </radialGradient>
        <radialGradient id="skinGrad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#f1c6a7"/>
          <stop offset="100%" stop-color="#b88662"/>
        </radialGradient>
        <radialGradient id="lampGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="truckBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#047857"/>
          <stop offset="50%" stop-color="#065f46"/>
          <stop offset="100%" stop-color="#022c22"/>
        </linearGradient>
        <radialGradient id="treeGradDark" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#065f46"/>
          <stop offset="100%" stop-color="#022c22"/>
        </radialGradient>
        <radialGradient id="treeGradMid" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#047857"/>
        </radialGradient>

        <!-- SHADOWS & LIGHTING FILTERS -->
        <filter id="wallShadow" x="-12%" y="-12%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6.5" flood-color="#000" flood-opacity="0.88"/>
        </filter>
        <filter id="propShadow" x="-20%" y="-20%" width="145%" height="145%">
          <feDropShadow dx="1" dy="3.5" stdDeviation="2.5" flood-color="#000" flood-opacity="0.8"/>
        </filter>
        <filter id="tokenShadow" x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#000" flood-opacity="0.92"/>
        </filter>
        <filter id="softEdgeBlur" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="11"/>
        </filter>

        <linearGradient id="coneGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.58"/>
          <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
        </linearGradient>

        <radialGradient id="flashlightMaskGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="black" stop-opacity="1"/>
          <stop offset="65%" stop-color="black" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- AMBIENT EXTERIOR GROUND -->
      <rect x="0" y="0" width="920" height="540" rx="14" fill="#060a11" stroke="#1e293b" stroke-width="2"/>

      ${floorContent}
      ${buildOrganicFogMask(fl, visibleTokens)}
      ${renderInteractive3DDoors(fl)}
      ${tokensSvg}
      ${emptyFloorNotice}
    </svg>
  `;
}

/* ============================================================================
   INTERACTIVE DRAG-AND-DROP WITH REAL WALL & CLOSED-DOOR COLLISION
   ============================================================================ */

let isPanning = false;
let startPanX = 0, startPanY = 0, panX = 0, panY = 0;
let initialPinchDist = null;
let initialPinchZoom = 1;

function updateStageTransform() {
  const st = document.getElementById('map-stage');
  if (STATE.isoView) {
    st.style.transform = `translate(${panX}px, ${panY}px) scale(${STATE.zoom}) rotateX(36deg) rotateZ(-14deg)`;
  } else {
    st.style.transform = `translate(${panX}px, ${panY}px) scale(${STATE.zoom})`;
  }
}

function zoomBy(factor) {
  STATE.zoom = Math.max(0.6, Math.min(2.4, STATE.zoom * factor));
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
  const t = STATE.tokens[tokenId];
  if (!t) return;

  STATE.activeToken = tokenId;

  if (t.tripped) {
    STATE.lastRollHtml = `<span style="color:#f87171;">⚠️ <strong>${t.name} [${t.id}]</strong> tropezó y no puede moverse. Desbloquéalo en su botón inferior (<strong>⚠️ Tropezó</strong>) para arrastrarlo.</span>`;
    renderAll();
    return;
  }

  if (t.floor !== STATE.currentFloor && t.inStairs) {
    const entry = getTokenRenderCoords(t, STATE.currentFloor);
    t.floor = STATE.currentFloor;
    t.x = entry.x;
    t.y = entry.y;
    t.roomId = entry.roomId;
    const ro = getRoomById(STATE.currentFloor, entry.roomId);
    if (ro) t.roomName = ro.name;
  }

  document.getElementById('map-stage').classList.add('dragging-now');
  STATE.dragState = {
    tokenId,
    startX: t.x,
    startY: t.y,
    startRoom: t.roomId,
    hitWall: false,
    closedDoorName: null
  };
  renderSquadBar();
}

const vp = document.getElementById('map-viewport');

vp.addEventListener('mousedown', e => {
  if (e.target.closest('.char-token-svg') || e.target.closest('.door-interactive')) return;
  isPanning = true;
  vp.classList.add('panning');
  document.getElementById('map-stage').classList.add('dragging-now');
  startPanX = e.clientX - panX;
  startPanY = e.clientY - panY;
});

window.addEventListener('mousemove', e => {
  if (STATE.dragState) {
    const svgPt = clientToSVGCoords(e.clientX, e.clientY);
    const t = STATE.tokens[STATE.dragState.tokenId];
    if (t) {
      const res = moveTokenWithCollision(t, svgPt.x, svgPt.y);
      if (res.hitWall) STATE.dragState.hitWall = true;
      if (res.closedDoorName) STATE.dragState.closedDoorName = res.closedDoorName;
      STATE.selectedRoom = t.roomId;
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
  document.getElementById('map-stage').classList.remove('dragging-now');
  if (STATE.dragState) {
    const ds = STATE.dragState;
    const t = STATE.tokens[ds.tokenId];
    const distPx = Math.hypot(t.x - ds.startX, t.y - ds.startY);
    const distMeters = (distPx * 0.04).toFixed(1) + 'm';

    if (ds.closedDoorName && t.roomId === ds.startRoom) {
      STATE.lastRollHtml = `<span style="color:#f87171;">🔒 <strong>${ds.closedDoorName} está CERRADA:</strong> Toca el ícono <strong>🔒</strong> sobre la puerta (o su botón en el inspector) para abrirla antes de cruzar.</span>`;
    } else if (t.inStairs) {
      STATE.lastRollHtml = `<span style="color:#38bdf8;">🪜 <strong>${t.name} [${t.id}]</strong> está en la <strong>${t.roomName}</strong>. Cambia de pestaña de piso arriba para verlo en el otro nivel.</span>`;
    } else if (ds.hitWall && t.roomId === ds.startRoom) {
      STATE.lastRollHtml = `<span style="color:#fbbf24;">🧱 <strong>Muro sólido 3D:</strong> Dirige a <strong>${t.name}</strong> hacia una puerta abierta (<strong>🔓</strong>).</span>`;
    } else {
      STATE.lastRollHtml = `<span style="color:#34d399;">👣 <strong>${t.name} [${t.id}]</strong> se desplazó en <strong>${t.roomName}</strong> (${distMeters}).</span>`;
    }

    STATE.dragState = null;
    renderAll();
  }
  isPanning = false;
  initialPinchDist = null;
  vp.classList.remove('panning');
}

window.addEventListener('mouseup', finishTokenOrPan);

vp.addEventListener('touchstart', e => {
  if (e.target.closest('.char-token-svg') || e.target.closest('.door-interactive')) return;
  document.getElementById('map-stage').classList.add('dragging-now');
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
    const t = STATE.tokens[STATE.dragState.tokenId];
    if (t) {
      const res = moveTokenWithCollision(t, svgPt.x, svgPt.y);
      if (res.hitWall) STATE.dragState.hitWall = true;
      if (res.closedDoorName) STATE.dragState.closedDoorName = res.closedDoorName;
      STATE.selectedRoom = t.roomId;
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
    STATE.zoom = Math.max(0.6, Math.min(2.4, initialPinchZoom * (dist / initialPinchDist)));
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

window.addEventListener('DOMContentLoaded', renderAll);
