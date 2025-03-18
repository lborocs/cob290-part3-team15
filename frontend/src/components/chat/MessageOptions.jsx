import { BsThreeDots, BsPencil, BsPencilFill } from "react-icons/bs";
import { useState } from 'react';
import EditMessageModal from './EditMessageModal';
function MessageOptions(){
    const [isHoveredEdit, SetIsHoveredEdit] = useState(false);
    const [openEditModal, SetOpenEditModal] = useState(false);
    const HandleMouseEnterEdit = () => {
        SetIsHoveredEdit(true);
      };
    
    const HandleMouseLeaveEdit = () => {
        SetIsHoveredEdit(false);
    };

    return (
        <>
            {!openEditModal && (
                <div className="flex space-x-2 justify-end">
                    <button 
                    // onClick={} 
                    className="p-1"
                    >
                    <BsThreeDots className="text-gray-200 hover:text-purple-200" />
                    </button>
                    <button
                    onClick={() => SetOpenEditModal(true)}
                    className="p-1"
                    onMouseEnter={HandleMouseEnterEdit}
                    onMouseLeave={HandleMouseLeaveEdit}
                    >
                    {isHoveredEdit ? <BsPencilFill className="text-purple-200" /> : <BsPencil className="text-gray-200" />}
                    </button>
                </div>
            )}
            <EditMessageModal open={openEditModal} onClose={() => SetOpenEditModal(false)}/>
        </>
      )
}

export default MessageOptions; 