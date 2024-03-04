import { useRef, useEffect, useState } from 'react';


export const useIsInViewport = () => {
    const ref = useRef(null);
    const [isInViewport, setIsInViewport] = useState(false);

    useEffect(() => {
        const element = ref.current;
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsInViewport(entry.isIntersecting);
            },
            { threshold: 1 }
        );

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);

    return { ref, isInViewport };
};
