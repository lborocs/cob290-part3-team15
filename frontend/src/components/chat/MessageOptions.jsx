import { BsThreeDots, BsPencil, BsPencilFill } from "react-icons/bs";
import { useState } from 'react';
import EditMessageModal from './EditMessageModal';
function MessageOptions({sentByUser, isHoveredComment, SetOpenEditModal}) {
    const [isHoveredEdit, SetIsHoveredEdit] = useState(false);
    const HandleMouseEnterEdit = () => {
        SetIsHoveredEdit(true);
      };
    
    const HandleMouseLeaveEdit = () => {
        SetIsHoveredEdit(false);
    };

    return (
        <>
            {isHoveredComment && (
                <div className="flex rounded-lg bg-white space-x-2 absolute right-0 bottom-10 y-10 z-40">
                    <button 
                    // onClick={} 
                    className="p-1"
                    >
                    <BsThreeDots className="text-gray-200 hover:text-purple-200" />
                    </button>
                    {sentByUser &&
                    <button
                    onClick={() => {
                        console.log("Opening edit modal")
                        SetOpenEditModal(true)
                    }}
                    className="p-1"
                    onMouseEnter={HandleMouseEnterEdit}
                    onMouseLeave={HandleMouseLeaveEdit}
                    >
                    {isHoveredEdit ? <BsPencilFill className="text-purple-200" /> : <BsPencil className="text-gray-200" />}
                    </button>
                    }
                </div>
            )}
        </>
      )
}

export default MessageOptions; 