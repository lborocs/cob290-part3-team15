import Modal from "../other/Modal";
import { useFloating, offset, useDismiss, autoUpdate } from "@floating-ui/react";
function RemoveMemberModal({ open, onClose, removeFunction, closeDropdown, refs, floatingStyles }) {

    const handleClose = (e) => {
        e.stopPropagation(); // Prevent event from bubbling up to the dropdown
        onClose(); // Close the modal
    };
    const handleRemove = (e) => {
        e.stopPropogation(); 
        console.log("Removing member...");
        removeFunction(); // Call the delete function passed as a prop
        handleClose(e);
    };
    if (!open) return null; // Don't render the modal if not open

    return (
        <Modal open={open} onClose={handleClose} refs={refs.setFloating} floatingStyles={floatingStyles}>
            <h3 className="text-2xl font-semibold text-text mb-4">Are you sure you want to remove this member?</h3>
            <hr className="border-t border-gray-300 mb-6" />
            <p className="text-base text-gray-700 mb-6 leading-relaxed">This person can be added back later if you choose to do so. </p>
            <hr className="border-t border-gray-300 mb-6" />
            <div className="flex justify-end mt-4 space-x-4">
                <button className="px-5 py-3 text-base font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none" onClick={handleClose}>Cancel</button>
                <button className="px-5 py-3 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none" onClick={() => console.log("Clicked")}>Confirm</button>
            </div>
        </Modal>
    );
}

export default RemoveMemberModal;