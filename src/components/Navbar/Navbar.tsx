"use client";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

import StockChess from "@/components/icons/StockChess";
import ChessBoard from "@/components/icons/ChessBoard";
import Puzzle from "@/components/icons/Puzzle";
import ChessBot from "@/components/icons/ChessBot";
import Human from "@/components/icons/Human";
import Duel from "@/components/icons/Duel";
import Video from "@/components/icons/Video";
import Learn from "@/components/icons/Learn";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import ModalPlayBot from "../Modal/ModalPlayBot";
import { SettingOutlined } from "@ant-design/icons";
import { UserContext } from "@/context/UserContext";
import ModalPlayHuman from "../Modal/ModalPlayHuman";

type MenuItem = Required<MenuProps>["items"][number];

const avatar = "https://www.chesskid.com/images/avatars/kids/100/kid-1162.png";

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem("Play", "sub1", <ChessBoard />, [
    getItem("Play vs Human", "/human", <Human />),
    getItem("Play vs Bot", "/computer", <ChessBot />),
  ]),

  // TODO: Change path to the corresponding component
  getItem("Puzzle", "sub2", <Puzzle />, [
    // Why `puzzleData`, thought this should be `puzzle`?
    getItem("Play Puzzle", "/puzzle", <Puzzle />),
    getItem("Puzzle Duel", "/puzzle-duel", <Duel />),
  ]),

  getItem("Learn", "sub3", <Learn />, [
    getItem("Videos", "/videos", <Video />),
  ]),
];

const Navbar: React.FC = () => {
  const [isModalPlayBotOpen, setIsModalPlayBotOpen] = React.useState(false);
  const [isModalPlayHumanOpen, setIsModalPlayHumanOpen] = React.useState(false);
  const router = useRouter();
  const { name, rate, accessToken } = useContext(UserContext);

  const showModal = () => {
    setIsModalPlayBotOpen(true);
  };

  const showHumanModal = () => {
    setIsModalPlayHumanOpen(true);
  };

  const onClickMenuDrawer: MenuProps["onClick"] = (e) => {
    let href = e.keyPath[0]; // WARNING: This's hacky...
    if (href === "/computer") {
      showModal();
    } else if (href === "/human") {
      if (!accessToken) router.push("/login");
      else showHumanModal();
    } else {
      router.push(href);
    }
  };

  const onClickAvatar = () => {
    const savedToken = localStorage.getItem("accessToken");
    if (!accessToken || !savedToken) router.push("/login");
    else router.push("/profile");
  };

  return (
    <>
      <div
        className="bg-[#477330] px-4 py-4 grow text-center"
        style={{ maxWidth: "272px", minWidth: "268px" }}
      >
        <Link href="/">
          <StockChess />
        </Link>
        <div className="object-cover p-6 w-full flex items-center justify-center">
          <div>
            <button onClick={onClickAvatar}>
              <img
                src={avatar}
                alt="image description"
                className="shadow rounded-full max-w-full h-auto border-4 border-[#518538]"
              />
            </button>
          </div>
          <Link href={"/settings"}>
            <SettingOutlined
              style={{ fontSize: "40px", color: "#f1f1f1" }}
              className="pl-5"
            />
          </Link>
        </div>
        <div className="pb-6">
          <div className="object-cover max-w-full flex items-center justify-center bg-[#518538] rounded-3xl shadow-md h-auto m-1">
            <div>
              <button onClick={onClickAvatar}>
                <div className="text-3xl text-slate-100 font-mono font-bold flex items-center pt-3">
                  {name ? name : "Guest"}
                </div>
                <div className="text-l text-slate-100 font-mono flex items-center pb-3 pt-0.5">
                  Rate: {rate ? rate : "xxx"}
                </div>
              </button>
            </div>
          </div>
        </div>
        <div>
          <Menu
            onClick={onClickMenuDrawer}
            mode="inline"
            items={items}
            className="bg-transparent text-white font-['Albula'] text-lg"
          />
        </div>
      </div>
      <ModalPlayBot
        isOpen={isModalPlayBotOpen}
        setOpen={setIsModalPlayBotOpen}
      />
      <ModalPlayHuman
        isOpen={isModalPlayHumanOpen}
        setOpen={setIsModalPlayHumanOpen}
      />
    </>
  );
};

export default Navbar;
