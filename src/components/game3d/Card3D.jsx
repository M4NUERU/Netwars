import { useRef, useState } from 'react';
import { useSpring, a } from '@react-spring/three';
import { Text, Html } from '@react-three/drei';
import { TYPE_COLOR } from '../../constants/gameConstants';

export default function Card3D({ card, index, position, rotation, isHovered, onHoverStart, onHoverEnd, onClick, playable = true }) {
    const mesh = useRef();

    const [hover, setHover] = useState(false);

    // Determine target transform
    const targetPos = hover ? [position[0], position[1] + 1, position[2] + 0.5] : position;
    const targetRot = hover ? [0, 0, 0] : rotation;
    const scale = hover ? [1.2, 1.2, 1.2] : [1, 1, 1];

    const { pos, rot, sc } = useSpring({
        pos: targetPos,
        rot: targetRot,
        sc: scale,
        config: { mass: 1, tension: 500, friction: 30 }
    });

    const color = TYPE_COLOR[card.type] || '#ffffff';

    return (
        <a.group
            position={pos}
            rotation={rot}
            scale={sc}
            ref={mesh}
            onPointerOver={(e) => {
                e.stopPropagation();
                if (playable) {
                    setHover(true);
                    if (onHoverStart) onHoverStart(card);
                }
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                if (playable) {
                    setHover(false);
                    if (onHoverEnd) onHoverEnd();
                }
            }}
            onClick={(e) => {
                e.stopPropagation();
                if (playable && onClick) onClick(card);
            }}
        >
            {/* Quartz/Glass Card Body */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[2, 3, 0.1]} />
                <meshPhysicalMaterial 
                    color="#060c18" 
                    metalness={0.1} 
                    roughness={0.05} 
                    transmission={0.95} 
                    thickness={0.8}
                    clearcoat={1}
                />
            </mesh>

            {/* Glowing Internal Core */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.9, 2.9, 0.05]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hover ? 0.8 : 0.2} toneMapped={false} />
            </mesh>

            {/* Front Face Content */}
            <group position={[0, 0, 0.06]}>
                {/* Header background */}
                <mesh position={[0, 1.1, 0]}>
                    <planeGeometry args={[1.8, 0.6]} />
                    <meshBasicMaterial color={color} />
                </mesh>
                
                <Text position={[-0.7, 1.1, 0.01]} fontSize={0.3} anchorX="left" anchorY="middle" color="#000">
                    {card.icon}
                </Text>
                
                <Text position={[-0.2, 1.1, 0.01]} fontSize={0.16} maxWidth={1.3} anchorX="left" anchorY="middle" color="#000">
                    {card.name.length > 12 ? card.name.substring(0, 11) + '...' : card.name}
                </Text>

                <Text position={[-0.8, 0.4, 0.01]} fontSize={0.12} maxWidth={1.6} anchorX="left" anchorY="top" color="#ffffff">
                    {card.effect}
                </Text>

                {/* Cyberpunk decoration lines */}
                <mesh position={[0, -1.2, 0.01]}>
                    <planeGeometry args={[1.8, 0.05]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
                </mesh>
            </group>
        </a.group>
    );
}
