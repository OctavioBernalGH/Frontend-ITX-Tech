import { useEffect, useState, useMemo } from 'react';
import type { Product } from '../types';
import { getProducts, filterProducts } from '../services/productService';
import { ProductItem } from '../components/ProductItem';

const ITEMS_PER_PAGE = 8;

export const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getProducts().then(setProducts);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortOrder]);

    const processedData = useMemo(() => {
        let result = filterProducts(products, search);

        if (sortOrder) {
            result = [...result].sort((a, b) => {
                const priceA = a.price && a.price !== '' ? parseFloat(a.price) : 0;
                const priceB = b.price && b.price !== '' ? parseFloat(b.price) : 0;

                if (sortOrder === 'asc') {
                    return priceA - priceB;
                } else {
                    return priceB - priceA;
                }
            });
        }

        return result;
    }, [products, search, sortOrder]);

    const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
    const paginatedList = processedData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value as 'asc' | 'desc' | '');
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="product-list-page">

            <div className="actions-bar">
                <select
                    className="sort-select"
                    value={sortOrder}
                    onChange={handleSort}
                >
                    <option value="">ORDENAR POR</option>
                    <option value="asc">PRECIO: MENOR A MAYOR</option>
                    <option value="desc">PRECIO: MAYOR A MENOR</option>
                </select>

                <input
                    type="text"
                    placeholder="BUSCAR..."
                    value={search}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>

            <div className="product-grid">
                {paginatedList.map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>

            {processedData.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>NO SE ENCONTRARON RESULTADOS.</p>
                </div>
            )}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(1)}
                        title="Ir a la primera página"
                    >
                        PRIMERA
                    </button>

                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        ANTERIOR
                    </button>

                    <span className="page-info">
                        {currentPage} / {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        SIGUIENTE
                    </button>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        title="Ir a la última página"
                    >
                        ÚLTIMA
                    </button>
                </div>
            )}
        </div>
    );
};