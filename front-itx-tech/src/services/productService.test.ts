// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProducts, filterProducts } from './productService';
const fetchMock = vi.fn();

global.fetch = fetchMock;

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Product Service Logic', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('getProducts (Caching Strategy)', () => {
        const mockProducts = [{ id: '1', brand: 'Acer', model: 'Aspire', price: '100' }];

        it('debe llamar a la API si no hay datos en caché', async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            });

            const result = await getProducts();

            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockProducts);
        });

        it('debe devolver datos de caché si existen y NO han expirado (< 1 hora)', async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            });
            await getProducts();

            vi.advanceTimersByTime(30 * 60 * 1000);

            const resultCached = await getProducts();
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(resultCached).toEqual(mockProducts);
        });

        it('debe llamar a la API de nuevo si la caché ha expirado (> 1 hora)', async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            });
            await getProducts();

            vi.advanceTimersByTime(61 * 60 * 1000);

            const newProducts = [{ id: '2', brand: 'Apple', model: 'iPhone', price: '999' }];
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => newProducts,
            });

            const result = await getProducts();

            expect(fetchMock).toHaveBeenCalledTimes(2);
            expect(result).toEqual(newProducts);
        });
    });

    describe('filterProducts (Search Logic)', () => {
        const list = [
            { id: '1', brand: 'Samsung', model: 'Galaxy S20', price: '100' },
            { id: '2', brand: 'Apple', model: 'iPhone 12', price: '200' },
            { id: '3', brand: 'Samsung', model: 'Note', price: '300' }
        ];

        it('debe filtrar por MARCA ignorando mayúsculas/minúsculas', () => {
            const result = filterProducts(list, 'samsung');
            expect(result).toHaveLength(2);
            expect(result[0].brand).toBe('Samsung');
        });

        it('debe filtrar por MODELO ignorando mayúsculas/minúsculas', () => {
            const result = filterProducts(list, 'iphone');
            expect(result).toHaveLength(1);
            expect(result[0].model).toBe('iPhone 12');
        });

        it('debe devolver toda la lista si la búsqueda está vacía', () => {
            const result = filterProducts(list, '');
            expect(result).toHaveLength(3);
        });
    });
});