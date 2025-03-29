import React from 'react'
import WelcomeMessage from '../../components/chat/analytics/WelcomeMessage'
import QuickStatistics from '../../components/chat/analytics/QuickStatistics'
import SearchBox from '../../components/chat/analytics/SearchBox'
import StatisticsField from '../../components/chat/analytics/StatisticsField'


function Teamleader() {
  return (
    <>
    {/* TODO: make the backend calls to get the data for the statistics, name and role */}
      <div className="grid grid-cols-12 grid-rows-7 w-screen h-screen gap-4">
        <WelcomeMessage userID={"Team15"} role={"Team Leader"}/>

        <QuickStatistics colStart={2} rowStart={3} statistic={"Projects"} statisticValue={10}/>
        <QuickStatistics colStart={3} rowStart={3} statistic={"Tasks Completed"} statisticValue={10}/>
        <QuickStatistics colStart={4} rowStart={3} statistic={"Tasks Pending"} statisticValue={10}/>
        <QuickStatistics colStart={5} rowStart={3} statistic={"Other stat"} statisticValue={10}/>

        <SearchBox/>

        <StatisticsField/>

      </div>
    </>
  )
}

export default Teamleader