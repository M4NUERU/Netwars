import { Text, Float } from '@react-three/drei';
import PlayerZone3D from './PlayerZone3D';

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
            {/* Sleek Dark Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.5, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial 
                    color="#030712" 
                    metalness={0.6} 
                    roughness={0.4} 
                    envMapIntensity={0.5} 
                />
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

                return (
                    <PlayerZone3D 
                        key={p.id} 
                        player={p} 
                        isCurrent={p.id === game.currentIdx}
                        position={posRot.pos}
                        rotation={posRot.rot}
                    />
                );
            })}
        </group>
    );
}
