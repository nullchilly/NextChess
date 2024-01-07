import { Modal } from "antd";
import React, { useState } from "react";
import {pawnLost, pawnWon} from "@/helpers/const";
import Image from 'next/image';

type Props = {
	isWon: boolean;
	isOpen: boolean;
	onCLose: (isOpen: boolean) => void;
};

export default function ModalDuel({ isWon, isOpen, onCLose }: Props) {
	const handleCancel = () => {
		onCLose(false);
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
						key="closeButton"
						className="border-transparent w-fit p-1 pl-3 pr-3 items-center"
						onClick={handleCancel}
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
					<Image
						src={isWon ? pawnWon : pawnLost}
						alt={"won"}
						width={82}
						height={140}
					/>
				</div>
			</Modal>
		</>
	);
}
