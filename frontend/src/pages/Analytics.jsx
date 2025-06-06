import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Auth from "../components/login/Auth.jsx";
import Navbar from '../components/navigation/Navbar.jsx';
import {connectSocket, disconnectSocket, getSocket} from '../socket';
import axios from "axios";
import QuickStatistics from "../components/analytics/QuickStatistics.jsx";
import SearchBox from "../components/analytics/SearchBox.jsx";
import StatisticsField from "../components/analytics/StatisticsField.jsx";


function Analytics({ user }) {
    const navigate = useNavigate();
    const selectable = false;
    const activeTab = "Analytics";
    const [isLeader, setIsLeader] = useState(false);
    const [userRole, setUserRole] = useState(user.role);
    const [personalStatus, setPersonalStatus] = useState("Offline");
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedProjectTitle, setSelectedProjectTitle] = useState("Overview");
    const [newNotification,setNewNotification] = useState(0);


    // Check if the user leads any projects
    const isUserLeader = async() => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            // projects led by this user
            const response = await axios.get(`/api/analytics/employees/getIsLeader`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            setIsLeader(response?.data?.result.isLeader);
        }
        catch (error) {
            console.error("Error fetching leadership status:", error);
        }
    }

    useEffect(() => {
        // Check if the user is a team leader on load
        isUserLeader();

        connectSocket();
        const socket = getSocket();
        if (socket) {
            socket.on('selfStatus', (data) => {
                setPersonalStatus(data?.status);
            });
            socket.on('notification', (data) => { 
                setNewNotification(previous => previous+1);
            }); 
            socket.emit('requestStatus', user.userID);
        }
        return () => {
            socket.off('selfStatus');
            disconnectSocket();
        };
    }, [user.userID]);

    const updateSelectedProject = (id, title) => {
        setSelectedProjectId(id);
        setSelectedProjectTitle(title);
    }

    return (
        <div className="flex h-screen w-screen select-none">
            <Navbar
                userID={user.userID}
                selectable={selectable}
                isSelected={null}
                setIsSelected={null}
                activeTab={activeTab}
                status={personalStatus}
                newNotification={newNotification}
            />
            <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-7 gap-4 h-screen flex-1 w-full bg-primary overflow-y-auto lg:overflow-y-hidden overflow-x-hidden p-2 lg:p-0">
                <div className="ml-0 col-span-4 col-start-2 row-span-1 row-start-2 rounded-4xl p-2">
                    <h2 className="text-4xl font-bold text-start text-text">Welcome {user.name}</h2>
                    { (userRole === 'Manager' || (userRole === 'Employee' && !isLeader)) && (
                        <div className="flex items-center mt-4">
                            { userRole === 'Manager' && (
                                <div className="flex border-2 border-accentOrange rounded-full overflow-hidden">
                                    <button className="px-4 py-2 transition-colors duration-200 bg-accentOrange text-white">{userRole}</button>
                                </div>
                            )}
                            { userRole === 'Employee' && !isLeader && (
                                <div className="flex border-2 border-accentOrange rounded-full overflow-hidden">
                                    <button className="px-4 py-2 transition-colors duration-200 bg-accentOrange text-white">{userRole}</button>
                                </div>
                            )}
                        </div>
                    )}
        
                    { isLeader ? (
                        <div className="flex items-center mt-4">
                            <div className="flex border-2 border-accentOrange rounded-full overflow-hidden">
                                <button
                                className={`px-4 py-2 transition-colors duration-200 ${
                                    userRole === "Employee" 
                                    ? 'bg-accentOrange text-white' 
                                    : 'bg-white text-gray-700 hover:bg-accentOrange/10'
                                }`}
                                onClick={() => setUserRole("Employee")}
                                >
                                Employee
                                </button>
                                <button
                                className={`px-4 py-2 transition-colors duration-200 ${
                                    userRole === "Team Leader" 
                                    ? 'bg-accentOrange text-white' 
                                    : 'bg-white text-gray-700 hover:bg-accentOrange/10'
                                }`}
                                onClick={() => { setUserRole("Team Leader"); updateSelectedProject(null, "Overview"); }}
                                >
                                Team Leader
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="lg:col-span-4 lg:row-start-1 lg:col-start-6 w-full self-end text-start text-2xl font-bold test-text flex items-center justify-between">
                    <span className={"py-1 pr-2"}>{selectedProjectTitle}</span>
                    {selectedProjectTitle !== 'Overview' && (
                        <button
                            onClick={() => updateSelectedProject(null, "Overview")}
                            className="px-4 py-2 bg-white text-grey-700 rounded-full shadow-sm hover:bg-accentOrange/90 hover:text-white transition-all duration-200 transform hover:scale-105 text-sm font-medium"
                        >
                            Back to Overview
                        </button>
                    )}
                    
                </div>

                <QuickStatistics
                    userRole={userRole}
                    selectedProjectId={selectedProjectId}
                />

                <SearchBox
                    userRole={userRole}
                    onProjectSelect={(id, title) => updateSelectedProject(id, title)}
                    selectedProjectId={selectedProjectId}
                />

                <StatisticsField
                    userRole={userRole}
                    selectedProjectId={selectedProjectId}
                />
            </div>
        </div>
    )
}

export default Auth(Analytics);