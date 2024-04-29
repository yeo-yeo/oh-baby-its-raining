import React, { useState } from 'react';
import { Circles } from 'react-loader-spinner';

export const Panel = ({
    defaultYear,
    availableYears,
    restartImages,
}: {
    defaultYear: string;
    availableYears: string[];
    restartImages: () => void
}) => {
    const [year, setYear] = useState<string>(defaultYear);
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
                alignItems: 'center',
            }}
        >
            <select
                style={{
                    background: '#111111',
                    borderRadius: '4px',
                    border: 'none',
                    color: '#dddddd',
                    width: '50%',
                    textAlign: 'center',
                    height: '24px',
                    fontSize: '16px',
                }}
                onChange={(e) => {
                    if (e.target.value !== year) {
                        setYear(e.target.value);
                        setImageLoaded(false);
                        restartImages();
                    }
                }}
                value={year}
            >
                {availableYears.map((y) => (
                    <option key={y}>{y}</option>
                ))}
            </select>
            <div
                style={{
                    width: '60%',
                    minHeight: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '32px',
                    marginBottom: '64px',
                }}
            >
                <img
                    src={`./gifs/${year}-final-analysis-small.gif`}
                    style={{
                        display: imageLoaded ? 'block' : 'none',
                        width: '100%',
                    }}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(false)}
                />
                <Circles visible={!imageLoaded} color="#2222aa" height={40} />
            </div>
        </div>
    );
};
