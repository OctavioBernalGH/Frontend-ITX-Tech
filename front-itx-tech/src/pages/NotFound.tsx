import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                {/* Efecto de texto gigante hueco */}
                <h1 className="error-code">404</h1>

                <h2 className="error-title">PIEZA NO ENCONTRADA</h2>

                <p className="error-desc">
                    Lo sentimos, la página que buscas no está disponible.
                </p>

                <Link to="/" className="btn-fashion-back">
                    VOLVER A LA TIENDA
                </Link>
            </div>
        </div>
    );
};