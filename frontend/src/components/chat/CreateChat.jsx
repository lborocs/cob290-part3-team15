import { MdOutlineGroupAdd } from "react-icons/md";

function CreateChat({userID}) {
  return (
    <div className="flex justify-end px-2 ">
      <button>
        <MdOutlineGroupAdd className="w-8 h-8"/>
      </button>
    </div>
  );
}

export default CreateChat;