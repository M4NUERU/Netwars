# ⚔ NetWars

Juego de cartas multijugador local de **ciberseguridad**, con interfaz 3D renderizada en el navegador.

Cada jugador gestiona su infraestructura de red, despliega defensas y lanza ataques contra los demás. El objetivo es mantener todos tus servicios operativos durante **5 turnos consecutivos**.

## 🎮 Cómo jugar

1. Selecciona 2-4 jugadores y asigna nombres
2. Cada turno tienes **3 acciones** para jugar cartas de tu mano
3. Tipos de carta:
   - **Infraestructura** — Instala servidores, switches, routers
   - **Defensa** — Firewalls, IDS, cifrado para proteger tus servicios
   - **Ataque** — DDoS, Ransomware, MITM contra otros jugadores
   - **Evento** — Afectan a todos los jugadores (Caída ISP, Apagón, Auditoría)
4. Ganas manteniendo todos tus servicios arriba por 5 rondas seguidas

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/M4NUERU/Netwars.git
cd Netwars

# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev
```

El juego se abrirá en `http://localhost:5173`.

## 🛠 Stack tecnológico

| Tecnología | Uso |
|---|---|
| [React 19](https://react.dev) | UI y lógica de componentes |
| [Three.js](https://threejs.org) + [React Three Fiber](https://r3f.docs.pmnd.rs) | Renderizado 3D de cartas y escena |
| [React Spring](https://www.react-spring.dev) | Animaciones fluidas |
| [Vite](https://vite.dev) | Build tool y dev server |

## 📁 Estructura del proyecto

```
src/
├── main.jsx                  # Entry point
├── NetWars.jsx               # Componente raíz (router de pantallas)
├── components/
│   ├── screens/              # MenuScreen, SetupScreen, GameOverScreen
│   ├── game/                 # RightPanel (mano, log, controles)
│   ├── game3d/               # GameScene3D, Hand3D, cartas en 3D
│   └── ui/                   # Toast, TooltipDock, AttackModal, NetworkBackground
├── logic/
│   └── gameEngine.js         # Motor de juego puro (sin side effects)
├── constants/
│   └── gameConstants.js      # Servicios, colores, configuración
├── data/
│   └── cardDefinitions.js    # Deck de cartas con efectos
├── hooks/
│   └── useGameState.js       # Estado global del juego
└── styles/
    ├── global.css            # Variables, reset, layout
    └── panel.css             # Estilos del panel lateral
```

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Análisis estático con ESLint |

## 📄 Licencia

MIT — [M4NUERU](https://github.com/M4NUERU)
