import { Text, Edges, Float, Sphere, Cylinder, Octahedron, TorusKnot, Cone, Icosahedron, Sparkles } from '@react-three/drei';
import Card3D from './Card3D';

const SERVICE_MODELS = [
    <sphereGeometry args={[0.4, 16, 16]} />,
    <torusKnotGeometry args={[0.25, 0.08, 64, 8]} />,
    <octahedronGeometry args={[0.4]} />,
    <cylinderGeometry args={[0.4, 0.4, 0.8, 16]} />,
    <coneGeometry args={[0.4, 0.8, 4]} />
];

export default function PlayerZone3D({ player, isCurrent, position, rotation }) {
    const d = player.defenses || [];
    const hasFw = d.includes("fw1") || d.includes("fw2");
    const hasVpn = d.includes("vpn");
    const hasIds = d.includes("ids") || d.includes("honeypot");
    const hasVlan = d.includes("vlan");
    const hasAcl = d.includes("acl");
    const hasSsl = d.includes("ssl");
    const hasDmz = d.includes("dmz");
    const hasRouting = d.includes("routing");
    const hasSwitch = d.includes("switch");
    const hasLb = d.includes("lb");

    return (
        <group position={position} rotation={rotation}>
            {/* Player base plate */}
            <mesh position={[0, -0.4, 3]} receiveShadow>
                <boxGeometry args={[14, 0.2, 5]} />
                <meshPhysicalMaterial color={isCurrent ? '#0a1526' : '#050505'} transmission={0.5} opacity={0.8} transparent roughness={0.2} />
                <Edges color={isCurrent ? player.color : '#334455'} threshold={15} />
            </mesh>

            {/* Player Name */}
            <Text position={[0, -0.2, 4.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.6} color={player.color}>
                {player.name.toUpperCase()}
            </Text>

            {/* Services Area */}
            <group position={[-3, 0, 1.5]}>
                <Text position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.3} color="#888">
                    SERVICIOS
                </Text>
                {/* 5 Service slots */}
                {Array.from({ length: 5 }).map((_, i) => {
                    const geometry = SERVICE_MODELS[i] || SERVICE_MODELS[0];
                    return (
                        <group key={`svc-${i}`} position={[(i - 2) * 1.5, 0.3, 1.5]}>
                            {player.services[i] ? (
                                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                                    <mesh>
                                        {geometry}
                                        <meshStandardMaterial color="#00ffcc" emissive="#00aa88" />
                                        <Edges color="#ffffff" />
                                    </mesh>
                                </Float>
                            ) : (
                                <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
                                    <mesh position={[0, -0.2, 0]}>
                                        {geometry}
                                        <meshStandardMaterial color="#222" emissive="#ff0000" emissiveIntensity={0.2} wireframe />
                                        <Sparkles count={15} scale={1.5} size={4} color="#888" speed={0.5} opacity={0.4} />
                                    </mesh>
                                </Float>
                            )}
                        </group>
                    );
                })}
            </group>

            {/* Custom Interactive Defense Effects */}
            {hasFw && (
                <Float speed={1} rotationIntensity={0} floatIntensity={0.2} position={[0, 0, 0.2]}>
                    <Text position={[0, 2.5, 0]} fontSize={0.4} color="#ff6600">FIREWALL</Text>
                    <Sparkles count={400} scale={[14, 3, 0.5]} size={6} speed={2} opacity={0.8} color="#ff3300" />
                    <mesh position={[0, 1.2, 0]}>
                        <boxGeometry args={[14.5, 2.5, 0.2]} />
                        <meshPhysicalMaterial color="#ff2200" transmission={0.9} transparent opacity={0.3} roughness={0.1} />
                        <Edges color="#ff5500" threshold={15} />
                    </mesh>
                </Float>
            )}

            {hasVpn && (
                <Float speed={3} rotationIntensity={0.5} floatIntensity={1} position={[6.5, 1.5, 3]}>
                    <Text position={[0, 1.2, 0]} fontSize={0.3} color="#00ff00">VPN</Text>
                    <group>
                        <mesh position={[0, -0.2, 0]}>
                            <boxGeometry args={[0.8, 0.6, 0.3]} />
                            <meshStandardMaterial color="#00aa00" emissive="#00cc00" />
                        </mesh>
                        <mesh position={[0, 0.2, 0]}>
                            <torusGeometry args={[0.3, 0.1, 16, 32, Math.PI]} />
                            <meshStandardMaterial color="#aaaaaa" metalness={0.8} roughness={0.2} />
                        </mesh>
                    </group>
                </Float>
            )}

            {hasIds && (
                <Float speed={4} rotationIntensity={2} floatIntensity={0} position={[-6.5, 1, 3]}>
                    <Text position={[0, 1.5, 0]} fontSize={0.3} color="#4dabff">{d.includes("ids") ? "IDS" : "HONEYPOT"}</Text>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[1.5, 32]} />
                        <meshBasicMaterial color="#4dabff" transparent opacity={0.3} wireframe />
                    </mesh>
                    <mesh position={[0, 0.5, 0]}>
                        <coneGeometry args={[0.1, 1, 4]} />
                        <meshBasicMaterial color="#4dabff" />
                    </mesh>
                </Float>
            )}

            {hasVlan && (
                <mesh position={[0, -0.29, 3]} rotation={[-Math.PI/2, 0, 0]}>
                    <planeGeometry args={[13.8, 4.8]} />
                    <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.3} />
                    <Text position={[0, -2, 0.1]} fontSize={0.4} color="#00ffff">VLAN SEGMENTADA</Text>
                </mesh>
            )}

            {hasAcl && (
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[0, 1.5, 5]}>
                    <mesh>
                        <planeGeometry args={[2, 3]} />
                        <meshPhysicalMaterial color="#333" transmission={0.8} transparent opacity={0.5} />
                        <Edges color="#ffcc00" />
                    </mesh>
                    <Text position={[0, 0, 0.1]} fontSize={0.3} color="#ffcc00">ACL DENY</Text>
                </Float>
            )}

            {hasSsl && (
                <Float speed={3} rotationIntensity={1} floatIntensity={0.5} position={[0, 1.8, 1.5]}>
                    <mesh>
                        <torusKnotGeometry args={[0.4, 0.1, 64, 8]} />
                        <meshStandardMaterial color="#ffcc00" emissive="#aa8800" />
                    </mesh>
                    <Text position={[0, 0.8, 0]} fontSize={0.3} color="#ffcc00">SSL/TLS</Text>
                </Float>
            )}

            {hasDmz && (
                <mesh position={[0, 0.6, 3]}>
                    <boxGeometry args={[13.5, 2, 4.5]} />
                    <meshBasicMaterial color="#aa00ff" wireframe transparent opacity={0.2} />
                    <Text position={[0, 1.2, 0]} fontSize={0.4} color="#aa00ff">DMZ</Text>
                </mesh>
            )}

            {hasRouting && (
                <group position={[0, 0, 3]}>
                    <Sparkles count={50} scale={[13, 0.5, 4]} size={3} speed={5} opacity={1} color="#00ffcc" />
                    <Text position={[3, 0, 2]} fontSize={0.3} rotation={[-Math.PI/2,0,0]} color="#00ffcc">OSPF</Text>
                </group>
            )}

            {hasSwitch && (
                <group position={[0, 0, 3]}>
                    {[-6.5, 6.5].map((x, i) => [-2, 2].map((z, j) => (
                        <mesh key={`sw-${i}-${j}`} position={[x, 0, z]}>
                            <sphereGeometry args={[0.2, 16, 16]} />
                            <meshStandardMaterial color="#00ff00" emissive="#00aa00" />
                        </mesh>
                    )))}
                    <Text position={[-3, 0, 2]} fontSize={0.3} rotation={[-Math.PI/2,0,0]} color="#00ff00">SWITCH RSTP</Text>
                </group>
            )}

            {hasLb && (
                <group position={[-5, 2, 1.5]}>
                    <Float speed={5} rotationIntensity={2} floatIntensity={0}>
                        <mesh position={[-0.5, 0, 0]}><sphereGeometry args={[0.2]} /><meshStandardMaterial color="#ffff00" emissive="#cccc00" /></mesh>
                        <mesh position={[0.5, 0, 0]}><sphereGeometry args={[0.2]} /><meshStandardMaterial color="#ffff00" emissive="#cccc00" /></mesh>
                    </Float>
                    <Text position={[0, 0.6, 0]} fontSize={0.3} color="#ffff00">BALANCER</Text>
                </group>
            )}
        </group>
    );
}
