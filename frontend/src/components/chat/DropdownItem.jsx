function DropdownItem({item, onClick }) {
    return (
        <div
        id="dropdown-item"
        className="p-2 hover:bg-gray-200 cursor-pointer rounded-lg"
        onClick={() => onClick(item)}
        >
        {item}
        </div>
    );
}

export default DropdownItem;