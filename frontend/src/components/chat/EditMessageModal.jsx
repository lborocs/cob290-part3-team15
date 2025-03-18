import Modal from "./Modal";
function EditMessageModal({open, onClose}){ 
    return (
        <>
            {open && (
                <Modal open={open} onClose={onClose}>
                    <h3>Edit Message</h3>
                </Modal>
            )}
        </>
    )
}

export default EditMessageModal;