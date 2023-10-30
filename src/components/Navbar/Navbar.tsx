"use client";
import Link from "next/link";
import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import { CaretRightIcon } from "@radix-ui/react-icons";
import StockChess from "@/components/icons/StockChess";
import ChessBoard from "@/components/icons/ChessBoard";
import Puzzle from "@/components/icons/Puzzle";
import ChessBot from "@/components/icons/ChessBot";
import Human from "@/components/icons/Human";
import Duel from "@/components/icons/Duel";
import Video from "@/components/icons/Video";
import Learn from "@/components/icons/Learn";

const ROUTES = [
  { href: "/random", text: "Random" },
  { href: "/computer", text: "Computer" },
  { href: "/minimax", text: "Minimax" },
];

const Navbar = () => {
  return (
    <div className="bg-[#477330] px-4 py-4 grow text-center" style={{maxWidth: '272px'}}>
      <div>
        <StockChess />
      </div>
      <div className="text-white font-['Albula'] text-xl">
        <NavigationMenu.Root orientation="vertical">
          <NavigationMenu.List className="flex flex-col gap-4">
            <NavigationMenu.Item >
              <NavigationMenu.Trigger asChild className="cursor-pointer hover:bg-[#538538]">
                <div className="flex flex-row items-center justify-between px-4">
                  <div className="flex flex-row gap-4">
                    <ChessBoard />
                    <span> Play </span>
                  </div>
                  <CaretRightIcon
                    width={24}
                    height={24}
                    color="white"
                    fontWeight={"bold"}
                  />
                </div>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div className="one m-0 grid list-none gap-x-[8px] p-[18px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr] gap-4">
                  <Link className="col-span-2 grid w-fit hover:bg-[#538538]" href='/login'>
                    <div className="flex flex-row gap-4 w-full px-4">
                      <Human />
                      <span> Play vs Human </span>
                    </div>
                  </Link>
                  <Link className="col-span-2 grid w-fit hover:bg-[#538538]" href='/'>
                    <div className="flex flex-row gap-4 w-full px-4">
                      <ChessBot />
                      <span> Play vs Bot </span>
                    </div>
                  </Link>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger asChild className="cursor-pointer hover:bg-[#538538]">
                <div className="flex flex-row items-center justify-between px-4">
                  <div className="flex flex-row gap-4">
                    <Puzzle />
                    <span> Puzzle </span>
                  </div>
                  <CaretRightIcon
                    width={24}
                    height={24}
                    color="white"
                    fontWeight={"bold"}
                  />
                </div>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div className="one m-0 grid list-none gap-x-[8px] p-[18px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr] gap-4">
                  <Link className="col-span-2 grid w-fit hover:bg-[#538538]" href='/'>
                    <div className="flex flex-row gap-4 w-full px-4">
                      <Puzzle />
                      <span> Play Puzzle </span>
                    </div>
                  </Link>
                  <Link className="col-span-2 grid w-fit hover:bg-[#538538]" href='/'>
                    <div className="flex flex-row gap-4 w-full px-4">
                      <Duel />
                      <span> Puzzle Duel </span>
                    </div>
                  </Link>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger asChild className="cursor-pointer hover:bg-[#538538]">
                <div className="flex flex-row items-center justify-between px-4">
                  <div className="flex flex-row gap-4">
                    <Learn />
                    <span> Learn </span>
                  </div>
                  <CaretRightIcon
                    width={24}
                    height={24}
                    color="white"
                    fontWeight={"bold"}
                  />
                </div>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div className="one m-0 grid list-none gap-x-[8px] p-[18px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr] gap-4">
                  <Link className="col-span-2 grid w-fit hover:bg-[#538538]" href='/'>
                    <button className="flex flex-row gap-4 w-full px-4">
                      <Video />
                      <span> Videos </span>
                    </button>
                  </Link>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </div>
  );
};

export default Navbar;
