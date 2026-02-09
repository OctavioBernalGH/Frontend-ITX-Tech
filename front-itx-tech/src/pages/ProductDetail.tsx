import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { ProductDetail as ProductDetailData } from '../types';
import { getProductById, addToCart } from '../services/productService';

import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCartGlobal } = useCart();
    const { showToast } = useToast();
    const [selectedColor, setSelectedColor] = useState<number | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getProductById(id).then((data) => {
                setProduct(data);
                if (data && data.options) {
                    if (data.options.colors.length > 0) {
                        setSelectedColor(data.options.colors[0].code);
                    }
                    if (data.options.storages.length > 0) {
                        setSelectedStorage(data.options.storages[0].code);
                    }
                }
                setLoading(false);
            });
        }
    }, [id]);

    const handleAddToCart = async () => {
        if (product && selectedColor && selectedStorage) {
            await addToCart({
                id: product.id,
                colorCode: selectedColor,
                storageCode: selectedStorage
            });

            const colorName = product.options.colors.find(c => c.code === selectedColor)?.name || '';
            const storageName = product.options.storages.find(s => s.code === selectedStorage)?.name || '';

            addToCartGlobal({
                id: product.id,
                brand: product.brand,
                model: product.model,
                price: product.price,
                imgUrl: product.imgUrl,
                color: colorName,
                storage: storageName
            });

            showToast(`AÑADIDO: ${product.brand} ${product.model}`);
        }
    };

    if (loading) return <div className="loading-screen">CARGANDO...</div>;
    if (!product) return <div className="loading-screen">PRODUCTO NO ENCONTRADO</div>;

    const formatCamera = (cam: string | string[]) => Array.isArray(cam) ? cam.join(', ') : cam;

    return (
        <div className="detail-container">

            <div className="detail-image-col">
                <Link to="/" className="back-link">← VOLVER</Link>
                <div className="detail-image-wrapper">
                    <img src={product.imgUrl} alt={product.model} />
                </div>
            </div>

            <div className="detail-info-col">
                <div className="product-header">
                    <h2 className="detail-brand">{product.brand}</h2>
                    <h1 className="detail-model">{product.model}</h1>
                    <p className="detail-price">{product.price} €</p>
                </div>

                <div className="specs-section" style={{ marginBottom: '40px' }}>
                    <h3>ESPECIFICACIONES</h3>
                    <dl className="specs-list">
                        <div className="spec-item"><dt>CPU</dt><dd>{product.cpu}</dd></div>
                        <div className="spec-item"><dt>RAM</dt><dd>{product.ram}</dd></div>
                        <div className="spec-item"><dt>SISTEMA</dt><dd>{product.os}</dd></div>
                        <div className="spec-item"><dt>PANTALLA</dt><dd>{product.displayResolution}</dd></div>
                        <div className="spec-item"><dt>BATERÍA</dt><dd>{product.battery}</dd></div>
                        <div className="spec-item"><dt>CÁMARAS</dt><dd>{formatCamera(product.primaryCamera)}</dd></div>
                        <div className="spec-item"><dt>DIMENSIONES</dt><dd>{product.dimentions}</dd></div>
                        <div className="spec-item"><dt>PESO</dt><dd>{product.weight} g</dd></div>
                    </dl>
                </div>

                <div className="action-area" style={{ borderTop: '1px solid #000', paddingTop: '30px' }}>
                    <div className="options-section">
                        <div className="option-group">
                            <label>ALMACENAMIENTO</label>
                            <div className="selector-grid">
                                {product.options.storages.map((storage) => (
                                    <button
                                        key={storage.code}
                                        className={`option-btn ${selectedStorage === storage.code ? 'selected' : ''}`}
                                        onClick={() => setSelectedStorage(storage.code)}
                                    >
                                        {storage.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="option-group">
                            <label>COLOR</label>
                            <div className="selector-grid">
                                {product.options.colors.map((color) => (
                                    <button
                                        key={color.code}
                                        className={`option-btn ${selectedColor === color.code ? 'selected' : ''}`}
                                        onClick={() => setSelectedColor(color.code)}
                                    >
                                        {color.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button className="add-cart-btn" onClick={handleAddToCart}>
                        AÑADIR A LA CESTA
                    </button>
                </div>

            </div>
        </div>
    );
};