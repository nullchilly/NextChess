import React, {useEffect, useState} from "react";
import {Col, Divider, Row, Statistic} from "antd";
import {StarFilled} from "@ant-design/icons";
import {StatePuzzleDuel} from "@/helpers/types";
import PuzzleDuelHistory from "@/components/Controls/PuzzleDuelHistory";

const { Countdown } = Statistic;

type ControlsPuzzleDuelProps = {
	type?: string;
	name?: string;
	competitor?: string;
	currentPuzzle?: number;
	resultL?: number[];
	resultR?: number[];
	state?: StatePuzzleDuel;
	history?: string[];
	onFinish: () => void;
	onPlay: () => void;
}

const avatar = "https://www.chesskid.com/images/avatars/kids/100/kid-1162.png";
const dueling = "https://www.chesskid.com/images/pieces/dueling.png";

const ControlsPuzzleDuel : React.FC<ControlsPuzzleDuelProps> = (props) => {
	const [deadline, setDeadline] = useState<number>(0);
	
	const startGame = () => {
		setDeadline(Date.now() +  1000 * 30 * 3);
	}
	
	const onTimeoutDuel = () => {
		props.onFinish();
	}
	
	useEffect(() => {
		if (props.state === StatePuzzleDuel.pending) {
			startGame();
		}
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
												<div key = {index}>
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
												<div key={index}>
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
					:
					<div className={"items-center"}>
						<div className="object-cover p-3 w-full flex justify-center">
							<div>
									<img src={avatar} alt="image description" className="shadow rounded-full max-w-full h-auto border-4 border-[#518538]"/>
							</div>
						</div>
						<div className={`text-center text-slate-100 font-mono text-3xl font-bold`}>
							{props.name ? props.name : "Guest"}
						</div>
						<Divider className={`bg-slate-100`}/>
						<div className={`text-left text-slate-100 font-mono text-3xl font-bold pl-3`}>
							Latest Results:
						</div>
						<div className={`text-center pt-4`}>
							{props.history?.map((e, index) => (
									<PuzzleDuelHistory
                    key={index}
										state={e}
									/>
							))}
						</div>
						<div className={`flex items-center justify-center pt-4`}>
							<img
								src={dueling}
								alt={"dueling"}
							/>
						</div>
						<Divider className={`bg-slate-100`}/>
						<div className={`text-center h-full`}>
							<button
								className="hintButton buttonSize border-transparent w-9/12 p-1"
								onClick={props.onPlay}
								style={{
									background: "#f4892e",
									borderRadius: "5px"
								}}
							>
								<div className={`text-center text-slate-100 font-mono text-3xl font-bold`}>
									Play
								</div>
							</button>
						</div>
					</div>
			}
		</div>
	)
}

export default ControlsPuzzleDuel
