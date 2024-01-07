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
import SubMenu from "antd/lib/menu/SubMenu";
import Admin from "@/components/icons/Admin";

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

const Navbar: React.FC = () => {
  const [isModalPlayBotOpen, setIsModalPlayBotOpen] = React.useState(false);
  const [isModalPlayHumanOpen, setIsModalPlayHumanOpen] = React.useState(false);
  const router = useRouter();
  const { name, rate, accessToken, isAdmin } = useContext(UserContext);
  
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
            // items={items}
            className="bg-transparent text-white font-['Albula'] text-lg"
          >
            <SubMenu title={"Play"} icon={<ChessBoard />}>
              <Menu.Item key="/human" icon={<Human />}>
                <Link href="/"> Play vs Human </Link>
              </Menu.Item>
              <Menu.Item key="/computer" icon={<ChessBot />}>
                <Link href="/"> Play vs Bot </Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu title={"Puzzle"} icon={<Puzzle />}>
              <Menu.Item key="/puzzle" icon={<Puzzle />}>
                <Link href="/puzzle"> Play Puzzle </Link>
              </Menu.Item>
              <Menu.Item key="/puzzle-duel" icon={<Duel />}>
                <Link href="/puzzle-duel"> Puzzle Duel </Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu title={"Learn"} icon={<Learn />}>
              <Menu.Item key="/videos" icon={<Video />}>
                <Link href="/videos"> Videos </Link>
              </Menu.Item>
            </SubMenu>
            {
              isAdmin &&
              <Menu.Item key="/admin" icon={<Admin/>}>
                <Link href="/admin"> Admin </Link>
              </Menu.Item>
            }
          </Menu>
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
