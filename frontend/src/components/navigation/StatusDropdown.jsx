import DropdownList from "../chat/DropdownList";
import { useEffect, useRef } from "react";
function statusDropdown({onClose, refs, floatingStyles}) {

    const dropdownRef = useRef(null); // Reference to the dropdown element

    // Close dropdown when clicking outside
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickOnButton = refs.reference.current && refs.reference.current.contains(event.target);
            const isClickInsideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);

            if (!isClickOnButton && !isClickInsideDropdown) {
                // Close dropdown when clicking outside
                onClose(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose, refs]);

    const handleOnline = () => {
        console.log('Online clicked'); // Placeholder for online status action
    }

    const handleInvisible = () => {
        console.log('Invisible clicked'); // Placeholder for invisible status action
    }

    const items = ['Online', 'Invisible'];

    const componentsFunctions = [handleOnline, handleInvisible]

    const icons = [
        <div className={`absolute w-4 h-4 rounded-full border-2 border-blackFaded bg-green-400`}></div>,
        <div className={`absolute w-4 h-4 rounded-full border-2 border-blackFaded bg-gray-400`}></div>
    ]

    return(
        <div ref = {dropdownRef} className="absolute">
            <DropdownList items={items} onClick={componentsFunctions} icons={icons} refs={refs} floatingStyles={floatingStyles}/>
        </div>
    )
}

export default statusDropdown;