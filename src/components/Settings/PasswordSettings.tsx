import {Alert, Button, Form, Input, Spin} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "@/context/UserContext";
import {useRouter} from "next/navigation";
import "./styles.css"

const avatar = "https://www.chesskid.com/images/avatars/kids/100/kid-1162.png";

const PasswordSettings = () => {
	const [form] = Form.useForm()
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState(false);
	const {accessToken} = useContext(UserContext);
	const router = useRouter();
	const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

	const handleChangePassword = () => {
		form
			.validateFields()
			.then((values) => {
				setIsUpdating(true);
				fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + "/api/password", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
						'accessToken': accessToken,
					},
					body: JSON.stringify(values)
				}).then((response) => {
					if (!response.ok) {
						setError(true)
					} else {
						router.push('/profile');
					}
				}).finally(() => {
					setIsUpdating(false);
				})
			})
	}
	
	const onCloseError = () => {
		setError(false);
	}
	
	useEffect(() => {
		if (!localStorage.getItem('accessToken')) {
			router.push('/login');
		}
	}, []);
	
	return (
		<div className="bg-[#477330] pt-4 pb-4 rounded-lg shadow-md w-full row-auto">
			<div className="grid">
				<div className="object-cover h-full w-full flex items-center justify-end">
					<img src={avatar} alt="image description" className="shadow rounded-full max-w-full h-auto align-middle border-none"/>
				</div>
				<div className="col-start-2 col-end-4 text-6xl text-slate-100 font-mono font-bold flex items-center pl-7">
					Account
				</div>
			</div>
			<div className="grid grid-cols-4 pt-10">
				<div className="col-start-2 col-end-4 text-6xl text-slate-100 font-mono font-bold flex items-center pl-7">
					<Form
						layout={'vertical'}
						form={form}
						style={{ maxWidth: 1000, width: 500 }}
					>
						<Spin spinning={isUpdating}>
							<Form.Item
								label={
									<p className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex items-center pl-5">
										Old Password
									</p>
								}
								name={"oldPassword"}
								rules={[
									() => ({
										validator(_, value) {
											if (regex.test(value)) {
												return Promise.resolve();
											}
											if (!value) {
												return Promise.reject(new Error('Please input your old password!'));
											}
											return Promise.reject(new Error('Minimum eight characters, at least one letter and one number'));
										},
									}),
								]}
							>
								<Input
									className={`bg-[#385c26] text-slate-100 p-4 rounded-lg grid grid-cols-4 text-2xl border-4 border-transparent hover:border-[#6ab148] focus:border-[#6ab148] `}
									type={'password'}
								/>
							</Form.Item>
							<Form.Item
								label={
									<p className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex items-center pl-5">
										New Password
									</p>
								}
								name={"newPassword"}
								rules={[
									({getFieldValue}) => ({
										validator(_, value) {
											if (getFieldValue('oldPassword') === value) {
												return Promise.reject(new Error('New password cannot be the same as your old password!'));
											}
											if (!value) {
												return Promise.reject(new Error('Please input your old password!'));
											}
											if (regex.test(value)) {
												return Promise.resolve();
											}
											return Promise.reject(new Error('Minimum eight characters, at least one letter and one number'));
										},
									}),
								]}
							>
								<Input
									className={`bg-[#385c26] text-slate-100 p-4 rounded-lg grid grid-cols-4 text-2xl border-4 border-transparent hover:border-[#6ab148] focus:border-[#6ab148] `}
									type={'password'}
								/>
							</Form.Item>
							<Form.Item
								label={
									<p className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex items-center pl-5">
										Confirm Password
									</p>
								}
								name={"confirm"}
								rules={[
									({ getFieldValue }) => ({
										validator(_, value) {
											if (getFieldValue('newPassword') === value) {
												return Promise.resolve();
											}
											if (!value) {
												return Promise.reject(new Error('Please input your old password!'));
											}
											return Promise.reject(new Error('The new password that you entered do not match!'));
										},
									}),
								]}
							>
								<Input
									className={`bg-[#385c26] text-slate-100 p-4 rounded-lg grid grid-cols-4 text-2xl border-4 border-transparent hover:border-[#6ab148] focus:border-[#6ab148] `}
									type={'password'}
								/>
							</Form.Item>
						</Spin>
						<Button
							className={`bg-[#e8822c] flex items-center p-7 hover:bg-[#f59543] border-0 w-fit`}
							onClick={handleChangePassword}
						>
							<p className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex text-center">
								Change Password
							</p>
						</Button>
						{
							error &&
							<div className={`pt-4`}>
								<Alert
									message="Oops?! We noticed the following errors in your form:"
									type="error"
                  description={
										<code>
											- Your password is too short. Please enter in at least 6 characters.
											<br />
											- Password is too easy!
											<br />
											- Passwords do not match. Please try again.
										</code>
									}
									onClose={onCloseError}
									closable
									className={`bg-[#515865]`}
								/>
							</div>
						}
					</Form>
				</div>
			</div>
		</div>
		
	)
	
}

export default PasswordSettings;