import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Header = () => {
    const { count } = useCart();

    return (
        <header className="header">
            <nav>
                <div className="logo">
                    <Link to="/">ZARA PHONE</Link>
                </div>
                <div className="header-actions">
                    <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
                        CESTA ({count})
                    </Link>
                </div>
            </nav>
        </header>
    );
};