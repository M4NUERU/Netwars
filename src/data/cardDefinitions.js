// ─── CARD DATABASE (60 cartas) ────────────────────────────────────────────────
export const CARD_DEFS = [
    // INFRAESTRUCTURA 35% → 21 cartas
    {
        id: "i1", type: "infrastructure", name: "Router OSPF", icon: "📡", count: 4,
        effect: "Tus paquetes toman la ruta más eficiente. Los ataques de ruta no te afectan.",
        provides: ["routing"],
        tech: "OSPF (Open Shortest Path First) es un protocolo de enrutamiento de estado de enlace. Usa el algoritmo de Dijkstra para calcular la ruta más corta; cada router mantiene una LSDB (Link State Database) sincronizada con sus vecinos."
    },
    {
        id: "i2", type: "infrastructure", name: "Firewall Nv.1", icon: "🔥", count: 3,
        effect: "Protección básica: bloquea tráfico no autorizado por puerto/IP.",
        provides: ["fw1"],
        tech: "Un firewall de primera generación filtra paquetes por reglas ACL (permit/deny) basadas en IP origen/destino y número de puerto TCP/UDP. No realiza inspección de estado (stateless)."
    },
    {
        id: "i3", type: "infrastructure", name: "Firewall Nv.2", icon: "🛡️", count: 2,
        effect: "NGFW: bloquea DDoS, Port Scan y tráfico malicioso. Incluye inspección profunda.",
        provides: ["fw1", "fw2"],
        tech: "Un Next-Generation Firewall (NGFW) integra DPI (Deep Packet Inspection), IPS, control de aplicaciones (capa 7) y análisis de comportamiento. Puede identificar y bloquear ataques aunque usen puertos legítimos."
    },
    {
        id: "i4", type: "infrastructure", name: "VLAN", icon: "🔀", count: 4,
        effect: "Segmenta tu red lógicamente. Bloquea ARP Spoofing automáticamente.",
        provides: ["vlan"],
        tech: "Una VLAN (IEEE 802.1Q) divide el dominio de broadcast de un switch en segmentos lógicos independientes. Cada trama Ethernet recibe un tag de 12 bits (VLAN ID). Aísla tráfico entre departamentos sin hardware adicional."
    },
    {
        id: "i5", type: "infrastructure", name: "VPN Tunnel", icon: "🔒", count: 3,
        effect: "Cifra todo tu tráfico. Ataques MITM y sniffing quedan inútiles.",
        provides: ["vpn"],
        tech: "Una VPN crea un túnel cifrado usando IPSec (IKEv2) o TLS. IPSec opera en capa 3 y cifra cada paquete IP; el túnel garantiza confidencialidad, integridad (HMAC) y autenticación mutua mediante certificados X.509."
    },
    {
        id: "i6", type: "infrastructure", name: "Switch Gestionado", icon: "⚡", count: 3,
        effect: "Restaura un servicio caído de inmediato con redundancia activa.",
        provides: ["switch"],
        tech: "Un switch gestionado soporta 802.1Q (VLANs), STP/RSTP (evita bucles), Port Mirroring y SNMP para monitoreo. La redundancia con RSTP (IEEE 802.1w) conmuta en <1s vs. los 30-50s del STP clásico."
    },
    {
        id: "i7", type: "infrastructure", name: "Balanceador de Carga", icon: "⚖️", count: 2,
        effect: "Distribuye tráfico. Los ataques necesitan 2 acciones para derribar tus servicios.",
        provides: ["lb"],
        tech: "Un load balancer distribuye peticiones entre múltiples servidores (Round Robin, Least Connections, IP Hash). Implementa health checks para descartar nodos caídos y garantiza alta disponibilidad (HA) con failover automático."
    },

    // ATAQUE 30% → 18 cartas
    {
        id: "a1", type: "attack", name: "DDoS", icon: "💥", count: 4,
        counters: ["fw2"],
        effect: "Satura los recursos del objetivo y derriba un servicio. Bloqueado por Firewall Nv.2.",
        tech: "DDoS (Distributed Denial of Service): miles de bots (botnet) inundan el objetivo con tráfico UDP/ICMP o SYN floods. Agota ancho de banda o CPU. Se mitiga con rate limiting, scrubbing centers y Anycast routing."
    },
    {
        id: "a2", type: "attack", name: "ARP Spoofing", icon: "🎭", count: 4,
        counters: ["vlan", "ids"],
        effect: "Suplanta identidad en capa 2. Derriba un servicio. Bloqueado por VLAN o IDS.",
        tech: "El atacante responde a peticiones ARP con su MAC, envenena la caché ARP de los hosts y redirige el tráfico por su interfaz. Ataque de capa 2 (Modelo OSI): funciona solo en segmentos de red local sin segmentación VLAN."
    },
    {
        id: "a3", type: "attack", name: "DNS Poisoning", icon: "☠️", count: 3,
        counters: ["acl", "dmz"],
        effect: "Envenena el resolver DNS. Derriba el servicio DNS. Bloqueado por ACL o DMZ.",
        tech: "DNS Cache Poisoning: el atacante inyecta registros DNS falsos en el caché del resolver, redirigiendo usuarios a IPs maliciosas. Kaminsky Attack (2008) demostró que bastaban ~65 000 peticiones para envenenar un resolver sin DNSSEC."
    },
    {
        id: "a4", type: "attack", name: "MITM", icon: "👁️", count: 3,
        counters: ["vpn", "ssl"],
        effect: "Intercepta comunicaciones. Derriba 2 servicios. Bloqueado por VPN o SSL/TLS.",
        tech: "Man-in-the-Middle: el atacante se interpone entre dos hosts usando ARP Spoofing, rogue AP o BGP hijacking. Puede leer, modificar o inyectar tráfico. TLS con certificate pinning y VPN IPSec previenen la interceptación."
    },
    {
        id: "a5", type: "attack", name: "Port Scan", icon: "🔍", count: 2,
        counters: ["fw2", "honeypot"],
        effect: "Reconocimiento activo. Elimina una defensa del rival. Bloqueado por FW Nv.2 o Honeypot.",
        tech: "Nmap usa SYN Scan (half-open): envía SYN, si recibe SYN-ACK el puerto está abierto. También: UDP Scan, OS fingerprinting (TTL, Window Size), y Service Version Detection mediante banners de respuesta."
    },
    {
        id: "a6", type: "attack", name: "Ransomware", icon: "💀", count: 2,
        counters: ["ids", "fw1"],
        effect: "Cifra todo. Derriba TODOS los servicios del objetivo. Bloqueado por IDS + Firewall.",
        tech: "El ransomware cifra archivos del sistema con AES-256 y exige rescate en criptomonedas. Se propaga por phishing, exploits de SMB (EternalBlue) o RDP expuesto. WannaCry (2017) afectó +200 000 sistemas en 150 países."
    },

    // DEFENSA 25% → 15 cartas
    {
        id: "d1", type: "defense", name: "IDS Activo", icon: "🚨", count: 3,
        provides: ["ids"],
        effect: "Detecta intrusos. Bloquea ARP Spoofing y Port Scan. Alerta al equipo.",
        tech: "IDS (Intrusion Detection System) analiza tráfico en tiempo real comparando contra firmas (Snort/Suricata) o baselines de comportamiento (anomalía). Un IPS (Intrusion Prevention System) añade bloqueo activo automático."
    },
    {
        id: "d2", type: "defense", name: "ACL Estricta", icon: "📋", count: 3,
        provides: ["acl"],
        effect: "Listas de control de acceso. Bloquea DNS Poisoning y filtra origen/destino.",
        tech: "Las ACL en routers Cisco definen reglas permit/deny por IP fuente/destino, protocolo y puerto (extended ACL). Se evalúan en orden; la primera coincidencia aplica. Una ACL implícita 'deny any' cierra el tráfico no listado."
    },
    {
        id: "d3", type: "defense", name: "Honeypot", icon: "🍯", count: 3,
        provides: ["honeypot"],
        effect: "Trampa activa. Bloquea Port Scan y revela las cartas del atacante.",
        tech: "Un honeypot simula vulnerabilidades reales para atraer atacantes. Tipos: low-interaction (emula servicios) y high-interaction (SO real). Permite recolectar TTPs (Tácticas, Técnicas y Procedimientos) sin riesgo para la red real."
    },
    {
        id: "d4", type: "defense", name: "DMZ", icon: "🏰", count: 3,
        provides: ["dmz"],
        effect: "Zona desmilitarizada. Bloquea DNS Poisoning y aisla servidores públicos.",
        tech: "La DMZ es una subred aislada entre dos firewalls: uno hacia Internet y otro hacia la red interna. Los servidores públicos (web, mail, DNS) residen en la DMZ; si son comprometidos, el firewall interno protege la red corporativa."
    },
    {
        id: "d5", type: "defense", name: "SSL/TLS", icon: "🔐", count: 3,
        provides: ["ssl"],
        effect: "Cifrado en tránsito. Bloquea MITM. Protege servicios Web y Mail.",
        tech: "TLS 1.3 (RFC 8446) realiza un handshake en 1-RTT: negocia claves con ECDHE (Perfect Forward Secrecy), autentica con certificados X.509 y cifra con AES-GCM o ChaCha20-Poly1305. HSTS fuerza HTTPS en navegadores."
    },

    // EVENTO 10% → 6 cartas
    {
        id: "e1", type: "event", name: "Caída ISP", icon: "🌩️", count: 2,
        effect: "TODOS los jugadores pierden 1 servicio aleatorio este turno.",
        tech: "Un SLA (Service Level Agreement) con el ISP define el uptime garantizado (ej. 99.9% = 8.7h downtime/año). Las arquitecturas multi-homed con BGP sobre dos ISPs distintos garantizan continuidad ante fallos del proveedor."
    },
    {
        id: "e2", type: "event", name: "Auditoría", icon: "📊", count: 2,
        effect: "Todos revelan sus defensas. El jugador con más defensas activas gana 1 acción extra.",
        tech: "Una auditoría de seguridad evalúa controles técnicos y organizativos según ISO 27001, NIST CSF o CIS Controls. El Red Team simula ataques reales; el Blue Team defiende. El Purple Team coordina y comparte aprendizajes."
    },
    {
        id: "e3", type: "event", name: "Apagón Total", icon: "⚫", count: 2,
        effect: "Todos los jugadores pierden sus defensas activas hasta el próximo turno.",
        tech: "La resiliencia eléctrica en CPDs incluye: UPS (Uninterruptible Power Supply) para cortes de <15min, generadores diésel para cortes prolongados y sistemas de transferencia automática (ATS). Tier IV garantiza 99.995% uptime."
    },
];

// ─── DECK UTILITIES ───────────────────────────────────────────────────────────
export function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function buildDeck() {
    const cards = [];
    CARD_DEFS.forEach(def => {
        for (let i = 0; i < def.count; i++) {
            cards.push({ ...def, uid: `${def.id}_${i}` });
        }
    });
    return shuffle(cards);
}
