// @ts-check
"use client";
import Link from "next/link";
import {
  GameType,
  Rating,
  UserNetworkLink,
  UserNetworkType,
  UserProfile,
} from "@/helpers/types";
import FastChessLogo from "@/components/icons/FastChessLogo";
import SlowChessLogo from "@/components/icons/SlowChessLogo";
import PuzzleLogo from "@/components/icons/PuzzleLogo";
import Star from "@/components/icons/Star";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";

import { List } from "antd";
import White from "@/components/icons/wK";

const ROUTES = [
  { href: "/profile", text: "Profile" },
  { href: "/history", text: "History" },
  { href: "/stats", text: "Stats" },
];

const fakeProfile: UserProfile = {
  name: "vipghn2003",
  avatar: "https://www.chesskid.com/images/avatars/kids/100/kid-1162.png",
  userNetworkLinks: [
    {
      link: "/profile",
      text: "facebook",
      type: UserNetworkType.FACEBOOK,
    },
    {
      link: "/profile",
      text: "profile",
      type: UserNetworkType.FACEBOOK,
    },
    {
      link: "/profile",
      text: "profile",
      type: UserNetworkType.FACEBOOK,
    },
  ],
  ratings: [
    {
      gameType: GameType.FAST,
      rate: 800,
      history: [
        { x: "", y: 500 },
        { x: "", y: 600 },
        { x: "", y: 700 },
        { x: "", y: 650 },
        { x: "", y: 550 },
        { x: "", y: 800 },
        { x: "", y: 900 },
      ],
    },
    {
      gameType: GameType.SLOW,
      rate: 800,
      history: [
        { x: "", y: 500 },
        { x: "", y: 450 },
        { x: "", y: 400 },
        { x: "", y: 600 },
      ],
    },
    {
      gameType: GameType.PUZZLE,
      rate: 1000,
      history: [
        { x: "", y: 500 },
        { x: "", y: 600 },
        { x: "", y: 700 },
      ],
    },
    {
      gameType: GameType.STARS,
      rate: 0,
      history: [
        { x: "", y: 550 },
        { x: "", y: 800 },
        { x: "", y: 900 },
      ],
    },
  ],
};

const ProfileNavbar = () => {
  return (
    <nav className="bg-[#477330] p-4 rounded-lg shadow-md">
      <div className="items-center justify-center mx-auto sp">
        <div className="flex md:flex md:space-x-4 mx-auto">
          <div
            key={0}
            className="flex-grow text-center text-slate-100 font-mono p-4 bg-[#58943c] hover:bg-[#4f8536] transition-colors rounded-lg"
          >
            <Link href="/profile" className="">
              {" "}
              Profile
            </Link>
          </div>

          <div
            key={0}
            className="flex-grow text-center text-slate-100 font-mono p-4 hover:bg-[#4f8536] transition-colors rounded-lg"
          >
            <Link href="/stat" className="">
              {" "}
              Stat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Profile = (avatar: string, name: string, links: UserNetworkLink[]) => {
  return (
    <div className="bg-[#477330] pt-4 pb-4 rounded-lg shadow-md w-full">
      <div className="grid grid-cols-2">
        <div className="grid grid-cols-3">
          <div className="object-cover h-full w-full flex items-center justify-center">
            <img
              src={avatar}
              alt="image description"
              className="shadow rounded-full max-w-full h-auto align-middle border-none"
            />
          </div>
          <div className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex items-center">
            {name}
          </div>
        </div>
      </div>
    </div>
  );
};

const Rating = (userRatings: Rating[]) => {
  return (
    <div className="bg-[#477330] rounded-lg p-4">
      <div className="flex-grow text-slate-100 text-xl font-bold font-mono p-4">
        Ratings
      </div>
      <div className="bg-[#58943c] text-black p-4 rounded-lg grid grid-cols-4">
        <div className="flex flex-col items-center justify-center pr-20 pl-20">
          <FastChessLogo />
        </div>
        <div className="flex flex-col items-center justify-center pr-20 pl-20">
          <SlowChessLogo />
        </div>
        <div className="flex flex-col items-center justify-center pr-20 pl-20">
          <PuzzleLogo />
        </div>
        <div className="flex flex-col items-center justify-center pr-20 pl-20">
          <Star />
        </div>
        <div className="flex flex-col items-center justify-center text-slate-100 font-mono text-xl/2">
          Fast Chess
        </div>
        <div className="flex flex-col items-center justify-center text-slate-100 font-mono text-xl/2">
          Slow Chess
        </div>
        <div className="flex flex-col items-center justify-center text-slate-100 font-mono text-xl/2">
          Puzzle
        </div>
        <div className="flex flex-col items-center justify-center text-slate-100 font-mono text-xl/2">
          Stars
        </div>
        <div className="flex flex-col items-center justify-center text-slate-100 font-mono font-bold text-xl">
          {userRatings[0].rate}
        </div>
        <div className="flex flex-col items-center justify-center text-slate-100 font-mono font-bold text-xl">
          {userRatings[1].rate}
        </div>
        <div className="flex flex-col items-center justify-center text-slate-100 font-mono font-bold text-xl">
          {userRatings[2].rate}
        </div>
        <div className="flex flex-col items-center justify-center text-slate-100 font-mono font-bold text-xl">
          {userRatings[3].rate}
        </div>
      </div>
    </div>
  );
};

const SlowGame = () => {
  return {};
};

const Achievements = () => {
  return {};
};

const Trophies = () => {
  return {};
};

const GameHistory = () => {
  return {};
};

const StatOption = () => {
  return {};
};

const RatingHistory = () => {
  return {};
};

const Analyst = () => {
  return {};
};

const ProfilePage = () => {
  const { name, accessToken } = useContext(UserContext);
  const [gamesPlayed, setGamesPlayed] = useState([]);
  useEffect(() => {
    async function fetchUserGame() {
      const savedToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` + "/api/game/history",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accessToken: savedToken ?? accessToken,
          },
        }
      );
      const data = await response.json();
      if (data?.code === 200) {
        const allGamesSlug = data.data.games.map((game: any) => ({
          slug: game.slug,
          result: game.result,
        }));
        console.log(allGamesSlug);
        setGamesPlayed(allGamesSlug);
      }
    }
    fetchUserGame();
  }, []);
  return (
    <div className="flex flex-col">
      <div className="rw-full sm:w-full md:w-full p-4">{ProfileNavbar()}</div>
      <div className="rw-full sm:w-full md:w-full p-4">
        {Profile(
          fakeProfile.avatar,
          name ? name : "Not Found",
          fakeProfile.userNetworkLinks
        )}
      </div>
      <div className="rw-full sm:w-full md:w-full p-4">
        {Rating(fakeProfile.ratings)}
      </div>
      {gamesPlayed.length > 0 ? (
        <div className="rw-full sm:w-full md:w-full p-4">
          <div className="bg-[#477330] rounded-lg p-4">
            <div className="flex-grow text-slate-100 text-xl font-bold font-mono p-4">
              Your match
            </div>
            <div className="bg-[#58943c] text-black p-4 rounded-lg grid grid-cols-4">
              <List
                itemLayout="horizontal"
                dataSource={gamesPlayed.map((game: any) => ({
                  title: "Game " + game.slug,
                  slug: game.slug,
                  description:
                    game.result === 2
                      ? "You lose"
                      : game.result === 1
                      ? "You win"
                      : "Draw match",
                }))}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<White />}
                      title={
                        <Link href={`/computer/${item.slug}`} target="_blank">
                          <span className="font-bold">{item.title}</span>
                        </Link>
                      }
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProfilePage;
