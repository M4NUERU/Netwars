import { TYPE_COLOR } from "../../constants/gameConstants";

export default function RulesModal({ rulesOpen, onClose }) {
    if (!rulesOpen) return null;

    return (
        <div className="overlay" style={{ zIndex: 1000 }}>
            <div className="modal" style={{ "--mc": "var(--col-blue)", maxWidth: 500, maxHeight: "80vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                <div className="modal-header">
                    <div className="modal-icon" style={{ color: "var(--col-blue)" }}>
                        📖
                    </div>
                    <div>
                        <div className="modal-title" style={{ color: "var(--col-blue)" }}>
                            MANUAL DE OPERACIONES
                        </div>
                        <div className="tooltip-type mono" style={{ color: "var(--col-blue)88", letterSpacing: 2 }}>
                            REGLAS DEL JUEGO
                        </div>
                    </div>
                </div>

                <div style={{ padding: "0 10px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                    
                    <section>
                        <h3 className="mono" style={{ color: "var(--col-text)", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 4, marginBottom: 8 }}>
                            🎯 OBJETIVO
                        </h3>
                        <p style={{ color: "var(--col-text-muted)", fontSize: 13, lineHeight: 1.5 }}>
                            Sobrevive a los ataques y mantén <strong>sus 5 servicios activos</strong> (sin caer) durante <strong>5 rondas consecutivas</strong> para ganar la partida.
                        </p>
                    </section>

                    <section>
                        <h3 className="mono" style={{ color: "var(--col-text)", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 4, marginBottom: 8 }}>
                            ⚙️ TU TURNO
                        </h3>
                        <p style={{ color: "var(--col-text-muted)", fontSize: 13, lineHeight: 1.5 }}>
                            Cada jugador tiene <strong>3 acciones</strong> por turno. Jugar una carta cuesta 1 acción. Al finalizar el turno o agotar las acciones, pasarás el turno y tomarás 2 cartas del mazo.
                        </p>
                    </section>

                    <section>
                        <h3 className="mono" style={{ color: "var(--col-text)", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 4, marginBottom: 8 }}>
                            🎴 TIPOS DE CARTAS
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ display: "flex", gap: 8 }}>
                                <div style={{ width: 12, height: 12, borderRadius: 2, background: TYPE_COLOR.infrastructure, flexShrink: 0, marginTop: 3 }} />
                                <div>
                                    <strong style={{ color: TYPE_COLOR.infrastructure, fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>INFRAESTRUCTURA</strong>
                                    <p style={{ color: "var(--col-text-muted)", fontSize: 12, lineHeight: 1.4 }}>Cartas azules. Instalan hardware que provee beneficios o permite restaurar servicios caídos (Switch).</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <div style={{ width: 12, height: 12, borderRadius: 2, background: TYPE_COLOR.defense, flexShrink: 0, marginTop: 3 }} />
                                <div>
                                    <strong style={{ color: TYPE_COLOR.defense, fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>DEFENSA</strong>
                                    <p style={{ color: "var(--col-text-muted)", fontSize: 12, lineHeight: 1.4 }}>Cartas verdes. Añaden protecciones contra ataques específicos (Firewall, IDS, VPN).</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <div style={{ width: 12, height: 12, borderRadius: 2, background: TYPE_COLOR.attack, flexShrink: 0, marginTop: 3 }} />
                                <div>
                                    <strong style={{ color: TYPE_COLOR.attack, fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>ATAQUE</strong>
                                    <p style={{ color: "var(--col-text-muted)", fontSize: 12, lineHeight: 1.4 }}>Cartas rojas. Tiran los servicios de los oponentes. Un jugador con servicios caídos reinicia su contador de victoria. Algunos ataques pueden ser bloqueados por defensas.</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <div style={{ width: 12, height: 12, borderRadius: 2, background: TYPE_COLOR.event, flexShrink: 0, marginTop: 3 }} />
                                <div>
                                    <strong style={{ color: TYPE_COLOR.event, fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>EVENTO</strong>
                                    <p style={{ color: "var(--col-text-muted)", fontSize: 12, lineHeight: 1.4 }}>Cartas amarillas. Afectan a todos los jugadores en la matriz (Apagón, Caída de ISP) o dan recompensas especiales.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                <div className="btn-primary-wrap" style={{ width: "100%", marginTop: "auto", flexShrink: 0 }}>
                    <button
                        className="btn-ghost"
                        style={{ width: "100%" }}
                        onClick={onClose}
                    >
                        ENTENDIDO
                    </button>
                </div>
            </div>
        </div>
    );
}
