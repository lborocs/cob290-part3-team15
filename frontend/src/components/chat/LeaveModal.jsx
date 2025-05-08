import Modal from "../other/Modal";

function LeaveModal ({open, onClose, leaveFunction, closeDropdown, refs, floatingStyles, isSelf, chatName}) {
    const handleClose = () => {
        onClose(); // Close the modal
        if (closeDropdown) {
            closeDropdown(); // Close the dropdown if possible
        }
    }
    const handleLeave = () => {
        leaveFunction(); // Call the delete function passed as a prop
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose} refs={refs?.setFloating} floatingStyles={floatingStyles}>
            <h3 className="text-2xl font-semibold text-text mb-4 select-none">Are you sure you want to remove this chat?</h3>
            <hr className="border-t border-gray-300 mb-6" />
            <p className="text-base text-gray-700 mb-6 leading-relaxed select-none">{!isSelf? (`Messages will still be stored as they are and you will be able to recover the chat by re-adding the user.`):(<>You are about to delete the group <strong>{chatName}</strong>, this is an irreversible process.<br/>Are you sure you want to continue?</>)}</p>
            <hr className="border-t border-gray-300 mb-6" />
            <div className="flex justify-end mt-4 space-x-4">
                <button className="px-5 py-3 text-base font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none select-none" onClick={handleClose}>Cancel</button>
                <button className="px-5 py-3 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none select-none" onClick={handleLeave}>Confirm</button>
            </div>
        </Modal>
    );
}

export default LeaveModal;