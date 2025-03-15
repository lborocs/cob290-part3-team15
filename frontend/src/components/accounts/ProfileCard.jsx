import {useEffect,useState} from 'react';
import axios from 'axios'

const ProfileCard = () => {
  // Status color mapping based on the passed `status` prop
  const statusColors = {
    online: 'bg-green-400',
    occupied: 'bg-red-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    twitter: 'bg-blue-400',
  };
  const [userIcon, setUserIcon] = useState(null);
  const [status, setStatus] = useState("offline")

  useEffect(() => {
    const fetchRandomUser = async () => {
      try {
        const response = await axios.get('https://randomuser.me/api/');
        const randomUser = response.data.results[0];
        
        setUserIcon(randomUser.picture.large);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchRandomUser();
  }, []);

  return (
    <button className="flex relative w-full h-full">
      {/* Profile Picture */}
      <img src={userIcon} alt="Profile" className="w-full h-full rounded-full mx-auto border-4 border-accentOrange"/>
      
      {/* Status Indicator (Bottom-right) */}
      <div className={`absolute flex justify-center items-center bottom-0 right-0 w-6 h-6 rounded-full bg-accentOrange`}>
        <div className={`absolute w-4 h-4 rounded-full border-2 border-blackFaded ${statusColors[status] || statusColors["offline"]}`}></div>
      </div>
    </button>
  );
};

export default ProfileCard;
