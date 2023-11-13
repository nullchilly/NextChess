import React from "react";
import { Card, Avatar, Row, Col, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import BotIcon from "@/components/icons/BotIcon";

type PlayerCardProps = {
	name: string,
	link: string,
}

const PlayerCard: React.FC<PlayerCardProps> = ({name, link}) => {
	const items: MenuProps['items'] = [
		{
			label: '1st menu item',
			key: '1',
		},
		{
			label: '2nd menu item',
			key: '2',
		},
		{
			label: '3rd menu item',
			key: '3',
		},
	]

	return (
		<div className="flex pt-4 pb-4">
			<Card className="w-full justify-center relative">
				<Row align="middle">
					<Col flex="50px">
						<Avatar >
							<div className="w-[60px] -translate-y-1/2">
								<BotIcon name={name} />
							</div>
						</Avatar>
					</Col>
					<Col
						className="flex-auto font-bold"
						style={{
							fontSize: "20px",
						}}
					>
						{name}
					</Col>
					<Col>
						<Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
							<Button className="flex w-15 h-7" >
							</Button>
						</Dropdown>
					</Col>
				</Row>
			</Card>
		</div>
	);
}

export default PlayerCard