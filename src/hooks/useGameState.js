import { useState, useEffect, useCallback } from "react";
import { buildDeck } from "../data/cardDefinitions";
import { makePlayer, processPlayCard, processEndTurn } from "../logic/gameEngine";
import { playClick, playError, playAttack, playBlock, playDown, playSwitch, playCardPlay, playTurnEnd } from "../logic/audio";

export function useGameState() {
    const [screen, setScreen] = useState("menu");
    const [pCount, setPCount] = useState(2);
    const [pNames, setPNames] = useState(["Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4"]);
    const [game, setGame] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [toast, setToast] = useState(null);
    const [attackModal, setAttackModal] = useState(null);
    const [log, setLog] = useState([]);

    // ── Toast helper ──
    const showToast = useCallback((msg, type = "ok") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2200);
    }, []);

    // ── Log helper ──
    const addLog = useCallback((msg) => {
        setLog(prev => [msg, ...prev].slice(0, 25));
    }, []);

    // ── Start a new game ──
    const startGame = useCallback(() => {
        const players = Array.from({ length: pCount }, (_, i) =>
            makePlayer(i, pNames[i] || `Jugador ${i + 1}`)
        );
        const deck = buildDeck();
        players.forEach(p => { p.hand = deck.splice(0, 5); });

        setGame({
            players, deck, discard: [],
            currentIdx: 0, actionsLeft: 3,
            round: 1, winner: null,
        });
        setLog([`▶ Partida iniciada. Turno de ${players[0].name}`]);
        playTurnEnd();
        setScreen("game");
    }, [pCount, pNames]);

    // ── End turn ──
    const endTurn = useCallback(() => {
        if (!game) return;
        playTurnEnd();
        setGame(prev => {
            const result = processEndTurn(prev);
            if (result.winner !== null) {
                return { ...result.gameState, winner: result.winner };
            }
            if (result.logMessage) addLog(result.logMessage);
            return result.gameState;
        });
        setAttackModal(null);
    }, [game, addLog]);

    // ── Winner detection ──
    useEffect(() => {
        if (game?.winner != null) setScreen("gameover");
    }, [game?.winner]);

    // ── Play a card ──
    const playCard = useCallback((card, targetIdx = null) => {
        if (!game || game.actionsLeft <= 0) {
            playError();
            showToast("¡Sin acciones disponibles!", "danger");
            return;
        }

        // Attack without target → open modal
        if (card.type === "attack" && targetIdx === null) {
            playClick();
            const targets = game.players
                .map((p, i) => ({ ...p, idx: i }))
                .filter((_, i) => i !== game.currentIdx);
            setAttackModal({ card, targets });
            return;
        }

        setGame(prev => {
            const result = processPlayCard(prev, card, targetIdx);
            if (result.needsTarget) return prev;
            
            if (result.blocked) {
                playBlock();
                const target = result.gameState.players[targetIdx];
                showToast(`¡Ataque bloqueado por ${target.name}!`, "warn");
            } else {
                if (card.type === "attack") playAttack();
                else playCardPlay();
                
                if (result.logMessage?.includes("CAÍDO!") || result.logMessage?.includes("pierden 1 servicio")) {
                    setTimeout(playDown, 300); // Slight delay for impact
                } else if (result.logMessage?.includes("restauró")) {
                    setTimeout(playSwitch, 200);
                }
            }
            
            addLog(result.logMessage);
            return result.gameState;
        });

        setAttackModal(null);
    }, [game, showToast, addLog]);

    // ── Reset to menu ──
    const resetToMenu = useCallback(() => {
        setGame(null);
        setScreen("menu");
    }, []);

    return {
        // State
        screen, setScreen,
        pCount, setPCount,
        pNames, setPNames,
        game,
        hovered, setHovered,
        toast,
        attackModal, setAttackModal,
        log,
        // Actions
        startGame,
        endTurn,
        playCard,
        showToast,
        addLog,
        resetToMenu,
    };
}
