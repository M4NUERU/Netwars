import { useState } from "react";
import { TYPE_COLOR, TYPE_LABEL, WIN_TURNS } from "../../constants/gameConstants";

export default function RightPanel({
    currentPlayer, onPlayCard, onHoverCard, onHoverEnd, onEndTurn, log,
}) {
    const [legendOpen, setLegendOpen] = useState(false);

    return (
        <div className="right-panel right-panel-3d" style={{ pointerEvents: 'none' }}>
            {/* Hand */}
            <div className="panel-section">
                <div className="panel-title">
                    <span>🃏 mano de {currentPlayer.name}</span>
                    <span style={{ color: "var(--col-blue)" }}>{currentPlayer.hand.length}/5</span>
                </div>
                {/* Cards are now rendered in 3D space */}
            </div>

            {/* End Turn */}
            <button
                className={`end-turn-btn ${currentPlayer.hand.length === 0 ? "pulse" : ""}`}
                onClick={onEndTurn}
                style={{ pointerEvents: 'auto' }}
            >
                PASAR TURNO ➔
            </button>

            {/* Legend Toggle */}
            <div className="panel-section" style={{ padding: "8px 14px", pointerEvents: 'auto' }}>
                <div
                    className="panel-title"
                    style={{ marginBottom: 0, cursor: "pointer" }}
                    onClick={() => setLegendOpen(!legendOpen)}
                >
                    <span>leyenda / controles</span>
                    <span style={{ fontSize: 14 }}>{legendOpen ? "−" : "+"}</span>
                </div>
                {legendOpen && (
                    <div style={{ marginTop: 12, animation: "fadeSlideIn 0.2s ease-out" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {Object.entries(TYPE_COLOR).map(([t, c]) => (
                                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c, boxShadow: `0 0 5px ${c}` }} />
                                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "var(--col-text-muted)" }}>
                                        {TYPE_LABEL[t]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div
                            style={{
                                marginTop: 12,
                                fontFamily: "'Share Tech Mono', monospace",
                                fontSize: 9,
                                color: "var(--col-text-muted)",
                                lineHeight: 1.8,
                                borderTop: "1px solid rgba(255,255,255,0.05)",
                                paddingTop: 8
                            }}
                        >
                            <span style={{ color: "var(--col-text)" }}>🖱 Clic</span> en carta = jugar<br />
                            <span style={{ color: "var(--col-text)" }}>👁 Hover</span> = ficha técnica<br />
                            <span style={{ color: "var(--col-amber)", textShadow: "0 0 5px var(--col-amber)" }}>🔥 Meta</span>: {WIN_TURNS} turnos con 5 servicios
                        </div>
                    </div>
                )}
            </div>

            {/* Event Log */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.5)", pointerEvents: 'auto' }}>
                <div style={{ padding: "10px 14px 4px", borderTop: "1px solid var(--col-border)", background: "rgba(10, 16, 26, 0.8)" }}>
                    <div className="panel-title" style={{ marginBottom: 4 }}>📡 log de eventos</div>
                </div>
                <div className="log-wrap">
                    {log.map((entry, i) => (
                        <div key={i} className={`log-entry${i === 0 ? " fresh" : ""}`}>
                            {entry}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
