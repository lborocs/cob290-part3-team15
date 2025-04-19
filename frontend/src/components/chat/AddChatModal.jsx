import React, { useState } from "react";
import Modal from "../other/Modal.jsx";
import { BsChevronLeft, BsChevronRight, BsSearch } from "react-icons/bs";
function AddChatModal({ open, onClose, userID }) {
    const [searchInput, setInput] = useState("");
    const [selectedPeople, setSelectedPeople] = useState([]);

    const people = [
        { id: 1, name: "Johnny Smith", color: "bg-green-400" },
        { id: 2, name: "John Haymaker", color: "bg-purple-400" },
        { id: 3, name: "Hugh Full-Stack", color: "bg-blue-400" },
        { id: 4, name: "Tudor Stats", color: "bg-pink-400" },
        { id: 5, name: "Toby Pi", color: "bg-yellow-400" },
        { id: 6, name: "Nik Graph", color: "bg-red-400" },
        { id: 7, name: "Jacob Bar", color: "bg-orange-400" },
        { id: 8, name: "Ryan Message", color: "bg-teal-400" },
        { id: 9, name: "Rogger Modal", color: "bg-gray-400" },
    ];

    const [unselectedPeople, setUnselectedPeople] = useState(people); // Initially set unselected people to all people
    
    // This function is just an if else for if the person is already selected or not, and does the opposite action
    const handleSelectPerson = (person) => {
      if (selectedPeople.some((p) => p.id === person.id)) { // Check if the person is already selected or not
        setSelectedPeople(selectedPeople.filter((p) => p.id !== person.id)); // Remove the person from the selected list
        setUnselectedPeople([...unselectedPeople, person]); // Add the person to the unselected list
      } else {
        setSelectedPeople([...selectedPeople, person]); // Add the person from the selected list
        setUnselectedPeople(unselectedPeople.filter((p) => p.id !== person.id)); // Remove the person from the unselected list
      }
    };
  
    const handleSubmit = () => {
      console.log("Selected People:", selectedPeople);
      onClose();
    };

  return (
    open && (
        <Modal open={open} onClose={onClose} bgColor="bg-backgroundOrange py-8 w-xl" accentColor="bg-orangeHover">
            {/* Header */}
            <h3 className="text-2xl font-bold text-text mb-4 text-left w-full select-none">{selectedPeople.length > 1 ? "Add Group" : "Add Person"}</h3>

            <div className="py-8 bg-accentOrange rounded-lg mx-auto shadow-sm w-full select-none">
                <div className="w-full px-8">
                    {/* Search Bar */}
                    <div className="flex items-center bg-gray-500 rounded-lg p-2 mb-4 w-full">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search"
                        className="flex-grow bg-transparent outline-none text-gray-200 placeholder-gray-200"
                    />
                        <BsSearch className="text-gray-200" />
                    </div>
                    {/* Selected People Section */}
                    <div className="relative flex items-center mb-4 pl-4 pr-4">
                        {/* Left Scroll Button */}
                        <button
                            onClick={() => {
                                const container = document.getElementById("selected-people-container");
                                container.scrollLeft -= 150;
                            }}
                            className="absolute left-0 text-black"
                        >
                            <BsChevronLeft />
                        </button>

                        {/* Selected People Container */}
                        <div
                            id="selected-people-container"
                            className="flex flex-nowrap items-center overflow-hidden"
                        >
                            {selectedPeople.map((person) => (
                                <div
                                    key={person.id}
                                    className="flex flex-nowrap whitespace-nowrap bg-orangeHover text-text px-3 py-1 rounded-full shadow-sm"
                                >
                                    <span className="mr-2 flex flex-nowrap">{person.name}</span>
                                    <button
                                        onClick={() => {
                                            setSelectedPeople(selectedPeople.filter((p) => p.id !== person.id))
                                            setUnselectedPeople([...unselectedPeople, person])
                                            }
                                        }
                                        className="text-gray-500 hover:text-red-700 font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Right Scroll Button */}
                        <button
                            onClick={() => {
                                const container = document.getElementById("selected-people-container");
                                container.scrollLeft += 150;
                            }}
                            className="absolute right-0 text-black"
                        >
                            <BsChevronRight />
                        </button>
                    </div>
                </div>
                {/* List of people */}
                
                <div className="space-y-2 px-8 w-full max-h-40 overflow-y-auto">
                {/* For Selected People / Top Half */}
                {selectedPeople
                    .map((person) => (
                        <label
                            key={person.id}
                            className="flex w-full items-center bg-orangeHover shadow-sm p-2 rounded-lg cursor-pointer"
                        >
                            <div
                                className={`w-8 h-8 rounded-full ${person.color} mr-4`}
                            ></div>
                            <span className="font-bold px-2">{person.name}</span>
                            <input
                                type="checkbox"
                                onChange={() => handleSelectPerson(person)}
                                checked={selectedPeople.some((p) => p.id === person.id)}
                                className="ml-auto w-5 h-5 cursor-pointer"
                            />
                        </label>
                    ))}
                {/* For Unselected People / Bottom Half */}
                {unselectedPeople
                    .filter((person) =>
                        person.name.toLowerCase().includes(searchInput.toLowerCase())
                    )
                    .map((person) => (
                        <label
                            key={person.id}
                            className="flex w-full items-center bg-orangeHover shadow-sm p-2 rounded-lg cursor-pointer"
                        >
                            <div
                                className={`w-8 h-8 rounded-full ${person.color} mr-4`}
                            ></div>
                            <span className="font-bold px-2">{person.name}</span>
                            <input
                                type="checkbox"
                                onChange={() => handleSelectPerson(person)}
                                checked={selectedPeople.some((p) => p.id === person.id)}
                                className="ml-auto w-5 h-5 cursor-pointer"
                            />
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex justify-end">  
                <button onClick={handleSubmit} className="mt-4 px-10 py-2 bg-orangeHover shadow-sm text-black font-bold rounded-lg">
                    Add
                </button>
            </div>
        </Modal>
    )
  );
}

export default AddChatModal;