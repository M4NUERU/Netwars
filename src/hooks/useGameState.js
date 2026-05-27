import { useState, useEffect, useCallback, useRef } from "react";
import { buildDeck } from "../data/cardDefinitions";
import { makePlayer, processPlayCard, processEndTurn } from "../logic/gameEngine";
import { playClick, playError, playAttack, playBlock, playDown, playSwitch, playCardPlay, playTurnEnd } from "../logic/audio";
import { supabase } from "../logic/supabaseClient";

// Helper to generate a room code (4 letters)
function generateRoomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // readable chars
    let code = "";
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export function useGameState() {
    const [screen, setScreen] = useState("menu");
    const [pCount, setPCount] = useState(2);
    const [pNames, setPNames] = useState(["Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4"]);
    const [game, setGame] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [toast, setToast] = useState(null);
    const [attackModal, setAttackModal] = useState(null);
    const [log, setLog] = useState([]);

    // Multiplayer States
    const [lobbyCode, setLobbyCode] = useState(null);
    const [myPlayerId, setMyPlayerId] = useState(null); // null means local play
    const [isConnecting, setIsConnecting] = useState(false);

    // Keep ref to log for inside the callback
    const logRef = useRef([]);
    useEffect(() => {
        logRef.current = log;
    }, [log]);

    // ── Toast helper ──
    const showToast = useCallback((msg, type = "ok") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2200);
    }, []);

    // ── Log helper ──
    const addLog = useCallback((msg) => {
        setLog(prev => [msg, ...prev].slice(0, 25));
    }, []);

    // ── Start a new local game ──
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
        setLobbyCode(null);
        setMyPlayerId(null);
    }, [pCount, pNames]);

    // ── Create Online Game (Supabase) ──
    const createOnlineGame = useCallback(async (hostName) => {
        if (!supabase) {
            showToast("El servidor online no está configurado en Vercel.", "danger");
            return;
        }
        setIsConnecting(true);
        try {
            const code = generateRoomCode();
            
            // Build the initial multiplayer game state
            // Player 0 is the host, Player 1 is waiting
            const players = [
                makePlayer(0, hostName || "Host"),
                makePlayer(1, "Esperando jugador...")
            ];
            
            const deck = buildDeck();
            players.forEach(p => { p.hand = deck.splice(0, 5); });

            const initialGame = {
                players, deck, discard: [],
                currentIdx: 0, actionsLeft: 3,
                round: 1, winner: null,
            };
            const initialLog = [`▶ Partida Online Creada [Código: ${code}]. Turno de ${players[0].name}`];

            const { error } = await supabase.from('netwars_lobbies').insert({
                code,
                game_state: { game: initialGame, log: initialLog }
            });

            if (error) throw error;

            setGame(initialGame);
            setLog(initialLog);
            setLobbyCode(code);
            setMyPlayerId(0);
            setScreen("game");
            showToast(`¡Sala ${code} creada con éxito!`, "ok");
            playTurnEnd();
        } catch (e) {
            console.error(e);
            showToast("Error al crear la sala online.", "danger");
        } finally {
            setIsConnecting(false);
        }
    }, [showToast]);

    // ── Join Online Game (Supabase) ──
    const joinOnlineGame = useCallback(async (code, playerName) => {
        if (!supabase) {
            showToast("El servidor online no está configurado en Vercel.", "danger");
            return;
        }
        if (!code) {
            showToast("Por favor ingresa un código de sala.", "warn");
            return;
        }
        setIsConnecting(true);
        const cleanCode = code.toUpperCase().trim();
        try {
            const { data, error } = await supabase
                .from('netwars_lobbies')
                .select('game_state')
                .eq('code', cleanCode)
                .single();

            if (error || !data) {
                showToast("Sala no encontrada o inactiva.", "danger");
                return;
            }

            const { game: remoteGame, log: remoteLog } = data.game_state;
            
            // Clone and claim Player 1 slot
            const updatedGame = JSON.parse(JSON.stringify(remoteGame));
            
            let assignedId = 1;
            if (updatedGame.players[1] && updatedGame.players[1].name.includes("Esperando")) {
                updatedGame.players[1].name = playerName || "Infiltrado";
            } else {
                // If Player 1 is already taken, we can spectate or assign as player 2 if supported
                // For simplicity, we claim slot 1
                updatedGame.players[1].name = playerName || "Infiltrado";
            }

            const updatedLog = [`▶ ${playerName} se unió a la sala.`, ...remoteLog].slice(0, 25);

            // Save back to Supabase
            const { error: updateError } = await supabase
                .from('netwars_lobbies')
                .update({
                    game_state: { game: updatedGame, log: updatedLog },
                    updated_at: new Date().toISOString()
                })
                .eq('code', cleanCode);

            if (updateError) throw updateError;

            setGame(updatedGame);
            setLog(updatedLog);
            setLobbyCode(cleanCode);
            setMyPlayerId(assignedId);
            setScreen("game");
            showToast(`Conectado a la sala ${cleanCode}`, "ok");
            playTurnEnd();
        } catch (e) {
            console.error(e);
            showToast("Error al unirse a la sala online.", "danger");
        } finally {
            setIsConnecting(false);
        }
    }, [showToast]);

    // ── Push updated state to Supabase ──
    const pushGameState = useCallback(async (nextGame, nextLog) => {
        if (!lobbyCode || !supabase) return;
        try {
            await supabase
                .from('netwars_lobbies')
                .update({
                    game_state: { game: nextGame, log: nextLog },
                    updated_at: new Date().toISOString()
                })
                .eq('code', lobbyCode);
        } catch (e) {
            console.error("Error syncing online state:", e);
        }
    }, [lobbyCode]);

    // ── End turn ──
    const endTurn = useCallback(() => {
        if (!game) return;

        // Turn lock for multiplayer
        if (lobbyCode !== null && game.currentIdx !== myPlayerId) {
            showToast("¡No es tu turno de juego!", "warn");
            playError();
            return;
        }

        playTurnEnd();
        
        let nextGame;
        let nextLog = logRef.current;

        const result = processEndTurn(game);
        if (result.winner !== null) {
            nextGame = { ...result.gameState, winner: result.winner };
        } else {
            nextGame = result.gameState;
        }
        
        if (result.logMessage) {
            nextLog = [result.logMessage, ...logRef.current].slice(0, 25);
            setLog(nextLog);
        }
        
        setGame(nextGame);
        setAttackModal(null);

        if (lobbyCode !== null) {
            pushGameState(nextGame, nextLog);
        }
    }, [game, lobbyCode, myPlayerId, pushGameState, showToast]);

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

        // Turn lock for multiplayer
        if (lobbyCode !== null && game.currentIdx !== myPlayerId) {
            showToast("¡No es tu turno de juego!", "warn");
            playError();
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

        let nextGame = game;
        let nextLog = logRef.current;

        const result = processPlayCard(game, card, targetIdx);
        if (result.needsTarget) return;
        
        if (result.blocked) {
            playBlock();
            const target = result.gameState.players[targetIdx];
            showToast(`¡Ataque bloqueado por ${target.name}!`, "warn");
        } else {
            if (card.type === "attack") playAttack();
            else playCardPlay();
            
            if (result.logMessage?.includes("CAÍDO!") || result.logMessage?.includes("pierden 1 servicio")) {
                setTimeout(playDown, 300);
            } else if (result.logMessage?.includes("restauró")) {
                setTimeout(playSwitch, 200);
            }
        }
        
        nextLog = [result.logMessage, ...logRef.current].slice(0, 25);
        setLog(nextLog);
        nextGame = result.gameState;
        
        setGame(nextGame);
        setAttackModal(null);

        if (lobbyCode !== null) {
            pushGameState(nextGame, nextLog);
        }
    }, [game, lobbyCode, myPlayerId, pushGameState, showToast]);

    // ── Subscribe to Online Realtime Updates ──
    useEffect(() => {
        if (!lobbyCode || !supabase) return;

        const channel = supabase
            .channel(`lobby:${lobbyCode}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'netwars_lobbies',
                    filter: `code=eq.${lobbyCode}`
                },
                (payload) => {
                    if (payload.new && payload.new.game_state) {
                        const { game: remoteGame, log: remoteLog } = payload.new.game_state;
                        
                        // Only update if remote state is different or advanced
                        setGame(remoteGame);
                        if (remoteLog) setLog(remoteLog);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [lobbyCode]);

    // ── Reset to menu ──
    const resetToMenu = useCallback(() => {
        setGame(null);
        setLobbyCode(null);
        setMyPlayerId(null);
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
        lobbyCode,
        myPlayerId,
        isConnecting,
        
        // Actions
        startGame,
        createOnlineGame,
        joinOnlineGame,
        endTurn,
        playCard,
        showToast,
        addLog,
        resetToMenu,
    };
}
