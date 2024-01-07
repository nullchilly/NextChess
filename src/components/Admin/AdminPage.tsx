import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "@/context/UserContext";
import {Button, Col, Empty, Modal, Row, Space, Table, Tag} from "antd";
import type { ColumnsType } from 'antd/es/table';
import {TagNull} from "@/helpers/tag";

type UserProps = {
	userId: number,
	name: string,
	dateOfBirth: string,
	gender: string,
	email: string,
	isAdmin: boolean,
	userName: string,
}

type GameProps = {
	gameId: number,
	variantId: number,
	timeMode: number,
	usersId: number[],
	createdAt: string,
	moves: string[],
	slug: string,
	result: number
}

const initPagination = {
	current: 1,
	pageSize: 10,
	showSizeChanger: true,
	pageSizeOptions: ['5', '10', '20', '50'],
	total: 0,
};

const AdminPage = () => {
	const {isAdmin, accessToken} = useContext(UserContext);
	const [isLoading, setIsLoading] = useState(false);
	const [users, setUsers] = useState<UserProps[]>([]);
	const [games, setGames] = useState<GameProps[]>([]);
	const [showModalUser, setShowModalUser] = useState(false);
	const [currentUser, setCurrentUser] = useState<UserProps>();
	const [showModalGame, setShowModalGame] = useState(false);
	const [currentGame, setCurrentGame] = useState<GameProps>();
	const [showModalDeleteUser, setShowModalDeleteUser] = useState(false);
	const [showModalDeleteGame, setShowModalDeleteGame] = useState(false);
	const [deleteSuccess, setDeleteSuccess] = useState(false);
	const [pagination, setPagination] = useState(initPagination);
	
	const columnsUserTable: ColumnsType<UserProps> = [
		{
			title: 'UserId',
			dataIndex: 'userId',
			key: 'userId',
		},
		{
			title: 'UserName',
			dataIndex: 'userName',
			key: 'userName',
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Rolse',
			key: 'isAdmin',
			dataIndex: 'isAdmin',
			render: (_, { isAdmin }) => (
					<Tag color={isAdmin ? 'geekblue' : 'green'} key={"isAdmin"}>
						{isAdmin ? "Admin" : "User"}
					</Tag>
			),
		},
		{
			title: 'Date Of Birth',
			dataIndex: 'dateOfBirth',
			key: 'dateOfBirth',
		},
		{
			title: 'Gender',
			dataIndex: 'gender',
			key: 'gender',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<Space size="middle">
					<p onClick={() => {onClickDetailUser(record)}}>Info</p>
					<p onClick={() => {onClickDeleteUser(record)}}>Delete</p>
				</Space>
			),
		},
	];
	
	const columnsGameTable: ColumnsType<GameProps> = [
		{
			title: 'GameId',
			dataIndex: 'gameId',
			key: 'gameId',
		},
		{
			title: 'VariantId',
			dataIndex: 'variantId',
			key: 'variantId',
		},
		{
			title: 'User Ids',
			dataIndex: 'usersId',
			key: 'usersId',
			render: (_, {usersId}) => (
				<>
					{usersId?.map((userId, index) => (
						<Tag key={index} bordered={false} color={index % 2 ? 'red' : 'blue'}> {userId} </Tag>
					))}
				</>
			)
		},
		{
			title: 'Create At',
			dataIndex: 'createdAt',
			key: 'createdAt',
		},
		{
			title: 'Time Mode',
			key: 'timeMode',
			dataIndex: 'timeMode',
			render: (_, { timeMode }) => (
				<Tag color={timeMode ? 'geekblue' : 'gray'} key={"isAdmin"}>
					{timeMode ? timeMode : "NULL"}
				</Tag>
			),
		},
		{
			title: 'Moves',
			dataIndex: 'moves',
			key: 'moves',
			render: (_, {moves}) => (
				<>
					{moves?.map((move, index) => (
						index < 3 && <Tag key={index} bordered={false}> {move} </Tag>
					))}
					{
						moves.length > 3 && "..."
					}
				</>
			)
		},
		{
			title: 'Slug',
			dataIndex: 'slug',
			key: 'slug',
		},
		{
			title: 'Result',
			dataIndex: 'result',
			key: 'result',
			render: (_, record) => (
				<>
					{
						record.variantId === 3 ?
							<Tag color={'geekblue'}> {record.result === 1 ? 'Player 2 Win' : 'Player 1 Win'} </Tag> :
							<Tag color={'geekblue'}> {record.result === 1 ? 'Player 1 Win' : record.result === 2 ? 'Player 2 Win' : "Draw"} </Tag>
					}
				</>
			)
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<Space size="middle">
					<p onClick={() => {onClickDetailGame(record)}}>Info</p>
					<p onClick={() => {onClickDeleteGame(record)}}>Delete</p>
				</Space>
			),
		},
	];
	
	const handleTableUserChange = (newPagination: any) => {
		setPagination({
			...pagination,
			current: newPagination.current,
			pageSize: newPagination.pageSize,
		});
	};
	
	const handleTableGameChange = (newPagination: any) => {
		setPagination({
			...pagination,
			current: newPagination.current,
			pageSize: newPagination.pageSize,
		});
	};
	
	const onClickDeleteUser = (user: UserProps) => {
		setShowModalDeleteUser(true);
		setCurrentUser(user);
	}
	
	const onClickDeleteGame = (game: GameProps) => {
		setShowModalDeleteGame(true);
		setCurrentGame(game);
	}
	
	const onDeleteUser = async () => {
		setIsLoading(true);
		setShowModalDeleteUser(false);
		try {
			const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/profile`;
			const savedToken = localStorage.getItem("accessToken");
			const raw = JSON.stringify({
				"userId": currentUser?.userId
			});
			const response = await fetch(url, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
					'accessToken': savedToken ?? accessToken,
				},
				body: raw,
			});
			if (response.ok) {
				setDeleteSuccess(true);
				fetchDataUser();
			}
		} catch (err) {
			console.log(err);
		} finally {
			setIsLoading(false);
		}
	}
	
	const onDeleteGame = async () => {
		setIsLoading(true);
		setShowModalDeleteGame(false);
		try {
			const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/game`;
			const savedToken = localStorage.getItem("accessToken");
			const raw = JSON.stringify({
				"gameId": currentGame?.gameId
			});
			console.log(raw)
			const response = await fetch(url, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
					'accessToken': savedToken ?? accessToken,
				},
				body: raw,
			});
			if (response.ok) {
				setDeleteSuccess(true);
				fetchDataGame();
			}
		} catch (err) {
			console.log(err);
		} finally {
			setIsLoading(false);
		}
	}
	
	const onCloseDeleteSuccess = () => {
		setDeleteSuccess(false);
	}
	
	const onClickDetailUser = (user: UserProps) => {
		setCurrentUser(user);
		setShowModalUser(true);
	}
	
	const onClickDetailGame = (game: GameProps) => {
		setCurrentGame(game);
		setShowModalGame(true);
	}
	
	const onCloseModal = () => {
		setShowModalGame(false);
		setShowModalUser(false);
	}
	
	const fetchDataUser = async () => {
		setIsLoading(true);
		try {
			const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users`;
			const savedToken = localStorage.getItem("accessToken");
			const response = await fetch(url, {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					'accessToken': savedToken ?? accessToken,
				},
			});
			const data = await response.json();
			setUsers(data.data.users);
		} catch (err) {
			console.log(err);
		} finally {
			setIsLoading(false);
		}
	}
	
	const fetchDataGame = async () => {
		setIsLoading(true);
		try {
			const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/game`;
			const savedToken = localStorage.getItem("accessToken");
			const response = await fetch(url, {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					'accessToken': savedToken ?? accessToken,
				},
			});
			const data = await response.json();
			setGames(data.data.games);
		} catch (err) {
			console.log(err);
		} finally {
			setIsLoading(false);
		}
	}
	
	useEffect(() => {
		setShowModalGame(false)
		setShowModalDeleteGame(false)
		setShowModalUser(false)
		setShowModalDeleteUser(false)
		setDeleteSuccess(false)
		fetchDataUser()
		fetchDataGame()
	}, []);
	
	return (
		<div>
			{isAdmin &&
				<div>
					<Row className={`justify-center flex p-4 mt-8`}>
						<Col>
              <div className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex items-center pl-7">
                List User
              </div>
							<Table
								bordered
								loading={isLoading}
								rowKey={(record) => record.userId}
								dataSource={users}
                pagination={pagination}
								onChange={handleTableUserChange}
								columns={columnsUserTable}
                locale={{ emptyText: <Empty description="Not found Data" /> }}
                scroll={{ x: 1000 }}
								className={`self-center mt-4`}
							/>

              <div className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex items-center pl-7">
                List Game
              </div>
              <Table
                bordered
                loading={isLoading}
                rowKey={(record) => record.gameId}
                dataSource={games}
                pagination={pagination}
                onChange={handleTableGameChange}
                columns={columnsGameTable}
                locale={{ emptyText: <Empty description="Not found Data" /> }}
                scroll={{ x: 1000 }}
                className={`self-center mt-4`}
              />
						</Col>
					</Row>
				</div>
			}
			{
				<Modal
					open={showModalUser}
					title={
						<div className="text-2xl pl-7">
							User Info
						</div>
					}
					closable={false}
					footer={null}>
					<div className="text-l pl-7">
						<div className={`m-2`}>
							UserId: {currentUser?.userId ? currentUser?.userId : <TagNull/>}
						</div>
						<div className={`m-2`}>
							Name: {currentUser?.name ? currentUser?.name : <TagNull/>}
						</div>
						<div className={`m-2`}>
							Gender: {currentUser?.gender ? currentUser?.gender : <TagNull/>}
						</div>
						<div className={`m-2`}>
							Email: {currentUser?.email ? currentUser?.email : <TagNull/>}
						</div>
						<div className={`m-2`}>
							Date Of Birth: {currentUser?.dateOfBirth ? currentUser?.dateOfBirth : <TagNull/>}
						</div>
					</div>
					<div className={`text-end`}>
						<Button style={{background:'white'}} type="default" onClick={onCloseModal}>Close</Button>
					</div>
				</Modal>
			}
			{
				<Modal
					open={showModalDeleteUser}
					title={'Are you sure delete this user?'}
					okText= {'Yes'}
					okType={'danger'}
					cancelText= {'No'}
					onOk={onDeleteUser}
					okButtonProps={{ disabled: currentUser?.isAdmin }}
					onCancel={() => {setShowModalDeleteUser(false)}}
				>
					Do you want delete user {currentUser?.userId}
				</Modal>
			}
			{
				<Modal
					open={showModalGame}
					title={
						<div className="text-2xl pl-7">
							Game Info
						</div>
					}
					closable={false}
					footer={null}>
					<div className="text-l pl-7">
						<div className={`m-2`}>
							Game Id: {currentGame?.gameId}
						</div>
						<div className={`m-2`}>
							Variant Id: {currentGame?.variantId}
						</div>
						<div className={`m-2`}>
							Time Mode:
							<Tag color={currentGame?.timeMode ? 'geekblue' : 'gray'} className={`ml-1`}>
								{currentGame?.timeMode ? currentGame?.timeMode : "NULL"}
							</Tag>
						</div>
						<div className={`m-2`}>
							Users Id:
							<Tag bordered={false} color={'red'} className={`ml-1`}> {currentGame?.usersId[0]} </Tag>
							vs
							<Tag bordered={false} color={'blue'} className={`ml-1`}> {currentGame?.usersId[1]} </Tag>
						</div>
						<div className={`m-2`}>
							Created At: {currentGame?.createdAt}
						</div>
						<div className={`m-2`}>
							Moves:
							{currentGame?.moves.length ?
								currentGame?.moves?.map((move, index) => (
									<Tag key={index} bordered={false}> {move} </Tag>
								)) :
									<TagNull/>
							}
						</div>
						<div className={`m-2`}>
							Slug: {currentGame?.slug}
						</div>
						<div className={`m-2`}>
							Result: {
							currentGame?.variantId === 3 ?
								<Tag color={'geekblue'}> {currentGame?.result === 1 ? 'Player 2 Win' : 'Player 1 Win'} </Tag> :
								<Tag color={'geekblue'}> {currentGame?.result === 1 ? 'Player 1 Win' : currentGame?.result === 2 ? 'Player 2 Win' : "Draw"} </Tag>
						}
						</div>
					</div>
					<div className={`text-end`}>
						<Button style={{background:'white'}} type="default" onClick={onCloseModal}>Close</Button>
					</div>
				</Modal>
			}
			{
				<Modal
					open={showModalDeleteGame}
					title={'Are you sure delete this game?'}
					okText= {'Yes'}
					okType={'danger'}
					cancelText= {'No'}
					onOk={onDeleteGame}
					onCancel={() => {setShowModalDeleteUser(false)}}
				>
					Do you want delete game {currentGame?.gameId}
				</Modal>
			}
			{
				<Modal
					open={deleteSuccess}
					title={
						<div className="text-2xl pl-7">
							Delete Success
						</div>
					}
					closable={false}
					footer={null}
				>
					<div className={`text-end`}>
						<Button style={{background:'white'}} type="default" onClick={onCloseDeleteSuccess}>Close</Button>
					</div>
				</Modal>
			}
		</div>
	);
}

export default AdminPage;