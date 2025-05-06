import React, {useEffect} from 'react'
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { FiSearch, FiUsers } from 'react-icons/fi';

function StatisticsFieldBottom({ employees }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const dummyEmployees = employees.map((employee) => ({
    id: employee.id,
    name: `${employee.forename} ${employee.surname}`,
    profilePicture: faker.image.avatar(),
    tasksGiven: Math.floor(Math.random() * 100),
    tasksDue: Math.floor(Math.random() * 100),
    tasksCompleted: Math.floor(Math.random() * 100),
  }));

  const filteredEmployees = dummyEmployees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSelectedUser(null);
  }, [employees]);

  return (
    <div className="flex flex-col w-full col-span-4 row-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {!selectedUser ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Team Members</h3>
            <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium">
              {filteredEmployees.length} {filteredEmployees.length === 1 ? 'member' : 'members'}
            </span>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employee..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accentOrange focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center p-3 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-md hover:border-orange-200 transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedUser(employee)}
                >
                  <img
                    src={employee.profilePicture}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{employee.name}</p>
                    <p className="text-xs text-gray-500">{employee.tasksCompleted} tasks completed</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-400">
                <FiUsers className="text-3xl mb-2" />
                <p>No members found</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col h-full">
          <div
            onClick={() => {
              setSelectedUser(null);
              setSearchTerm('');
            }}
            className="flex flex-col mb-4 p-2 bg-white rounded-md shadow cursor-pointer hover:shadow-md hover:bg-gray-100 transition-all duration-200"
          >
            Back
          </div>

          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center">
              <img
                src={selectedUser.profilePicture}
                alt={selectedUser.name}
                className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-orange-100"
              />
              <div>
                <h2 className="font-bold text-gray-800">{selectedUser.name}</h2>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                    {selectedUser.tasksGiven} Given
                  </span>
                  <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full">
                    {selectedUser.tasksDue} Due
                  </span>
                  <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                    {selectedUser.tasksCompleted} Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-grow -mt-2">
            <Bar
              data={{
                labels: ['Tasks Given', 'Tasks Due', 'Tasks Completed'],
                datasets: [
                  {
                    label: 'Tasks',
                    data: [
                      selectedUser.tasksGiven,
                      selectedUser.tasksDue,
                      selectedUser.tasksCompleted,
                    ],
                    backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StatisticsFieldBottom;