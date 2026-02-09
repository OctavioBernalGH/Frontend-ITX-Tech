import { useEffect } from 'react';

export const useSEO = ({ title, description }: { title: string; description?: string }) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;

        if (description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                const meta = document.createElement('meta');
                meta.name = 'description';
                meta.content = description;
                document.head.appendChild(meta);
            }
        }

        return () => {
            document.title = prevTitle;
        };
    }, [title, description]);
};