import Modal from "../other/Modal";
import axios from "axios";

function HideMessageModal({ open, onClose, messageID, mode }) {
    const handleHide = async() => {
        // Logic to hide the message
        try {
            // API call to hide the message
            const accessToken = localStorage.getItem('accessToken');
            const headers = {headers: {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json',}}
            const body = {id: messageID};
            const response = await axios.put(`/api/chat/${mode}/hideMessage`, body, headers);
            if (response.data.success) {
                onClose();
            } else {
                console.error("Failed to hide message:");
            }
        } catch (error) {
            console.error("Error hiding message:", error);
        }
    }
    return (
        <Modal open={open} onClose={onClose}>
            <h3 className="text-2xl font-semibold text-text mb-4 select-none">Are you sure you want to delete this message?</h3>
            <hr className="border-t border-gray-300 mb-6" />
            <p className="text-base text-gray-700 mb-6 leading-relaxed select-none">This message will no longer be visible, however it will still be stored in our system, for your safety. </p>
            <hr className="border-t border-gray-300 mb-6" />
            <div className="flex justify-end mt-4 space-x-4">
                <button className="px-5 py-3 text-base font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none select-none" onClick={onClose}>Cancel</button>
                <button className="px-5 py-3 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none select-none" onClick={handleHide}>Confirm</button>
            </div>
        </Modal>
    );
}

export default HideMessageModal;