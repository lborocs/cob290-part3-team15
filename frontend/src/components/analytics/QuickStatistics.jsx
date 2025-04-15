import React from 'react'

function QuickStatistics({ title, statisticValue }) {
    return (
        <div className="col-span-1 row-span-1 bg-secondary/50 rounded-3xl p-2 flex flex-col justify-center border-1 border-blackFaded"> 
            <p className="text-sm font-bold text-center text-wrap">{title}</p>
            <h2 className='text-3xl font-bold text-center text-text sm:text-2xl md:text-3xl'>{statisticValue}</h2>
            <p className='text-center mt-0 text-text/60 sm:text-xs md:text-sm'>Your subtitle here</p>
        </div>
    )
}

export default QuickStatistics