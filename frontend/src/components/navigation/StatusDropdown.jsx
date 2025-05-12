import DropdownItem from "../other/DropdownItem";
import {getSocket} from '../../socket';

function statusDropdown({onClose, refs, floatingStyles}) {

    const handleOnline = async() => {
        const socket = getSocket();
        socket.emit('updateStatus', 'Online');
        onClose();
    }

    const handleInvisible = async() => {
        const socket = getSocket();
        socket.emit('updateStatus', 'Invisible');

        onClose();
    }

    const handleDND = async() => {
        const socket = getSocket();
        socket.emit('updateStatus', 'DND');

        onClose();
    }

    const handleAway = async() => {
        const socket = getSocket();
        socket.emit('updateStatus', 'Away');

        onClose();
    }

    const items = ['Online','Away','Do Not Disturb' ,'Invisible'];

    const componentsFunctions = [handleOnline,handleAway,handleDND,handleInvisible]

    const icons = [
        <div className={`w-4 h-4 rounded-full border-2 border-blackFaded bg-green-400`}></div>,
        <div className={`w-4 h-4 rounded-full border-2 border-blackFaded bg-yellow-500`}></div>,
        <div className={`w-4 h-4 rounded-full border-2 border-blackFaded bg-red-400`}></div>,
        <div className={`w-4 h-4 rounded-full border-2 border-blackFaded bg-gray-400`}></div>
    ]

    return(
        <div className="w-auto absolute bg-white rounded-lg p-2 z-50 border border-gray-300" ref={refs.setFloating} style={floatingStyles} >
                {/* Goes through each item in the list and maps items to a key value*/}
                {items.map((item, index) => (
                    <DropdownItem 
                    key={index} 
                    item={item} 
                    onClick={componentsFunctions[index]} // Maps the item to the function at the same index
                    icon={icons? icons[index] : null} // Maps the icon to the item after checking if it exists, else sets it to null
                    /> 
                ))}
        </div>
    )
}

export default statusDropdown;