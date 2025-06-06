import DropdownItem from './DropdownItem';

function DropdownList({ items, onClick, icons, refs, floatingStyles, blurBackground }) {
  return (
    <>
      {/* Background Blur */}
      {blurBackground && (
        <div
          className="fixed inset-0 z-50 pointer-events-auto"
        ></div>
      )}

      <div
      className="w-auto absolute bg-white rounded-lg p-2 z-50 border border-gray-300" {...(refs?.setFloating ? { ref: refs.setFloating } : {})} {...(floatingStyles ? { style: floatingStyles } : {})}>
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
    </>
  );
}

export default DropdownList;