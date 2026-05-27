import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

export default function MonitorScreenUI({ player }) {
    const meshRef = useRef();
    const canvasRef = useRef();
    const textureRef = useRef();

    // Create canvas texture
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        canvasRef.current = canvas;
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.flipY = false;
        textureRef.current = texture;
        
        return texture;
    }, []);

    // Draw content to canvas
    useEffect(() => {
        if (!player || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas with a visible background for testing
        ctx.fillStyle = '#050a14';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Border
        ctx.strokeStyle = player.color || '#00ff00';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        // Test text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.textBaseline = 'top';
        ctx.fillText(`SYS.TARGET // ${player.name.toUpperCase()}`, 30, 30);
        
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('STATUS: ONLINE', canvas.width - 30, 30);
        
        // Services section
        ctx.fillStyle = '#888';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('[ NETWORK SERVICES ]', 30, 80);
        
        if (player.services && Array.isArray(player.services)) {
            player.services.forEach((svc, i) => {
                const y = 120 + i * 40;
                
                // Service box
                ctx.fillStyle = svc.up ? 'rgba(6, 182, 212, 0.2)' : 'rgba(239, 68, 68, 0.2)';
                ctx.fillRect(30, y, canvas.width - 60, 30);
                ctx.strokeStyle = svc.up ? '#06b6d4' : '#ef4444';
                ctx.lineWidth = 1;
                ctx.strokeRect(30, y, canvas.width - 60, 30);
                
                // Service name
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px monospace';
                ctx.fillText(svc.name, 45, y + 8);
                
                // Service status
                ctx.fillStyle = svc.up ? '#00ffcc' : '#ff3d5a';
                ctx.font = 'bold 16px monospace';
                ctx.fillText(svc.up ? 'UP' : 'DOWN', canvas.width - 45, y + 8);
            });
        }
        
        // Defenses section
        ctx.fillStyle = '#888';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('[ ACTIVE DEFENSES ]', 30, 350);
        
        const defenses = player.defenses || [];
        if (defenses.length === 0) {
            ctx.fillStyle = '#555';
            ctx.font = 'italic 14px monospace';
            ctx.fillText('No active defenses detected.', 30, 390);
        } else {
            defenses.forEach((def, i) => {
                const y = 390 + i * 25;
                
                // Defense background
                ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
                ctx.fillRect(30, y, canvas.width - 60, 20);
                
                // Defense left border
                ctx.fillStyle = '#f59e0b';
                ctx.fillRect(30, y, 3, 20);
                
                // Defense text
                ctx.fillStyle = '#f59e0b';
                ctx.font = 'bold 14px monospace';
                ctx.fillText(`> ${def.toUpperCase()}`, 40, y + 4);
            });
        }
        
        // Scanline effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        for (let i = 0; i < canvas.height; i += 3) {
            ctx.fillRect(0, i, canvas.width, 1);
        }
        
        // Update texture
        if (textureRef.current) {
            textureRef.current.needsUpdate = true;
        }
    }, [player]);

    if (!player) return null;

    return (
        <mesh position={[0, 0, 0.06]} rotation={[0, 0, 0]}>
            <planeGeometry args={[16.5, 8.5]} />
            <meshBasicMaterial 
                map={texture} 
                transparent={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}
