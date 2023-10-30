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
        <div className="bg-green-700 text-white py-6 p-14 rounded-lg">
            {ROUTES.map((navElement) => {
                return(
                    <Link href={navElement.href} className="bg-green-500 px-36 py-2 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors"> {navElement.text}</Link>
                )
            })}
        </div>
    )
}

const Profile = (avatar: string, name: string, links: UserNetworkLink[]) => {
    return (
        <div className="bg-green-700 text-white p-14 rounded-lg grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2">
                <div>
                    <Image src={getPieceSrc('b', 'q')} width={100} height={100} alt="Avatar"></Image>
                </div>
                <div className="font-serif font-bold itali text-3xl">
                    {name}
                </div>
            </div>
            <div className="grid-cols-1">
                {links.map((link) => {
                    return (
                        <div className="text-center">
                            <Link href={link.link} className="">
                                <Image src={getImageSrc(link.type)} alt={link.type} width={50} height={50}></Image>
                                {link.text}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

const Rating = (userRatings: Rating[]) => {
    return (
        <div className="bg-green-700 text-white p-14 rounded-lg grid grid-cols-4">
            {userRatings.map((rating) => {
                return (
                    <div className="inline-block px-28">
                            {rating.gameType}:{rating.rate}
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
        <div className="">
            <div className="relative flex flex-col items-center justify-center">
                {ProfileNavbar()}
            </div>
            <div className="relative flex flex-col items-center justify-center">
                {Profile( fakeProfile.avatar, fakeProfile.name, fakeProfile.userNetworkLinks)}
            </div>
            <div className="relative flex flex-col items-center justify-center">
                {Rating(fakeProfile.ratings)}
            </div>
        </div>
    )
};

export default ProfilePage