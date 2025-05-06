import DropdownList from "../other/DropdownList";
function MemberDropdown({onClose, refs, floatingStyles}) {
    
    const items = ['Member 1', 'Member 2', 'Member 3'];
    const componentsFunctions = [null, null, null];
    const icons = [null, null, null]; // Add icons if needed

    return (
        <DropdownList items={items} onClick={componentsFunctions} icons={icons} refs={refs} floatingStyles={floatingStyles} blurBackground={true}/>
    );

}

export default MemberDropdown;