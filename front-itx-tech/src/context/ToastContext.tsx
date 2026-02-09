import { createContext, useState, useContext, type ReactNode, useCallback } from 'react';

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({
        message: '',
        visible: false
    });

    const showToast = useCallback((message: string) => {
        setToast({ message, visible: true });

        // Ocultar automáticamente a los 3 segundos
        setTimeout(() => {
            setToast((prev) => ({ ...prev, visible: false }));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* RENDERIZADO DEL TOAST (Global) */}
            <div className={`toast-notification ${toast.visible ? 'show' : ''}`}>
                {toast.message}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast debe usarse dentro de ToastProvider');
    return context;
};