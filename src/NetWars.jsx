import { useState, useEffect } from "react";
import { useGameState } from "./hooks/useGameState";

// Screens
import MenuScreen from "./components/screens/MenuScreen";
import SetupScreen from "./components/screens/SetupScreen";
import GameOverScreen from "./components/screens/GameOverScreen";
import NetworkBackground from "./components/ui/NetworkBackground";

// Game components
import RightPanel from "./components/game/RightPanel";
import GameScene3D from "./components/game3d/GameScene3D";

// UI overlays
import TooltipDock from "./components/ui/TooltipDock";
import AttackModal from "./components/ui/AttackModal";
import Toast from "./components/ui/Toast";

export default function NetWars() {
    const {
        screen, setScreen,
        pCount, setPCount,
        pNames, setPNames,
        game,
        hovered, setHovered,
        toast,
        attackModal, setAttackModal,
        log,
        startGame, endTurn, playCard, resetToMenu,
    } = useGameState();

    const [turnBanner, setTurnBanner] = useState(null);

    // Watch for turn changes to show banner
    useEffect(() => {
        if (game && screen === "game") {
            const p = game.players[game.currentIdx];
            setTurnBanner(p);
            const t = setTimeout(() => setTurnBanner(null), 1500);
            return () => clearTimeout(t);
        }
    }, [game?.currentIdx, game?.round, screen]);

    // ── Menu ──
    if (screen === "menu") {
        return (
            <div className="nw-root">
                <MenuScreen onStart={() => setScreen("setup")} />
            </div>
        );
    }

    // ── Setup ──
    if (screen === "setup") {
        return (
            <div className="nw-root">
                <SetupScreen
                    pCount={pCount} setPCount={setPCount}
                    pNames={pNames} setPNames={setPNames}
                    onStart={startGame}
                    onBack={() => setScreen("menu")}
                />
            </div>
        );
    }

    // ── Game Over ──
    if (screen === "gameover" && game) {
        const winner = game.players[game.winner ?? 0];
        return (
            <div className="nw-root text-center">
                <NetworkBackground />
                <GameOverScreen winner={winner} onNewGame={resetToMenu} />
            </div>
        );
    }

    // ── In-game ──
    if (!game) return null;
    const currentPlayer = game.players[game.currentIdx];

    return (
        <div className="nw-root">
            <NetworkBackground />

            {/* Turn Banner Overlay */}
            {turnBanner && (
                <div style={{
                    position: "absolute", inset: 0, zIndex: 300, display: "flex",
                    alignItems: "center", justifyContent: "center", pointerEvents: "none",
                    background: "rgba(0,0,0,0.5)",
                    animation: "overlayFadeIn 0.2s reverse 1.3s both"
                }}>
                    <div style={{
                        background: "rgba(13, 22, 32, 0.95)",
                        borderTop: `4px solid ${turnBanner.color}`,
                        borderBottom: `4px solid ${turnBanner.color}`,
                        width: "100%", padding: "40px 0", textAlign: "center",
                        boxShadow: `0 0 50px color-mix(in srgb, ${turnBanner.color} 30%, transparent)`,
                        animation: "fadeSlideIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both, fadeSlideOut 0.4s 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) both"
                    }}>
                        <div className="mono" style={{ fontSize: 48, fontWeight: 600, color: turnBanner.color, letterSpacing: 8, textShadow: `0 0 20px ${turnBanner.color}` }}>
                            TURNO DE {turnBanner.name.toUpperCase()}
                        </div>
                        <div className="mono" style={{ fontSize: 16, color: "var(--col-text-muted)", letterSpacing: 4, marginTop: 10 }}>
                            RONDA {game.round}
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="game-header" style={{ borderBottomColor: currentPlayer.color }}>
                <span className="header-logo">⚔ NETWARS</span>
                <span className="header-info">
                    RONDA <strong>{game.round}</strong> &nbsp;|&nbsp;
                    <span style={{ color: currentPlayer.color, fontWeight: 600 }}> {currentPlayer.name.toUpperCase()}</span>
                </span>
                <div className="header-actions">
                    <span className="header-info" style={{ marginRight: 6 }}>ACCIONES</span>
                    {[0, 1, 2].map(i => (
                        <div
                            key={`pip-${i}`}
                            className={`action-pip ${i < game.actionsLeft ? "active" : "used"} ${i === game.actionsLeft ? "consume-anim" : ""}`}
                        />
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="game-body game-body-3d" style={{ position: 'relative', flex: 1, zIndex: 1 }}>
                <GameScene3D 
                    game={game} 
                    onPlayCard={playCard}
                    onHoverCard={setHovered}
                    onHoverEnd={() => setHovered(null)}
                />
                <RightPanel
                    currentPlayer={currentPlayer}
                    onPlayCard={playCard}
                    onHoverCard={setHovered}
                    onHoverEnd={() => setHovered(null)}
                    onEndTurn={endTurn}
                    log={log}
                />
            </div>

            {/* Overlays */}
            <TooltipDock card={hovered} />
            <AttackModal
                attackModal={attackModal}
                onPlayCard={playCard}
                onCancel={() => setAttackModal(null)}
            />
            <Toast toast={toast} />
        </div>
    );
}
