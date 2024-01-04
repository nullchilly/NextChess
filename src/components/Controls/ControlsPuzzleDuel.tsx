import React, {useEffect, useState} from "react";
import {Col, Divider, Row, Spin, Statistic} from "antd";
import {CheckSquareOutlined, CloseSquareOutlined, LoadingOutlined, MinusSquareOutlined} from "@ant-design/icons";
import {StatePuzzleDuel} from "@/helpers/types";
import PuzzleDuelHistory from "@/components/Controls/PuzzleDuelHistory";
import WhiteMove from "@/components/icons/WhiteMove";
import BlackMove from "@/components/icons/BlackMove";
import "./styles.css";

const { Countdown } = Statistic;

type ControlsPuzzleDuelProps = {
	type?: string;
	name?: string;
	competitor?: string;
	player?: string;
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
		setDeadline(Date.now() +  1000 * 60 * 3);
	}
	
	const onTimeoutDuel = () => {
		props.onFinish();
	}
	
	useEffect(() => {
		if (props.state === StatePuzzleDuel.pending) {
			startGame();
		}
	}, [props.state]);
	
	return (
		<div>
			{
				props.state === StatePuzzleDuel.pending ?
					<div>
						{
							props.player === "White" ? (
								<div className="bg-[#f1f1f1] w-full h-[100px] flex justify-center">
									{/*	white first*/}
									<span>
										<WhiteMove />
									</span>
									<span className="headerControls text-[#321E2B]">
										White to Move
									</span>
								</div>
							) : (
								<div className="bg-[#4B4847] w-full h-[100px] flex justify-center">
									{/*	black first*/}
									<span>
								<BlackMove />
							</span>
									<span className="headerControls text-[#fff]">Black to Move</span>
								</div>
							)
						}
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
													{e == 1 ?
														<CheckSquareOutlined style={{background: 'green', fontSize: '20px'}}/> :
														e == -1 ?
															<CloseSquareOutlined style={{background: 'red', fontSize: '20px'}}/> :
															<MinusSquareOutlined style={{background: 'gray', fontSize: '20px'}}/>
													}
													<br/>
												</div>
											))}
										</div>
									</div>
								</div>
							</Col>
							<Col className="gutter-row text-center self-center" span={8}>
								<span className={'text-slate-100 font-mono text-5xl'}>
									VS
								</span>
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
							<Col className="gutter-row" span={8}>
								<div className={`mt-6 items-start`}>
									<div className="object-cover h-full w-full flex items-center">
										<div className={`items-center text-center`}>
											<img src={avatar} alt="image description" className="shadow rounded-full max-w-full h-auto align-middle border-none"/>
											<div className={`text-center text-slate-100 font-mono text-3xl font-bold mt-3	`}>
												{props.competitor ? props.competitor : "Not found"}
											</div>
											{props.resultR?.map((e, index) => (
												<div key = {index}>
													{e == 1 ?
														<CheckSquareOutlined style={{background: 'green', fontSize: '20px'}}/> :
														e == -1 ?
															<CloseSquareOutlined style={{background: 'red', fontSize: '20px'}}/> :
															<MinusSquareOutlined style={{background: 'gray', fontSize: '20px'}}/>
													}
													<br/>
												</div>
											))}
										</div>
									</div>
								</div>
							</Col>
						</Row>
						<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className={`pt-8`}>
						
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
							{
								props.state === StatePuzzleDuel.wait ?
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
									:
									<span>
										<span className={`text-center text-slate-100 font-mono text-3xl font-bold pr-3`}>
											Finding
										</span>
										<Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#f1f5f9'}} spin />} />
									</span>
							}
						</div>
					</div>
			}
		</div>
	)
}

export default ControlsPuzzleDuel
