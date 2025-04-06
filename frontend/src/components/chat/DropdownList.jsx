
import DropdownItem from './DropdownItem';

function DropdownList({ items, onClick }) {
  return (
    <div id="dropdown-list" className="absolute bg-white rounded-lg p-2 z-50">
        {/* Goes through each item in the list and maps items to a key value and  */}
        {items.map((item, index) => (
            <DropdownItem key={index} item={item} onClick={onClick} />
        ))}
    </div>
  );
}

export default DropdownList;