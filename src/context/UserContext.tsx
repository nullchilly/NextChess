'use client';
import React, {ComponentType, useState, useEffect} from "react";

import Login from '@/app/login/page';

type UserContextType = {
	name?: string,
	dob?: string,
	gender?: string,
	email?: string,
	rate?: string,
	rating?: string[],
	accessToken?: string,
}

const UserContext = React.createContext<UserContextType>({
	dob: '',
	email: "",
	gender: "",
	name: "",
	rate: "",
	rating: [],
	accessToken: "",
});

interface Props {
	children: React.ReactNode;
}

const UserProvider: React.FC<Props> = (props) => {
	const [currentUser, setCurrentUser] = useState('');
	const [dataUser, setDataUser] = useState<UserContextType>()
	useEffect(() => {
		const checkLogin = async () => {
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
			}
		}
		
		checkLogin().then();
	}, []);
	
	return (
		<UserContext.Provider value={{
			dob: dataUser?.dob,
			email: dataUser?.email,
			gender: dataUser?.gender,
			name: dataUser?.name,
			rate: dataUser?.rate,
			rating: dataUser?.rating,
			accessToken: currentUser,
		}}>
			{currentUser ? props.children : <Login/>}
		</UserContext.Provider>
	)
}

function withUserContext<T extends {}> (Component: ComponentType<T>) {
	return (props: T) => {
		return (
			<UserProvider>
				<Component {...props}/>
			</UserProvider>
		)
	}
}

export {withUserContext, UserContext, UserProvider}