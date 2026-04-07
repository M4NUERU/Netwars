import PlayerZone from "./PlayerZone";

export default function GameBoard({ game }) {
    const topRow = game.players.slice(0, 2);
    const bottomRow = game.players.slice(2, 4);

    return (
        <div className="board">
            {/* Top row */}
            <div className="board-row">
                {topRow.map(p => (
                    <PlayerZone
                        key={p.id}
                        player={p}
                        isCurrent={p.id === game.currentIdx}
                    />
                ))}
                {/* ISP in center when 3–4 players */}
                {game.players.length >= 3 && (
                    <div className="isp-node">
                        <span>🌐</span>
                        <span className="isp-label">ISP</span>
                    </div>
                )}
            </div>

            {/* Bottom row (only if 3–4 players) */}
            {bottomRow.length > 0 && (
                <div className="board-row">
                    {bottomRow.map(p => (
                        <PlayerZone
                            key={p.id}
                            player={p}
                            isCurrent={p.id === game.currentIdx}
                        />
                    ))}
                    {/* Spacer to align under ISP */}
                    <div style={{ width: 68, flexShrink: 0 }} />
                </div>
            )}

            {/* ISP for 2-player (between zones) */}
            {game.players.length === 2 && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className="isp-node">
                        <span>🌐</span>
                        <span className="isp-label">ISP CENTRAL</span>
                    </div>
                </div>
            )}
        </div>
    );
}
