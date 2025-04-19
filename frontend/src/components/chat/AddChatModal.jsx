import React, { useState } from "react";
import Modal from "./Modal.jsx";
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
  
    const handleSelectPerson = (person) => {
      if (selectedPeople.some((p) => p.id === person.id)) { // Check if the person is already selected or not
        setSelectedPeople(selectedPeople.filter((p) => p.id !== person.id));
      } else {
        setSelectedPeople([...selectedPeople, person]); // Add the person from the selected list
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
            <h3 className="text-2xl font-bold text-text mb-4 text-left w-full">Add People</h3>

            <div className="py-8 px-8 bg-accentOrange rounded-lg mx-auto shadow-sm w-full">

                {/* Search Bar */}
                <div className="flex items-center bg-gray-500 rounded-lg p-2 mb-4 w-full">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search"
                    className="flex-grow bg-transparent outline-none text-gray-200 placeholder-gray-200"
                />
                
                </div>
                
                {/* List of people */}
                <div className="space-y-2 w-full max-h-40 overflow-y-auto">
                {people
                    .filter((person) =>
                        person.name.toLowerCase().includes(searchInput.toLowerCase())
                    )
                    .map((person) => (
                        <div
                            key={person.id}
                            className="flex items-center bg-orangeHover shadow-sm p-2 rounded-lg cursor-pointer"
                        >
                            <div
                                className={`w-8 h-8 rounded-full ${person.color} mr-4`}
                            ></div>
                            <span className="font-bold px-2">{person.name}</span>
                            <input
                                type="checkbox"
                                checked={selectedPeople.some((p) => p.id === person.id)}
                                onChange={() => handleSelectPerson(person)}
                                className="ml-auto"
                            />
                        </div>
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