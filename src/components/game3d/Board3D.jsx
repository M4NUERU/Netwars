import { Text, Html, Grid, Float } from '@react-three/drei';
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
            {/* Grid/Table Base */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.5, 0]}>
                <planeGeometry args={[40, 40]} />
                <meshStandardMaterial color="#050510" metalness={0.9} roughness={0.5} />
            </mesh>
            
            <Grid 
                args={[40, 40]} 
                sectionColor="#00ffcc" 
                cellColor="#222244" 
                position={[0, -0.49, 0]} 
                fadeDistance={30} 
                fadeStrength={1} 
            />

            {/* Central ISP Node */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <group position={[0, 0.5, 0]}>
                    <mesh castShadow receiveShadow>
                        <cylinderGeometry args={[1.5, 2, 0.5, 6]} />
                        <meshStandardMaterial color="#00ffcc" emissive="#005544" />
                    </mesh>
                    
                    {/* Glowing Ring */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                        <torusGeometry args={[2.5, 0.05, 16, 100]} />
                        <meshBasicMaterial color="#00ffcc" transparent opacity={0.6} />
                    </mesh>

                    <Text position={[0, 0.3, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.6} color="#000">
                        ISP
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
