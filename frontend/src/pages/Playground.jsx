import { useState,useEffect } from 'react';
import viteLogo from '../assets/example.png';
import Message from '../components/chat/Message'
import axios from "axios";
      
//This is the boilerplate stuff
function Playground(){
    //Use State is just like default.. count is the variable, setCount is a function to redefine the useState
    const [count, setCount] = useState(0);
    const jsonMessage = {user:"Example",content:"Body"}
    const [displayedData, setDisplayedData] = useState(null);


    //This is a function to fetch data via axios(front) and express(back)
    const exampleRestfulFetch1 = async() => {
        try{
            const response = await axios.get("/api/chat/getMessage"); //This doesn't have id=? -> It should generate an error
            if (response?.data?.results){
                setDisplayedData(response.data.results);
            }
            else{
                setDisplayedData(null);
            }
        }
        catch (error) {
            if (error.response) {
                setDisplayedData("Error: " + error.response.data?.error || "Bad request");
            }
            else {
                setDisplayedData("An unexpected error occurred");
            }
        }
    }

    //A use effect with [] at the end just gets instantly called on page load
    useEffect(()=>{
        exampleRestfulFetch1();
    }, [])

    

    const exampleRestfulFetch2 = async(number) => {
        try{
            const response = await axios.get(`/api/chat/getMessage?id=${number}`);
            //The question mark here basically handles undefined, so data?.test being nothing would do the exit case
            if (response?.data?.results){
                setDisplayedData(JSON.stringify(response?.data?.results)); //Display purely json response for example
            }
            else{
                setDisplayedData(null);
            }
        }
        catch (error) {
            if (error.response) {
                setDisplayedData("Error: " + error.response.data?.error || "Bad request");
            }
            else {
                setDisplayedData("An unexpected error occurred");
            }
        }
    }

    const updateCounter = () => {
        exampleRestfulFetch2(count+1);
        setCount(count+1);
        
    }



    return(
        <>
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex items-center justify-center">
                <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            {/*This is Rogger's Message Component*/}

            <Message message={jsonMessage}/>
            {/*This is an example of conditional css i made, when the count variable is less than 5, it includes text_danger (red text) otherwise it doesn't*/}
            <div className="p-[2em]">
                <button className={`hover:bg-red-400 bg-gray-300 hover:text-white ${count < 5 ? 'text-red-400' : ''}  rounded-lg border border-2 px-5 py-2 text-base font-medium`} onClick={() => {updateCounter()}}>
                    <p>count is {count}</p>
                </button>
                <p>
                    Edit <code>../src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="color-[#888]">
                Click on the Vite and React logos to learn more
            </p>

            {/*This is basically an if statement*/}
            {displayedData!==null?
            <p className="text-red-500">MessageID {count} : {displayedData}</p>
            :
            <></>}
        </div>
        </>
    )
}
      
export default Playground;