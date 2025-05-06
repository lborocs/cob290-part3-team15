import ProfileCard from "../accounts/ProfileCard";
import { useState } from "react";
import MemberDropdown from "./MemberDropdown.jsx";
// components/chat/core/Header.jsx
export default function Header({ name, selectedID, mode }) {
    // You can customize this logic however you want
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <>
            <div className="bg-accentWhite w-full h-[100px] flex items-center px-4">
                <div className="text-lg font-semibold">
                    <div>User: {name}</div>
                    <ProfileCard displayBG={"bg-accentOrange group-hover:bg-orangeHover"} type={""} id={selectedID} status={"offline"}/>
                    <div className="flex items-center gap-2 mt-2 w=full">
                        <button
                            className="bg-accentOrange hover:bg-orangeHover text-text font-bold py-2 px-4 rounded"
                            onClick={() => setDropdownVisible(!dropdownVisible)}
                        >
                        </button>
                    </div>
                </div>
            </div>
            {dropdownVisible && (
                <MemberDropdown onClose={() => setDropdownVisible(false)}/>
            )
            }
        </>
    );
}