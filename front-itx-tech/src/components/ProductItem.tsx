import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MouseEvent } from 'react';
import type { Product, ProductDetail } from '../types';
import { getProductById, addToCart } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface ProductItemProps {
    product: Product;
}

export const ProductItem = ({ product }: ProductItemProps) => {
    const { addToCartGlobal } = useCart();
    const { showToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState<ProductDetail | null>(null);
    const [selectedColor, setSelectedColor] = useState<number | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<number | null>(null);

    const handleOpenModal = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        setShowModal(true);

        try {
            const data = await getProductById(product.id);
            if (data) {
                setDetails(data);
                if (data.options.colors.length > 0) {
                    setSelectedColor(data.options.colors[0].code);
                }
                if (data.options.storages.length > 0) {
                    setSelectedStorage(data.options.storages[0].code);
                }
            }
        } catch (error) {
            console.error('Error fetching details:', error);
            showToast('Error al cargar opciones del producto');
            setShowModal(false);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAdd = async () => {
        if (!details || !selectedColor || !selectedStorage) return;

        setLoading(true);

        try {
            await addToCart({
                id: product.id,
                colorCode: selectedColor,
                storageCode: selectedStorage
            });

            const colorObj = details.options.colors.find(c => c.code === selectedColor);
            const storageObj = details.options.storages.find(s => s.code === selectedStorage);

            addToCartGlobal({
                id: product.id,
                brand: product.brand,
                model: product.model,
                price: product.price,
                imgUrl: product.imgUrl,
                color: colorObj?.name || 'Estándar',
                storage: storageObj?.name || 'Estándar'
            });

            setShowModal(false);
            showToast(`AÑADIDO: ${product.brand} ${product.model}`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast('Error al añadir al carrito');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = (e?: MouseEvent) => {
        if (e) e.stopPropagation();
        setShowModal(false);
    };

    return (
        <>
            <article className="product-item">
                <Link to={`/product/${product.id}`} className="image-container">
                    <img src={product.imgUrl} alt={`${product.brand} ${product.model}`} loading="lazy" />
                </Link>

                <div className="info">
                    <div className="info-text">
                        <h3>{product.brand}</h3>
                        <div className="model">{product.model}</div>
                    </div>
                    <div className="price">{product.price ? `${product.price} €` : 'Consultar'}</div>
                </div>

                <div className="item-actions">
                    <button
                        className="btn btn-primary"
                        onClick={handleOpenModal}
                        disabled={loading && showModal} // Evitar doble click mientras abre
                    >
                        AÑADIR
                    </button>

                    <Link to={`/product/${product.id}`} className="btn btn-secondary">
                        VER DETALLES
                    </Link>
                </div>
            </article>

            {showModal && (
                <div className="modal-overlay" onClick={() => handleCloseModal()}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <button className="modal-close" onClick={() => handleCloseModal()}>×</button>

                        <div className="modal-header">
                            <span className="modal-subtitle">SELECCIONAR OPCIONES</span>
                            <div className="modal-product-name">{product.brand} {product.model}</div>
                        </div>

                        {(loading && !details) ? (
                            <div className="modal-loading">CARGANDO...</div>
                        ) : details ? (
                            <div className="modal-body">
                                <div className="modal-image-row">
                                    <img src={details.imgUrl} alt={details.model} />
                                </div>

                                <div className="modal-selectors">
                                    <div className="selector-group">
                                        <label>ALMACENAMIENTO</label>
                                        <div className="selector-options">
                                            {details.options.storages.map(s => (
                                                <button
                                                    key={s.code}
                                                    className={`selector-btn ${selectedStorage === s.code ? 'active' : ''}`}
                                                    onClick={() => setSelectedStorage(s.code)}
                                                    disabled={loading}
                                                >
                                                    {s.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="selector-group">
                                        <label>COLOR</label>
                                        <div className="selector-options">
                                            {details.options.colors.map(c => (
                                                <button
                                                    key={c.code}
                                                    className={`selector-btn ${selectedColor === c.code ? 'active' : ''}`}
                                                    onClick={() => setSelectedColor(c.code)}
                                                    disabled={loading}
                                                >
                                                    {c.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary modal-confirm-btn"
                                    onClick={handleConfirmAdd}
                                    disabled={loading || !selectedColor || !selectedStorage}
                                >
                                    {loading ? 'PROCESANDO...' : 'AÑADIR A LA CESTA'}
                                </button>
                            </div>
                        ) : (
                            <div className="modal-error">No se pudieron cargar las opciones.</div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};