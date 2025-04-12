import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from 'axios';
import make_it_all from '../assets/logo.png';

//This is the boilerplate stuff
function Login(){
    const navigate=useNavigate();

    const identities = {
        1:{userID:1,pass:"ABC123BCA!!!"},
        2:{userID:2,pass:"ABC123BCA!!!"},
        3:{userID:3,pass:"ABC123BCA!!!"}
    }
    
    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    };
    
      // Scroll to top of page
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const quickLogin = async(input) => {
        const headers = {headers: {'Content-Type': 'application/json',}};
        const body = identities[input];
        try{
            const response = await axios.post(`/auth/login`, body, headers);
            if (response?.data?.accessToken && response?.data?.refreshToken){
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                navigate("/landing/")
            }
            else{
                alert("Failed to log in!")
            }
          }
        catch (error) {
            // Empty as we log errors in the request response
        }
        
    }

    return(
        <>
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="flex items-center justify-center">
                <img src={make_it_all} className="w-24 mb-8" alt="Make It All Logo" />
            </div>
            <h1 className="font-bold">Login</h1>

            {/*General Navigation*/}
            <div className="flex flex-wrap items-center justify-center gap-x-4 my-4 w-[calc(min(700px,100%))]">
                <button className={`w-[calc(min(200px,90%))] my-2 hover:bg-red-400 bg-gray-300 hover:text-white
                    rounded-lg border border-2 px-5 py-2 text-base font-medium`} onClick={() => {quickLogin(1)}}>
                    <p>User 1 (Employee)</p>
                </button>
                <button className={`w-[calc(min(200px,90%))] my-2 hover:bg-red-400 bg-gray-300 hover:text-white
                    rounded-lg border border-2 px-5 py-2 text-base font-medium`} onClick={() => {quickLogin(2)}}>
                    <p>User 2 (Manager)</p>
                </button>
                <button className={`w-[calc(min(200px,90%))] my-2 hover:bg-red-400 bg-gray-300 hover:text-white
                    rounded-lg border border-2 px-5 py-2 text-base font-medium`} onClick={() => {quickLogin(3)}}>
                    <p>User 3 (Leader)</p>
                </button>
                <button onClick={scrollToBottom} className="absolute bottom-5 justify-center items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    <div className="flex flex-col justify-center items-center">
                        <FaChevronDown className=""/>
                        <span>Manual Login</span>
                    </div>
                </button>
            </div>
        </div>
        <div className="relative flex flex-col items-center justify-center h-screen w-full">
                <button onClick={scrollToTop} className="absolute top-5 justify-center items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    <div className="flex flex-col justify-center items-center">
                        <FaChevronUp className=""/>
                        <span>Back to Quick Login</span>
                    </div>
                </button>
                <div className="flex flex-col bg-white p-6 rounded-2xl shadow-md w-[calc(min(500px,90%))]">
                    <h2 className="text-xl font-semibold text-center mb-4">Manual Login<br></br>(Demo)</h2>
                    <input type="text" placeholder="Username" className="p-2 mb-3 border rounded-lg"/>
                    <input type="password" placeholder="Password" className="p-2 mb-3 border rounded-lg"/>
                    <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">Login</button>
                </div>
        </div>
        </>
    )
}
      
export default Login;