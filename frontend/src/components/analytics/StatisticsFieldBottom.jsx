import React from 'react'
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function StatisticsFieldBottom() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const dummyEmployees = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    profilePicture: faker.image.avatar(),
    tasksGiven: faker.number.int({ min: 10, max: 50 }),
    tasksDue: faker.number.int({ min: 5, max: 20 }),
    tasksCompleted: faker.number.int({ min: 5, max: 20 }),
  }));

  const filteredEmployees = dummyEmployees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-col w-full col-span-4 row-span-2 bg-secondary/40 p-4 rounded-3xl">
      {!selectedUser ? (
        <>
          <input
            type="text"
            placeholder="Search employee..."
            className="border border-gray-300 mb-4 bg-secondary/40 rounded-3xl p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4 overflow-y-auto h-full">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center p-2 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg hover:bg-gray-100 transition-all duration-200"
                style={{ maxHeight: '60px' }}
                onClick={() => handleSelectUser(employee)}
              >
                <img
                  src={employee.profilePicture}
                  alt={employee.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="text-sm">{employee.name}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col w-full">
          <button
            onClick={() => {
              handleBack();
              setSearchTerm(''); // Clear the search bar to reset
            }}
            className="mb-4 p-2 bg-primary text-black rounded-lg"
          >
            Back
          </button>
          <div className="flex items-center mb-4">
            <img
              src={selectedUser.profilePicture}
              alt={selectedUser.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 className="text-lg font-bold">{selectedUser.name}</h2>
              <p>Tasks Given: {selectedUser.tasksGiven}</p>
              <p>Tasks Due: {selectedUser.tasksDue}</p>
              <p>Tasks Completed: {selectedUser.tasksCompleted}</p>
            </div>
          </div>
          <div style={{ width: '100%', height: '400px' }}>
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
                    backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StatisticsFieldBottom;
