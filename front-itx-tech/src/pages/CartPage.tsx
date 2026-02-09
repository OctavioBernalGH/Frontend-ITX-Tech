import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItemRow } from '../components/CardItemRow';

export const CartPage = () => {
    const { cartItems, removeFromCart } = useCart();

    const totalPrice = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            const price = item.price ? parseFloat(item.price) : 0;
            return acc + price;
        }, 0);
    }, [cartItems]);

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart-container">
                <h2>TU CESTA ESTÁ VACÍA</h2>
                <Link to="/" className="btn btn-primary btn-empty-cart">
                    VOLVER A LA TIENDA
                </Link>
            </div>
        );
    }

    return (
        <div className="app-container cart-page-container">
            <h1 className="cart-title">CESTA ({cartItems.length})</h1>

            <div className="cart-list">
                {cartItems.map((item, index) => (
                    <CartItemRow
                        key={`${item.id}-${index}`}
                        item={item}
                        onRemove={() => removeFromCart(index)}
                    />
                ))}
            </div>

            <div className="cart-total">
                <span>TOTAL</span>
                <span>{totalPrice} €</span>
            </div>

            <button className="checkout-btn" onClick={() => alert("Funcionalidad de Checkout no implementada")}>
                TRAMITAR PEDIDO
            </button>
        </div>
    );
};