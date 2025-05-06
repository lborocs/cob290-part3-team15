import React, {useEffect} from 'react'
import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { FiSearch, FiUsers } from 'react-icons/fi';

function StatisticsFieldBottom({ employees }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOpacity, setModalOpacity] = useState(0);

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

  useEffect(() => {
    setSelectedUser(null);
  }, [employees]);

  return (
    <div className="flex flex-col w-full col-span-4 row-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accentOrange focus:border-transparent"
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
                  onClick={() => handleSelectUser(employee)}
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

            </div>
          </div>
        </div>
      )}



    </div>
  );
}

export default StatisticsFieldBottom;