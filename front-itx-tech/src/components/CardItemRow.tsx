import type { CartItemState } from '../types';

interface CartItemRowProps {
    item: CartItemState;
    onRemove: () => void;
}

export const CartItemRow = ({ item, onRemove }: CartItemRowProps) => {
    return (
        <div className="cart-item">
            <div className="cart-img">
                <img src={item.imgUrl} alt={item.model} />
            </div>

            <div className="cart-info">
                <h3>{item.brand} {item.model}</h3>
                <p className="details">{item.color} | {item.storage}</p>
                <button onClick={onRemove} className="remove-btn">
                    ELIMINAR
                </button>
            </div>

            <div className="cart-price">
                {item.price ? `${item.price} €` : '-'}
            </div>
        </div>
    );
};