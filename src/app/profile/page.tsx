// @ts-check

import Link from "next/link";
import Image from 'next/image';
import {GameType, Rating, UserNetworkLink, UserNetworkType, UserProfile} from "@/helpers/types";
import {getImageSrc, getPieceSrc} from "@/helpers/images";

const ROUTES = [
    { href: '/profile', text: 'Profile' },
    { href: '/history', text: 'History' },
    { href: '/stats', text: 'Stats' },
];

const fakeProfile: UserProfile = {
    name: "tu nguyen",
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
            rate: 1300
        },
        {
            gameType: GameType.SLOW,
            rate: 1300
        },
        {
            gameType: GameType.PUZZLE,
            rate: 1300
        },
        {
            gameType: GameType.STARS,
            rate: 1300
        }

    ]
}

const ProfileNavbar = () => {
    return(
        <nav className="bg-gray-200 p-4 rounded-lg shadow-md">
            <div className="items-center justify-center mx-auto sp">
                <div className="hidden md:flex md:space-x-4 mx-auto">
                    {ROUTES.map((navElement) => {
                        return(
                            <div className="flex-grow text-center text-lg p-4 border
                            bg-gray-400 hover:bg-gray-600 transition-colors rounded-lg">
                                <Link href={navElement.href} className=""> {navElement.text}</Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}

const Profile = (avatar: string, name: string, links: UserNetworkLink[]) => {
    return (
        <div className="bg-gray-200 p-4 rounded-lg shadow-md max-w-screen-xl">
            <div className="grid grid-cols-2">
                <div className="grid grid-cols-2 items-center justify-center space-x-4">
                    <div className="rounded-full overflow-hidden">
                        <Image className="w-full h-full" src={getPieceSrc('b', 'q')} width={100} height={100} alt="Avatar"></Image>
                    </div>
                    <div className="text-4xl font-bold">
                        {name}
                    </div>
                </div>
                <div className="grid grid-cols-1 ">
                    {links.map((link) => {
                        return (
                            <div className="flex flex-col items-center justify-center">
                                <Link href={link.link} className="flex flex-col items-center text-blue-500 hover:underline">
                                    <Image src={getImageSrc(link.type)} alt={link.type} width={30} height={30}></Image>
                                    {link.text}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

const Rating = (userRatings: Rating[]) => {
    return (
        <div className="bg-gray-200 text-black p-14 rounded-lg grid grid-cols-4">
            {userRatings.map((rating) => {
                return (
                    <div className="grid-rows-3">
                        <div className="flex flex-col items-center justify-center">
                            <Image src={getPieceSrc('b','q')} alt="asd" width={100} height={100}></Image>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                                {rating.gameType}
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            {rating.rate}
                        </div>
                    </div>
                )
            })}
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

const RatingHistory = () => {
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
            <div className="rw-full sm:w-full md:w-full p-4">
                {Rating(fakeProfile.ratings)}
            </div>
        </div>
    )
};

export default ProfilePage