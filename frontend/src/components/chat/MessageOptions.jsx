import { BsThreeDots, BsPencil, BsPencilFill } from "react-icons/bs";
import { useState } from 'react';
import EditMessageModal from "./EditMessageModal";
function MessageOptions(){
    const [isHoveredEdit, SetIsHoveredEdit] = useState(false);
    const [isHoveredOptions, SetIsHoveredOptions] = useState(false);  
    const [openEditModal, SetOpenEditModal] = useState(false);
    const HandleMouseEnterEdit = () => {
        SetIsHoveredEdit(true);
      };
    
    const HandleMouseLeaveEdit = () => {
        SetIsHoveredEdit(false);
    };
    
    const HandleMouseEnterOptions = () => {
        SetIsHoveredOptions(true);
    };
    
    const HandleMouseLeaveOptions = () => {
        SetIsHoveredOptions(false);
    };

    return (
        <>
            <div className="flex space-x-2 justify-end">
                <button 
                // onClick={} 
                className="p-1 hover: "
                onMouseEnter={HandleMouseEnterOptions}
                onMouseLeave={HandleMouseLeaveOptions}
                >
                {isHoveredOptions ? <BsThreeDots className="text-purple-200" /> : <BsThreeDots className="text-gray-200" />}
                </button>
                <button
                onClick={() => SetOpenEditModal(true)}
                className="p-1 hover: "
                onMouseEnter={HandleMouseEnterEdit}
                onMouseLeave={HandleMouseLeaveEdit}
                >
                {isHoveredEdit ? <BsPencilFill className="text-purple-200" /> : <BsPencil className="text-gray-200" />}
                </button>
            </div>
            {openEditModal && (
            <EditMessageModal open={openEditModal} onClose={() => SetOpenEditModal(false)}>
                <h3>Modal</h3>
            </EditMessageModal>
            )}
        </>
      )
}

export default MessageOptions; 