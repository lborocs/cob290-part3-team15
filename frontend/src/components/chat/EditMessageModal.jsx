import Modal from "./Modal";
import {useState} from "react";
import axios from "axios";

function EditMessageModal({open, onClose, message, setMessage,mode}){
    const [editedContent, setEditedContent] = useState(message.content); // Initially set the edited content to the message content
    const handleSave = async () => {
        try {
            // Make an api call to update the message content
            const accessToken = localStorage.getItem('accessToken');
            const headers = {headers: {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json',}}
            const body = {id: message.messageID, content: editedContent};
            const response = await axios.put(`/api/chat/${mode}/updateMessage`, body, headers);
            if (response?.data?.success) {
                setMessage({...message, content: editedContent});
                onClose(); // Close the modal if the update was successful
            } else {
                console.error("Failed to update message");
            }
        } catch (error) {
            console.error("Error updating message:", error);
        }
    }
    return (
        <>
            {open && (
                <Modal open={open} onClose={onClose}>
                    <h3 className="text-lg mb-2 justify-start">Edit Message</h3>
                    <hr className="border-t-2 border-gray-300 mb-4" />
                    <textarea className="w-full h-32 p-2 border border-gray-300 rounded-lg mb-4 resize-none" 
                    value={editedContent} // Default value is the message content
                    onChange={(e) => setEditedContent(e.target.value)} // Update edited content state on change
                    />
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 text-white bg-blue-400 rounded-lg" onClick={handleSave}>Save</button>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default EditMessageModal;