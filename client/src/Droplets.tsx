import React, { useEffect, useState } from 'react';
import { Droplet } from 'Droplet';

export const Droplets = () => {
    const [droplets, setDroplets] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        const droplets: React.JSX.Element[] = [];
        for (let i = 0; i < 100; i++) {
            const randomX = Math.floor(Math.random() * window.innerWidth);
            const randomY = Math.floor(Math.random() * window.innerHeight);
            const dropSpeed = Math.floor(Math.random() * 5) + 1;
            const dropWidth =
                Math.floor(Math.random() * (dropSpeed / 5 - 1)) + 1;
            const dropHeight =
                Math.floor(Math.random() * (dropSpeed * 2 - 3)) + 3;

            droplets.push(
                <Droplet
                    x={randomX}
                    y={randomY}
                    speed={dropSpeed}
                    width={dropWidth}
                    height={dropHeight}
                    key={i}
                />
            );
        }
        setDroplets(droplets);
    }, []);

    return <>{...droplets}</>;
};
