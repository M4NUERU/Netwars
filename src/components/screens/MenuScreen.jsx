import NetworkBackground from "../ui/NetworkBackground";

export default function MenuScreen({ onStart }) {
    return (
        <>
            <NetworkBackground />
            <div className="menu-wrap">
                <div className="menu-title mono" data-text="⚔ NETWARS">⚔ NETWARS</div>
                <div className="menu-sub">La Batalla por la Red</div>
                <div className="menu-desc">
                    Juego estratégico de redes y ciberseguridad<br />
                    Protege tus servicios. Destruye los de tus rivales.
                </div>
                <div className="btn-primary-wrap">
                    <button className="btn-primary" onClick={onStart}>
                        INICIAR PARTIDA
                    </button>
                </div>
            </div>
        </>
    );
}
