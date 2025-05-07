import ProfileCard from "../accounts/ProfileCard";
import { useState } from "react";
import MemberDropdown from "./MemberDropdown.jsx";
import { useFloating, offset, flip, shift,limitShift,useDismiss,autoUpdate } from "@floating-ui/react";
// components/chat/core/Header.jsx
export default function Header({ name, selectedID, mode, userID, refresh }) {
    // You can customize this logic however you want
    const [dropdownVisible, setDropdownVisible] = useState(false);
    
    // Floating UI for dropdown
    const { refs, floatingStyles, context } = useFloating({
        middleware: [
            offset(8),
            flip(),
            shift({
                limiter: limitShift({
                    crossAxis: true,
                    offset: ({ rects, availableWidth }) => {
                        // Only limit shifting to the left (Off screen)
                        return availableWidth < 0 ? 0 : -rects.floating.width;
                    }
                })
            })
        ],
        placement: "bottom-center",
        whileElementsMounted: autoUpdate,
        open: dropdownVisible,
        onOpenChange: setDropdownVisible
    });
    useDismiss(context, {outsidePressEvent: "mousedown",}); 
    return (
        <>
            <div className="bg-orangeFaded w-full h-[60px] flex justify-center items-center px-4 border-b-2 border-blackFaded">
                <div className="flex flex-col text-lg font-semibold">
                    {/*<div>User: {name}</div>*/}
                    <div className="flex items-center self-center gap-2">
                            <button
                                className={`bg-accentOrange hover:bg-orangeHover text-text font-bold px-4 rounded border-blackFaded border-1 ${dropdownVisible?"z-30":""}`}
                                onClick={() => setDropdownVisible(!dropdownVisible)}
                                ref={refs.setReference}
                            >
                                <ProfileCard displayBG={"bg-accentOrange group-hover:bg-orangeHover"} type={""} id={selectedID} status={"offline"}/>
                            </button>
                    </div>
                </div>
            </div>
            {dropdownVisible && (
                <MemberDropdown onClose={() => setDropdownVisible(false)} refs={refs} floatingStyles={floatingStyles} mode={mode} selectedID={selectedID} name={name} userID={userID} refresh={refresh}/>
            )
            }
        </>
    );
}