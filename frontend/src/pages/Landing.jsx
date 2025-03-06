import { useState,useEffect } from 'react';
import viteLogo from '../assets/example.png';
import axios from "axios";
      
//This is the boilerplate stuff
function Landing(){
    //Use State is just like default.. count is the variable, setCount is a function to redefine the useState
    const [count, setCount] = useState(0);
    const [displayedData, setDisplayedData] = useState(null);


    //This is a function to fetch data via axios(front) and express(back)
    const exampleRestfulFetch1 = async() => {
        const response = await axios.get("http://localhost:3000/addFive");
        //The question mark here basically handles undefined, so data?.test being nothing would do the exit case
        console.log(response.data?.result)
        if (response?.data?.result){
            setDisplayedData(response.data.result); //Display purely json response for example
        }
        else{
            setDisplayedData(null);
        }
    }

    //A use effect with [] at the end just gets instantly called on page load
    useEffect(()=>{
        exampleRestfulFetch1();
    }, [])

    

    const exampleRestfulFetch2 = async(number) => {
        const response = await axios.get(`http://localhost:3000/addFive?number=${number}`);
        //The question mark here basically handles undefined, so data?.test being nothing would do the exit case
        console.log(response.data?.result)
        if (response?.data?.result){
            setDisplayedData(response.data.result); //Display purely json response for example
        }
        else{
            setDisplayedData(null);
        }
    }

    const updateCounter = () => {
        exampleRestfulFetch2(count+1);
        setCount(count+1);
        
    }



    return(
        <>
        <div>
            <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
        </div>
        <h1>Vite + React</h1>
        {/*This is an example of conditional css i made, when the count variable is less than 5, it includes text_danger (red text) otherwise it doesn't*/}
        <div className="card">
            <button onClick={() => {updateCounter()}}>
                <p className={`${count < 5 ? 'text-danger' : ''}`}>count is {count}</p>
            </button>
            <p>
                Edit <code>../src/App.jsx</code> and save to test HMR
            </p>
        </div>
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>

        {/*This is basically an if statement*/}
        {displayedData!==null?
        <p className="text-danger">The value of the counter + 5 = {displayedData}</p>
        :
        <></>}
        
        </>
    )
}
      
export default Landing;