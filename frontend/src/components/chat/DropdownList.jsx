
import DropdownItem from './DropdownItem';

function DropdownList({ items, onClick, icons, refs, floatingStyles }) {
  return (
    <div
    className="w-auto absolute bg-white rounded-lg p-2 z-50 border border-gray-300" ref={refs.setFloating} style={floatingStyles}>
        {/* Goes through each item in the list and maps items to a key value*/}
        {items.map((item, index) => (
            <DropdownItem 
            key={index} 
            item={item} 
            onClick={onClick[index]} // Maps the item to the function at the same index
            icon={icons? icons[index] : null} // Maps the icon to the item after checking if it exists, else sets it to null
            /> 
        ))}
    </div>
  );
}

export default DropdownList;