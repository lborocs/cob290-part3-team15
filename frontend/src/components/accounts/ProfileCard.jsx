import {useEffect,useState} from 'react';

import { FaUser } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";

const ProfileCard = ({ displayBG,type,id,status}) => {
  const [userIcon, setUserIcon] = useState(null);
  const statusColors = {
    Online: 'bg-green-400',
    DND: 'bg-red-400',
    Offline: 'bg-gray-400',
    Invisible: 'bg-gray-400',
    Away: 'bg-yellow-500',
    Twitter: 'bg-blue-400',
  };

  const colors = {
    blue:   "bg-[#4d74b6]", //rgb(0, 57, 150) @ 70%
    green:  "bg-[#64d68e]", // #22c55e @ 70%
    red:    "bg-[#f47c7c]", // #ef4444 @ 70%
    blue2:  "bg-[#74ccfb]", // rgb(0, 170, 255)
    pink:   "bg-[#f27fb8]", // #ec4899 @ 70%
    purple: "bg-[#ae8df9]", // #8b5cf6 @ 70%
    blue3:  "bg-[#6d8cf5]", // rgb(51, 102, 255)
    color3:  "bg-[#ef6f92]", // rgb(255, 0, 76)
    gray:   "bg-[#979ca6]", // #6b7280 @ 70%
    green2: "bg-[#59b64d]", //rgb(111, 224, 101) @ 70%
    indigo: "bg-[#9294f5]", // #6366f1 @ 70%
    teal:   "bg-[#5bcdc1]", // #14b8a6 @ 70%
    pink2: "bg-[#e880aa]", // rgb(255, 162, 199)
    pink3: "bg-[#dc5e91]", // rgb(221, 34, 119)
  }

  const colorKeys = Object.keys(colors);
  const colorBasedOnId = id % colorKeys.length;
  const color = colors[colorKeys[colorBasedOnId]];

  return (
    <div className="flex relative w-full h-full group">
      {/* Profile Picture */}
      <div className={`flex justify-center w-full h-full rounded-full mx-auto border-4 border-transparent ${color}`}>
        {type === "Group" ? <HiUserGroup className="w-9 h-full text-white" /> : <FaUser className="w-8 h-full text-white" />}
        {/*<img src={userIcon} alt={type} className={`w-full h-full`} />*/}
      </div>

      
      {/* Status Indicator (Bottom-right) */}
      {type === "Group" ? <></> :
        <div className={`absolute flex justify-center items-center bottom-0 right-0 w-6 h-6 rounded-full ${displayBG}`}>
          <div className={`absolute w-4 h-4 rounded-full border-2 border-blackFaded ${statusColors[status] || statusColors["Offline"]}`}></div>
        </div>
      }
    </div>
  );
};

export default ProfileCard;
