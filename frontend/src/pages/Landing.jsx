import { useState } from 'react';
import viteLogo from '../assets/example.png';
import Message from '../components/chat/Message'
      
//This is the boilerplate stuff
function Landing(){
    //Use State is just like default.. count is the variable, setCount is a function to redefine the useState
    const [count, setCount] = useState(0);
    const jsonMessage = {user:"Example",content:"Body"}

    return(
        <>
        <div>
            <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
        </div>
        <h1>Vite + React</h1>
        {/*This is Rogger's Message Component*/}

        <Message message={jsonMessage}/>
        {/*This is an example of conditional css i made, when the count variable is less than 5, it includes text_danger (red text) otherwise it doesn't*/}
        <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
                <p className={`${count < 5 ? 'text-danger' : ''}`}>count is {count}</p>
            </button>
            <p>
                Edit <code>../src/App.jsx</code> and save to test HMR
            </p>
        </div>
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
        </>
    )
}
      
export default Landing;