import { WIN_TURNS } from "../../constants/gameConstants";

export default function GameOverScreen({ winner, onNewGame }) {
    return (
        <div className="gameover-wrap">
            <div className="trophy">🏆</div>
            <div className="gameover-name mono" style={{ color: winner.color }}>
                {winner.name}
            </div>
            <div
                style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 13,
                    color: "#4dabff",
                    letterSpacing: 2,
                }}
            >
                VICTORIA
            </div>
            <div className="gameover-sub">
                Mantuvo los 5 servicios activos durante<br />
                {WIN_TURNS} turnos consecutivos sin interrupciones.
            </div>
            <button className="btn-primary" onClick={onNewGame}>
                NUEVA PARTIDA
            </button>
        </div>
    );
}
