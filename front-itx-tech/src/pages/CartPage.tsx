import { useMemo, useState } from 'react'; // Importar useState
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext'; // Importar Toast
import { CartItemRow } from '../components/CardItemRow';
import { CheckoutModal } from '../components/CheckoutModal'; // Importar Modal

export const CartPage = () => {
    const { cartItems, removeFromCart, clearCart } = useCart(); // Traer clearCart
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // Estado del modal

    const totalPrice = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            const price = item.price ? parseFloat(item.price) : 0;
            return acc + price;
        }, 0);
    }, [cartItems]);

    const handlePaymentSuccess = () => {
        setIsCheckoutOpen(false);
        clearCart(); // Vaciar carrito
        showToast("¡PAGO REALIZADO CON ÉXITO!");
        navigate('/'); // Volver al inicio
    };

    // ... (Bloque de carrito vacío igual que antes) ...
    if (cartItems.length === 0) {
        // ...
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

            {/* Botón que abre el modal */}
            <button
                className="checkout-btn"
                onClick={() => setIsCheckoutOpen(true)}
            >
                TRAMITAR PEDIDO
            </button>

            {/* Renderizado condicional del Modal */}
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