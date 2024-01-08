import React from "react";
import Link from "next/link";
import {FacebookOutlined, InstagramOutlined, TwitterOutlined, YoutubeOutlined} from "@ant-design/icons";

const Footer = () => {
	return (
		<div
			className="bg-[#477330] py-3 px-24 flex-col items-center"
			style={{
				position: "fixed",
				bottom: "0",
				display: "flex",
				left: "39%",
				width: "39%",
				borderRadius: "8px",
			}}
		>
			<div className={'flex-row'}>
				<Link href={"/"} className="text-white"> Home </Link>
				<a className="text-white ml-1 mr-1"> | </a>
				<Link href={"https://github.com/nullchilly/web101"} className="text-white"> About </Link>
				<a className="text-white ml-1 mr-1"> | </a>
				<Link href={"https://www.facebook.com/sonfam03"} className="text-white"> FAQs </Link>
				<span className="text-white ml-10">Copyright 2024 @ UET-VNU</span>
			</div>
			{/* <div>
				<Link href={"https://www.facebook.com/sonfam03"} className="text-white">
					<FacebookOutlined className={'m-1 text-2xl'} />
				</Link>
				<Link href={"https://www.youtube.com/sonfam03"} className="text-white">
					<YoutubeOutlined className={'m-1 text-2xl'} />
				</Link>
				<Link href={"https://www.twitter.com/sonfam03"} className="text-white">
					<TwitterOutlined className={'m-1 text-2xl'} />
				</Link>
				<Link href={"https://www.instagram.com/sonfam03"} className="text-white">
					<InstagramOutlined className={'m-1 text-2xl'} />
				</Link>
			</div> */}
		</div>
	);
}

export default Footer;