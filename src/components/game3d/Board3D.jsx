import { Text, Float } from '@react-three/drei';
import PlayerZone3D from './PlayerZone3D';

export default function Board3D({ game }) {
    // We arrange players around the center node.
    // Assuming 2 to 4 players.
    // If 2: one at z = -6, one at z = 6
    // If 3-4: x = -8, 8 and z = -6, 6

    const positions = [
        { pos: [0, 0, 14], rot: [0, Math.PI, 0] },     // Bottom (Current Player)
        { pos: [0, 0, -14], rot: [0, 0, 0] },          // Top
        { pos: [-16, 0, 0], rot: [0, Math.PI/2, 0] },  // Left
        { pos: [16, 0, 0], rot: [0, -Math.PI/2, 0] },  // Right
    ];

    return (
        <group>
            {/* Sleek Dark Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.5, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial 
                    color="#09090b" 
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
                        <meshStandardMaterial 
                            color="#18181b" 
                            metalness={0.8}
                            roughness={0.2}
                            emissive="#6366f1"
                            emissiveIntensity={0.2}
                        />
                    </mesh>
                    
                    {/* Elegant Ambient Ring */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                        <torusGeometry args={[3, 0.02, 16, 100]} />
                        <meshBasicMaterial color="#818cf8" transparent opacity={0.3} />
                    </mesh>
                    
                    {/* Inner Glowing Core */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[1.9, 2.6, 1.9]} />
                        <meshBasicMaterial color="#6366f1" transparent opacity={0.1} />
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
                    posRot = i === game.currentIdx ? positions[0] : positions[1];
                } else {
                    // Just cycle through them but ensure current player is at [0] mapping
                    const mappedIdx = (i - game.currentIdx + game.players.length) % game.players.length;
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
