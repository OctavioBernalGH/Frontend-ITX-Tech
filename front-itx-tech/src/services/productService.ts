import type { Product, ProductDetail, CartItemPayload } from '../types';

const API_URL = 'https://itx-frontend-test.onrender.com/api/product';
const CACHE_KEY = 'products_list_cache';
const EXPIRATION_TIME = 3600 * 1000;

interface CacheData {
    data: Product[];
    timestamp: number;
}

export const getProducts = async (): Promise<Product[]> => {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
        try {
            const { data, timestamp }: CacheData = JSON.parse(cached);
            const now = Date.now();

            if (now - timestamp < EXPIRATION_TIME) {
                return data;
            }
        } catch (e) {
            console.warn("Error parsing cache, fetching fresh data...");
        }
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: Product[] = await response.json();

        const cachePayload: CacheData = {
            data,
            timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));

        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const getProductById = async (id: string): Promise<ProductDetail | null> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Error fetching product detail');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const addToCart = async (item: CartItemPayload): Promise<number> => {
    try {
        const response = await fetch('https://itx-frontend-test.onrender.com/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });

        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error('Error adding to cart', error);
        return 0;
    }
};

export const filterProducts = (products: Product[], query: string): Product[] => {
    if (!query) return products;

    const lowerQuery = query.toLowerCase();

    return products.filter((product) =>
        product.brand.toLowerCase().includes(lowerQuery) ||
        product.model.toLowerCase().includes(lowerQuery)
    );
};