import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { FiSearch, FiUsers, FiX } from 'react-icons/fi';
import axios from "axios";

function StatisticsFieldBottom({ selectedProjectId }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOpacity, setModalOpacity] = useState(0);
  const [employees, setEmployees] = useState([]);

  const fetchMemberList = async() => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const endpoint = selectedProjectId 
        ? `/api/analytics/projects/getProjectTeamMembers?id=${selectedProjectId}`
        : `/api/analytics/projects/getOverviewTeamMembers`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchMemberList();
  }, [selectedProjectId]);

  const getInitials = (name) => 
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const colors = {
    blue:   "bg-[#4d74b6]", //rgb(0, 57, 150) @ 70%
    green:  "bg-[#64d68e]", // #22c55e @ 70%
    red:    "bg-[#f47c7c]", // #ef4444 @ 70%
    blue2:  "bg-[#74ccfb]", // rgb(0, 170, 255)
    pink:   "bg-[#f27fb8]", // #ec4899 @ 70%
    purple: "bg-[#ae8df9]", // #8b5cf6 @ 70%
    blue3:  "bg-[#6d8cf5]", // rgb(51, 102, 255)
    gray:   "bg-[#979ca6]", // #6b7280 @ 70%
    green2: "bg-[#59b64d]", //rgb(111, 224, 101) @ 70%
    indigo: "bg-[#9294f5]", // #6366f1 @ 70%
    teal:   "bg-[#5bcdc1]", // #14b8a6 @ 70%
    pink2: "bg-[#e880aa]", // rgb(255, 162, 199)
    pink3: "bg-[#dc5e91]", // rgb(221, 34, 119)
    }

  const getColor = (name) => {
    const colorValues = Object.values(colors);
    return colorValues[name.length % colorValues.length];
  };

  const processedEmployees = employees.map(employee => {
    const fullName = `${employee.forename} ${employee.surname}`;
    return {
      ...employee,
      name: fullName,
      initials: getInitials(fullName),
      colorClass: getColor(fullName),
    };
  });

  const filteredEmployees = processedEmployees.filter(employee =>
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
              className="flex items-center p-3 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-md hover:border-accentOrange transition-all duration-200 cursor-pointer"
              onClick={() => handleSelectUser(employee)}
            >
              <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white ${employee.colorClass} border-2 border-accentOrange shadow-sm`}>
                {employee.initials}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-800">{employee.name}</p>
                <p className="text-xs text-gray-500">{employee.tasksCompleted}/{employee.tasksGiven} tasks completed</p>
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
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl ${selectedUser?.colorClass} border-3 border-accentOrange shadow-md`}>
                  {selectedUser?.initials}
                </div>
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