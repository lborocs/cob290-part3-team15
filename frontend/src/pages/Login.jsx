import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from 'axios';
import make_it_all from '../assets/logo.png';

//This is the boilerplate stuff
function Login(){
    const navigate=useNavigate();
    const [userID, setUserID] = useState('');
    const [pass, setPass] = useState('');

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

    const handleLogin = async() => {
        //Presence checks
        if (userID === ""){
            alert("Please enter a user ID")
            return;
        }
        //Check if userID is a number
        if (isNaN(userID)){
            alert("User ID must be a number")
            return;
        }
        const headers = {headers: {'Content-Type': 'application/json',}};
        const body = {userID: parseInt(userID),pass: pass};
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
        <div className="relative flex flex-col items-center justify-center h-screen w-full">
                <div className="flex flex-col bg-white p-6 rounded-2xl shadow-md w-[calc(min(500px,90%))]">
                    <h2 className="text-xl font-semibold text-center mb-4">Manual Login<br></br>(Demo)</h2>
                    <input type="text" placeholder="ID" onChange={(e) => setUserID(e.target.value)} className="p-2 mb-3 border rounded-lg "/>
                    <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} className="p-2 mb-3 border rounded-lg"/>
                    <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600" onClick={handleLogin}>Login</button>
                </div>
        </div>
        </>
    )
}
      
export default Login;