import React from 'react'
import QuickStatisticItem from "./QuickStatisticItem.jsx";

function QuickStatistics({ quickStatistics }) {
    return (
        <div className="col-start-2 row-start-3 col-span-4 w-full">
            <div className="grid grid-cols-3 gap-4 mt-4 w-full">
                {quickStatistics.map((stat) => (
                    <QuickStatisticItem
                        key={stat.id}
                        title={stat.title}
                        statisticValue={stat.value}
                    />
                ))}
            </div>
        </div>
    );
}

export default QuickStatistics;