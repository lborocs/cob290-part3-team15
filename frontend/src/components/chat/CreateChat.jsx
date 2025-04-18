import { MdGroupAdd } from "react-icons/md";
import { useState } from "react";
import AddChatModal from "./AddChatModal.jsx";
function CreateChat({userID}) {
  const [addChatModal, setAddChatModal] = useState(false);
  
  return (
    <div className="flex h-full justify-center items-center">
      <button onClick = {() => setAddChatModal(true)}>
        <MdGroupAdd className="w-6 h-6 text-text/70"/>
      </button>
      <AddChatModal open={addChatModal} onClose={() => setAddChatModal(false)} userID={userID}/>
    </div>
  );
}

export default CreateChat;