import React from 'react'

function EmployeeStatisticsCarousel() {
  // no charts just statistical data so no need for a carousel
  // stats should include:
  const [timePeriod, setTimePeriod] = React.useState('week');
  const [weekIndex, setWeekIndex] = React.useState(0);

  const dummyData = [
    {
      week: {
        tasksCompleted: 25,
        tasksInProgress: 10,
        tasksOverdue: 1,
        hoursWorked: 40,
      },
    },
    {
      week: {
        tasksCompleted: 30,
        tasksInProgress: 8,
        tasksOverdue: 2,
        hoursWorked: 42,
      },
    },
    {
      week: {
        tasksCompleted: 20,
        tasksInProgress: 12,
        tasksOverdue: 5,
        hoursWorked: 38,
      },
    },
  ];

  // Calculate monthly roundups based on weekly data
  const monthlyStats = dummyData.reduce(
    (acc, weekData) => {
      const weekStats = weekData.week;
      acc.tasksCompleted += weekStats.tasksCompleted;
      acc.tasksInProgress += weekStats.tasksInProgress;
      acc.tasksOverdue += weekStats.tasksOverdue;
      acc.hoursWorked += weekStats.hoursWorked;
      return acc;
    },
    {
      tasksCompleted: 0,
      tasksInProgress: 0,
      tasksOverdue: 0,
      hoursWorked: 0,
    }
  );

  dummyData.forEach((weekData) => {
    weekData.month = monthlyStats;
  });

  const currentStats = dummyData[weekIndex]?.[timePeriod] || {};

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 col-span-4 row-span-2 h-full">
      <div className="flex flex-row items-center justify-center w-full mt-8">
        <select
          className="px-4 py-2 rounded border border-gray-300 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={timePeriod}
          onChange={(e) => {
            setTimePeriod(e.target.value);
            setWeekIndex(0); // Reset week index when switching time period
          }}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>

        <div
          className={`transition-all duration-300 ${
            timePeriod === 'week' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <select
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={weekIndex}
            onChange={(e) => setWeekIndex(Number(e.target.value))}
          >
            {dummyData.map((_, index) => (
              <option key={index} value={index}>
                {`Week ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow h-full mt-6 w-full">
        <div className="w-full max-w-md max-h-[220px] h-full mb-4 p-4 rounded-lg text-center">
          <ul className="text-gray-700 px-2 text-xl font-semibold">
            {Object.entries(currentStats).map(([key, value]) => (
              <li
                key={key}
                className="capitalize mb-2"
                style={{
                  color:
                    key === 'tasksOverdue' && value > 0
                      ? 'red'
                      : key === 'tasksOverdue'
                      ? 'green'
                      : 'inherit',
                }}
              >
                {`${key.replace(/([A-Z])/g, ' $1')}: ${value}`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EmployeeStatisticsCarousel;