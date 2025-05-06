import ProfileCard from "../accounts/ProfileCard";

// components/chat/core/Header.jsx
export default function Header({ name, selectedID, mode }) {
    // You can customize this logic however you want
   

    return (
        <div className="bg-accentWhite w-full h-[100px] flex items-center px-4">
            <div className="text-lg font-semibold">
                <div>User: {name}</div>
                <ProfileCard displayBG={"bg-accentOrange group-hover:bg-orangeHover"} type={""} id={selectedID} status={"offline"}/>

            </div>
        </div>
    );
}