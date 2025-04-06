
import DropdownItem from './DropdownItem';

function DropdownList({ items, onClick }) {
  return (
    <div
    className="w-auto absolute bg-white rounded-lg p-2 z-50 border border-gray-300">
        {/* Goes through each item in the list and maps items to a key value and  */}
        {items.map((item, index) => (
            <DropdownItem key={index} item={item} onClick={onClick} />
        ))}
    </div>
  );
}

export default DropdownList;