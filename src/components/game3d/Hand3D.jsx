import { useThree } from '@react-three/fiber';
import Card3D from './Card3D';

export default function Hand3D({ hand, onPlayCard, onHoverCard, onHoverEnd }) {
    const { camera } = useThree();

    // The camera is typically at [0, 8, 12] looking at [0, 0, 0]
    // We want the cards to hover in front of the camera, towards the bottom of the screen.
    // Instead of parenting to camera (which can be tricky with orbiting), we'll place them fixed
    // in the scene but lower down, or we just fix the camera and put them at a specific spot.
    // Let's place them at z = 8, y = 3.

    const spacing = 2.2;
    const totalWidth = (hand.length - 1) * spacing;
    const startX = -totalWidth / 2;

    return (
        <group position={[0, 4, 9]} rotation={[-Math.PI / 6, 0, 0]}>
            {hand.map((card, i) => {
                const x = startX + i * spacing;
                // Add a slight arc effect
                const y = -Math.abs(x) * 0.1;
                const rotZ = x * -0.05;

                return (
                    <Card3D
                        key={card.uid}
                        card={card}
                        index={i}
                        position={[x, y, 0]}
                        rotation={[0, 0, rotZ]}
                        onHoverStart={onHoverCard}
                        onHoverEnd={onHoverEnd}
                        onClick={onPlayCard}
                    />
                );
            })}
        </group>
    );
}
