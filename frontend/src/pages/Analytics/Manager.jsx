import React from 'react'
import WelcomeMessage from '../../components/analytics/WelcomeMessage'
import QuickStatistics from '../../components/analytics/QuickStatistics'
import SearchBox from '../../components/analytics/SearchBox'
import StatisticsField from '../../components/analytics/StatisticsField'
import Navbar from '../../components/navigation/Navbar'

function Manager({ user, roleLabel }) {
  return (
    <>
      {/* TODO: make the backend calls to get the data for the statistics */}
      <div className="grid grid-cols-12 grid-rows-7 w-screen h-screen gap-4 ">
        <div className='col-start-1 row-start-1 row-span-7'>
          <Navbar />
        </div>

        <WelcomeMessage userName={user.name} roleLabel={roleLabel}/>

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

export default Manager