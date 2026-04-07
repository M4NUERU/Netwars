import { SERVICES, WIN_TURNS, ZONE_COLORS, ZONE_NAMES } from "../constants/gameConstants";
import { shuffle } from "../data/cardDefinitions";

// ─── UTILITIES ────────────────────────────────────────────────────────────────
export function clone(o) {
    return JSON.parse(JSON.stringify(o));
}

// ─── PLAYER FACTORY ───────────────────────────────────────────────────────────
export function makePlayer(id, name) {
    return {
        id,
        name,
        color: ZONE_COLORS[id],
        zoneName: ZONE_NAMES[id],
        hand: [],
        services: SERVICES.map(s => ({ name: s, up: true })),
        infra: [],
        defenses: [],
        streak: 0,
    };
}

// ─── CARD EFFECT HANDLERS ─────────────────────────────────────────────────────
// Each returns { gameState, logMessage, blocked? }
// All operate on a pre-cloned game state (no mutation of original).

export function applyInfrastructureCard(gameState, card) {
    const g = gameState;
    const cp = g.players[g.currentIdx];

    card.provides?.forEach(p => {
        if (!cp.infra.includes(p)) cp.infra.push(p);
    });

    let logMessage;
    if (card.provides?.includes("switch")) {
        const downed = cp.services.find(s => !s.up);
        if (downed) {
            downed.up = true;
            logMessage = `${cp.name} usó Switch → restauró ${downed.name}`;
        } else {
            logMessage = `${cp.name} usó Switch → no había servicios caídos`;
        }
    } else {
        logMessage = `${cp.name} instaló ${card.name}`;
    }

    return { gameState: g, logMessage };
}

export function applyDefenseCard(gameState, card) {
    const g = gameState;
    const cp = g.players[g.currentIdx];

    card.provides?.forEach(p => {
        if (!cp.defenses.includes(p)) cp.defenses.push(p);
    });

    return {
        gameState: g,
        logMessage: `${cp.name} activó ${card.name}`,
    };
}

export function applyAttackCard(gameState, card, targetIdx) {
    const g = gameState;
    const cp = g.players[g.currentIdx];
    const target = g.players[targetIdx];
    const allDefs = [...target.infra, ...target.defenses];
    const blocked = card.counters?.some(c => allDefs.includes(c));

    if (blocked) {
        return {
            gameState: g,
            logMessage: `⚔ ${cp.name} → ${card.name} a ${target.name} — BLOQUEADO`,
            blocked: true,
        };
    }

    const active = target.services.filter(s => s.up);
    let count = 1;
    if (card.name === "MITM") count = Math.min(2, active.length);
    if (card.name === "Ransomware") count = active.length;

    const hit = active.slice(0, count);
    hit.forEach(s => { s.up = false; });

    // Port Scan removes a defense
    if (card.name === "Port Scan" && target.defenses.length > 0) {
        target.defenses.shift();
    }

    const logMessage = hit.length
        ? `⚔ ${cp.name} → ${card.name} a ${target.name} — ¡${hit.map(s => s.name).join(", ")} CAÍDO!`
        : `⚔ ${cp.name} → ${card.name} a ${target.name} — sin servicios activos`;

    return { gameState: g, logMessage, blocked: false };
}

export function applyEventCard(gameState, card) {
    const g = gameState;
    let logMessage;

    if (card.name === "Caída ISP") {
        g.players.forEach(p => {
            const s = p.services.find(sv => sv.up);
            if (s) s.up = false;
        });
        logMessage = `🌩 EVENTO: Caída ISP — todos pierden 1 servicio`;
    } else if (card.name === "Apagón Total") {
        g.players.forEach(p => { p.defenses = []; });
        logMessage = `⚫ EVENTO: Apagón — todas las defensas eliminadas`;
    } else if (card.name === "Auditoría") {
        let best = g.players[0];
        let bestN = 0;
        g.players.forEach(p => {
            if (p.defenses.length > bestN) {
                bestN = p.defenses.length;
                best = p;
            }
        });
        if (g.currentIdx === best.id) {
            g.actionsLeft = Math.min(3, g.actionsLeft + 1);
        }
        logMessage = `📊 EVENTO: Auditoría — ${best.name} tiene más defensas`;
    }

    return { gameState: g, logMessage };
}

// ─── PLAY CARD ORCHESTRATOR ───────────────────────────────────────────────────
// Returns { gameState, logMessage, blocked?, needsTarget? }
export function processPlayCard(gameState, card, targetIdx = null) {
    const g = clone(gameState);
    const cp = g.players[g.currentIdx];

    // Attack needs a target — signal the UI to show modal
    if (card.type === "attack" && targetIdx === null) {
        return { gameState: g, needsTarget: true };
    }

    // Remove card from hand, discard, spend action
    cp.hand = cp.hand.filter(c => c.uid !== card.uid);
    g.discard.push(card);
    g.actionsLeft -= 1;

    // Dispatch to the appropriate handler
    const handlers = {
        infrastructure: () => applyInfrastructureCard(g, card),
        defense: () => applyDefenseCard(g, card),
        attack: () => applyAttackCard(g, card, targetIdx),
        event: () => applyEventCard(g, card),
    };

    const handler = handlers[card.type];
    if (handler) {
        const result = handler();
        return {
            gameState: result.gameState,
            logMessage: result.logMessage || `${cp.name} jugó ${card.name}`,
            blocked: result.blocked,
        };
    }

    return { gameState: g, logMessage: `${cp.name} jugó ${card.name}` };
}

// ─── END TURN ─────────────────────────────────────────────────────────────────
// Returns { gameState, winner (index|null), logMessage }
export function processEndTurn(gameState) {
    const g = clone(gameState);
    const cp = g.players[g.currentIdx];

    // Streak check
    const allUp = cp.services.every(s => s.up);
    cp.streak = allUp ? cp.streak + 1 : 0;

    if (cp.streak >= WIN_TURNS) {
        return { gameState: g, winner: g.currentIdx, logMessage: null };
    }

    // Advance to next player
    const nextIdx = (g.currentIdx + 1) % g.players.length;
    const np = g.players[nextIdx];

    // Draw 2 cards
    for (let i = 0; i < 2; i++) {
        if (g.deck.length === 0) {
            g.deck = shuffle(g.discard);
            g.discard = [];
        }
        if (g.deck.length > 0) np.hand.push(g.deck.shift());
    }

    const newRound = g.round + (nextIdx === 0 ? 1 : 0);
    const logMessage = `▶ Ronda ${newRound} — turno de ${np.name}`;

    return {
        gameState: { ...g, currentIdx: nextIdx, actionsLeft: 3, round: newRound },
        winner: null,
        logMessage,
    };
}
