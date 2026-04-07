import { TYPE_COLOR, TYPE_LABEL } from "../../constants/gameConstants";

export default function TooltipDock({ card }) {
    return (
        <div
            className={`tooltip-dock ${card ? "visible" : ""}`}
            style={{ borderColor: card ? TYPE_COLOR[card.type] : "transparent" }}
        >
            {card && (
                <>
                    <div className="tooltip-left">
                        <div className="tooltip-icon" style={{ color: TYPE_COLOR[card.type] }}>
                            {card.icon}
                        </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="tooltip-name mono" style={{ color: TYPE_COLOR[card.type] }}>
                            {card.name}
                        </div>
                        <div className="tooltip-type mono" style={{ color: TYPE_COLOR[card.type] + "88" }}>
                            {TYPE_LABEL[card.type]}
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <div className="tooltip-effect">{card.effect}</div>
                            {card.tech && (
                                <>
                                    <div className="tooltip-tech-label">FICHA TÉCNICA</div>
                                    <div className="tooltip-tech">{card.tech}</div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
