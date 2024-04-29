import React, { useCallback, useEffect, useRef } from 'react';

export const Droplet = ({
    x,
    y,
    speed,
    width,
    height,
}: {
    x: number;
    y: number;
    speed: number;
    width: number;
    height: number;
}) => {
    const timeRef = useRef<number | undefined>();
    const elementRef = useRef<HTMLDivElement>(null);

    const animate = useCallback(() => {
        if (elementRef.current?.style) {
            const oldTop = Number(elementRef.current.style.top.slice(0, -2));
            if (oldTop < window.innerHeight) {
                elementRef.current.style.top = `${oldTop + speed}px`;
            } else {
                elementRef.current.style.top = `${-10}px`;
            }
        }

        timeRef.current = requestAnimationFrame(animate);
    }, [speed]);

    useEffect(() => {
        timeRef.current = requestAnimationFrame(animate);
        return () => {
            if (timeRef.current) {
                cancelAnimationFrame(timeRef.current);
            }
        };
    }, [animate]);

    return (
        <div
            ref={elementRef}
            className="rain-drop"
            style={{
                top: `${y}px`,
                left: `${x}px`,
                width: `${width}px`,
                height: `${height}px`,
                position: 'absolute',
                background:
                    'linear-gradient(to bottom, rgba(90,188,216,0.5) 100%, rgba(255,255,255,1) 0%)',
                borderRadius: '100% 100% 80% 80%',
            }}
        />
    );
};
