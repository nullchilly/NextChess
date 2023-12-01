// @ts-check
"use client";
import { useState } from 'react';
import Link from "next/link";
import Image from 'next/image';
import {GameType, Rating, UserNetworkLink, UserNetworkType, UserProfile, DataPoint} from "@/helpers/types";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale'; 

const ROUTES = [
    { href: '/profile', text: 'Profile' },
    { href: '/history', text: 'History' },
    { href: '/stats', text: 'Stats' },
];

const fakeProfile: UserProfile = {
    name: "vipghn2003",
    avatar: "https://www.chesskid.com/images/avatars/kids/100/kid-1162.png",
    userNetworkLinks: [
        {
            link: "/profile",
            text: "facebook",
            type: UserNetworkType.FACEBOOK
        },
        {
            link: "/profile",
            text: "profile",
            type: UserNetworkType.FACEBOOK
        },
        {
            link: "/profile",
            text: "profile",
            type: UserNetworkType.FACEBOOK
        }
    ],
    ratings: [
        {
            gameType: GameType.FAST,
            rate: 800,
            history: [{
                x: '2021-11-06 23:39:30',
                y: 800
            }, {
                x: '2021-11-07 01:00:28',
                y: 810
            }, {
                x: '2021-11-07 09:00:28',
                y: 790
            }, {
                x: '2021-11-07 09:05:28',
                y: 780
            },
            {
                x: '2021-11-09 09:10:28',
                y: 850
            }]
        },
        {
            gameType: GameType.SLOW,
            rate: 800,
            history: [{
                x: '2021-10-04 23:39:30',
                y: 1200
            }, {
                x: '2021-11-07 01:00:28',
                y: 1100
            }, {
                x: '2021-12-07 09:00:28',
                y: 1000
            }, {
                x: '2022-01-07 09:05:28',
                y: 1050
            },
            {
                x: '2022-01-09 09:10:28',
                y: 1000
            }]
        },
        {
            gameType: GameType.PUZZLE,
            rate: 1000,
            history: [{
                x: '2021-11-05 23:39:30',
                y: 0
            }, {
                x: '2021-11-06 01:00:28',
                y: 110
            }, {
                x: '2021-11-07 09:00:28',
                y: 290
            }, {
                x: '2021-11-08 09:05:28',
                y: 380
            },
            {
                x: '2021-11-09 09:10:28',
                y: 450
            }]
        },
        {
            gameType: GameType.STARS,
            rate: 0,
            history: [{
                x: '2021-11-06 23:39:30',
                y: 800
            }, {
                x: '2021-11-07 01:00:28',
                y: 810
            }, {
                x: '2021-11-07 09:00:28',
                y: 790
            }, {
                x: '2021-11-07 09:05:28',
                y: 780
            },
            {
                x: '2021-11-09 09:10:28',
                y: 850
            }]
        }

    ]
}

const ProfileNavbar = () => {
    return(
        <nav className="bg-[#477330] p-4 rounded-lg shadow-md">
            <div className="items-center justify-center mx-auto sp">
                <div className="flex md:flex md:space-x-4 mx-auto">

                            <div key={0} className="flex-grow text-center text-slate-100 font-mono p-4 hover:bg-[#4f8536] transition-colors rounded-lg">
                                <Link href="/profile" className=""> Profile</Link>
                            </div>

                            <div key={0} className="flex-grow text-center text-slate-100 font-mono p-4 bg-[#58943c] hover:bg-[#4f8536] transition-colors rounded-lg">
                                <Link href="/stat" className=""> Stat</Link>
                            </div>
                </div>
            </div>
        </nav>
    )
}

