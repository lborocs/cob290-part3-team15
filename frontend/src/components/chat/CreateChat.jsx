import {MdGroupAdd} from "react-icons/md";
import {useState} from "react";
import AddChatModal from "./AddChatModal.jsx";

function CreateChat({userID,setSelectedID,setMode}) {
  const [addChatModal, setAddChatModal] = useState(false);
  
  return (
    <>
    <button onClick = {() => setAddChatModal(true)} className="flex h-full justify-center items-center">
      <MdGroupAdd className="w-6 h-6 text-text/70"/>
    </button>
    <AddChatModal open={addChatModal} onClose={() => setAddChatModal(false)} userID={userID} setSelectedID={setSelectedID} setMode={setMode}/>
    </>
  );
}

export default CreateChat;