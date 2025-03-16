import React from 'react'
import { useNavigate } from 'react-router-dom';


function AnalyticsLanding() {
    const navigate = useNavigate();

    return (
        <>
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="font-bold">Navigate</h1>

            {/*General Navigation*/}
            <div className="flex flex-wrap items-center justify-center gap-x-4 my-4">
                <button className={`w-50 my-2 hover:bg-red-400 bg-gray-300 hover:text-white}
                    rounded-lg border px-5 py-2 text-base font-medium`} onClick={() => {navigate("/analytics/employee")}}>
                    <p>Employee</p>
                </button>
                <button className={`w-50 my-2 hover:bg-red-400 bg-gray-300 hover:text-white}
                    rounded-lg border px-5 py-2 text-base font-medium`} onClick={() => {navigate("/analytics/leader")}}>
                    <p>Team Leader</p>
                </button>
                <button className={`w-50 my-2 hover:bg-red-400 bg-gray-300 hover:text-white}
                    rounded-lg border px-5 py-2 text-base font-medium`} onClick={() => {navigate("/analytics/manager")}}>
                    <p>Manager</p>
                </button>
            </div>
        </div>
        </>
  )
}

export default AnalyticsLanding