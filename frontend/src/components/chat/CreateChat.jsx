import { MdOutlineGroupAdd } from "react-icons/md";

function CreateChat({userID}) {
  return (
    <div className="flex right-2 top-0 h-full items-center ml-auto mr-2">
      <button>
        <MdOutlineGroupAdd className="w-8 h-8"/>
      </button>
    </div>
  );
}

export default CreateChat;