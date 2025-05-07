import Modal from "../other/Modal";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

function AddMemberModal({ open, onClose, refs, floatingStyles,selectedID}) {
    const [searchInput, setInput] = useState("");
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [people, setPeople] = useState([]); // Limited list of people
    const [fullPeopleList, setFullPeopleList] = useState([]); // Full list of people
    const searchRecords = useRef(new Map());

    const colors = {
        blue : 'bg-blue-500/60',
        green : 'bg-green-500/60', 
        red : 'bg-red-400/60',
        pink : 'bg-pink-500/40', 
        purple : 'bg-purple-500/40',
        gray : 'bg-gray-500/70',
    }

    const handleSearchInput = async(e) => {
        const before = searchInput.length;
        const after = e.target.value.length;
        setInput(e.target.value);
        //30 people can be returned from getPeople in one instance, if it's maxed out then there COULD be more people to get
        //10 people will be displayed at one time.

        //Attempt to filter to 10 max people
        var newFilteredList = fullPeopleList.filter((person) => person.name.toLowerCase().includes(e.target.value.toLowerCase())).slice(0, 10)

        //If it didn't get 10 people, will need to reference other sources to see if there are more people to get
        const shouldQuery = newFilteredList.length<10 && (before>after || (fullPeopleList.length==30 && after>before))
        if (shouldQuery) {
            const cachedResults = searchRecords.current.get(e.target.value);
            //If there's no cached results, then we need to get the people from the Database
            if (cachedResults===undefined){
                const response=await getPeople(e.target.value)  || [];
                if (response.length > 0) {
                    searchRecords.current.set(e.target.value, response);
                    newFilteredList = response.filter((person) => person.name.toLowerCase().includes(e.target.value)).slice(0, 10);
                    setFullPeopleList(response);
                } else {
                    searchRecords.current.set(e.target.value, []);
                }

            }
            //If there are cached results, use them instead of querying the database again
            else{
                newFilteredList = cachedResults
                setFullPeopleList(cachedResults);
            }
        }

        //Cache the filtered results
        if (newFilteredList.length > 0) {
            searchRecords.current.set(e.target.value, newFilteredList);
        } 
        else if (newFilteredList.length === 0) {
            searchRecords.current.set(e.target.value, []);
        }

        setPeople(newFilteredList);
        setSelectedPeople(selectedPeople.filter((p) => p.isSelected));

        // Cleaning up cached results if the size exceeds 100
        if (searchRecords.current.size > 100) {
            const firstKey = searchRecords.current.keys().next().value;
            searchRecords.current.delete(firstKey);
        }
    }

    const getPeople = async (query='') => {
        try{
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`/api/chat/getPeopleOutsideGroup?group=${encodeURIComponent(selectedID)}&filter=${encodeURIComponent(query)}`,{headers: { Authorization: `Bearer ${accessToken}` }});
            if (response?.data?.results){
                return response.data.results;
                }
        }
        catch (error) {}
    }

    useEffect(() => {
            const fetchPeople = async () => {
                if (open) {
                    const response = await getPeople();
                    searchRecords.current.set('', response);
                    setFullPeopleList(response);
                    setPeople(response.slice(0, 10));
                }
            };
        
            fetchPeople();
        }, [open]);

    const handleSubmit = async (target) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const headers = {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json',}
            const body    = { group: selectedID, target:target};
            const response = await axios.post('/api/chat/group_messages/addMember', body,headers);
            if (response?.data?.success) {
                //setFullPeopleList(getPeople())                
            }
            onClose(); // Close the modal
        } catch (error) {}
    }


    return (
        <Modal open={open} onClose={onClose} bgColor="bg-backgroundOrange py-3 px-3 w-xl" accentColor="bg-orangeHover">
            <div className="pt-5"></div>
            <div className="py-3 bg-accentOrange rounded-lg mx-auto shadow-sm w-full select-none">
                {/* Header */}
                <h3 className="px-4 text-2xl font-bold text-text mb-3 text-left w-full select-none">Add Member</h3>
                <div className="w-full px-4">
                    {/* Search Bar */}
                    <div className="flex items-center bg-gray-500 rounded-lg p-2 mb-4 w-full">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearchInput}
                        placeholder="Search"
                        className="flex-grow bg-transparent outline-none text-gray-200 placeholder-gray-200"
                    />
                        <BsSearch className="text-gray-200" />
                    </div>
                </div>

                {/* List of people */}
                
                <div className="space-y-2 px-4 w-full max-h-50 overflow-y-auto">
                {/* For Selected People / Top Half */}
                {selectedPeople
                    .map((person) => (
                        <label
                            key={person.id}
                            className="flex w-full items-center bg-orangeHover shadow-sm p-2 rounded-lg cursor-pointer"
                            onClick={() => console.log(person.name)}
                        >
                            <div
                                className={`flex flex-col w-8 h-8 rounded-full items-center ${colors[Object.keys(colors)[person.id % Object.keys(colors).length]]} mr-4`}
                            ><FaUser className="h-full h-full text-white" /></div>
                            <span className="font-bold px-2">{person.name}</span>
                        </label>
                    ))}
                {/* For Unselected People / Bottom Half */}
                {people
                    .filter((person) => 
                        !selectedPeople.some((p) => p.id === person.id) // Filter out selected people
                    )
                    .filter((person) =>
                        person.name.toLowerCase().includes(searchInput.toLowerCase())
                    )
                    .map((person) => (
                        <label
                            key={person.id}
                            className="flex w-full items-center bg-orangeHover shadow-sm p-2 rounded-lg cursor-pointer"
                            onClick={() => handleSubmit(person.id)}
                        >
                            <div
                                className={`flex flex-col w-8 h-8 rounded-full items-center ${colors[Object.keys(colors)[person.id % Object.keys(colors).length]]} mr-4`}
                            ><FaUser className="h-full h-full text-white" /></div>
                            <span className="font-bold px-2">{person.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </Modal>
    );
}

export default AddMemberModal;