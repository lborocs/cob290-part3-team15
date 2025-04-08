function DropdownItem({item, onClick, icon}) {
    return (
        <div
        className="flex justify-between items-center w-auto whitespace-nowrap text-sm p-2 px-2 hover:bg-gray-100 cursor-pointer rounded-md text-gray-700"
        onClick={onClick}
        >
        <span>
            {item}
        </span>
        {icon && <span className="ml-4 text-gray-500 items-end">{icon}</span>} {/* Check if icon exists before rendering */}
        </div>
    );
}

export default DropdownItem;