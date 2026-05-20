import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import Board3D from './Board3D';
import Hand3D from './Hand3D';

function CameraRig() {
    useFrame((state) => {
        state.camera.position.lerp(new THREE.Vector3(state.mouse.x * 0.15, 20 + state.mouse.y * 0.15, 38), 0.05);
        state.camera.lookAt(0, 0, 0);
    });
    return null;
}

export default function GameScene3D({ game, currentPlayer, onPlayCard, onHoverCard, onHoverEnd, onEndTurn, onReboot, log }) {
    if (!game) return null;

    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Canvas shadows camera={{ position: [0, 20, 38], fov: 45 }}>
                <color attach="background" args={['#030712']} />
                <fog attach="fog" args={['#030712', 15, 60]} />
                
                <ambientLight intensity={0.6} />
                <directionalLight 
                    position={[5, 10, 5]} 
                    intensity={1.2} 
                    castShadow 
                    shadow-mapSize={[1024, 1024]} 
                />
                <spotLight 
                    position={[0, 15, 0]} 
                    angle={0.8} 
                    penumbra={1} 
                    intensity={1.2} 
                    color="#06b6d4" 
                />
                
                <Environment preset="city" />

                <CameraRig />

                <Board3D game={game} />
                
                <Hand3D 
                    hand={currentPlayer.hand}
                    onPlayCard={onPlayCard}
                    onHoverCard={onHoverCard}
                    onHoverEnd={onHoverEnd}
                />

                {/* 3D Terminal Log */}
                <Html position={[20, 8, 5]} transform rotation={[0, -0.4, 0]}>
                    <div style={{ width: 280, height: 350, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
                    <div style={{ pointerEvents: 'auto' }}>
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
