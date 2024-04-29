import React, { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Droplets } from 'Droplets';
import { Panel } from 'Panel';
import { availableYears } from 'years.json';

const App = () => {
    // Hack to synchronise the gifs if one is changed
    const restartImages = useCallback(() => {
        console.log('restart!');
        const imgs = document.getElementsByTagName('img');
        console.log(imgs);
        Array.from(imgs).forEach((i) => {
            i.src = i.getAttribute('src')!;
        });
    }, []);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                    className="maps"
                    style={{
                        display: 'flex',
                        maxWidth: '80%',
                        width: '80%',
                        marginTop: '36px',
                    }}
                >
                    <Panel
                        defaultYear={'2012'}
                        availableYears={availableYears}
                        restartImages={restartImages}
                    />
                    <Panel
                        defaultYear={'2022'}
                        availableYears={availableYears}
                        restartImages={restartImages}
                    />
                </div>
            </div>
            <Droplets />
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
