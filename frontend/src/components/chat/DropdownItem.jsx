function DropdownItem({item, onClick }) {
    return (
        <div
        className="w-auto whitespace-nowrap text-sm p-2 px-4 hover:bg-gray-100 cursor-pointer rounded-md text-gray-700"
        onClick={onClick}
        >
        {item}
        </div>
    );
}

export default DropdownItem;