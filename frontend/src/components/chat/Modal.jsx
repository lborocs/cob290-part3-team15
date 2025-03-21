import { BsX } from "react-icons/bs";
export default function Modal({open, onClose, children}){
    return(
        <div 
        onClick={onClose} 
        className={`
            fixed inset-0 flex justify-center items-center
            transition-colors z-50
            ${open ? "visible bg-black/20" : "invisible"}
        `}>
            <div
                onClick={(e) => e.stopPropagation()} 
                className={`
                bg-white rounded-xl shadow p-6 transition-all
                ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
                `}
            >
                <button 
                    className="absolute top-2 right-2 p-1 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-600" 
                    onClick={onClose}
                >
                    < BsX />
                </button>
                {children}
            </div>
        </div>
    )
}