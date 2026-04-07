import { useState, useEffect } from "react";
import { TYPE_COLOR, TYPE_LABEL } from "../../constants/gameConstants";

export default function CardMini({ card, onPlay, onHoverStart, onHoverEnd, index }) {
    const [isEntering, setIsEntering] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsEntering(false), 400 + index * 100);
        return () => clearTimeout(timer);
    }, [index]);

    const handlePlay = () => {
        setIsPlaying(true);
        onHoverEnd();
        setTimeout(() => onPlay(card), 400); // Wait for play animation
    };

    const handleMouseMove = (e) => {
        // Subtle CSS 3D effect controlled by JS
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((rect.height / 2 - y) / rect.height) * 20;
        const rotateY = ((x - rect.width / 2) / rect.width) * 20;

        e.currentTarget.style.transform = `translateY(-8px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = "";
        onHoverEnd();
    };

    let className = "card-mini";
    if (isEntering) className += " enter";
    if (isPlaying) className += " play-anim";

    return (
        <div
            className={className}
            style={{
                borderColor: TYPE_COLOR[card.type],
                boxShadow: `0 0 10px ${TYPE_COLOR[card.type]}22`,
                animationDelay: isEntering ? `${index * 0.05}s` : "0s",
                '--glow-color': TYPE_COLOR[card.type],
            }}
            onClick={handlePlay}
            onMouseEnter={() => onHoverStart(card)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <span className="card-icon">{card.icon}</span>
            <span className="card-name mono" style={{ color: TYPE_COLOR[card.type] }}>
                {card.name}
            </span>
            <span className="card-badge mono" style={{ color: TYPE_COLOR[card.type] + "99" }}>
                {TYPE_LABEL[card.type]}
            </span>
        </div>
    );
}
