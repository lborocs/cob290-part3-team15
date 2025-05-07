import Modal from "../other/Modal";
import { useState } from "react";
import axios from "axios";
function RenameModal({ open, chatID, onClose, refs, floatingStyles, chatName,selectedID }) {
    const [newChatName, setNewChatName] = useState(chatName);
    const handleRename = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const headers = {headers: {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json',}}
            const body    = { group: selectedID, name:newChatName};
            const response = await axios.post('/api/chat/group_messages/updateName', body,headers);
            if (response?.data?.success) {
                //setFullPeopleList(getPeople())                
            }
            console.log("Renaming chat to: ", newChatName);
            onClose(); // Close the modal
        }
        catch (error) {
            console.error("Error in renaming chat:", error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} refs={refs.setFloating} floatingStyles={floatingStyles} bgColor="bg-backgroundOrange" accentColor="bg-orangeHover">
            <div className="py-6 px-8 bg-accentOrange rounded-lg shadow-lg w-full max-w-md mx-auto">
                <h3 className="px-2 text-2xl font-bold text-text mb-3 text-left w-full select-none">Rename this chat</h3>
                <input className="w-full px-4 py-2 mb-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newChatName} placeholder="Enter chat name" type="text" onChange={(e) => setNewChatName(e.target.value)}></input>
                <div className="flex justify-end space-x-4">
                    <button className="mt-4 py-2 px-2 bg-orangeHover shadow-sm text-black font-bold rounded-lg w-full" onClick={onClose}>Cancel</button>
                    <button className="mt-4 py-2 px-2 bg-orangeHover shadow-sm text-black font-bold rounded-lg w-full" onClick={handleRename}>Confirm</button>
                </div>
            </div>
        </Modal>
    );
}

export default RenameModal;