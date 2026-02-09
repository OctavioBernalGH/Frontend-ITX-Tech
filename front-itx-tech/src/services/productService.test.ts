// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProducts, filterProducts } from './productService';

const fetchMock = vi.fn();
globalThis.fetch = fetchMock as any;

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value.toString(); }),
        clear: vi.fn(() => { store = {}; }),
        removeItem: vi.fn((key: string) => { delete store[key]; }),
        key: vi.fn(),
        length: 0,
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

    describe('getProducts (Estrategia de Caché)', () => {
        const mockProducts = [
            { id: '1', brand: 'Acer', model: 'Aspire', price: '100', imgUrl: '' }
        ];

        it('debe llamar a la API si no hay datos en caché', async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            });

            const result = await getProducts();

            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockProducts);
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });

        it('debe devolver datos de caché si existen y NO han expirado (< 1 hora)', async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            });
            await getProducts();

            vi.advanceTimersByTime(30 * 60 * 1000);

            fetchMock.mockClear();
            const resultCached = await getProducts();

            expect(fetchMock).not.toHaveBeenCalled();
            expect(resultCached).toEqual(mockProducts);
        });

        it('debe llamar a la API de nuevo si la caché ha expirado (> 1 hora)', async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            });
            await getProducts();
            vi.advanceTimersByTime(61 * 60 * 1000);
            const newProducts = [{ id: '2', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: '' }];
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => newProducts,
            });

            fetchMock.mockClear();
            const result = await getProducts();
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(result).toEqual(newProducts);
        });
    });

    describe('filterProducts (Lógica de Búsqueda)', () => {
        const list = [
            { id: '1', brand: 'Samsung', model: 'Galaxy S20', price: '100', imgUrl: '' },
            { id: '2', brand: 'Apple', model: 'iPhone 12', price: '200', imgUrl: '' },
            { id: '3', brand: 'Samsung', model: 'Note', price: '300', imgUrl: '' }
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