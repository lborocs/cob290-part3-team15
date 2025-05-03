import ProfileCard from "../accounts/ProfileCard";

// components/chat/core/Header.jsx
export default function Header({ name, selectedID, mode }) {
    // You can customize this logic however you want
   let group = ""


    return (
        <div className="w-full flex justify-center items-center py-2 bg-[#e3ebeb]">
            <div className="flex items-center gap-2 text-lg font-semibold">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <ProfileCard displayBG={"bg-accentOrange group-hover:bg-orangeHover"} type={mode === "group_messages"? "Group" : ""} id={selectedID} status={""}/>
                </div>
                <div>{name}</div>
                
            </div>
        </div>
    );
}