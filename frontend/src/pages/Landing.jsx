import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import viteLogo from '../assets/example.png';

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
            <div className="flex items-center justify-center">
                <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
            </div>
            <h1 className="font-bold">Navigate</h1>

            {/*General Navigation*/}
            <div className="flex flex-wrap items-center justify-center gap-x-4 my-4">
                <button className={`w-50 my-2 hover:bg-red-400 bg-gray-300 hover:text-white ${count % 3 == 0 ? 'text-red-400' : ''}
                    rounded-lg border border-2 px-5 py-2 text-base font-medium`} onClick={() => {navigate("/chat")}}>
                    <p>To Chat</p>
                </button>
                <button className={`w-50 my-2 hover:bg-red-400 bg-gray-300 hover:text-white ${count % 3 == 1 ? 'text-red-400' : ''}
                    rounded-lg border border-2 px-5 py-2 text-base font-medium`} onClick={() => {navigate("/login")}}>
                    <p>To basic login</p>
                </button>
                <button className={`w-50 my-2 hover:bg-red-400 bg-gray-300 hover:text-white ${count % 3 == 2 ? 'text-red-400' : ''}
                    rounded-lg border border-2 px-5 py-2 text-base font-medium`} onClick={() => {navigate("/analytics")}}>
                    <p>To Analytics</p>
                </button>
            </div>

            <div>
            <button className={`w-50 my-2 bg-gradient-to-r from-pink-400 to-red-500 text-white 
                rounded-lg border-2 border-black px-5 py-2 font-medium 
                animate-bounce hover:animate-wiggle hover:scale-150`}
                onClick={() => navigate("/playground")}>
                    <p>Playground</p>
                </button>
            </div>

            {/*This is an example of conditional css i made, when the count variable is less than 5, it includes text_danger (red text) otherwise it doesn't*/}
            <div className="p-[2em]">
                <button className={`hover:bg-red-400 bg-gray-300 hover:text-white ${count < 5 ? 'text-red-400' : ''}  rounded-lg border border-2 px-5 py-2 text-base font-medium`} onClick={() => {updateCounter()}}>
                    <p>count is <br/>{count}</p>
                </button>
                <p>
                    Edit <code>../src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="color-[#888]">
                Click on the Vite and React logos to learn more
            </p>
        </div>
        </>
    )
}
      
export default Landing;