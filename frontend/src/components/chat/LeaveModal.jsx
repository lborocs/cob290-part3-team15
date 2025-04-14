

function DeletionModal ({open, onClose, leaveFunction}) {
    const handleDelete = () => {
        leaveFunction(); // Call the delete function passed as a prop
        onClose(); // Close the modal after deletion
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h3 className="text-lg mb-2">Are you sure you want to delete this message?</h3>
            <hr className="border-t-2 border-gray-300 mb-4" />
            <div className="flex justify-end mt-4">
                <button className="px-4 py-2 text-white bg-red-500 rounded-lg" onClick={handleDelete}>Delete</button>
            </div>
        </Modal>
    );
}

export default DeletionModal;