import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Board3D from './Board3D';
import Hand3D from './Hand3D';

export default function GameScene3D({ game, onPlayCard, onHoverCard, onHoverEnd }) {
    if (!game) return null;

    const currentPlayer = game.players[game.currentIdx];

    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Canvas shadows camera={{ position: [0, 8, 14], fov: 45 }}>
                <color attach="background" args={['#050508']} />
                
                <ambientLight intensity={0.4} />
                <directionalLight 
                    position={[5, 10, 5]} 
                    intensity={1.5} 
                    castShadow 
                    shadow-mapSize={[1024, 1024]} 
                />
                
                <Environment preset="night" />

                <Board3D game={game} />
                
                <Hand3D 
                    hand={currentPlayer.hand}
                    onPlayCard={onPlayCard}
                    onHoverCard={onHoverCard}
                    onHoverEnd={onHoverEnd}
                />

                <OrbitControls 
                    makeDefault 
                    enablePan={false}
                    minPolarAngle={Math.PI / 6} 
                    maxPolarAngle={Math.PI / 2.5}
                    minDistance={8}
                    maxDistance={25}
                />
            </Canvas>
        </div>
    );
}
