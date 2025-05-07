import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { FiSearch, FiUsers, FiX } from 'react-icons/fi';

function StatisticsFieldBottom({ selectedProject, employees, tasks }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOpacity, setModalOpacity] = useState(0);

  const dummyEmployees = employees.map(employee =>  {

    let employeeTasks = tasks.filter((task) => task.assignee === employee.id);
    if (selectedProject.title !== "Overview") {
      employeeTasks = employeeTasks.filter((task) => task.project === selectedProject.id);
    }

    const tasksGiven = employeeTasks.length;
    const tasksDue = employeeTasks.filter((task) => task.status !== "Completed").length;
    const tasksCompleted = tasksGiven - tasksDue;

    return {
      id: employee.id,
      name: `${employee.forename} ${employee.surname}`,
      profilePicture: faker.image.avatar(),
      tasksGiven: tasksGiven,
      tasksDue: tasksDue,
      tasksCompleted: tasksCompleted,
    }
  });

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
    setTimeout(() => setModalOpacity(1), 10);
  };

  const closeModal = () => {
    setModalOpacity(0);
    setTimeout(() => {
      setModalVisible(false);
      setIsModalOpen(false);
      setSelectedUser(null);
    }, 300);
  };

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
                className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-800 flex">{employee.name}</p>
                <p className="text-xs text-gray-500 flex">{employee.tasksCompleted}/{employee.tasksGiven} tasks completed</p>
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
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300"
            style={{
              opacity: modalOpacity,
              transform: `scale(${0.95 + (modalOpacity * 0.05)}) translateY(${(1 - modalOpacity) * 20}px)`
            }}
          >
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center z-10">
              <button
                onClick={closeModal}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-gray-800">Employee Details</h3>
              <div className="w-5"></div> {/* Placeholder for alignment */}
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-6 mb-8">
                <img
                  src={selectedUser?.profilePicture}
                  alt={selectedUser?.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-orange-100 shadow-sm"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl px-8 items-center font-bold text-gray-800 mb-1">{selectedUser?.name}</h2>
                  
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                      {selectedUser?.tasksGiven} Given
                    </div>
                    <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-sm">
                      {selectedUser?.tasksDue} Due
                    </div>
                    <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm">
                      {selectedUser?.tasksCompleted} Completed
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Task Statistics</h4>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: ['Tasks Given', 'Tasks Due', 'Tasks Completed'],
                      datasets: [{
                        label: 'Tasks',
                        data: [
                          selectedUser?.tasksGiven || 0,
                          selectedUser?.tasksDue || 0,
                          selectedUser?.tasksCompleted || 0,
                        ],
                        backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
                        borderRadius: 6,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          displayColors: false,
                          callbacks: {
                            label: (context) => `${context.parsed.y} tasks`
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { display: false },
                          ticks: { display: false }
                        },
                        x: {
                          grid: { display: false }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatisticsFieldBottom;