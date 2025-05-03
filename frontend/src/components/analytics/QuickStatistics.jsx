import React from 'react'

function QuickStatistics({ title, statisticValue }) {
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
        let start = 0;
        const duration = 1500; // Animation duration in milliseconds
        const startTime = performance.now();
        const hasPercentSign = typeof statisticValue === 'string' && statisticValue.trim().endsWith('%');
        const numericValue = parseFloat(statisticValue) || 0; // Parse statisticValue as a number

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Clamp progress between 0 and 1
            const easedProgress = progress * (2 - progress); // Ease-out curve
            const currentValue = Math.round(easedProgress * numericValue);

            setDisplayValue(hasPercentSign ? `${currentValue}%` : currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        setDisplayValue(hasPercentSign ? '0%' : 0); // Ensure percent sign is there at the start
        requestAnimationFrame(animate);
    }, [statisticValue]);

    return (
        <div className="col-span-1 row-span-1 bg-secondary/50 rounded-3xl p-2 flex flex-col justify-center border-1 border-blackFaded"> 
            <p className="text-sm font-bold text-center text-wrap">{title}</p>
            <h2 className='text-3xl font-bold text-center text-text sm:text-2xl md:text-3xl'>{displayValue}</h2>
        </div>
    );
}

export default QuickStatistics