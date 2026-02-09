export interface Product {
    id: string;
    brand: string;
    model: string;
    price: string;
    imgUrl: string;
}

export interface ProductOption {
    code: number;
    name: string;
}

export interface ProductDetail extends Product {
    cpu: string;
    ram: string;
    os: string;
    displayResolution: string;
    battery: string;
    primaryCamera: string | string[];
    dimentions: string;
    weight: string;
    options: {
        colors: ProductOption[];
        storages: ProductOption[];
    };
}