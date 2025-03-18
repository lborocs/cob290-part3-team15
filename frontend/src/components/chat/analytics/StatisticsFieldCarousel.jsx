import React, { useState, useEffect } from 'react';

const dummyData = [
    { id: 1, title: 'Statistic 1', value: '42', description: 'This is the first statistic.' },
    { id: 2, title: 'Statistic 2', value: '73%', description: 'This is the second statistic.' },
    { id: 3, title: 'Statistic 3', value: '120', description: 'This is the third statistic.' },
];

function StatisticsFieldCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeButton, setActiveButton] = useState(null);

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
            setActiveButton('right');
            setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyData.length);
        } else if (event.key === 'ArrowLeft') {
            setActiveButton('left');
            setCurrentIndex((prevIndex) => (prevIndex - 1 + dummyData.length) % dummyData.length);
        }
    };

    const handleButtonClick = (direction) => {
        setActiveButton(direction);
        if (direction === 'left') {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + dummyData.length) % dummyData.length);
        } else if (direction === 'right') {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyData.length);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        const timeout = setTimeout(() => setActiveButton(null), 200); // Reset active state after 200ms
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timeout);
        };
    }, [activeButton]);

    return (
        <div className="flex items-center justify-between p-6 bg-gray-100 rounded-lg shadow-md col-span-4 row-span-2">
            <button
                className={`px-4 py-2 rounded text-white hover:bg-orange-500 ${
                    activeButton === 'left' ? 'bg-orange-600' : 'bg-orange-400'
                }`}
                onClick={() => handleButtonClick('left')}
            >
                ←
            </button>
            <div className="text-center mx-6 flex-grow">
                <h2 className="text-xl font-semibold text-gray-800">{dummyData[currentIndex].title}</h2>
                <p className="text-4xl font-bold text-orange-300 my-4">{dummyData[currentIndex].value}</p>
                <p className="text-gray-600">{dummyData[currentIndex].description}</p>
            </div>
            <button
                className={`px-4 py-2 rounded text-white hover:bg-orange-500 ${
                    activeButton === 'right' ? 'bg-orange-600' : 'bg-orange-400'
                }`}
                onClick={() => handleButtonClick('right')}
            >
                →
            </button>
        </div>
    );
}

export default StatisticsFieldCarousel;