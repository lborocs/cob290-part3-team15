import React, { useEffect, useRef } from "react";
function LeaveDropdown(onClose){
    const dropdownRef = useRef(null); // Reference to the dropdown element
    // Same as chat dropdown, using ref to detect clicks outside the dropdown
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

    return (
        <div ref={dropdownRef}>
          <DropdownList items={items} onClick={componentsFunctions} icons={icons} />
        </div>
    );
}

export default LeaveDropdown;