'use client'

import {useContext, useEffect} from "react";
import {UserContext} from "@/context/UserContext";
import {useRouter} from "next/navigation";
import SettingsNavbar from "@/components/Settings/NavbarSettings";

const ProfilePage = () => {
	const {name } = useContext(UserContext);
	const router = useRouter();
	useEffect(() => {
		const token = localStorage.getItem('accessToken');
		if (!token) {
			router.push('/login');
		}
	},[])
	return (
		<div className="flex flex-col">
			<div className="rw-full sm:w-full md:w-full p-4">
				{SettingsNavbar({key: false})}
			</div>
			<div className="rw-full sm:w-full md:w-full p-4">
				<div className="bg-[#477330] rounded-lg p-4"></div>
			</div>
			<div className="rw-full sm:w-full md:w-full p-4">
				<div className="bg-[#477330] rounded-lg p-4"></div>
			</div>
		</div>
	)
};

export default ProfilePage