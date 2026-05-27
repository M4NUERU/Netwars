import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function MonitorScreenUI({ player }) {
    const canvas = useMemo(() => {
        const c = document.createElement('canvas');
        c.width = 1024;
        c.height = 512;
        return c;
    }, []);

    const textureRef = useRef();

    // Draw content to canvas
    useEffect(() => {
        if (!player || !canvas) return;

        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;
        
        // 1. Deep Cyber Background
        ctx.fillStyle = '#060913';
        ctx.fillRect(0, 0, W, H);
        
        // 2. Futuristic Grid Pattern
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
        ctx.lineWidth = 1;
        const gridSize = 32;
        for (let x = 0; x < W; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (let y = 0; y < H; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }

        // Theme colors
        const themeColor = player.color || '#00ffcc';
        const integrityColor = '#06b6d4';
        
        // 3. Glowing Corner Ornaments (Cyberpunk HUD style)
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 4;
        const offset = 24;
        const len = 30;
        
        // Top-Left
        ctx.beginPath(); ctx.moveTo(offset, offset + len); ctx.lineTo(offset, offset); ctx.lineTo(offset + len, offset); ctx.stroke();
        // Top-Right
        ctx.beginPath(); ctx.moveTo(W - offset - len, offset); ctx.lineTo(W - offset, offset); ctx.lineTo(W - offset, offset + len); ctx.stroke();
        // Bottom-Left
        ctx.beginPath(); ctx.moveTo(offset, H - offset - len); ctx.lineTo(offset, H - offset); ctx.lineTo(offset + len, H - offset); ctx.stroke();
        // Bottom-Right
        ctx.beginPath(); ctx.moveTo(W - offset - len, H - offset); ctx.lineTo(W - offset, H - offset); ctx.lineTo(W - offset, H - offset - len); ctx.stroke();

        // Subtle inner bounding box
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(offset + 10, offset + 10, W - (offset + 10) * 2, H - (offset + 10) * 2);

        // 4. Header Bar
        ctx.textBaseline = 'top';
        
        // Glitchy Cyber Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px monospace';
        ctx.fillText(`// SYSTEM.MONITOR: ${player.name.toUpperCase()}`, 50, 45);
        
        // Status indicator badge
        ctx.fillStyle = 'rgba(0, 255, 204, 0.1)';
        ctx.fillRect(W - 270, 42, 220, 38);
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(W - 270, 42, 220, 38);
        
        ctx.fillStyle = themeColor;
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SECURE // CONNECTED', W - 160, 52);
        ctx.textAlign = 'left'; // Reset

        // 5. Integrity Bar (Integridad de Red)
        const services = player.services || [];
        const activeServicesCount = services.filter(s => s.up).length;
        const integrityPercent = services.length > 0 ? (activeServicesCount / services.length) * 100 : 0;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('NETWORK INTEGRITY PROFILE', 50, 96);
        
        // Drawing the progress bar container
        const barX = 50;
        const barY = 118;
        const barW = W - 100;
        const barH = 14;
        ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.strokeRect(barX, barY, barW, barH);
        
        // Draw segmented progress blocks
        const segmentCount = 20;
        const filledSegments = Math.round((integrityPercent / 100) * segmentCount);
        const segW = (barW - (segmentCount - 1) * 3) / segmentCount;
        
        for (let i = 0; i < segmentCount; i++) {
            if (i < filledSegments) {
                // Color fades from cyan to red if integrity is dropping
                ctx.fillStyle = integrityPercent > 50 ? '#00f0ff' : integrityPercent > 20 ? '#ffaa00' : '#ff0055';
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            }
            ctx.fillRect(barX + i * (segW + 3), barY + 2, segW, barH - 4);
        }
        
        // Percentage indicator text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`[ ${integrityPercent}% INTEGRITY VALUE ]`, W - 280, 94);

        // 6. Services Grid Section
        ctx.fillStyle = '#8892b0';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('NODE SERVICES LAYER', 50, 150);

        const svcW = (W - 140) / 2; // Two columns
        const svcH = 42;
        
        services.forEach((svc, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            
            const x = 50 + col * (svcW + 40);
            const y = 185 + row * (svcH + 18);
            
            // Neon glass background for each service
            ctx.fillStyle = svc.up ? 'rgba(0, 240, 255, 0.04)' : 'rgba(255, 0, 85, 0.04)';
            ctx.fillRect(x, y, svcW, svcH);
            
            // Glowing border edge
            ctx.strokeStyle = svc.up ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 0, 85, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y, svcW, svcH);
            
            // Status left accent bar
            ctx.fillStyle = svc.up ? '#00ffcc' : '#ff3d5a';
            ctx.fillRect(x, y, 6, svcH);
            
            // Service Name with cyberpunk chevron
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px monospace';
            ctx.fillText(`> ${svc.name.toUpperCase()}`, x + 20, y + 12);
            
            // Service Status Badge
            ctx.fillStyle = svc.up ? 'rgba(0, 255, 204, 0.1)' : 'rgba(255, 61, 90, 0.1)';
            ctx.fillRect(x + svcW - 110, y + 8, 90, 26);
            ctx.strokeStyle = svc.up ? '#00ffcc' : '#ff3d5a';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + svcW - 110, y + 8, 90, 26);
            
            ctx.fillStyle = svc.up ? '#00ffcc' : '#ff3d5a';
            ctx.font = 'bold 13px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(svc.up ? 'ACTIVE' : 'OFFLINE', x + svcW - 65, y + 14);
            ctx.textAlign = 'left'; // Reset
        });

        // 7. Active Defenses HUD Bar
        const defensesY = H - 85;
        
        // Horizontal divider line
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, defensesY - 15);
        ctx.lineTo(W - 50, defensesY - 15);
        ctx.stroke();

        ctx.fillStyle = '#8892b0';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('ACTIVE GATEWAYS & FIREWALLS', 50, defensesY - 5);

        const defenses = player.defenses || [];
        
        if (defenses.length === 0) {
            ctx.fillStyle = '#444c66';
            ctx.font = 'italic 16px monospace';
            ctx.fillText('NO SYSTEM GATEWAY ACTIVE - PERIMETER VULNERABLE', 50, defensesY + 24);
        } else {
            // Draw cute neon badges for each active defense
            let badgeX = 50;
            defenses.forEach((def) => {
                const text = def.toUpperCase();
                ctx.font = 'bold 14px monospace';
                const textW = ctx.measureText(text).width + 30;
                
                // Badge background
                ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
                ctx.fillRect(badgeX, defensesY + 20, textW, 28);
                
                // Orange border
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(badgeX, defensesY + 20, textW, 28);
                
                // Glow marker dot inside badge
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.arc(badgeX + 14, defensesY + 34, 4, 0, Math.PI * 2);
                ctx.fill();
                
                // Defense Name
                ctx.fillStyle = '#ffffff';
                ctx.fillText(text, badgeX + 24, defensesY + 26);
                
                badgeX += textW + 16;
            });
        }

        // 8. Scanline overlay effect
        ctx.fillStyle = 'rgba(6, 9, 19, 0.12)';
        for (let i = 0; i < H; i += 4) {
            ctx.fillRect(0, i, W, 2);
        }
        
        // Alert texture update
        if (textureRef.current) {
            textureRef.current.needsUpdate = true;
        }
    }, [player, canvas]);

    if (!player) return null;

    return (
        <mesh position={[0, 0, 0.06]} rotation={[0, 0, 0]}>
            <planeGeometry args={[16.5, 8.5]} />
            <meshBasicMaterial transparent={false} side={THREE.DoubleSide}>
                <canvasTexture ref={textureRef} attach="map" image={canvas} />
            </meshBasicMaterial>
        </mesh>
    );
}
