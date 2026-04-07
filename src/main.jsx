import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Global styles
import "./styles/global.css";
import "./styles/animations.css";
import "./styles/menu.css";
import "./styles/game.css";
import "./styles/panel.css";
import "./styles/overlays.css";

import NetWars from "./NetWars";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NetWars />
  </StrictMode>
);
