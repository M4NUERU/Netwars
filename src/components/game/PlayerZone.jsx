import { useState, useEffect, useRef } from "react";
import { WIN_TURNS } from "../../constants/gameConstants";

export default function PlayerZone({ player, isCurrent }) {
    const upCount = player.services.filter(s => s.up).length;

    // Animation states
    const [shake, setShake] = useState(false);
    const [shield, setShield] = useState(false);
    const prevServices = useRef(player.services);

    useEffect(() => {
        // Detect if a service went down to trigger shake
        const wasUpCount = prevServices.current.filter(s => s.up).length;
        if (upCount < wasUpCount) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
        prevServices.current = player.services;
    }, [player.services, upCount]);

    let zoneClass = "zone";
    if (isCurrent) zoneClass += " current";
    if (shake) zoneClass += " shake";
    if (shield) zoneClass += " shield"; // For future integration if defenses block

    return (
        <div className={zoneClass} style={{ "--zc": player.color }}>
            {/* Header */}
            <div className="zone-header">
                <div className="zone-name mono">
                    {isCurrent && <span style={{ color: player.color }}>▶</span>}
                    {player.name.toUpperCase()}
                </div>
                <div className={`zone-streak mono${player.streak > 0 ? " hot" : ""}`}>
                    🔥 {player.streak}/{WIN_TURNS}
                </div>
            </div>

            {/* Services */}
            <div className="services-row">
                {player.services.map((svc, i) => {
                    const wasUp = prevServices.current.find(s => s.name === svc.name)?.up;
                    const flashClass = (!svc.up && wasUp) ? " flash-down" : "";
                    return (
                        <div key={svc.name} className={`svc ${svc.up ? "up" : "down"}${flashClass}`}>
                            <div className="svc-dot" />
                            {svc.name}
                        </div>
                    );
                })}
            </div>

            {/* Progress bar */}
            <div style={{ height: 4, background: "#111820", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                <div
                    style={{
                        height: "100%",
                        width: `${(upCount / 5) * 100}%`,
                        background: `linear-gradient(90deg, ${player.color} 0%, color-mix(in srgb, ${player.color} 80%, white) 50%, ${player.color} 100%)`,
                        backgroundSize: "200% auto",
                        animation: "shimmer 2s linear infinite",
                        transition: "width .3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                        borderRadius: 2,
                    }}
                />
            </div>

            {/* Active tags */}
            <div className="tags-row">
                {player.infra.map((t, i) => (
                    <span key={`infra-${t}-${i}`} className="tag infra" style={{ animationDelay: `${i * 0.05}s` }}>{t}</span>
                ))}
                {player.defenses.map((t, i) => (
                    <span key={`def-${t}-${i}`} className="tag defense" style={{ animationDelay: `${(i + player.infra.length) * 0.05}s` }}>{t}</span>
                ))}
            </div>
        </div>
    );
}

