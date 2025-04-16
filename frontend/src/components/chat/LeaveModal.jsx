import Modal from "./Modal";

function LeaveModal ({open, onClose, leaveFunction, closeDropdown}) {
    const handleClose = () => {
        onClose(); // Close the modal
        closeDropdown(); // Close the dropdown
    }
    const handleLeave = () => {
        leaveFunction(); // Call the delete function passed as a prop
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <h3 className="text-2xl font-semibold text-text mb-4">Are you sure you want to remove this chat?</h3>
            <hr className="border-t border-gray-300 mb-6" />
            <p className="text-base text-gray-700 mb-6 leading-relaxed">Messages will still be stored as they are and you will be able to recover the chat by re-adding the user. </p>
            <hr className="border-t border-gray-300 mb-6" />
            <div className="flex justify-end mt-4 space-x-4">
                <button className="px-5 py-3 text-base font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none" onClick={handleClose}>Cancel</button>
                <button className="px-5 py-3 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none" onClick={handleLeave}>Confirm</button>
            </div>
        </Modal>
    );
}

export default LeaveModal;