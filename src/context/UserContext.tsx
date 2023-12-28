'use client';
import React, {ComponentType, useState, useEffect} from "react";

type UserContextType = {
	name?: string,
	dateOfBirth?: string,
	gender?: string,
	email?: string,
	rate?: string,
	rating?: string[],
	accessToken: string,
	isLoading?: boolean,
	checkLogin: () => void,
}

const defaultValue = {
	dateOfBirth: "",
	email: "",
	gender: "",
	name: "",
	rate: "",
	rating: [],
	accessToken: "",
	isLoading: false,
}

const UserContext = React.createContext<UserContextType>({
	...defaultValue,
	checkLogin: () => {},
});

interface Props {
	children: React.ReactNode;
}

const UserProvider: React.FC<Props> = (props) => {
	const [currentUser, setCurrentUser] = useState('');
	const [dataUser, setDataUser] = useState<UserContextType>({
		...defaultValue,
		checkLogin: () => {},
	})
	const [isLoading, setIsLoading] = useState(false);

	const checkLogin = async () => {
		setIsLoading(true);
		const token = localStorage.getItem('accessToken');
		if (token) {
			setCurrentUser(token);
			const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + '/api/profile', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'accessToken': token,
				},
			})
			const data = await response.json();
			if (data?.code === 200) {
				setDataUser(data.data)
			}
		} else {
			setDataUser({
				...defaultValue,
				checkLogin: () => {},
			});
		}
		setIsLoading(false);
	}
	
	useEffect(() => {
		checkLogin().then();
	}, []);
	
	return (
		<UserContext.Provider value={{
			dateOfBirth: dataUser?.dateOfBirth,
			email: dataUser?.email,
			gender: dataUser?.gender,
			name: dataUser?.name,
			rate: dataUser?.rate,
			rating: dataUser?.rating,
			accessToken: currentUser,
			isLoading: isLoading,
			checkLogin: checkLogin,
		}}>
			{props.children}
		</UserContext.Provider>
	)
}

export {UserContext, UserProvider}
