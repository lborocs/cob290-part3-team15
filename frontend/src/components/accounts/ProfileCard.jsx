import {useEffect,useState} from 'react';
import axios from 'axios'

import { FaUser } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";

const ProfileCard = ({ displayBG,type,id}) => {
  const [userIcon, setUserIcon] = useState(null);
  const [status, setStatus] = useState("offline");
  const statusColors = {
    online: 'bg-green-400',
    occupied: 'bg-red-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    twitter: 'bg-blue-400',
  };

  const colors = {
    blue : 'bg-blue-500/60',
    green : 'bg-green-500/60', 
    red : 'bg-red-500/60',
    pink : 'bg-pink-500/40', 
    purple : 'bg-purple-500/40',
    gray : 'bg-gray-500/70',
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
          <div className={`absolute w-4 h-4 rounded-full border-2 border-blackFaded ${statusColors[status] || statusColors["offline"]}`}></div>
        </div>
      }
    </div>
  );
};

export default ProfileCard;
