import {UserNetworkLink} from "@/helpers/types";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "@/context/UserContext";
import {useRouter} from "next/navigation";
import {Button, ConfigProvider, DatePicker, Flex, Form, Input, Select, Spin} from "antd";
import "./styles.css";
import moment from "moment";
import dayjs from "dayjs";

const avatar = "https://www.chesskid.com/images/avatars/kids/100/kid-1162.png";

const AccountSettings = () => {
	const {name, dateOfBirth, gender, email, checkLogin, isLoading, accessToken} = useContext(UserContext);
	const router = useRouter();
	const [form] = Form.useForm()
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdate, setIsUpdate] = useState(false)
	const init = {
		dateOfBirth: dayjs(),
	};
	const handleSubmitAccount = () => {
		form
			.validateFields()
			.then((values) => {
				setIsUpdating(true);
				const raw = JSON.stringify({
					...values,
					dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD")
				});
				fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + "/api/profile", {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'accessToken': accessToken,
					},
					body: raw,
				}).then((response) => {
					if (response.ok) {
						checkLogin();
					}
				}).finally(() => {
					setIsUpdating(false);
				});
			})
	}
	
	const logout = () => {
		localStorage.removeItem('accessToken');
		checkLogin();
		router.push('/login')
	}
	
	const getInitValue = () => {
		setIsUpdating(true);
		form.setFieldsValue({
			name: name,
			dateOfBirth: moment(dateOfBirth ? dateOfBirth : ""),
			gender: gender,
			email: email,
		})
		setIsUpdating(false);
	}
	
	useEffect(() => {
		if (!localStorage.getItem('accessToken')) {
			router.push('/login');
		}
		console.log(dateOfBirth)
	}, []);
	
	useEffect(() => {
		getInitValue();
	}, [isLoading]);
	
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
							initialValues={{name: name, dateOfBirth: dayjs(), gender: gender, email: email}}
							style={{ maxWidth: 1000, width: 500 }}
							onFinish={handleSubmitAccount}
						>
							<Spin spinning={isLoading || isUpdating}>
								<Form.Item
									label={
										<p className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex items-center pl-5">
											Name
										</p>
									}
									name={"name"}
								>
									<Input
											className={`bg-[#385c26] text-slate-100 p-4 rounded-lg grid grid-cols-4 text-2xl border-4 border-transparent hover:border-[#6ab148] focus:border-[#6ab148] `}
										disabled={!isUpdate}
									/>
								</Form.Item>
								<Form.Item
									label={
										<p className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex items-center pl-5">
											Date of Birth
										</p>
									}
									name={"dateOfBirth"}
								>
									<DatePicker
										format="YYYY-MM-DD"
										className={`bg-[#385c26] p-4 rounded-lg grid grid-cols-4 text-2xl border-4 border-transparent hover:border-[#6ab148] focus:border-[#6ab148]`}
										disabled={!isUpdate}
									/>
								</Form.Item>
								<ConfigProvider
									theme={{
										components: {
											Select: {
												optionSelectedBg: '#6ab148',
												colorPrimary: '#6ab148',
												optionSelectedColor: '#000000',
											},
										},
									}}
								>
									<Form.Item
										label={
											<p className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex items-center pl-5">
												Gender
											</p>
										}
										name={"gender"}
										className={`pb-4`}
									>
										<Select
											popupClassName={`border-4 bg-[#385c26] rounded-lg border-transparent font-bold`}
											disabled={!isUpdate}
										>
											<Select.Option value="male">
												<div className={`text-2xl text-slate-100 font-mono font-bold flex`}>
													Male
												</div>
											</Select.Option>
											<Select.Option value="female">
												<div className={`text-2xl text-slate-100 font-mono font-bold flex`}>
													Female
												</div>
											</Select.Option>
											<Select.Option value="Other">
												<div className={`text-2xl text-slate-100 font-mono font-bold flex`}>
													Other
												</div>
											</Select.Option>
										</Select>
									</Form.Item>
								</ConfigProvider>
								<Form.Item
									label={
										<p className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex items-center pl-5 pt-2">
											Email
										</p>
									}
									name={"email"}
									rules={[
										{
											type: 'email',
											message: 'The input is not valid E-mail!',
										},
									]}
								>
									<Input
										className={`bg-[#385c26] text-slate-100 p-4 rounded-lg grid grid-cols-4 text-2xl border-4 border-transparent hover:border-[#6ab148] focus:border-[#6ab148] `}
										disabled={!isUpdate}
									/>
								</Form.Item>
							</Spin>
							<Flex gap="small" className={`grid grid-cols-2 mt-5`}>
								{isUpdate ?
									<Button
										className={`bg-[#e8822c] flex items-center p-7 hover:bg-[#f59543] border-0 w-fit`}
										onClick={() => {
											setIsUpdate(false);
											handleSubmitAccount();
										}}
									>
										<p className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex text-center">
											Save
										</p>
									</Button>
									:
									<Button
										onClick={() => {
											setIsUpdate(true);
										}}
										className={`bg-[#e8822c] flex items-center p-7 hover:bg-[#f59543] border-0  w-fit`}
									>
										<p className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex text-center">
											Change Profile
										</p>
									</Button>
								}
								<div className={`place-self-end`}>
									{!isUpdate ?
										<Button type="text" className={`bg-transparent flex items-center p-7`} onClick={logout}>
											<p className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex text-center">
												Logout
											</p>
										</Button>
										:
										<Button
											type="text"
											className={`bg-transparent flex items-center p-7`}
											onClick={() => {
												setIsUpdate(false);
												getInitValue();
											}}
										>
											<p className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex text-center">
												Cancel
											</p>
										</Button>
									}
								</div>
							</Flex>
						</Form>
					</div>
			</div>
		</div>
	)
}

export default AccountSettings;