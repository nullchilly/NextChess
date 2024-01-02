import { Button, Modal } from "antd";
import React, { useState } from "react";
import Checkmate from "../icons/Checkmate";
import { useRouter } from "next/navigation";
import Crown from "../icons/Crown";
import { WINNER } from "@/helpers/types";
import Handshake from "../icons/Handshake";
import {pawnLost, pawnWon} from "@/helpers/const";

type Props = {
	isWon: boolean;
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
};

export default function ModalDuel({ isWon, isOpen, setOpen }: Props) {
	const [loading, setLoading] = useState(false);
	// const [open, setOpen] = useState(false);
	
	const handleCancel = () => {
		setOpen(false);
	};
	
	return (
		<>
			<Modal
				open={isOpen}
				title={
					<div className={`text-center text-[#f4892e] font-mono text-2xl font-bold`}>
						{isWon ? "You Won" : "You Lost"}
					</div>
				}
				onCancel={handleCancel}
				footer={[
					<button
						className="border-transparent w-fit p-1 pl-3 pr-3 items-center"
						onClick={() => {}}
						style={{
							background: "#f4892e",
							borderRadius: "5px",
						}}
					>
						<div className={`text-center text-slate-100 font-mono text-xl font-bold`}>
							Close
						</div>
					</button>,
				]}
			>
				<div className="flex flex-col justify-center items-center">
					<img
						src={isWon ? pawnWon : pawnLost}
						alt={"won"}
					/>
				</div>
			</Modal>
		</>
	);
}