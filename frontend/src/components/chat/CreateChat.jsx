import { MdGroupAdd } from "react-icons/md";

function CreateChat({userID}) {
  return (
    <div className="flex h-full justify-center items-center">
      <button>
        <MdGroupAdd className="w-6 h-6 text-text/70"/>
      </button>
    </div>
  );
}

export default CreateChat;