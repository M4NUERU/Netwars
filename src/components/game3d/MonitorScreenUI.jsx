import { Html } from '@react-three/drei';

export default function MonitorScreenUI({ player }) {
    if (!player) return null;

    const d = player.defenses || [];
    
    return (
        <Html position={[0, 0, 0.27]} transform scale={0.021} distanceFactor={1}>
            <div style={{
                width: 780,
                height: 400,
                background: 'rgba(5, 10, 20, 0.95)',
                border: `2px solid ${player.color}`,
                boxShadow: `0 0 30px ${player.color}40 inset`,
                borderRadius: 8,
                padding: 24,
                fontFamily: "'Share Tech Mono', monospace",
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    borderBottom: `2px solid ${player.color}60`,
                    paddingBottom: 12,
                    marginBottom: 24
                }}>
                    <div style={{ fontSize: 28, color: player.color, fontWeight: 'bold', textShadow: `0 0 10px ${player.color}` }}>
                        SYS.TARGET // {player.name.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 24, color: '#06b6d4', opacity: 0.9 }}>
                        STATUS: ONLINE
                    </div>
                </div>

                {/* Body */}
                <div style={{ display: 'flex', gap: 30, flex: 1 }}>
                    {/* Services Column */}
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 15 }}>
                        <div style={{ color: '#888', fontSize: 18, marginBottom: 5 }}>[ NETWORK SERVICES ]</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
                            {player.services.map((svc, i) => (
                                <div key={i} style={{
                                    background: svc.up ? 'rgba(6, 182, 212, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                    border: `1px solid ${svc.up ? '#06b6d4' : '#ef4444'}`,
                                    padding: '16px 20px',
                                    borderRadius: 6,
                                    width: 'calc(50% - 10px)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: 20, color: '#fff' }}>{svc.name}</span>
                                    <span style={{ 
                                        color: svc.up ? '#00ffcc' : '#ff3d5a', 
                                        fontWeight: 'bold',
                                        fontSize: 22,
                                        textShadow: `0 0 12px ${svc.up ? '#00ffcc' : '#ff3d5a'}`
                                    }}>
                                        {svc.up ? 'UP' : 'DOWN'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Defenses Column */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 15 }}>
                        <div style={{ color: '#888', fontSize: 18, marginBottom: 5 }}>[ ACTIVE DEFENSES ]</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {d.length === 0 && (
                                <div style={{ color: '#555', fontStyle: 'italic', padding: 10, fontSize: 18 }}>No active defenses detected.</div>
                            )}
                            {d.map((def, i) => (
                                <div key={i} style={{
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    borderLeft: '4px solid #f59e0b',
                                    padding: '10px 16px',
                                    color: '#f59e0b',
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    letterSpacing: 2
                                }}>
                                    {"> "} {def.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scanline overlay effect */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 4px, 3px 100%',
                    pointerEvents: 'none',
                    opacity: 0.5
                }} />
            </div>
        </Html>
    );
}
