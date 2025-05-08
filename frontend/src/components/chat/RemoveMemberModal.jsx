import Modal from "../other/Modal";
function RemoveMemberModal({ open, onClose, removeFunction, refs, floatingStyles }) {
    const handleClose = () => {
        onClose(); // Close the modal
    };
    const handleRemove = () => {
        removeFunction(); // Call the delete function passed as a prop
        onClose(); // Close the modal after removing the member
    };

    return (
        <Modal open={open} onClose={handleClose} refs={refs.setFloating} floatingStyles={floatingStyles}>
            <h3 className="text-2xl font-semibold text-text mb-4 select-none">Are you sure you want to remove this member?</h3>
            <hr className="border-t border-gray-300 mb-6" />
            <p className="text-base text-gray-700 mb-6 leading-relaxed select-none">This person can be added back later if you choose to do so. </p>
            <hr className="border-t border-gray-300 mb-6" />
            <div className="flex justify-end mt-4 space-x-4">
                <button className="px-5 py-3 text-base font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none select-none" onClick={handleClose}>Cancel</button>
                <button className="px-5 py-3 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none select-none" onClick={handleRemove}>Confirm</button>
            </div>
        </Modal>
    );
}

export default RemoveMemberModal;