export interface CartItemPayload {
    id: string;
    colorCode: number;
    storageCode: number;
}

export interface CartItemState {
    id: string;
    brand: string;
    model: string;
    price: string;
    imgUrl: string;
    color: string;
    storage: string;
}

export interface CardVisualData {
    number: string;
    name: string;
    expiry: string;
    cvc: string;
}