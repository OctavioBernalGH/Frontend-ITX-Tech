import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CartItemRow } from '../components/CardItemRow';
import { CheckoutModal } from '../components/CheckoutModal';
import { useSEO } from '../hooks/useSEO';

export const CartPage = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useSEO({
        title: `Cesta (${cartItems.length}) | ZARA PHONE`,
        description: 'Revisa tu selección de productos y finaliza tu compra de forma segura.'
    });

    const totalPrice = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            const price = item.price ? parseFloat(item.price) : 0;
            return acc + price;
        }, 0);
    }, [cartItems]);

    const handlePaymentSuccess = () => {
        setIsCheckoutOpen(false);
        clearCart();
        showToast("¡PAGO REALIZADO CON ÉXITO!");
        navigate('/');
    };


    if (cartItems.length === 0) {
        return (
            <div className="empty-cart-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '30px', letterSpacing: '1px' }}>
                    TU CESTA ESTÁ VACÍA
                </h2>
                <Link to="/" className="btn-fashion-back">
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

            <button
                className="checkout-btn"
                onClick={() => setIsCheckoutOpen(true)}
            >
                TRAMITAR PEDIDO
            </button>

            {isCheckoutOpen && (
                <CheckoutModal
                    total={totalPrice}
                    onClose={() => setIsCheckoutOpen(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};