# ⚔ NetWars

Juego de cartas estratégico de **ciberseguridad**, con un espectacular tablero 3D interactivo en el navegador y sincronización multijugador online en tiempo real.

Cada jugador gestiona su propia infraestructura de red, despliega gateways y firewalls de defensa, y lanza ataques ofensivos avanzados contra sus rivales. El objetivo es mantener todos tus servicios críticos operativos durante **3 turnos consecutivos**.

---

## 🎮 Modos de Juego

1. **Partida Local (PVP):** Juega en la misma computadora por turnos pasando el control.
2. **Multijugador Online (Real-Time):** Crea una sala virtual en la nube (recibiendo un código de acceso único de 4 letras) y permite que otros jugadores se conecten desde sus propios dispositivos (móviles, laptops, tablets) compartiendo la partida en tiempo real. ¡Funciona de forma automática en Vercel sin configuraciones complejas!

---

## ⚔ Cómo jugar

1. Elige tu alias de combate e ingresa al campo.
2. Cada turno dispones de **2 acciones** para jugar cartas de tu mano.
3. Tipos de carta:
   - **Infraestructura (Cian):** Instala servidores, switches, routers para restaurar servicios.
   - **Defensa (Ámbar):** Firewalls, VPNs, IDSs, cifrado SSL/TLS para blindar tus sistemas.
   - **Ataque (Rojo):** DDoS, Ransomware, MITM, Port Scans para botar los servicios del rival.
   - **Evento (Gris):** Afectan a toda la red global (Apagones, Caídas de ISP, Auditorías).
4. **Condición de Victoria:** Mantener el 100% de tus servicios activos (`UP`) durante 3 turnos seguidos.

---

## 🚀 Características Premium e Interactivas

* **Tablero 3D Interactivo:** Cartas tridimensionales animadas con físicas, rotaciones por gravedad y efectos de flotabilidad en la mesa.
* **Escritorio de Caoba:** El campo de batalla se asienta sobre un elegante escritorio con textura procedural de madera de caoba de alta resolución generada mediante código.
* **Teclado Mecánico RGB + CORE.SYS:** Reemplazando el viejo nodo central, el tablero cuenta con un teclado mecánico tridimensional hiperrealista con base emisora RGB de neón cian, teclas individuales coloreadas bajo la temática del juego, y un holograma flotante del procesador cuántico `CORE.SYS` orbitando en la mesa.
* **Consolas de Monitoreo HUD Cyberpunk:** Monitores virtuales tácticos para los oponentes que proyectan en 3D un canvas de integridad de red, servicios activos y defensas perimetrales en tiempo real.
* **Cámara de Zoom Cinemático:** ¡Haz clic en el monitor de cualquier oponente para volar la cámara en una suave transición de zoom! Te permite inspeccionar al detalle las capas de red y defensas enemigas. Pulsa la interfaz flotante o el monitor de nuevo para regresar al tablero aéreo.
* **Fondo "Hacker's Den" 3D:** El escenario se asienta en la habitación de un hacker, rodeada por luces LED de neón verticales (Cian, Rosa, Naranja y Verde) y una pantalla holográfica gigante que despliega un flujo de datos binarios y logs del sistema en la distancia.
* **Audio Sintetizado Retro-Cyberpunk (Nativo):** Efectos de sonido generados a través de la Web Audio API (alarmas de caída de servicios, ruidos de barrido en ataques y arpegios de restauración) sin consumo de archivos pesados.
* **Lobbies Online Sincronizados (Zero-Config):** Sincronización en la nube con Supabase Realtime a través de WebSockets en milisegundos. ¡Incluye credenciales fallback integradas para despliegue inmediato en Vercel!

---

## 🛠️ Instalación y Configuración

```bash
# 1. Clonar el repositorio
git clone https://github.com/M4NUERU/Netwars.git
cd Netwars

# 2. Instalar dependencias (incluyendo el SDK de Supabase)
npm install

# 3. Iniciar servidor de desarrollo local
npm run dev
```

El juego se abrirá en `http://localhost:5173`. Para jugarlo en tu red local con otros dispositivos, expón el host ejecutando: `npm run dev -- --host` y accede mediante la IP local de tu PC.

---

## ⚡ Stack Tecnológico

| Tecnología | Propósito |
|---|---|
| [React 19](https://react.dev) | UI y gestión de estado reactiva |
| [Three.js](https://threejs.org) + [React Three Fiber](https://r3f.docs.pmnd.rs) | Renderizado y simulación 3D de la mesa de red |
| [Supabase](https://supabase.com) | Base de datos PostgreSQL y sincronización en tiempo real vía WebSockets |
| [React Spring](https://www.react-spring.dev) | Animaciones de físicas tridimensionales fluidas |
| [Vite](https://vite.dev) | Compilación ultrarrápida y Hot Module Replacement (HMR) |

---

## 📂 Estructura del Proyecto

```
src/
├── main.jsx                  # Punto de entrada de la aplicación
├── NetWars.jsx               # Enrutador de pantallas y estado base
├── components/
│   ├── screens/              # MenuScreen (Lobbies), SetupScreen, GameOverScreen
│   ├── game/                 # Componentes 2D laterales (mano, logs)
│   ├── game3d/               # GameScene3D, Board3D, PlayerZone3D, MonitorScreenUI
│   └── ui/                   # AttackModal, Toast, RulesModal, TooltipDock
├── logic/
│   ├── gameEngine.js         # Motor lógico de juego (funcional puro)
│   ├── audio.js              # Sintetizador nativo de efectos de sonido
│   └── supabaseClient.js     # Cliente de comunicación con Supabase
├── constants/
│   └── gameConstants.js      # Servicios, colores, constantes de balance
├── data/
│   └── cardDefinitions.js    # Deck de cartas y efectos
├── hooks/
│   └── useGameState.js       # Estado global y sincronización con Supabase Realtime
└── styles/
    ├── global.css            # Estilos base y variables CSS
    └── game.css              # Estilos visuales del tablero y paneles
```

---

## 📜 Licencia

MIT — [M4NUERU](https://github.com/M4NUERU)
