import { useState } from "react";
import NetworkBackground from "../ui/NetworkBackground";

export default function MenuScreen({ onStart, onOpenRules, onCreateOnline, onJoinOnline, isConnecting }) {
    const [playerName, setPlayerName] = useState("Hacker_" + Math.floor(100 + Math.random() * 900));
    const [roomCode, setRoomCode] = useState("");
    const [mode, setMode] = useState("select"); // 'select', 'create', 'join'

    const handleCreate = () => {
        if (!playerName.trim()) return;
        onCreateOnline(playerName.trim());
    };

    const handleJoin = () => {
        if (!playerName.trim() || !roomCode.trim()) return;
        onJoinOnline(roomCode.trim(), playerName.trim());
    };

    return (
        <>
            <NetworkBackground />
            <div className="menu-wrap" style={{ maxWidth: 440, padding: '30px 40px' }}>
                <div className="menu-title mono" data-text="⚔ NETWARS">⚔ NETWARS</div>
                <div className="menu-sub" style={{ marginBottom: 15 }}>La Batalla por la Red</div>
                
                {isConnecting ? (
                    <div className="mono text-center" style={{ color: '#00ffcc', padding: '40px 0', fontSize: 16 }}>
                        <div className="loading-spinner" style={{ border: '3px solid rgba(0,255,204,0.1)', borderTop: '3px solid #00ffcc', borderRadius: '50%', width: 40, height: 40, animation: 'spin 1s linear infinite', margin: '0 auto 15px auto' }} />
                        CONECTANDO AL SERVIDOR DE RED...
                        <style>{`
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                        `}</style>
                    </div>
                ) : mode === "select" ? (
                    <>
                        <div className="menu-desc" style={{ marginBottom: 25 }}>
                            Juego estratégico de redes y ciberseguridad<br />
                            Protege tus servicios. Destruye los de tus rivales.
                        </div>
                        <div className="btn-primary-wrap">
                            <button className="btn-primary" onClick={onStart}>
                                PARTIDA LOCAL (PVP)
                            </button>
                        </div>
                        <div className="btn-primary-wrap" style={{ marginTop: 12 }}>
                            <button className="btn-primary" style={{ background: '#0f172a', borderColor: '#06b6d4', color: '#06b6d4' }} onClick={() => setMode("multiplayer")}>
                                MULTIJUGADOR ONLINE
                            </button>
                        </div>
                        <div className="btn-primary-wrap" style={{ marginTop: 12 }}>
                            <button className="btn-ghost" onClick={onOpenRules}>
                                REGLAS / MANUAL
                            </button>
                        </div>
                    </>
                ) : mode === "multiplayer" ? (
                    <div style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                        <div className="mono" style={{ color: '#8892b0', fontSize: 12, marginBottom: 6, textAlign: 'left' }}>ALFASIGMA // ALIAS DE COMBATE</div>
                        <input 
                            type="text" 
                            className="mono" 
                            value={playerName} 
                            onChange={(e) => setPlayerName(e.target.value)}
                            maxLength={15}
                            style={{ width: '100%', background: '#0a0f1d', border: '1px solid #1e293b', color: '#fff', padding: '10px 14px', borderRadius: 4, marginBottom: 20, outline: 'none', fontFamily: 'monospace', fontSize: 14 }}
                        />

                        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                            <button 
                                className="btn-primary" 
                                style={{ flex: 1, fontSize: 12 }} 
                                onClick={handleCreate}
                                disabled={!playerName.trim()}
                            >
                                CREAR SALA
                            </button>
                            <button 
                                className="btn-primary" 
                                style={{ flex: 1, fontSize: 12, background: '#0a0f1d', borderColor: '#1e293b', color: '#8892b0' }} 
                                onClick={() => setMode("join")}
                                disabled={!playerName.trim()}
                            >
                                UNIRSE A SALA
                            </button>
                        </div>

                        <button className="btn-ghost" style={{ fontSize: 12, padding: '6px 0' }} onClick={() => setMode("select")}>
                            [ VOLVER AL MENÚ ]
                        </button>
                    </div>
                ) : (
                    <div style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                        <div className="mono" style={{ color: '#8892b0', fontSize: 12, marginBottom: 6, textAlign: 'left' }}>INGRESAR CÓDIGO DE ACCESO (4 LETRAS)</div>
                        <input 
                            type="text" 
                            className="mono" 
                            placeholder="EJ. X9FA"
                            value={roomCode} 
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            maxLength={4}
                            style={{ width: '100%', background: '#0a0f1d', border: '1px solid #00ffcc', color: '#00ffcc', padding: '10px 14px', borderRadius: 4, marginBottom: 20, outline: 'none', fontFamily: 'monospace', fontSize: 18, textAlign: 'center', letterSpacing: 4 }}
                        />

                        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                            <button 
                                className="btn-primary" 
                                style={{ flex: 1, fontSize: 12 }} 
                                onClick={handleJoin}
                                disabled={!playerName.trim() || roomCode.length !== 4}
                            >
                                INGRESAR
                            </button>
                            <button 
                                className="btn-primary" 
                                style={{ flex: 1, fontSize: 12, background: '#0a0f1d', borderColor: '#1e293b', color: '#8892b0' }} 
                                onClick={() => setMode("multiplayer")}
                            >
                                CANCELAR
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
