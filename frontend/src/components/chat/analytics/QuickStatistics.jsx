import React from 'react'

function QuickStatistics({ colStart, rowStart, statistic, statisticValue }) {
    return (
        <div className="col-span-1 row-span-1rounded-4xl bg-zinc-400 rounded-3xl p-2 flex flex-col justify-center" style={{ gridColumnStart: colStart, gridRowStart: rowStart }}> 
            <p className="text-md font-bold text-start text-nowrap">{statistic}</p>
            <h2 className='text-3xl font-bold text-start'>{statisticValue}</h2>
            <p className='text-start mt-0 '>Your subtitle here</p>
        </div>
    )
}

export default QuickStatistics