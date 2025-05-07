import { BsFillPersonFill, BsPersonAdd, BsPersonFillAdd, BsX } from "react-icons/bs";
import {useState,useEffect} from "react";
import axios from "axios";

function MemberDropdown({onClose, refs, floatingStyles,mode,selectedID,name}) {
    
    const [items,setItems] = useState([])
    const componentsFunctions = [() => console.log("Member 1"), () => console.log("Member 2"), null];
    const icons = [<BsFillPersonFill className="w-6 h-6"/>, <BsFillPersonFill className="w-6 h-6"/>, <BsFillPersonFill className="w-6 h-6"/>]; // Add icons if needed
    const iconColours = ['bg-green-500', 'bg-blue-500', 'bg-red-500'];


    const getPeople = async() => {
        try{
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`/api/chat/${mode}/getMembers?target=${selectedID}`, {headers: { Authorization: `Bearer ${accessToken}` }});
        if (response?.data?.results){
            setItems(response.data.results)
        }
        else{
            setMessages([]);
        }
        }
        catch (error) {
        // Empty as we log errors in the request response
        }
    }

    //Onload
    useEffect(()=>{
        getPeople();
    }, [selectedID,mode])

    return (
        <>
        <div
        className="w-auto absolute bg-backgroundOrange rounded-lg p-2 z-50 border border-accentOrange" {...(refs?.setFloating ? { ref: refs.setFloating } : {})} {...(floatingStyles ? { style: floatingStyles } : {})}>
            <div className="px-1 font-bold text-lg text-left">Members</div>
            {/* Goes through each item in the list and maps items to a key value*/}
            {items.map((item, index) => (
                <div
                className={`group flex justify-between bg-accentOrange items-center w-auto whitespace-nowrap select-none text-lg p-2 px-2 font-bold ${mode=="group_messages"?"hover:bg-orangeHover cursor-pointer":""}  rounded-md text-gray-700 mb-1`}
                key={index} // Add a unique key for each item
                >
                    {icons[index] && <span className={`w-10 h-10 ${iconColours[index]} rounded-full text-white flex items-center justify-center mr-3`}>{icons[index]}</span>} {/* Check if icon exists before rendering */}
                    <span>
                        {item.name}
                    </span>
                    {mode=="group_messages"?<BsX className="invisible w-10 h-10 text-gray-500 ml-2 group-hover:visible" onClick={componentsFunctions[index]} />:<></>}
                </div>
            ))}
            <div className="flex justify-center mt-4">
                <button
                    className="group w-8 h-8 bg-accentOrange hover:bg-orangeHover rounded-full flex items-center justify-center shadow-md"
                    onClick={() => console.log("Add Member")}
                >
                    <BsPersonAdd className=" w-6 h-6 group-hover:hidden"/>
                    <BsPersonFillAdd className="w-6 h-6 hidden group-hover:block"/>
                </button>
            </div>
        </div>

        <div className="fixed inset-0 z-40 pointer-events-auto"></div>
        </>
    );
}

export default MemberDropdown;