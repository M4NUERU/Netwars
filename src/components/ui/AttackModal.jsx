import { TYPE_COLOR } from "../../constants/gameConstants";

export default function AttackModal({ attackModal, onPlayCard, onCancel }) {
    if (!attackModal) return null;

    return (
        <div className="overlay">
            <div className="modal" style={{ "--mc": TYPE_COLOR.attack }}>
                <div className="modal-header">
                    <div className="modal-icon" style={{ color: TYPE_COLOR.attack }}>
                        {attackModal.card.icon}
                    </div>
                    <div>
                        <div className="modal-title" style={{ color: TYPE_COLOR.attack }}>
                            {attackModal.card.name}
                        </div>
                        <div className="tooltip-type mono" style={{ color: TYPE_COLOR.attack + "88", letterSpacing: 2 }}>
                            ATAQUE
                        </div>
                    </div>
                </div>
                <div className="modal-sub">{attackModal.card.effect}</div>
                <div
                    style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: 11,
                        color: "var(--col-text-muted)",
                        marginBottom: 14,
                        letterSpacing: 1,
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        paddingBottom: 6
                    }}
                >
                    SELECCIONA EL OBJETIVO:
                </div>
                {attackModal.targets.map(t => (
                    <button
                        key={t.id}
                        className="target-btn"
                        style={{ borderColor: t.color }}
                        onClick={() => onPlayCard(attackModal.card, t.id)}
                    >
                        <span style={{ color: t.color, fontWeight: 600 }}>
                            <span style={{ opacity: 0.5, marginRight: 6 }}>⌖</span>
                            {t.name}
                        </span>
                        <div className="target-meta">
                            <span>📡 {t.services.filter(s => s.up).length}/5</span>
                            <span>🛡 {t.defenses.length}</span>
                        </div>
                    </button>
                ))}
                <div className="btn-primary-wrap" style={{ width: "100%", marginTop: 8 }}>
                    <button
                        className="btn-ghost"
                        style={{ width: "100%" }}
                        onClick={onCancel}
                    >
                        CANCELAR ATAQUE
                    </button>
                </div>
            </div>
        </div>
    );
}
