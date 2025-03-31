import React from 'react'

function QuickStatistics({ colStart, rowStart, statistic, statisticValue }) {
    return (
        <div className="col-span-1 row-span-1rounded-4xl bg-secondary/50 rounded-3xl p-2 flex flex-col justify-center  border-1 border-blackFaded"  style={{ gridColumnStart: colStart, gridRowStart: rowStart }}> 
            <p className="text-sm font-bold text-center text-nowrap">{statistic}</p>
            <h2 className='text-3xl font-bold text-center text-text'>{statisticValue}</h2>
            <p className='text-center mt-0 text-text/60'>Your subtitle here</p>
        </div>
    )
}

export default QuickStatistics