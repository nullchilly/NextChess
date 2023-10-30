import React from "react";
import { Card, Avatar, Row, Col, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import {getSvgSrc} from "@/helpers/images";

type PlayerCardProps = {
	avtRef: string,
	name: string,
	link: string,
}

const PlayerCard: React.FC<PlayerCardProps> = ({avtRef, name, link}) => {
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
						<Avatar src={avtRef ? avtRef : "https://bit.ly/3FzLkSs"} />
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
							<Button className="flex">
								<img src={getSvgSrc("meatballs-menu")} width="20px" height="20px" alt=">"/>
							</Button>
						</Dropdown>
					</Col>
				</Row>
			</Card>
		</div>
	);
}

export default PlayerCard