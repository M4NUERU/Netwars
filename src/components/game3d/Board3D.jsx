import { Text, Float } from '@react-three/drei';
import PlayerZone3D from './PlayerZone3D';
import MonitorScreenUI from './MonitorScreenUI';

export default function Board3D({ game }) {
    // We arrange players around the center node.
    // Assuming 2 to 4 players.
    // If 2: one at z = -6, one at z = 6
    // If 3-4: x = -8, 8 and z = -6, 6

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
                    color="#0f172a" 
                    metalness={0.2} 
                    roughness={0.8} 
                />
            </mesh>
            {/* Desk Mat (Current Player) */}
            <mesh receiveShadow position={[0, -0.49, 10]}>
                <boxGeometry args={[18, 0.02, 10]} />
                <meshStandardMaterial color="#020617" roughness={0.9} />
            </mesh>

            {/* Central Server Node (formerly ISP) */}
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
                <group position={[0, 0.4, 0]}>
                    <mesh castShadow receiveShadow>
                        <boxGeometry args={[2, 2.5, 2]} />
                        <meshPhysicalMaterial 
                            color="#020617" 
                            metalness={0.9}
                            roughness={0.1}
                            emissive="#06b6d4"
                            emissiveIntensity={0.4}
                            clearcoat={1}
                        />
                    </mesh>
                    
                    {/* Elegant Ambient Ring */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                        <torusGeometry args={[3, 0.02, 16, 100]} />
                        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
                    </mesh>
                    
                    {/* Inner Glowing Core */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[1.9, 2.6, 1.9]} />
                        <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} />
                    </mesh>

                    <Text position={[0, 1.35, 0]} fontSize={0.4} color="#f8fafc" letterSpacing={0.1}>
                        CORE
                    </Text>
                </group>
            </Float>

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

                                    {/* Glass Screen Plane (Front) */}
                                    <mesh position={[0, 0, 0.05]} receiveShadow>
                                        <planeGeometry args={[16.6, 8.6]} />
                                        <meshPhysicalMaterial color="#000" metalness={0.9} roughness={0.1} transmission={0.2} clearcoat={1} />
                                    </mesh>

                                    {/* 2D Flat UI Projected on Screen */}
                                    <MonitorScreenUI player={p} />
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
