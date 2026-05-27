import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import Board3D from './Board3D';
import Hand3D from './Hand3D';

const ZOOM_TARGETS = {
    left: { pos: [-8, 6, -2], look: [-14, 3.5, -8] },
    top: { pos: [0, 5, -4], look: [0, 3.5, -12] },
    right: { pos: [8, 6, -2], look: [14, 3.5, -8] }
};

function CameraRig({ slot }) {
    const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

    useFrame((state) => {
        let destPos, destLook;
        if (slot && ZOOM_TARGETS[slot]) {
            destPos = ZOOM_TARGETS[slot].pos;
            destLook = ZOOM_TARGETS[slot].look;
        } else {
            destPos = [state.mouse.x * 2.5, 20 + state.mouse.y * 2.5, 38];
            destLook = [0, 0, 0];
        }

        state.camera.position.lerp(new THREE.Vector3(destPos[0], destPos[1], destPos[2]), 0.05);
        lookTarget.current.lerp(new THREE.Vector3(destLook[0], destLook[1], destLook[2]), 0.05);
        state.camera.lookAt(lookTarget.current);
    });
    return null;
}

export default function GameScene3D({ game, currentPlayer, onPlayCard, onHoverCard, onHoverEnd, onEndTurn, onReboot, log }) {
    const [zoomedPlayerId, setZoomedPlayerId] = useState(null);

    if (!game) return null;

    let slot = null;
    if (zoomedPlayerId !== null) {
        const i = game.players.findIndex(p => p.id === zoomedPlayerId);
        if (game.players.length === 2) {
            slot = 'top';
        } else if (game.players.length === 3) {
            const mappedIdx = (i - game.currentIdx + 3) % 3;
            if (mappedIdx === 1) slot = 'left';
            else if (mappedIdx === 2) slot = 'right';
        } else {
            const mappedIdx = (i - game.currentIdx + 4) % 4;
            if (mappedIdx === 1) slot = 'left';
            else if (mappedIdx === 2) slot = 'top';
            else if (mappedIdx === 3) slot = 'right';
        }
    }

    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Canvas 
                shadows 
                camera={{ position: [0, 20, 38], fov: 45 }}
                gl={{ 
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true
                }}
                dpr={[1, 2]}
            >
                <color attach="background" args={['#020408']} />
                
                <ambientLight intensity={0.5} />
                <directionalLight 
                    position={[8, 12, 8]} 
                    intensity={1.0} 
                    castShadow 
                    shadow-mapSize={[1024, 1024]} 
                />
                <spotLight 
                    position={[0, 16, 2]} 
                    angle={0.9} 
                    penumbra={1} 
                    intensity={1.5} 
                    color="#00ffcc" 
                />
                
                <Environment preset="city" />

                <CameraRig slot={slot} />

                {/* --- Hacker's Cyber Room Background Scene --- */}
                <group position={[0, -2, -26]}>
                    {/* Vertical Cyan, Pink, Orange and Green LED Tube Lights */}
                    {[-18, -6, 6, 18].map((x, idx) => {
                        const tubeColors = ['#00ffff', '#ff007f', '#ffaa00', '#00ff66'];
                        return (
                            <group key={`room-led-${idx}`} position={[x, 5, 0]}>
                                {/* LED outer neon glow tube */}
                                <mesh>
                                    <cylinderGeometry args={[0.12, 0.12, 16, 8]} />
                                    <meshBasicMaterial color={tubeColors[idx]} transparent opacity={0.25} />
                                </mesh>
                                {/* LED inner core tube */}
                                <mesh>
                                    <cylinderGeometry args={[0.04, 0.04, 16, 8]} />
                                    <meshBasicMaterial color="#ffffff" />
                                </mesh>
                            </group>
                        );
                    })}

                    {/* Futuristic holographic matrix terminal text floating behind desk */}
                    <Text 
                        position={[0, 7.5, -2]} 
                        fontSize={0.42} 
                        color="#06b6d4" 
                        maxWidth={30} 
                        textAlign="center" 
                        fillOpacity={0.12}
                    >
                        {`01001001 01001110 01010100 01010010 01010101 01010011 01001001 01001111 01001110\nNETWARS.SYS // TERMINAL_ACTIVE // ENCRYPTING_VPN_NODE... // KEY_PASSED\n[########################################] 100% SECURE\nPORT_80: LISTEN // PORT_443: SECURE // PORT_22: ACTIVE_ESTABLISHED`}
                    </Text>
                </group>

                <Board3D 
                    game={game} 
                    zoomedPlayerId={zoomedPlayerId}
                    onMonitorClick={(id) => setZoomedPlayerId(prev => prev === id ? null : id)}
                />
                
                <Hand3D 
                    hand={currentPlayer.hand}
                    onPlayCard={onPlayCard}
                    onHoverCard={onHoverCard}
                    onHoverEnd={onHoverEnd}
                />

                {/* Reset Zoom Button UI overlay */}
                {zoomedPlayerId !== null && (
                    <Html position={[0, 8, 4]} transform={false}>
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.85)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid #ff0055',
                            boxShadow: '0 0 15px rgba(255, 0, 85, 0.25)',
                            color: '#ffffff',
                            padding: '8px 16px',
                            borderRadius: 4,
                            fontFamily: 'monospace',
                            fontSize: 12,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            animation: 'subtlePulse 2s infinite',
                            userSelect: 'none',
                            transform: 'translateX(-50%)'
                        }} onClick={() => setZoomedPlayerId(null)}>
                            🔍 RESTABLECER VISTA [ ESC ]
                        </div>
                    </Html>
                )}

                {/* 3D Terminal Log */}
                <Html position={[20, 8, 5]} transform rotation={[0, -0.4, 0]}>
                    <div className="html-3d-content" style={{ width: 280, height: 350, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.5)', color: '#06b6d4', fontFamily: 'monospace', fontSize: 12, borderBottom: '1px solid rgba(6, 182, 212, 0.3)' }}>
                            📡 TERMINAL DE EVENTOS
                        </div>
                        <div style={{ flex: 1, padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {log.map((entry, i) => (
                                <div key={i} style={{ color: i === 0 ? '#f8fafc' : '#94a3b8', fontSize: 11, fontFamily: 'monospace', padding: 6, background: 'rgba(0,0,0,0.3)', borderLeft: `2px solid ${i === 0 ? '#06b6d4' : 'transparent'}` }}>
                                    {entry}
                                </div>
                            ))}
                        </div>
                    </div>
                </Html>

                {/* 3D Action Buttons */}
                <Html position={[12, 2, 20]} transform rotation={[-Math.PI / 4, 0, 0]}>
                    <div className="html-3d-content" style={{ pointerEvents: 'auto' }}>
                        {currentPlayer.services.every(s => !s.up) ? (
                            <button className="end-turn-btn pulse" onClick={onReboot} style={{ width: 220, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', padding: '16px 0', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 14, backdropFilter: 'blur(8px)', borderRadius: 4 }}>
                                🔄 REINICIO EMERGENCIA
                            </button>
                        ) : (
                            <button className={`end-turn-btn ${currentPlayer.hand.length === 0 ? "pulse" : ""}`} onClick={onEndTurn} style={{ width: 220, background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', border: '1px solid #06b6d4', padding: '16px 0', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 14, backdropFilter: 'blur(8px)', borderRadius: 4, transition: 'all 0.2s' }}>
                                PASAR TURNO ➔
                            </button>
                        )}
                    </div>
                </Html>
            </Canvas>
        </div>
    );
}
