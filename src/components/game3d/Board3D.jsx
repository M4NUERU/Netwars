import { useMemo } from 'react';
import * as THREE from 'three';
import { Text, Float } from '@react-three/drei';
import PlayerZone3D from './PlayerZone3D';
import MonitorScreenUI from './MonitorScreenUI';

export default function Board3D({ game }) {
    // Generate a gorgeous procedural wood texture for the desk
    const woodTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Warm brown mahogany mahogany base
        ctx.fillStyle = '#24120a';
        ctx.fillRect(0, 0, 512, 512);
        
        // Draw wood grains
        ctx.strokeStyle = '#120703';
        for (let i = 0; i < 80; i++) {
            ctx.lineWidth = 1 + Math.random() * 3;
            ctx.beginPath();
            ctx.moveTo(-100, i * 10);
            ctx.bezierCurveTo(150, i * 10 - 40, 350, i * 10 + 40, 612, i * 10);
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(3, 2);
        return texture;
    }, []);

    const positions = [
        { pos: [0, 0, 10], rot: [0, Math.PI, 0] },     // Current Player (Bottom)
        { pos: [-14, 0, -6], rot: [0, Math.PI / 8, 0] }, // Left Opponent
        { pos: [0, 0, -10], rot: [0, 0, 0] },          // Top Opponent
        { pos: [14, 0, -6], rot: [0, -Math.PI / 8, 0] }, // Right Opponent
    ];

    return (
        <group>
            {/* Hacker Desk */}
            <mesh receiveShadow position={[0, -1.5, 2]}>
                <boxGeometry args={[45, 2, 28]} />
                <meshStandardMaterial 
                    map={woodTexture}
                    roughness={0.7} 
                    metalness={0.1}
                />
            </mesh>
            {/* Desk Mat (Current Player) */}
            <mesh receiveShadow position={[0, -0.49, 10]}>
                <boxGeometry args={[18, 0.02, 10]} />
                <meshStandardMaterial color="#020617" roughness={0.9} />
            </mesh>

            {/* Central Mechanical RGB Keyboard & Core system */}
            <group position={[0, -0.4, 0.5]}>
                {/* Keyboard Base Plate */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[5.2, 0.2, 2.2]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
                </mesh>
                
                {/* Glowing Neon RGB Base Rim */}
                <mesh position={[0, -0.09, 0]}>
                    <boxGeometry args={[5.3, 0.04, 2.3]} />
                    <meshBasicMaterial color="#06b6d4" toneMapped={false} />
                </mesh>

                {/* Keyboard keycaps grid */}
                {Array.from({ length: 5 }).map((_, r) => (
                    <group key={`key-row-${r}`} position={[0, 0.15, -0.8 + r * 0.4]}>
                        {Array.from({ length: 13 }).map((_, c) => {
                            // High tech styling for keys
                            const isSpecial = r === 0 || c === 0 || c === 12;
                            const keyColor = isSpecial ? '#ff0055' : (r + c) % 6 === 0 ? '#00ffcc' : '#334155';
                            return (
                                <mesh key={`key-cap-${r}-${c}`} position={[-2.4 + c * 0.4, 0, 0]} castShadow>
                                    <boxGeometry args={[0.3, 0.14, 0.3]} />
                                    <meshStandardMaterial color={keyColor} roughness={0.2} />
                                </mesh>
                            );
                        })}
                    </group>
                ))}

                {/* Futuristic Holographic Floating Core system above keyboard */}
                <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.3}>
                    <group position={[0, 2.4, -0.5]}>
                        <mesh castShadow>
                            <octahedronGeometry args={[0.35]} />
                            <meshStandardMaterial color="#00ffcc" emissive="#06b6d4" emissiveIntensity={0.8} roughness={0.1} />
                        </mesh>
                        
                        {/* Core Orbit Ring */}
                        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                            <torusGeometry args={[0.65, 0.015, 8, 48]} />
                            <meshBasicMaterial color="#ff0055" transparent opacity={0.6} />
                        </mesh>

                        <Text position={[0, 0.7, 0]} fontSize={0.26} color="#f8fafc" letterSpacing={0.15} outlineWidth={0.02} outlineColor="#000">
                            CORE.SYS
                        </Text>
                    </group>
                </Float>
            </group>

            {/* Player Zones */}
            {game.players.map((p, i) => {
                // Determine layout mapping
                let posRot;
                if (game.players.length === 2) {
                    posRot = i === game.currentIdx ? positions[0] : positions[2];
                } else if (game.players.length === 3) {
                    const mappedIdx = (i - game.currentIdx + 3) % 3;
                    if (mappedIdx === 0) posRot = positions[0];
                    else if (mappedIdx === 1) posRot = positions[1];
                    else posRot = positions[3];
                } else {
                    const mappedIdx = (i - game.currentIdx + 4) % 4;
                    posRot = positions[mappedIdx];
                }

                if (!posRot) return null;

                const isCurrent = p.id === game.currentIdx;

                return (
                    <group key={p.id} position={posRot.pos} rotation={posRot.rot}>
                        {!isCurrent && (
                            <group position={[0, 4, -2]}>
                                {/* T-Shape Stand */}
                                {/* T-foot Horizontal Front Bar */}
                                <mesh position={[0, -4.4, 1.0]} castShadow receiveShadow>
                                    <boxGeometry args={[8, 0.15, 0.6]} />
                                    <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
                                </mesh>
                                {/* T-foot Depth Bar */}
                                <mesh position={[0, -4.4, -0.7]} castShadow receiveShadow>
                                    <boxGeometry args={[0.8, 0.15, 3]} />
                                    <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
                                </mesh>
                                {/* Vertical Neck */}
                                <mesh position={[0, -2.2, -2.0]} rotation={[0.05, 0, 0]} castShadow>
                                    <boxGeometry args={[0.8, 4.4, 0.4]} />
                                    <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.2} />
                                </mesh>

                                {/* Flat Monitor Chassis */}
                                <group position={[0, 0, 0]}>
                                    {/* The Monitor Shell */}
                                    <mesh position={[0, 0, -0.25]} castShadow receiveShadow>
                                        <boxGeometry args={[17, 9, 0.5]} />
                                        <meshStandardMaterial color="#020617" metalness={0.6} roughness={0.4} />
                                    </mesh>

                                    {/* 2D Flat UI Projected on Screen */}
                                    <MonitorScreenUI player={p} />

                                    {/* Glass Screen Plane (Front) */}
                                    <mesh position={[0, 0, 0.05]} receiveShadow>
                                        <planeGeometry args={[16.6, 8.6]} />
                                        <meshPhysicalMaterial color="#000" metalness={0.9} roughness={0.1} transmission={0.2} clearcoat={1} />
                                    </mesh>
                                </group>
                            </group>
                        )}
                        {/* Only render Current Player directly on the main desk */}
                        {isCurrent && (
                            <PlayerZone3D 
                                player={p} 
                                isCurrent={isCurrent}
                                position={[0, 0, 0]}
                                rotation={[0, 0, 0]}
                            />
                        )}
                    </group>
                );
            })}
        </group>
    );
}
