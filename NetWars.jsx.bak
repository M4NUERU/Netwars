import { useState, useEffect, useCallback } from "react";

// ─── CARD DATABASE (60 cartas) ────────────────────────────────────────────────
const CARD_DEFS = [
  // INFRAESTRUCTURA 35% → 21 cartas
  { id:"i1", type:"infrastructure", name:"Router OSPF", icon:"📡", count:4,
    effect:"Tus paquetes toman la ruta más eficiente. Los ataques de ruta no te afectan.",
    provides:["routing"],
    tech:"OSPF (Open Shortest Path First) es un protocolo de enrutamiento de estado de enlace. Usa el algoritmo de Dijkstra para calcular la ruta más corta; cada router mantiene una LSDB (Link State Database) sincronizada con sus vecinos." },
  { id:"i2", type:"infrastructure", name:"Firewall Nv.1", icon:"🔥", count:3,
    effect:"Protección básica: bloquea tráfico no autorizado por puerto/IP.",
    provides:["fw1"],
    tech:"Un firewall de primera generación filtra paquetes por reglas ACL (permit/deny) basadas en IP origen/destino y número de puerto TCP/UDP. No realiza inspección de estado (stateless)." },
  { id:"i3", type:"infrastructure", name:"Firewall Nv.2", icon:"🛡️", count:2,
    effect:"NGFW: bloquea DDoS, Port Scan y tráfico malicioso. Incluye inspección profunda.",
    provides:["fw1","fw2"],
    tech:"Un Next-Generation Firewall (NGFW) integra DPI (Deep Packet Inspection), IPS, control de aplicaciones (capa 7) y análisis de comportamiento. Puede identificar y bloquear ataques aunque usen puertos legítimos." },
  { id:"i4", type:"infrastructure", name:"VLAN", icon:"🔀", count:4,
    effect:"Segmenta tu red lógicamente. Bloquea ARP Spoofing automáticamente.",
    provides:["vlan"],
    tech:"Una VLAN (IEEE 802.1Q) divide el dominio de broadcast de un switch en segmentos lógicos independientes. Cada trama Ethernet recibe un tag de 12 bits (VLAN ID). Aísla tráfico entre departamentos sin hardware adicional." },
  { id:"i5", type:"infrastructure", name:"VPN Tunnel", icon:"🔒", count:3,
    effect:"Cifra todo tu tráfico. Ataques MITM y sniffing quedan inútiles.",
    provides:["vpn"],
    tech:"Una VPN crea un túnel cifrado usando IPSec (IKEv2) o TLS. IPSec opera en capa 3 y cifra cada paquete IP; el túnel garantiza confidencialidad, integridad (HMAC) y autenticación mutua mediante certificados X.509." },
  { id:"i6", type:"infrastructure", name:"Switch Gestionado", icon:"⚡", count:3,
    effect:"Restaura un servicio caído de inmediato con redundancia activa.",
    provides:["switch"],
    tech:"Un switch gestionado soporta 802.1Q (VLANs), STP/RSTP (evita bucles), Port Mirroring y SNMP para monitoreo. La redundancia con RSTP (IEEE 802.1w) conmuta en <1s vs. los 30-50s del STP clásico." },
  { id:"i7", type:"infrastructure", name:"Balanceador de Carga", icon:"⚖️", count:2,
    effect:"Distribuye tráfico. Los ataques necesitan 2 acciones para derribar tus servicios.",
    provides:["lb"],
    tech:"Un load balancer distribuye peticiones entre múltiples servidores (Round Robin, Least Connections, IP Hash). Implementa health checks para descartar nodos caídos y garantiza alta disponibilidad (HA) con failover automático." },

  // ATAQUE 30% → 18 cartas
  { id:"a1", type:"attack", name:"DDoS", icon:"💥", count:4,
    counters:["fw2"],
    effect:"Satura los recursos del objetivo y derriba un servicio. Bloqueado por Firewall Nv.2.",
    tech:"DDoS (Distributed Denial of Service): miles de bots (botnet) inundan el objetivo con tráfico UDP/ICMP o SYN floods. Agota ancho de banda o CPU. Se mitiga con rate limiting, scrubbing centers y Anycast routing." },
  { id:"a2", type:"attack", name:"ARP Spoofing", icon:"🎭", count:4,
    counters:["vlan","ids"],
    effect:"Suplanta identidad en capa 2. Derriba un servicio. Bloqueado por VLAN o IDS.",
    tech:"El atacante responde a peticiones ARP con su MAC, envenena la caché ARP de los hosts y redirige el tráfico por su interfaz. Ataque de capa 2 (Modelo OSI): funciona solo en segmentos de red local sin segmentación VLAN." },
  { id:"a3", type:"attack", name:"DNS Poisoning", icon:"☠️", count:3,
    counters:["acl","dmz"],
    effect:"Envenena el resolver DNS. Derriba el servicio DNS. Bloqueado por ACL o DMZ.",
    tech:"DNS Cache Poisoning: el atacante inyecta registros DNS falsos en el caché del resolver, redirigiendo usuarios a IPs maliciosas. Kaminsky Attack (2008) demostró que bastaban ~65 000 peticiones para envenenar un resolver sin DNSSEC." },
  { id:"a4", type:"attack", name:"MITM", icon:"👁️", count:3,
    counters:["vpn","ssl"],
    effect:"Intercepta comunicaciones. Derriba 2 servicios. Bloqueado por VPN o SSL/TLS.",
    tech:"Man-in-the-Middle: el atacante se interpone entre dos hosts usando ARP Spoofing, rogue AP o BGP hijacking. Puede leer, modificar o inyectar tráfico. TLS con certificate pinning y VPN IPSec previenen la interceptación." },
  { id:"a5", type:"attack", name:"Port Scan", icon:"🔍", count:2,
    counters:["fw2","honeypot"],
    effect:"Reconocimiento activo. Elimina una defensa del rival. Bloqueado por FW Nv.2 o Honeypot.",
    tech:"Nmap usa SYN Scan (half-open): envía SYN, si recibe SYN-ACK el puerto está abierto. También: UDP Scan, OS fingerprinting (TTL, Window Size), y Service Version Detection mediante banners de respuesta." },
  { id:"a6", type:"attack", name:"Ransomware", icon:"💀", count:2,
    counters:["ids","fw1"],
    effect:"Cifra todo. Derriba TODOS los servicios del objetivo. Bloqueado por IDS + Firewall.",
    tech:"El ransomware cifra archivos del sistema con AES-256 y exige rescate en criptomonedas. Se propaga por phishing, exploits de SMB (EternalBlue) o RDP expuesto. WannaCry (2017) afectó +200 000 sistemas en 150 países." },

  // DEFENSA 25% → 15 cartas
  { id:"d1", type:"defense", name:"IDS Activo", icon:"🚨", count:3,
    provides:["ids"],
    effect:"Detecta intrusos. Bloquea ARP Spoofing y Port Scan. Alerta al equipo.",
    tech:"IDS (Intrusion Detection System) analiza tráfico en tiempo real comparando contra firmas (Snort/Suricata) o baselines de comportamiento (anomalía). Un IPS (Intrusion Prevention System) añade bloqueo activo automático." },
  { id:"d2", type:"defense", name:"ACL Estricta", icon:"📋", count:3,
    provides:["acl"],
    effect:"Listas de control de acceso. Bloquea DNS Poisoning y filtra origen/destino.",
    tech:"Las ACL en routers Cisco definen reglas permit/deny por IP fuente/destino, protocolo y puerto (extended ACL). Se evalúan en orden; la primera coincidencia aplica. Una ACL implícita 'deny any' cierra el tráfico no listado." },
  { id:"d3", type:"defense", name:"Honeypot", icon:"🍯", count:3,
    provides:["honeypot"],
    effect:"Trampa activa. Bloquea Port Scan y revela las cartas del atacante.",
    tech:"Un honeypot simula vulnerabilidades reales para atraer atacantes. Tipos: low-interaction (emula servicios) y high-interaction (SO real). Permite recolectar TTPs (Tácticas, Técnicas y Procedimientos) sin riesgo para la red real." },
  { id:"d4", type:"defense", name:"DMZ", icon:"🏰", count:3,
    provides:["dmz"],
    effect:"Zona desmilitarizada. Bloquea DNS Poisoning y aisla servidores públicos.",
    tech:"La DMZ es una subred aislada entre dos firewalls: uno hacia Internet y otro hacia la red interna. Los servidores públicos (web, mail, DNS) residen en la DMZ; si son comprometidos, el firewall interno protege la red corporativa." },
  { id:"d5", type:"defense", name:"SSL/TLS", icon:"🔐", count:3,
    provides:["ssl"],
    effect:"Cifrado en tránsito. Bloquea MITM. Protege servicios Web y Mail.",
    tech:"TLS 1.3 (RFC 8446) realiza un handshake en 1-RTT: negocia claves con ECDHE (Perfect Forward Secrecy), autentica con certificados X.509 y cifra con AES-GCM o ChaCha20-Poly1305. HSTS fuerza HTTPS en navegadores." },

  // EVENTO 10% → 6 cartas
  { id:"e1", type:"event", name:"Caída ISP", icon:"🌩️", count:2,
    effect:"TODOS los jugadores pierden 1 servicio aleatorio este turno.",
    tech:"Un SLA (Service Level Agreement) con el ISP define el uptime garantizado (ej. 99.9% = 8.7h downtime/año). Las arquitecturas multi-homed con BGP sobre dos ISPs distintos garantizan continuidad ante fallos del proveedor." },
  { id:"e2", type:"event", name:"Auditoría", icon:"📊", count:2,
    effect:"Todos revelan sus defensas. El jugador con más defensas activas gana 1 acción extra.",
    tech:"Una auditoría de seguridad evalúa controles técnicos y organizativos según ISO 27001, NIST CSF o CIS Controls. El Red Team simula ataques reales; el Blue Team defiende. El Purple Team coordina y comparte aprendizajes." },
  { id:"e3", type:"event", name:"Apagón Total", icon:"⚫", count:2,
    effect:"Todos los jugadores pierden sus defensas activas hasta el próximo turno.",
    tech:"La resiliencia eléctrica en CPDs incluye: UPS (Uninterruptible Power Supply) para cortes de <15min, generadores diésel para cortes prolongados y sistemas de transferencia automática (ATS). Tier IV garantiza 99.995% uptime." },
];

