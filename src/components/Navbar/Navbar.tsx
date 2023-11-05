"use client";
import { useRouter } from "next/navigation";
import React from "react";

import StockChess from "@/components/icons/StockChess";
import ChessBoard from "@/components/icons/ChessBoard";
import Puzzle from "@/components/icons/Puzzle";
import ChessBot from "@/components/icons/ChessBot";
import Human from "@/components/icons/Human";
import Duel from "@/components/icons/Duel";
import Video from "@/components/icons/Video";
import Learn from "@/components/icons/Learn";
import { ConfigProvider, Menu } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { httpGet } from "@/modules/next-backend-client/httpGet";

type MenuItem = Required<MenuProps>["items"][number];

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
    getItem("Play vs Human", "/login", <Human />),
    getItem("Play vs Bot", "/computer", <ChessBot />),
  ]),

  // TODO: Change path to the corresponding component
  getItem("Puzzle", "sub2", <Puzzle />, [
    getItem("Play Puzzle", "/puzzle", <Puzzle />),
    getItem("Puzzle Duel", "/puzzle-duel", <Duel />),
  ]),

  getItem("Learn", "sub3", <Learn />, [
    getItem("Videos", "/videos", <Video />),
  ]),
];

const Navbar = async () => {
  // NOTE: This's for experiment purpose only, DELTE ME later.
  React.useEffect(() => {
    async function f() {
      const x = await httpGet("healthchecker");
      console.log(x);
    };
    f();
  }, [])
  const router = useRouter();
  const onClick: MenuProps["onClick"] = (e) => {
    let href = e.keyPath[0]; // WARNING: This's hacky...
    router.push(href);
  };
  return (
    <div
      className="bg-[#477330] px-4 py-4 grow text-center"
      style={{ maxWidth: "272px", minWidth: "268px" }}
    >
      <Link href="/">
        <StockChess />
      </Link>
      <div>
        <Menu
          onClick={onClick}
          mode="inline"
          items={items}
          className="bg-transparent text-white font-['Albula'] text-lg"
        />
      </div>
    </div>
  );
};

export default Navbar;