const Profile = (avatar: string, name: string, links: UserNetworkLink[]) => {
    return (
        <div className="bg-[#477330] pt-4 pb-4 rounded-lg shadow-md w-full">
            <div className="grid grid-cols-2">
                <div className="grid grid-cols-3">
                    <div className="object-cover h-full w-full flex items-center justify-center">
                        <img src={avatar} alt="image description" className="shadow rounded-full max-w-full h-auto align-middle border-none"/>
                    </div>
                    <div className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex items-center">
                        {name}
                    </div>
                </div>
            </div>
        </div>
    )
}


const RatingChart = (history: DataPoint[]) => {
    return (
        <div className="relative w-3/5 h-3/5">
            <Line 
                data={{
                datasets: [
                    { 
                    data: history,
                    label: "Ratings",
                    borderColor: '#2ECC71',  // Green border color
                    backgroundColor: '#82E0AA',  // Light green background color
                    fill: false
                    }
                ]
                }}
                options= {{
                    plugins:{
                        legend: {
                            display: false,
                        }
                    },
                    scales: {
                        x: {
                            grid:{
                                color: '#FFFFFF',
                                display: false
                            },
                            ticks:{
                                color: '#FFFFFF',
                                font: {
                                    family: 'Helvetica Neue',
                                    weight: 'bold',
                                }
                            },
                            type: 'time',
                            time: {
                                unit: 'month'
                            },
                            adapters: { 
                                date: {
                                  locale: enUS, 
                                },
                            }, 
                        },
                        y: {
                            grid:{
                                color: '#FFFFFF',
                                display: true
                            },
                            ticks:{
                                color: '#FFFFFF',
                                font: {
                                    family: 'Helvetica Neue',
                                    weight: 'bold',
                                },
                            },
                        }
                    }
                }}
            />

        </div>
    )
}


const RatingHistory = (userRatings: Rating[]) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    const [selectedOption, setSelectedOption] = useState(0);

    const handleOptionClick = (option: number) => {
        setSelectedOption(option);
        setIsOpen(false);
      };

    const ChessType = ['Fast Chess', 'Slow Chess', 'Puzzle'];

    return (
        <div className="rw-full max-h-screen max-w-screen  p-4">
            <div className="relative inline-block">
                <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                onClick={toggleDropdown}
                >
                <span>{ChessType[selectedOption]}</span>
                <svg
                    className="fill-current h-4 w-4 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 12.18l-6.36-6.36a1.5 1.5 0 1 1 2.12-2.12L10 7.94l4.24-4.24a1.5 1.5 0 1 1 2.12 2.12L12.12 10l4.24 4.24a1.5 1.5 0 0 1-2.12 2.12L10 12.18z" />
                </svg>
                </button>
                {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-40">
                    <ul>
                    <li className="py-2 px-4 hover:bg-gray-100 font-bold" onClick={() => handleOptionClick(0)}>Fast Chess</li>
                    <li className="py-2 px-4 hover:bg-gray-100 font-bold" onClick={() => handleOptionClick(1)}>Slow Chess</li>
                    <li className="py-2 px-4 hover:bg-gray-100 font-bold" onClick={() => handleOptionClick(2)}>Puzzle</li>
                    </ul>
                </div>
                )}
            </div>
            <div className="p-4">
                {RatingChart(fakeProfile.ratings[selectedOption].history)}
            </div>
        </div>
    )
}


const SlowGame = () => {
    return({

    })
}

const Achievements = () => {
    return({

    })
}

const Trophies = () => {
    return ({

    })
}

const GameHistory = () => {
    return({

    })
}

const StatOption = () => {
    return({

    })
}

const Analyst = () => {
    return({

    })
}

const ProfilePage = () => {
    return (
        <div className="flex flex-col">
            <div className="rw-full sm:w-full md:w-full p-4">
                {ProfileNavbar()}
            </div>
            <div className="rw-full sm:w-full md:w-full p-4">
                {Profile( fakeProfile.avatar, fakeProfile.name, fakeProfile.userNetworkLinks)}
            </div>
            {RatingHistory(fakeProfile.ratings)}
        </div>
    )
};



export default ProfilePage