// Expand to full deck
function buildDeck() {
  const cards = [];
  CARD_DEFS.forEach(def => {
    for (let i = 0; i < def.count; i++) {
      cards.push({ ...def, uid: `${def.id}_${i}` });
    }
  });
  return shuffle(cards);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const SERVICES = ["Web", "DNS", "Mail", "VoIP", "Base de Datos"];
const WIN_TURNS = 5;
const ZONE_COLORS = ["#00e87a", "#ff3d5a", "#4dabff", "#ffaa00"];
const ZONE_NAMES  = ["green", "red", "blue", "amber"];

// ─── STATE HELPERS ────────────────────────────────────────────────────────────
function makePlayer(id, name) {
  return {
    id, name,
    color: ZONE_COLORS[id],
    zoneName: ZONE_NAMES[id],
    hand: [],
    services: SERVICES.map(s => ({ name: s, up: true })),
    infra: [],      // active infrastructure tag strings
    defenses: [],   // active defense tag strings
    streak: 0,      // consecutive turns with all services up
  };
}

function clone(o) { return JSON.parse(JSON.stringify(o)); }

// ─── TYPE PALETTE ─────────────────────────────────────────────────────────────
const TYPE_COLOR = {
  infrastructure: "#4dabff",
  attack:         "#ff3d5a",
  defense:        "#00e87a",
  event:          "#ffaa00",
};
const TYPE_LABEL = {
  infrastructure: "INFRAEST.",
  attack:         "ATAQUE",
  defense:        "DEFENSA",
  event:          "EVENTO",
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow:wght@400;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .nw-root {
    min-height: 100vh;
    background: #080c10;
    color: #c8d8e8;
    font-family: 'Barlow', sans-serif;
    font-size: 14px;
    overflow: hidden;
  }

  .mono { font-family: 'Share Tech Mono', monospace; }

  /* ── MENU ── */
  .menu-wrap {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    background: radial-gradient(ellipse at 50% 40%, #00e87a0a 0%, transparent 70%);
  }
  .menu-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 52px;
    color: #00e87a;
    letter-spacing: 10px;
    text-shadow: 0 0 40px #00e87a55;
    line-height: 1;
  }
  .menu-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    letter-spacing: 6px;
    color: #4dabff;
    text-transform: uppercase;
  }
  .menu-desc { color: #5a7080; font-size: 13px; text-align: center; line-height: 1.8; }

  .btn-primary {
    background: transparent;
    border: 1.5px solid #00e87a;
    color: #00e87a;
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px;
    letter-spacing: 3px;
    padding: 12px 36px;
    cursor: pointer;
    transition: background .15s;
  }
  .btn-primary:hover { background: #00e87a18; }

  .btn-ghost {
    background: transparent;
    border: 1px solid #2a3a4a;
    color: #5a7080;
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    padding: 8px 20px;
    cursor: pointer;
  }
  .btn-ghost:hover { border-color: #5a7080; color: #c8d8e8; }

  /* ── SETUP ── */
  .setup-box {
    background: #0d1620;
    border: 1px solid #1a2a3a;
    border-radius: 10px;
    padding: 32px;
    width: 380px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .setup-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: #3a5060;
    text-transform: uppercase;
    margin-top: 4px;
  }
  .count-row { display: flex; gap: 10px; }
  .count-btn {
    width: 52px; height: 52px;
    background: #080c10;
    border: 1.5px solid #2a3a4a;
    color: #5a7080;
    font-family: 'Share Tech Mono', monospace;
    font-size: 20px;
    cursor: pointer;
    transition: all .15s;
  }
  .count-btn.active { border-color: #00e87a; color: #00e87a; }

  .name-input {
    width: 100%;
    background: #080c10;
    border: 1.5px solid;
    color: #c8d8e8;
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px;
    padding: 10px 14px;
    outline: none;
  }
  .name-input:focus { background: #0d1620; }

  /* ── GAME HEADER ── */
  .game-header {
    height: 46px;
    background: #0d1620;
    border-bottom: 1px solid #1a2a3a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    flex-shrink: 0;
  }
  .header-logo {
    font-family: 'Share Tech Mono', monospace;
    font-size: 16px;
    color: #00e87a;
    letter-spacing: 5px;
  }
  .header-info {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: #3a5060;
  }
  .header-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .action-pip {
    width: 10px; height: 10px;
    border-radius: 50%;
  }
  .action-pip.active { background: #00e87a; box-shadow: 0 0 6px #00e87a; }
  .action-pip.used   { background: #1a2a3a; }

  /* ── GAME BODY ── */
  .game-body {
    display: flex;
    height: calc(100vh - 46px);
    overflow: hidden;
  }

  /* ── BOARD ── */
  .board {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
    overflow: hidden;
  }
  .board-row {
    display: flex;
    gap: 16px;
    flex: 1;
    min-height: 0;
  }

  /* ── PLAYER ZONE ── */
  .zone {
    flex: 1;
    background: #0d1620;
    border: 1.5px solid #1a2a3a;
    border-radius: 8px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color .3s, box-shadow .3s;
    min-width: 0;
    overflow: hidden;
  }
  .zone.current {
    border-color: var(--zc);
    box-shadow: 0 0 18px color-mix(in srgb, var(--zc) 20%, transparent);
  }
  .zone-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .zone-name {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 2px;
    color: var(--zc);
    display: flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .zone-streak {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    color: #3a5060;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .zone-streak.hot { color: #ffaa00; }

  /* ── SERVICES ── */
  .services-row {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .svc {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    padding: 4px 7px;
    border-radius: 3px;
    border: 1px solid;
    letter-spacing: 0.5px;
    transition: all .2s;
  }
  .svc.up   { background:#00180d; border-color:#00e87a55; color:#00e87a; }
  .svc.down { background:#200010; border-color:#ff3d5a55; color:#ff3d5a; }
  .svc-dot  { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
  .svc.up   .svc-dot { background:#00e87a; }
  .svc.down .svc-dot { background:#ff3d5a; }

  /* ── ACTIVE TAGS ── */
  .tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    min-height: 20px;
  }
  .tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 8px;
    padding: 2px 6px;
    border-radius: 2px;
    letter-spacing: 0.5px;
    border: 1px solid;
  }
  .tag.infra   { background:#00102a; border-color:#4dabff44; color:#4dabff; }
  .tag.defense { background:#001008; border-color:#00e87a44; color:#00e87a; }

  /* ── ISP NODE ── */
  .isp-node {
    width: 68px; height: 68px;
    flex-shrink: 0;
    align-self: center;
    background: #0a1420;
    border: 1px solid #2a3a4a;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    gap: 2px;
  }
  .isp-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 7px;
    letter-spacing: 1px;
    color: #3a5060;
  }

  /* ── RIGHT PANEL ── */
  .right-panel {
    width: 288px;
    border-left: 1px solid #1a2a3a;
    background: #0d1620;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
  }
  .panel-section {
    border-bottom: 1px solid #1a2a3a;
    padding: 12px 14px;
  }
  .panel-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    color: #3a5060;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  /* ── HAND ── */
  .hand-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }
  .card-mini {
    width: 68px;
    min-height: 86px;
    background: #080c10;
    border: 1.5px solid;
    border-radius: 5px;
    padding: 7px 6px;
    cursor: pointer;
    transition: transform .15s, box-shadow .15s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
  }
  .card-mini:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,.5);
  }
  .card-mini.selected {
    transform: translateY(-8px) scale(1.06);
  }
  .card-icon   { font-size: 18px; }
  .card-name   { font-family: 'Share Tech Mono', monospace; font-size: 8px; text-align: center; line-height: 1.3; }
  .card-badge  { font-family: 'Share Tech Mono', monospace; font-size: 6px; letter-spacing: 1px; }

  /* ── END TURN BTN ── */
  .end-turn-btn {
    display: block;
    width: 100%;
    background: #001808;
    border: 1px solid #00e87a44;
    border-left: none; border-right: none;
    color: #00e87a;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    padding: 11px;
    cursor: pointer;
    transition: background .15s;
  }
  .end-turn-btn:hover { background: #002810; }
  .end-turn-btn:disabled { opacity: .35; cursor: default; }

  /* ── LOG ── */
  .log-wrap {
    flex: 1;
    overflow-y: auto;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .log-entry {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9.5px;
    color: #3a5060;
    line-height: 1.5;
    padding-bottom: 5px;
    border-bottom: 1px solid #111820;
  }
  .log-entry.fresh { color: #8a9aaa; }

  /* ── TOOLTIP ── */
  .tooltip-dock {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: #0d1620;
    border-top: 1.5px solid;
    padding: 14px 20px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
    z-index: 100;
    pointer-events: none;
  }
  .tooltip-left { flex-shrink: 0; }
  .tooltip-name { font-family:'Share Tech Mono',monospace; font-size:15px; font-weight:600; }
  .tooltip-type { font-family:'Share Tech Mono',monospace; font-size:9px; letter-spacing:2px; margin-top:2px; }
  .tooltip-effect { font-size:12px; color:#c8d8e8; margin-bottom:6px; line-height:1.5; }
  .tooltip-tech-label { font-family:'Share Tech Mono',monospace; font-size:9px; color:#4dabff; letter-spacing:1px; margin-bottom:3px; }
  .tooltip-tech { font-size:11px; color:#5a7080; line-height:1.6; }

  /* ── MODALS ── */
  .overlay {
    position: fixed; inset: 0;
    background: #000000cc;
    display: flex; align-items: center; justify-content: center;
    z-index: 200;
  }
  .modal {
    background: #0d1620;
    border: 1.5px solid #2a3a4a;
    border-radius: 10px;
    padding: 28px;
    min-width: 320px;
    max-width: 440px;
  }
  .modal-title {
    font-family:'Share Tech Mono',monospace;
    font-size:18px;
    margin-bottom:4px;
  }
  .modal-sub {
    font-size:12px; color:#5a7080; margin-bottom:18px;
  }
  .target-btn {
    display:flex; align-items:center; justify-content:space-between;
    width:100%;
    background:#080c10;
    border: 1.5px solid;
    color:#c8d8e8;
    padding: 11px 16px;
    cursor:pointer;
    font-family:'Share Tech Mono',monospace;
    font-size:12px;
    margin-bottom:8px;
    border-radius:4px;
    transition: background .1s;
  }
  .target-btn:hover { background:#0d1620; }
  .target-meta { font-size:10px; color:#3a5060; }

  /* ── TOAST ── */
  .toast {
    position: fixed;
    top: 58px; left: 50%; transform: translateX(-50%);
    padding: 9px 22px;
    border-radius: 4px;
    font-family:'Share Tech Mono',monospace;
    font-size:12px;
    letter-spacing:1px;
    z-index: 500;
    pointer-events:none;
  }
  .toast.ok      { background:#00e87a22; border:1px solid #00e87a66; color:#00e87a; }
  .toast.warn    { background:#ffaa0022; border:1px solid #ffaa0066; color:#ffaa00; }
  .toast.danger  { background:#ff3d5a22; border:1px solid #ff3d5a66; color:#ff3d5a; }

  /* ── GAME OVER ── */
  .gameover-wrap {
    min-height:100vh;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    gap:20px;
    background: radial-gradient(ellipse at 50% 40%, #ffaa0008 0%, transparent 60%);
  }
  .trophy { font-size:70px; animation: pulse 1.5s infinite alternate; }
  @keyframes pulse { from{transform:scale(1)} to{transform:scale(1.08)} }
  .gameover-name { font-family:'Share Tech Mono',monospace; font-size:36px; letter-spacing:6px; }
  .gameover-sub  { font-size:13px; color:#5a7080; text-align:center; line-height:1.8; }
`;

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function NetWars() {
  const [screen, setScreen]     = useState("menu");
  const [pCount, setPCount]     = useState(2);
  const [pNames, setPNames]     = useState(["Jugador 1","Jugador 2","Jugador 3","Jugador 4"]);
  const [game, setGame]         = useState(null);
  const [hovered, setHovered]   = useState(null);
  const [toast, setToast]       = useState(null);
  const [attackModal, setAttackModal] = useState(null);
  const [log, setLog]           = useState([]);

  const showToast = useCallback((msg, type="ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  }, []);

  const addLog = useCallback((msg) => {
    setLog(prev => [msg, ...prev].slice(0, 25));
  }, []);

  // ── START ──
  const startGame = () => {
    const players = Array.from({ length: pCount }, (_, i) =>
      makePlayer(i, pNames[i] || `Jugador ${i+1}`)
    );
    const deck = buildDeck();
    players.forEach(p => { p.hand = deck.splice(0, 5); });
    setGame({ players, deck, discard:[], currentIdx:0, actionsLeft:3, round:1, winner:null });
    setLog([`▶ Partida iniciada. Turno de ${players[0].name}`]);
    setScreen("game");
  };

  // ── END TURN ──
  const endTurn = () => {
    if (!game) return;
    setGame(prev => {
      const g = clone(prev);
      const cp = g.players[g.currentIdx];

      // Streak check
      const allUp = cp.services.every(s => s.up);
      cp.streak = allUp ? cp.streak + 1 : 0;
      if (cp.streak >= WIN_TURNS) {
        return { ...g, winner: g.currentIdx };
      }

      // Next player
      const nextIdx = (g.currentIdx + 1) % g.players.length;
      const np = g.players[nextIdx];

      // Draw 2
      for (let i = 0; i < 2; i++) {
        if (g.deck.length === 0) {
          g.deck = shuffle(g.discard);
          g.discard = [];
        }
        if (g.deck.length > 0) np.hand.push(g.deck.shift());
      }

      const newRound = g.round + (nextIdx === 0 ? 1 : 0);
      addLog(`▶ Ronda ${newRound} — turno de ${np.name}`);

      return { ...g, currentIdx: nextIdx, actionsLeft: 3, round: newRound };
    });
    setAttackModal(null);
  };

  useEffect(() => {
    if (game?.winner != null) setScreen("gameover");
  }, [game?.winner]);

  // ── PLAY CARD ──
  const playCard = (card, targetIdx = null) => {
    if (!game || game.actionsLeft <= 0) {
      showToast("¡Sin acciones disponibles!", "danger"); return;
    }
    if (card.type === "attack" && targetIdx === null) {
      const targets = game.players
        .map((p, i) => ({ ...p, idx: i }))
        .filter((_, i) => i !== game.currentIdx);
      setAttackModal({ card, targets });
      return;
    }

    setGame(prev => {
      const g = clone(prev);
      const cp = g.players[g.currentIdx];
      cp.hand = cp.hand.filter(c => c.uid !== card.uid);
      g.discard.push(card);
      g.actionsLeft -= 1;

      let msg = "";

      if (card.type === "infrastructure") {
        card.provides?.forEach(p => { if (!cp.infra.includes(p)) cp.infra.push(p); });
        if (card.provides?.includes("switch")) {
          const downed = cp.services.find(s => !s.up);
          if (downed) { downed.up = true; msg = `${cp.name} usó Switch → restauró ${downed.name}`; }
          else msg = `${cp.name} usó Switch → no había servicios caídos`;
        } else {
          msg = `${cp.name} instaló ${card.name}`;
        }
      }

      else if (card.type === "defense") {
        card.provides?.forEach(p => { if (!cp.defenses.includes(p)) cp.defenses.push(p); });
        msg = `${cp.name} activó ${card.name}`;
      }

      else if (card.type === "attack" && targetIdx !== null) {
        const target = g.players[targetIdx];
        const allDefs = [...target.infra, ...target.defenses];
        const blocked = card.counters?.some(c => allDefs.includes(c));

        if (blocked) {
          msg = `⚔ ${cp.name} → ${card.name} a ${target.name} — BLOQUEADO`;
          showToast(`¡Ataque bloqueado por ${target.name}!`, "warn");
        } else {
          const active = target.services.filter(s => s.up);
          let count = 1;
          if (card.name === "MITM") count = Math.min(2, active.length);
          if (card.name === "Ransomware") count = active.length;
          const hit = active.slice(0, count);
          hit.forEach(s => { s.up = false; });
          // Port Scan removes a defense
          if (card.name === "Port Scan" && target.defenses.length > 0) target.defenses.shift();
          msg = hit.length
            ? `⚔ ${cp.name} → ${card.name} a ${target.name} — ¡${hit.map(s=>s.name).join(", ")} CAÍDO!`
            : `⚔ ${cp.name} → ${card.name} a ${target.name} — sin servicios activos`;
        }
      }

      else if (card.type === "event") {
        if (card.name === "Caída ISP") {
          g.players.forEach(p => {
            const s = p.services.find(sv => sv.up);
            if (s) s.up = false;
          });
          msg = `🌩 EVENTO: Caída ISP — todos pierden 1 servicio`;
        } else if (card.name === "Apagón Total") {
          g.players.forEach(p => { p.defenses = []; });
          msg = `⚫ EVENTO: Apagón — todas las defensas eliminadas`;
        } else if (card.name === "Auditoría") {
          let best = g.players[0], bestN = 0;
          g.players.forEach(p => { if (p.defenses.length > bestN) { bestN = p.defenses.length; best = p; } });
          if (g.currentIdx === best.id) g.actionsLeft = Math.min(3, g.actionsLeft + 1);
          msg = `📊 EVENTO: Auditoría — ${best.name} tiene más defensas`;
        }
      }

      addLog(msg || `${cp.name} jugó ${card.name}`);
      return g;
    });

    setAttackModal(null);
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  if (screen === "menu") return (
    <div className="nw-root">
      <style>{CSS}</style>
      <div className="menu-wrap">
        <div className="menu-title mono">⚔ NETWARS</div>
        <div className="menu-sub">La Batalla por la Red</div>
        <div className="menu-desc">
          Juego estratégico de redes y ciberseguridad<br/>
          Protege tus servicios. Destruye los de tus rivales.
        </div>
        <button className="btn-primary" onClick={() => setScreen("setup")}>INICIAR PARTIDA</button>
      </div>
    </div>
  );

  if (screen === "setup") return (
    <div className="nw-root">
      <style>{CSS}</style>
      <div className="menu-wrap">
        <div className="menu-title mono" style={{fontSize:36}}>CONFIGURAR</div>
        <div className="setup-box">
          <div className="setup-label">Número de jugadores</div>
          <div className="count-row">
            {[2,3,4].map(n => (
              <button key={n} className={`count-btn${pCount===n?" active":""}`} onClick={() => setPCount(n)}>{n}</button>
            ))}
          </div>
          <div className="setup-label">Nombres</div>
          {Array.from({length: pCount}, (_,i) => (
            <input key={i} className="name-input"
              style={{borderColor: ZONE_COLORS[i]}}
              value={pNames[i]||""}
              placeholder={`Jugador ${i+1}`}
              onChange={e => { const n=[...pNames]; n[i]=e.target.value; setPNames(n); }}
            />
          ))}
          <button className="btn-primary" style={{marginTop:8}} onClick={startGame}>¡COMENZAR!</button>
          <button className="btn-ghost" onClick={() => setScreen("menu")}>← Volver</button>
        </div>
      </div>
    </div>
  );

  if (screen === "gameover" && game) {
    const w = game.players[game.winner ?? 0];
    return (
      <div className="nw-root">
        <style>{CSS}</style>
        <div className="gameover-wrap">
          <div className="trophy">🏆</div>
          <div className="gameover-name mono" style={{color: w.color}}>{w.name}</div>
          <div style={{fontFamily:"'Share Tech Mono',monospace", fontSize:13, color:"#4dabff", letterSpacing:2}}>VICTORIA</div>
          <div className="gameover-sub">
            Mantuvo los 5 servicios activos durante<br/>
            {WIN_TURNS} turnos consecutivos sin interrupciones.
          </div>
          <button className="btn-primary" onClick={() => { setGame(null); setScreen("menu"); }}>NUEVA PARTIDA</button>
        </div>
      </div>
    );
  }

  if (!game) return null;
  const cp = game.players[game.currentIdx];

  // Board layout: 2 rows
  const topRow    = game.players.slice(0, 2);
  const bottomRow = game.players.slice(2, 4);

  return (
    <div className="nw-root">
      <style>{CSS}</style>

      {/* HEADER */}
      <div className="game-header">
        <span className="header-logo">⚔ NETWARS</span>
        <span className="header-info">
          RONDA {game.round} &nbsp;|&nbsp; {cp.name.toUpperCase()}
        </span>
        <div className="header-actions">
          <span className="header-info" style={{marginRight:6}}>ACCIONES</span>
          {[0,1,2].map(i => (
            <div key={i} className={`action-pip ${i < game.actionsLeft ? "active" : "used"}`}/>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="game-body">

        {/* BOARD */}
        <div className="board">
          {/* Top row */}
          <div className="board-row">
            {topRow.map((p, i) => (
              <PlayerZone key={p.id} player={p} isCurrent={p.id === game.currentIdx} />
            ))}
            {/* ISP in center when 3–4 players */}
            {game.players.length >= 3 && (
              <div className="isp-node">
                <span>🌐</span>
                <span className="isp-label">ISP</span>
              </div>
            )}
          </div>

          {/* Bottom row (only if 3–4 players) */}
          {bottomRow.length > 0 && (
            <div className="board-row">
              {bottomRow.map(p => (
                <PlayerZone key={p.id} player={p} isCurrent={p.id === game.currentIdx} />
              ))}
              {/* Spacer to align under ISP */}
              <div style={{width:68, flexShrink:0}} />
            </div>
          )}

          {/* ISP for 2-player (between zones) */}
          {game.players.length === 2 && (
            <div style={{display:"flex", justifyContent:"center"}}>
              <div className="isp-node">
                <span>🌐</span>
                <span className="isp-label">ISP CENTRAL</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          {/* HAND */}
          <div className="panel-section">
            <div className="panel-title">🃏 mano de {cp.name}</div>
            <div className="hand-wrap">
              {cp.hand.map(card => (
                <div
                  key={card.uid}
                  className="card-mini"
                  style={{ borderColor: TYPE_COLOR[card.type], boxShadow: `0 0 10px ${TYPE_COLOR[card.type]}22` }}
                  onClick={() => playCard(card)}
                  onMouseEnter={() => setHovered(card)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="card-icon">{card.icon}</span>
                  <span className="card-name mono" style={{color: TYPE_COLOR[card.type]}}>{card.name}</span>
                  <span className="card-badge mono" style={{color: TYPE_COLOR[card.type]+"99"}}>{TYPE_LABEL[card.type]}</span>
                </div>
              ))}
              {cp.hand.length === 0 && (
                <span style={{fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:"#2a3a4a"}}>MANO VACÍA</span>
              )}
            </div>
          </div>

          {/* END TURN */}
          <button className="end-turn-btn" onClick={endTurn}>
            PASAR TURNO →
          </button>

          {/* LEGEND */}
          <div className="panel-section">
            <div className="panel-title">leyenda</div>
            <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
              {Object.entries(TYPE_COLOR).map(([t, c]) => (
                <div key={t} style={{display:"flex", alignItems:"center", gap:5}}>
                  <div style={{width:8, height:8, borderRadius:2, background:c}}/>
                  <span style={{fontFamily:"'Share Tech Mono',monospace", fontSize:8, color:"#3a5060"}}>{TYPE_LABEL[t]}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:10, fontFamily:"'Share Tech Mono',monospace", fontSize:8, color:"#2a3a4a", lineHeight:1.8}}>
              🎯 Clic en carta = jugar<br/>
              🖱 Hover = ficha técnica<br/>
              🔥 Meta: {WIN_TURNS} turnos con todos los servicios activos
            </div>
          </div>

          {/* LOG */}
          <div style={{flex:1, overflow:"hidden", display:"flex", flexDirection:"column"}}>
            <div style={{padding:"10px 14px 4px", borderTop:"1px solid #1a2a3a"}}>
              <div className="panel-title">📡 log de eventos</div>
            </div>
            <div className="log-wrap">
              {log.map((entry, i) => (
                <div key={i} className={`log-entry${i===0?" fresh":""}`}>{entry}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TOOLTIP DOCK */}
      {hovered && (
        <div className="tooltip-dock" style={{borderColor: TYPE_COLOR[hovered.type]}}>
          <div className="tooltip-left">
            <div style={{fontSize:30}}>{hovered.icon}</div>
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div className="tooltip-name mono" style={{color: TYPE_COLOR[hovered.type]}}>{hovered.name}</div>
            <div className="tooltip-type mono" style={{color: TYPE_COLOR[hovered.type]+"88"}}>{TYPE_LABEL[hovered.type]}</div>
            <div style={{marginTop:8}}>
              <div className="tooltip-effect">{hovered.effect}</div>
              <div className="tooltip-tech-label">FICHA TÉCNICA</div>
              <div className="tooltip-tech">{hovered.tech}</div>
            </div>
          </div>
        </div>
      )}

      {/* ATTACK TARGET MODAL */}
      {attackModal && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-title" style={{color: TYPE_COLOR.attack}}>
              {attackModal.card.icon} {attackModal.card.name}
            </div>
            <div className="modal-sub">{attackModal.card.effect}</div>
            <div style={{fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:"#3a5060", marginBottom:14, letterSpacing:1}}>
              SELECCIONA EL OBJETIVO:
            </div>
            {attackModal.targets.map(t => (
              <button key={t.id} className="target-btn" style={{borderColor: t.color}}
                onClick={() => playCard(attackModal.card, t.id)}>
                <span style={{color: t.color}}>◆ {t.name}</span>
                <span className="target-meta">
                  {t.services.filter(s=>s.up).length}/5 activos &nbsp;
                  🛡{t.defenses.length}
                </span>
              </button>
            ))}
            <button className="btn-ghost" style={{width:"100%", marginTop:4}}
              onClick={() => setAttackModal(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}

// ─── PLAYER ZONE COMPONENT ───────────────────────────────────────────────────
function PlayerZone({ player, isCurrent }) {
  const upCount = player.services.filter(s => s.up).length;
  return (
    <div
      className={`zone${isCurrent ? " current" : ""}`}
      style={{ "--zc": player.color }}
    >
      <div className="zone-header">
        <div className="zone-name mono">
          {isCurrent && <span style={{color: player.color}}>▶</span>}
          {player.name.toUpperCase()}
        </div>
        <div className={`zone-streak mono${player.streak > 0 ? " hot" : ""}`}>
          🔥 {player.streak}/{WIN_TURNS}
        </div>
      </div>

      {/* Services */}
      <div className="services-row">
        {player.services.map(svc => (
          <div key={svc.name} className={`svc ${svc.up ? "up" : "down"}`}>
            <div className="svc-dot" />
            {svc.name}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        height: 3, background:"#111820", borderRadius: 2, overflow:"hidden"
      }}>
        <div style={{
          height:"100%", width:`${upCount/5*100}%`,
          background: player.color,
          transition:"width .3s",
          borderRadius:2,
          opacity: 0.7
        }}/>
      </div>

      {/* Active tags */}
      <div className="tags-row">
        {player.infra.map((t, i) => (
          <span key={i} className="tag infra">{t}</span>
        ))}
        {player.defenses.map((t, i) => (
          <span key={i} className="tag defense">{t}</span>
        ))}
      </div>
    </div>
  );
}
