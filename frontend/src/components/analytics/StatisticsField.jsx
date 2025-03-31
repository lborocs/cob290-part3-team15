import React from 'react'
import StatisticsFieldCarousel from './StatisticsFieldCarousel'
import StatisticsFieldBottom from './StatisticsFieldBottom'
import TasksList from './TasksList'

function StatisticsField() {
  return (
    <div className="col-start-6 row-start-2 col-span-6 row-span-5 rounded-3xl grid grid-cols-6 grid-rows-4 gap-4">
      <StatisticsFieldCarousel />
      <TasksList />
      <StatisticsFieldBottom />
    </div>
  )
}

export default StatisticsField