import { useState } from 'react';
// import Cards from 'react-credit-cards-2'; <--- BORRAR ESTO
// import 'react-credit-cards-2/...' <--- BORRAR ESTO
import { CardVisual } from './CardVisual'; // <--- IMPORTAR EL NUEVO

interface CheckoutModalProps {
    total: number;
    onClose: () => void;
    onSuccess: () => void;
}

export const CheckoutModal = ({ total, onClose, onSuccess }: CheckoutModalProps) => {
    const [state, setState] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
        focus: '',
    });

    const [isProcessing, setIsProcessing] = useState(false);

    const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        if (name === 'number' && value.length > 16) return;
        if (name === 'expiry' && value.length > 5) return; // Permite MM/YY
        if (name === 'cvc' && value.length > 3) return;
        setState((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
        setState((prev) => ({ ...prev, focus: evt.target.name }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 2000);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <button className="modal-close" onClick={onClose}>×</button>

                <div className="modal-header">
                    <span className="modal-subtitle">PASARELA DE PAGO</span>
                    <div className="modal-product-name">TOTAL A PAGAR: {total} €</div>
                </div>

                <div className="payment-container">

                    {/* AQUÍ USAMOS NUESTRO COMPONENTE SEGURO */}
                    <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
                        <CardVisual
                            number={state.number}
                            expiry={state.expiry}
                            cvc={state.cvc}
                            name={state.name}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <input
                                type="tel"
                                name="number"
                                placeholder="Número de Tarjeta"
                                value={state.number}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                required
                                className="payment-input"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nombre del Titular"
                                value={state.name}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                required
                                className="payment-input"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    value={state.expiry}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    required
                                    className="payment-input"
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <input
                                    type="tel"
                                    name="cvc"
                                    placeholder="CVC"
                                    value={state.cvc}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    required
                                    className="payment-input"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary modal-confirm-btn"
                            disabled={isProcessing}
                            style={{ marginTop: '30px' }}
                        >
                            {isProcessing ? 'PROCESANDO PAGO...' : `PAGAR ${total} €`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};