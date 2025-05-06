
function MemberDropdown({onClose, refs, floatingStyles}) {
    
    const items = ['Member 1', 'Member 2', 'Member 3'];
    const componentsFunctions = [() => console.log("Member 1"), () => console.log("Member 2"), null];
    const icons = [null, null, null]; // Add icons if needed

    return (
        <div
        className="w-auto absolute bg-backgroundOrange rounded-lg p-2 z-50 border border-accentOrange" {...(refs?.setFloating ? { ref: refs.setFloating } : {})} {...(floatingStyles ? { style: floatingStyles } : {})}>
            <h2 className="font-bold">Members</h2>
            {/* Goes through each item in the list and maps items to a key value*/}
            {items.map((item, index) => (
                <div
                className="flex justify-between bg-accentOrange items-center w-auto whitespace-nowrap text-sm p-2 px-2 hover:bg-orangeHover cursor-pointer rounded-md text-gray-700"
                onClick={componentsFunctions[index]} // Maps the item to the function at the same index
                key={index} // Add a unique key for each item
                >
                <span>
                    {item}
                </span>
                {icons[index] && <span className="ml-4 text-gray-500 items-end">{icons[index]}</span>} {/* Check if icon exists before rendering */}
                </div>
            ))}
        </div>
    );
}

export default MemberDropdown;