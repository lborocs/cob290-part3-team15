import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Auth from "../components/login/Auth.jsx";

//This is the boilerplate stuff
function Landing(){
    //Use State is just like default.. count is the variable, setCount is a function to redefine the useState
    const [count, setCount] = useState(0);
    const [displayedData, setDisplayedData] = useState(null);

    const updateCounter = () => {
        setCount(count+1);
        
    }

    const navigate=useNavigate();
    

    return(
        <>
        <div className="flex flex-col items-center justify-center h-screen">
            <button className="flex w-30 h-30 mt-2 rounded-lg bg-[#D3D3D3] items-center justify-center shadow-[1px_2px_5px_rgba(0,0,0,0.3)] mb-6"
            onClick={(e) => navigate("/login/")}>
                <img src={Logo} className="w-25 h-25" alt="Logo" />
            </button>
            <h1 className="font-bold">Navigate (DEMO)</h1>

            {/*General Navigation*/}
            <div className="flex flex-wrap items-center justify-center gap-x-4 my-4">
                <button className={`w-50 my-2 hover:bg-red-400 bg-gray-300 hover:text-white ${count % 3 == 0 ? 'text-red-400' : ''}
                    rounded-lg border border-2 px-5 py-2 text-base font-medium`} onClick={() => {navigate("/chat/")}}>
                    <p>To Chat</p>
                </button>
                <button className={`w-50 my-2 hover:bg-red-400 bg-gray-300 hover:text-white ${count % 3 == 2 ? 'text-red-400' : ''}
                    rounded-lg border border-2 px-5 py-2 text-base font-medium`} onClick={() => {navigate("/analytics/")}}>
                    <p>To Analytics</p>
                </button>
            </div>
        </div>
        </>
    )
}
      
export default Auth(Landing);