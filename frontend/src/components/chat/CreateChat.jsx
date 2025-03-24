import { MdOutlineGroupAdd } from "react-icons/md";

function CreateChat({userID}) {
  return (
    <div className="absolute right-2 top-0 h-full">
      <button>
        <MdOutlineGroupAdd className="w-8 h-8"/>
      </button>
    </div>
  );
}

export default CreateChat;