import { useMemo } from 'react';
import type { CardVisualData } from '../types';

export const CardVisual = ({ number, name, expiry, cvc }: CardVisualData) => {

    const formattedNumber = useMemo(() => {
        const safeNumber = number || '';
        const num = safeNumber.padEnd(16, '•');
        return num.match(/.{1,4}/g)?.join(' ') || num;
    }, [number]);

    return (
        <div className="card-visual">
            <div className="card-shine"></div>

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
                    <div className="ellipsis-text">{name || 'NOMBRE APELLIDO'}</div>
                </div>
                <div className="card-expires">
                    <label>EXPIRA</label>
                    <div>{expiry || 'MM/YY'}</div>
                </div>
            </div>
        </div>
    );
};