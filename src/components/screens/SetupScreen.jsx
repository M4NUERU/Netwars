import { ZONE_COLORS } from "../../constants/gameConstants";
import NetworkBackground from "../ui/NetworkBackground";

export default function SetupScreen({
    pCount, setPCount, pNames, setPNames, onStart, onBack,
}) {
    return (
        <>
            <NetworkBackground />
            <div className="menu-wrap">
                <div className="menu-title mono" style={{ fontSize: 36, animationDelay: "0s" }}>CONFIGURAR</div>
                <div className="setup-box">
                    <div className="setup-label">Número de jugadores</div>
                    <div className="count-row">
                        {[2, 3, 4].map(n => (
                            <button
                                key={n}
                                className={`count-btn${pCount === n ? " active" : ""}`}
                                onClick={() => setPCount(n)}
                            >
                                {n}
                            </button>
                        ))}
                    </div>

                    <div className="setup-label" style={{ marginTop: 8 }}>Nombres y Facciones</div>
                    {Array.from({ length: pCount }, (_, i) => (
                        <div key={i} className="name-input-wrap" style={{ animationDelay: `${i * 0.1}s` }}>
                            <input
                                className="name-input"
                                style={{
                                    "--border-color": ZONE_COLORS[i],
                                    borderColor: ZONE_COLORS[i]
                                }}
                                value={pNames[i] || ""}
                                placeholder={`Jugador ${i + 1}`}
                                onChange={e => {
                                    const n = [...pNames];
                                    n[i] = e.target.value;
                                    setPNames(n);
                                }}
                            />
                        </div>
                    ))}

                    <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                        <button className="btn-ghost" style={{ flex: 1 }} onClick={onBack}>← Volver</button>
                        <button className="btn-primary" style={{ flex: 2, padding: "10px 0" }} onClick={onStart}>
                            ¡COMENZAR!
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
