import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

export interface CartItemType {
    id: string;
    brand: string;
    model: string;
    price: string;
    imgUrl: string;
    color: string;
    storage: string;
}

interface CartContextType {
    cartItems: CartItemType[];
    addToCartGlobal: (item: CartItemType) => void;
    removeFromCart: (index: number) => void;
    count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
        try {
            const savedCart = localStorage.getItem('my_cart_items');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error leyendo localStorage:", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('my_cart_items', JSON.stringify(cartItems));
        localStorage.setItem('cart_count', cartItems.length.toString());
    }, [cartItems]);

    const addToCartGlobal = (item: CartItemType) => {
        setCartItems((prev) => [...prev, item]);
    };

    const removeFromCart = (index: number) => {
        setCartItems((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCartGlobal, removeFromCart, count: cartItems.length }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
    return context;
};