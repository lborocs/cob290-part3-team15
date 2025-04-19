import DropdownItem from "../other/DropdownItem";
import { useEffect, useRef } from "react";
function statusDropdown({onClose, refs, floatingStyles, floatingProps}) {
    const dropdownRef = useRef(null); // Reference to the dropdown element


    // (Depricated, Handled with floating-ui)
    // Close dropdown when clicking outside
    /*
    useEffect(() => {
        const handleClickOutside = (event) => {
            const isClickOnButton = refs.reference.current && refs.reference.current.contains(event.target);
            const isClickInsideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);

            if (!isClickOnButton && !isClickInsideDropdown) {
                // Close dropdown when clicking outside
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose, refs]);*/

    const handleOnline = () => {
        console.log('Online clicked'); // Placeholder for online status action
        onClose();
    }

    const handleInvisible = () => {
        console.log('Invisible clicked'); // Placeholder for invisible status action
        onClose();
    }

    const items = ['Online', 'Invisible'];

    const componentsFunctions = [handleOnline, handleInvisible]

    const icons = [
        <div className={`w-4 h-4 rounded-full border-2 border-blackFaded bg-green-400`}></div>,
        <div className={`w-4 h-4 rounded-full border-2 border-blackFaded bg-gray-400`}></div>
    ]

    return(
        <div className="w-auto absolute bg-white rounded-lg p-2 z-50 border border-gray-300" ref={refs.setFloating} style={floatingStyles} {...floatingProps}>
                {/* Goes through each item in the list and maps items to a key value*/}
                {items.map((item, index) => (
                    <DropdownItem 
                    key={index} 
                    item={item} 
                    onClick={componentsFunctions[index]} // Maps the item to the function at the same index
                    icon={icons? icons[index] : null} // Maps the icon to the item after checking if it exists, else sets it to null
                    /> 
                ))}
        </div>
    )
}

export default statusDropdown;