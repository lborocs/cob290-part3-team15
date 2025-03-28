import { useState,useEffect,React } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';

import { MdOutlineChat } from "react-icons/md";
import { MdOutlineGroups } from "react-icons/md";
import { LuChartNoAxesCombined } from "react-icons/lu";

import ProfileCard from '../accounts/ProfileCard.jsx'


const Tab = (props) => {
    const handleNavigate = () => {
        if(props.isActive && props.selectable){
            props.setIsSelected(!props.isSelected)
        }
        else if (!props.isActive){
            props.navigate(props.link)
        }
    }

    return (
        <button className={`w-14 h-14 justify-center items-center text-center text-[10px] rounded-lg relative
            ${!props.isActive ? "bg-white/10 hover:bg-white/75" : !props.selectable ? "bg-white" : !props.isSelected ? "bg-white/75" : "bg-white"}`}
        onClick={(e) => handleNavigate(props.label)}>
            {props.icon}
            <p className="absolute w-full bottom-[6px]">{props.label}</p>
        </button>
    )
}

const Navbar = (props) => {
    {/* This needs to be planned */}
    const navigate=useNavigate();
    const Tabs=[
        {Label:"Chat",Icon:<MdOutlineChat className="flex flex-1 w-full h-7 mb-2"/>,link:"/chat",index:1},
        //{Label:"Teams",Icon:<MdOutlineGroups className="flex flex-1 w-full h-8 mb-2"/>,link:"/teams",index:2}, 
        {Label:"Analytics",Icon:<LuChartNoAxesCombined className="flex flex-1 w-full h-7 mb-3"/>,link:"/analytics",index:3}
    ]

    return (
        <div className="flex relative flex-col h-full items-center bg-accentOrange w-[72px] z-10 border-r-1 border-blackFaded overflow-scroll justify-between">
            <div className="flex flex-col w-full h-full min-h-80 relative items-center">
                <button className="flex w-15 h-15 mt-2 rounded-lg bg-[#D3D3D3] items-center justify-center shadow-[1px_2px_5px_rgba(0,0,0,0.3)]"
                onClick={(e) => navigate("/landing/")}>
                    <img src={Logo} className="w-12 h-12" alt="Logo" />
                </button>
                <p className="h-4 text-xs w-full font-black">Make It All</p>
                <div className="mt-[10vh]">
                    {Tabs.map((tab) => (
                        <div className="py-2" key={tab.index}>
                            <Tab 
                            navigate={navigate} 
                            label={tab.Label}
                            icon={tab.Icon} 
                            link={tab.link} 
                            selectable={props.selectable} 
                            isSelected={props.isSelected} 
                            setIsSelected={props.setIsSelected} 
                            isActive={props.activeTab===tab.Label}/>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-15 h-15 justify-end">
                <ProfileCard/>
            </div>
        </div>
    )
}

export default Navbar;