import React, {useEffect} from 'react';
import {Puzzle} from "@/type/type";
import {Button, Col, ConfigProvider, Row} from "antd";
import './styles.css'
import PlayerInfoCard from "@/components/Card/PlayerInfoCard";
import playerCard from "@/components/Card/PlayerCard";
import WhiteMove from "@/components/icons/WhiteMove";
import BlackMove from '../icons/BlackMove';
import SkipIcon from "@/components/icons/SkipIcon";
import {
	ArrowRightOutlined,
	BulbOutlined,
	CheckOutlined,
	CloseOutlined,
	RedoOutlined,
	StepForwardOutlined
} from "@ant-design/icons";
import {gray} from "@ant-design/colors";

type ControlsPuzzleProps = {
	puzzleData: Puzzle,
	result: number,
	status: string,
	onSkipModal: () => void,
	onHint: () => void,
	onRetry: () => void,
	onNext: () => void,
};

const ControlsPuzzle : React.FC<ControlsPuzzleProps> = ({
	puzzleData,
	result,
	status,
	onSkipModal,
	onHint,
	onRetry,
	onNext }) => {

	return (
		<div>
			<Row
				style={{
					height: '100px'
				}}
			>
				{status === 'pending' ?
					puzzleData.player === 'White' ?
						<div className="bg-[#f1f1f1] w-full h-full flex justify-center">
							{/*	white first*/}
							<span>
								<WhiteMove />
							</span>
							<span className="headerControls text-[#321E2B]">
								White to Move
							</span>
						</div> :
						<div className="bg-[#4B4847] w-full h-full flex justify-center">
							{/*	black first*/}
							<span>
								<BlackMove />
							</span>
							<span className="headerControls text-[#fff]">
								Black to Move
							</span>
						</div>
					: status === 'done' ?
						result === 1 ?
							<div className="bg-[#81b64c] w-full h-full flex justify-center">
								{/*	win*/}
								<span>
								<CheckOutlined
									style={{
										fontSize: '90px',
										color: '#fff',
									}}
								/>
							</span>
								<span className="headerControls text-[#fff]">
								Correct
							</span>
							</div>:
							<div className="bg-[#e02828] w-full h-full flex justify-center">
								{/*	lose*/}
								<span>
								<CloseOutlined
									style={{fontSize: '90px'}}
								/>
							</span>
								<span className="headerControls text-[#321E2B]">
								Incorrect
							</span>
							</div>
						:
						<div className="bg-gray-500 w-full h-full flex justify-center">
							{/*	nothing*/}
							<div className="headerControls text-amber-50">
								No data found
							</div>
						</div>
				}
			</Row>
			<Row>
				<div className="flex justify-center w-full">
					<PlayerInfoCard id={'1'} name={'Shark'} inGame={true} />
				</div>
			</Row>
			<Row>
				<div className="overflow-auto puzzleStats justify-center w-full">
					<div className="puzzleStatsRow">
						<div className="puzzleStatsText">
							Title
						</div>
						<div className="puzzleStatsFlex">
							<strong className="puzzleStatsText">
								{puzzleData.title}
							</strong>
						</div>
					</div>
				</div>
			</Row>
			<Row>
				<div className="overflow-auto puzzleStats justify-center w-full">
					<div className="puzzleStatsRow">
						<div className="puzzleStatsText">
							Date
						</div>
						<div className="puzzleStatsFlex">
							<strong className="puzzleStatsText">
								{puzzleData.date}
							</strong>
						</div>
					</div>
				</div>
				
			</Row>
			<Row className="flex justify-center pt-20 overflow-auto w-full">
				<div >
					{status === 'pending' ?
						<>
							<Button
								type="primary"
								icon={<StepForwardOutlined/>}
								className='buttonSize'
								danger
								onClick={onSkipModal}
							>
								Skip
							</Button>
							<Button
								icon={<BulbOutlined/>}
								className="hintButton buttonSize"
								onClick={onHint}
								style={{
									background: '#f1f1f1'
								}}
							>
								Hint
							</Button>
						</>
						:
						<>
							<Button
								icon={<RedoOutlined style={{color: '#000'}}/>}
								onClick={onRetry}
								className={'buttonSize'}
								style={{
									backgroundColor: '#f1f1f1',
								}}
							>
								Retry
							</Button>
							<Button
								icon={<ArrowRightOutlined/>}
								className="hintButton buttonSize"
								onClick={onNext}
								style={{
									background: '#81b64c'
								}}
							>
								Next
							</Button>
						</>
					}
				</div>
			</Row>
		</div>
	);
};

export default ControlsPuzzle
