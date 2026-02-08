export interface Product {
    id: string;
    brand: string;
    model: string;
    price: string;
    imgUrl: string;
}

interface CacheData {
    data: Product[];
    timestamp: number;
}

const API_URL = 'https://itx-frontend-test.onrender.com/api/product';
const CACHE_KEY = 'products_list_cache';
const EXPIRATION_TIME = 3600 * 1000; // 1 hora en milisegundos

export const getProducts = async (): Promise<Product[]> => {
    // 1. Intentamos leer del LocalStorage
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
        const { data, timestamp }: CacheData = JSON.parse(cached);
        const now = Date.now();

        // 2. Verificamos si la caché es válida (menos de 1 hora)
        if (now - timestamp < EXPIRATION_TIME) {
            console.log('Returning data from cache');
            return data;
        }
    }

    // 3. Si no hay caché o expiró, hacemos la petición a la API
    console.log('Fetching data from API');
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: Product[] = await response.json();

        // 4. Guardamos los nuevos datos en caché con la hora actual
        const cachePayload: CacheData = {
            data,
            timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));

        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; // En caso de error devolvemos array vacío para no romper la UI
    }
};

export const filterProducts = (products: Product[], query: string): Product[] => {
    if (!query) return products;

    const lowerQuery = query.toLowerCase();

    // El requisito dice filtrar por Marca y Modelo
    return products.filter((product) =>
        product.brand.toLowerCase().includes(lowerQuery) ||
        product.model.toLowerCase().includes(lowerQuery)
    );
};