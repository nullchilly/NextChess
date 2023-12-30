import React, {useContext, useEffect, useState} from "react";
import {Col, Row, Statistic} from "antd";
import {StarFilled} from "@ant-design/icons";
import {StatePuzzleDuel} from "@/helpers/types";

const { Countdown } = Statistic;

type ControlsPuzzleDuelProps = {
	type?: string;
	name?: string;
	competitor?: string;
	currentPuzzle?: number;
	resultL?: number[];
	resultR?: number[];
	state?: number;
}

const avatar = "https://www.chesskid.com/images/avatars/kids/100/kid-1162.png";

const ControlsPuzzleDuel : React.FC<ControlsPuzzleDuelProps> = (props) => {
	const [deadline, setDeadline] = useState<number>(0);
	
	const startGame = () => {
		setDeadline(Date.now() +  1000 * 30 * 3);
	}
	
	const onTimeoutDuel = () => {
	
	}
	
	useEffect(() => {
		startGame();
		
	}, []);
	
	return (
		<div>
			{
				props.state === StatePuzzleDuel.pending ?
					<div>
						<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
							<Col className="gutter-row" span={8}>
								<div className={`mt-6 items-end `}>
									<div className="object-cover h-full w-full flex items-center justify-end">
										<div className={`items-center text-center`}>
											<img src={avatar} alt="image description" className="shadow rounded-full max-w-full h-auto align-middle border-none"/>
											<div className={`text-center text-slate-100 font-mono text-3xl font-bold mt-3	`}>
												{props.name ? props.name : "Guest"}
											</div>
											{props.resultL?.map((e, index) => (
												<div>
													<StarFilled
														style={e == 1 ? {color: `#fadb14`, fontSize: '20px'} : e == -1 ? {color: `#ed4337`, fontSize: '20px'} : {color: `#f1f5f9`, fontSize: '20px'}}
														className={`bg-[#57903C] pt-2`}
													/>
													<br/>
												</div>
											))}
										</div>
									</div>
								</div>
							</Col>
							<Col className="gutter-row" span={8}>
							
							</Col>
							<Col className="gutter-row" span={8}>
								<div className={`mt-6 items-start`}>
									<div className="object-cover h-full w-full flex items-center">
										<div className={`items-center text-center`}>
											<img src={avatar} alt="image description" className="shadow rounded-full max-w-full h-auto align-middle border-none"/>
											<div className={`text-center text-slate-100 font-mono text-3xl font-bold mt-3	`}>
												{props.competitor ? props.competitor : "Not found"}
											</div>
											{props.resultR?.map((e, index) => (
												<div>
													<StarFilled
														style={e == 1 ? {color: `#fadb14`, fontSize: '20px'} : e == -1 ? {color: `#ed4337`, fontSize: '20px'} : {color: `#f1f5f9`, fontSize: '20px'}}
														className={`bg-[#57903C] pt-2`}
													/>
													<br/>
												</div>
											))}
										</div>
									</div>
								</div>
							</Col>
						</Row>
						<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className={`pt-8`}>
							<Col className={`text-center`} span={24}>
								<Countdown
									value={deadline}
									valueStyle={{
										color: '#f1f5f9',
										fontSize: '50px',
										fontFamily: 'monospace',
									}}
									format={'mm:ss'}
									onFinish={onTimeoutDuel}
								/>
							</Col>
						</Row>
						<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className={`pt-2`}>
							<Col className={`text-center text-slate-100 text-3xl font-bold`} span={24}>
								Come on, let's go guys and get your reward
							</Col>
						</Row>
					</div>
					: props.state === StatePuzzleDuel.wait ?
						<div>
						
						</div>
					: <div>
						
						</div>
			}
		</div>
	)
}

export default ControlsPuzzleDuel