import DropdownList from "../chat/DropdownList";
import { useEffect, useRef } from "react";
function statusDropdown({onClose, refs, floatingStyles}) {

    const dropdownRef = useRef(null); // Reference to the dropdown element

    // Close dropdown when clicking outside
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            onClose(); // Call the onClose function to close the dropdown
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleOnline = () => {
        console.log('Online clicked'); // Placeholder for online status action
    }

    const handleInvisible = () => {
        console.log('Invisible clicked'); // Placeholder for invisible status action
    }

    const items = ['Online', 'Invisible'];

    const componentsFunctions = []

    const icons = []

    return(
        <div ref = {dropdownRef}>
            <DropdownList items={items} onClick={componentsFunctions} icons={icons} refs={refs} floatingStyles={floatingStyles}/>
        </div>
    )
}

export default statusDropdown;