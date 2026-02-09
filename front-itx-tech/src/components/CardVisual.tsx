import { useMemo } from 'react';

interface CardVisualProps {
    number: string;
    name: string;
    expiry: string;
    cvc: string;
}

export const CardVisual = ({ number, name, expiry, cvc }: CardVisualProps) => {

    // Formatear número con espacios
    const formattedNumber = useMemo(() => {
        const num = number.padEnd(16, '•');
        return num.match(/.{1,4}/g)?.join(' ') || num;
    }, [number]);

    return (
        <div className="card-visual">
            <div className="card-shine"></div>

            {/* Chip simulado */}
            <div className="card-chip">
                <div className="chip-line"></div>
                <div className="chip-line"></div>
                <div className="chip-line"></div>
                <div className="chip-line"></div>
            </div>

            <div className="card-logo">VISA</div>

            <div className="card-number">{formattedNumber}</div>

            <div className="card-details">
                <div className="card-holder">
                    <label>TITULAR</label>
                    <div>{name || 'NOMBRE APELLIDO'}</div>
                </div>
                <div className="card-expires">
                    <label>EXPIRA</label>
                    <div>{expiry || 'MM/YY'}</div>
                </div>
            </div>
        </div>
    );
};