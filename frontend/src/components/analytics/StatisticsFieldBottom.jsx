import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function StatisticsFieldBottom() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOpacity, setModalOpacity] = useState(0);

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
    openModal();
  };

  const openModal = () => {
    setModalVisible(true);
    setIsModalOpen(true);
    // Trigger opacity change after the element is rendered
    setTimeout(() => setModalOpacity(1), 10);
  };

  const closeModal = () => {
    setModalOpacity(0);
    // Wait for fade-out animation before hiding
    setTimeout(() => {
      setModalVisible(false);
      setIsModalOpen(false);
      setSelectedUser(null);
    }, 300);
  };

  // Close modal when clicking outside content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="flex flex-col w-full col-span-4 row-span-2 bg-secondary/40 p-4 rounded-3xl relative">
      {/* Search and Employee List (always visible) */}
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

      {/* Modal with fade animation */}
      {modalVisible && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${modalOpacity * 0.5})`,
            opacity: modalOpacity,
          }}
          onClick={handleBackdropClick}
        >
          <div 
            className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300"
            style={{
              opacity: modalOpacity,
              transform: `translateY(${(1 - modalOpacity) * 20}px)`
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <img
                  src={selectedUser?.profilePicture}
                  alt={selectedUser?.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-xl font-bold">{selectedUser?.name}</h2>
                  <p>Tasks Given: {selectedUser?.tasksGiven}</p>
                  <p>Tasks Due: {selectedUser?.tasksDue}</p>
                  <p>Tasks Completed: {selectedUser?.tasksCompleted}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
              >
                &times;
              </button>
            </div>

            <div className="w-full" style={{ height: '400px' }}>
              {selectedUser && (
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
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-dark transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatisticsFieldBottom;
