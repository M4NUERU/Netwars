import { Html } from '@react-three/drei';

export default function MonitorScreenUI({ player }) {
    if (!player) return null;

    const d = player.defenses || [];
    
    return (
        <Html position={[0, 0, 0.27]} transform scale={0.325} center>
            <div style={{
                width: 1560,
                height: 800,
                background: 'rgba(5, 10, 20, 0.95)',
                border: `4px solid ${player.color}`,
                boxShadow: `0 0 60px ${player.color}40 inset`,
                borderRadius: 16,
                padding: 48,
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
                    borderBottom: `4px solid ${player.color}60`,
                    paddingBottom: 24,
                    marginBottom: 48
                }}>
                    <div style={{ fontSize: 56, color: player.color, fontWeight: 'bold', textShadow: `0 0 20px ${player.color}` }}>
                        SYS.TARGET // {player.name.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 48, color: '#06b6d4', opacity: 0.9 }}>
                        STATUS: ONLINE
                    </div>
                </div>

                {/* Body */}
                <div style={{ display: 'flex', gap: 60, flex: 1 }}>
                    {/* Services Column */}
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 30 }}>
                        <div style={{ color: '#888', fontSize: 36, marginBottom: 10 }}>[ NETWORK SERVICES ]</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 30 }}>
                            {player.services.map((svc, i) => (
                                <div key={i} style={{
                                    background: svc.up ? 'rgba(6, 182, 212, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                    border: `2px solid ${svc.up ? '#06b6d4' : '#ef4444'}`,
                                    padding: '32px 40px',
                                    borderRadius: 12,
                                    width: 'calc(50% - 15px)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: 40, color: '#fff' }}>{svc.name}</span>
                                    <span style={{ 
                                        color: svc.up ? '#00ffcc' : '#ff3d5a', 
                                        fontWeight: 'bold',
                                        fontSize: 44,
                                        textShadow: `0 0 24px ${svc.up ? '#00ffcc' : '#ff3d5a'}`
                                    }}>
                                        {svc.up ? 'UP' : 'DOWN'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Defenses Column */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 30 }}>
                        <div style={{ color: '#888', fontSize: 36, marginBottom: 10 }}>[ ACTIVE DEFENSES ]</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {d.length === 0 && (
                                <div style={{ color: '#555', fontStyle: 'italic', padding: 20, fontSize: 36 }}>No active defenses detected.</div>
                            )}
                            {d.map((def, i) => (
                                <div key={i} style={{
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    borderLeft: '8px solid #f59e0b',
                                    padding: '20px 32px',
                                    color: '#f59e0b',
                                    fontSize: 36,
                                    fontWeight: 'bold',
                                    letterSpacing: 4
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
                    backgroundSize: '100% 8px, 6px 100%',
                    pointerEvents: 'none',
                    opacity: 0.5
                }} />
            </div>
        </Html>
    );
}
