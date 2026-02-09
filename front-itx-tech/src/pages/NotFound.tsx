import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

export const NotFound = () => {

    useSEO({
        title: 'Página no encontrada | ZARA PHONE',
        description: 'Error 404. La página que buscas no existe o ha sido movida.'
    });

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="error-code">404</h1>
                <p className="error-desc" style={{ marginTop: "1rem" }}>
                    Lo sentimos, la página que buscas no está disponible.
                </p>
                <Link to="/" className="btn-fashion-back">
                    VOLVER A LA TIENDA
                </Link>
            </div>
        </div>
    );
};