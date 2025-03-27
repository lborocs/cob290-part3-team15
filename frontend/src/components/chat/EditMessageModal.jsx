import Modal from "./Modal";
function EditMessageModal({open, onClose, content}){ 
    return (
        <>
            {open && (
                <Modal open={open} onClose={onClose}>
                    <h3 className="text-lg mb-2 justify-start">Edit Message</h3>
                    <hr className="border-t-2 border-gray-300 mb-4" />
                    <textarea className="w-full h-32 p-2 border border-gray-300 rounded-lg mb-4 resize-none" defaultValue={content}/>
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 text-white bg-blue-400 rounded-lg">Save</button>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default EditMessageModal;