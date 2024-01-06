import ModalContainer from "@/components/Modal/ModalContainer";
import {CloseOutlined} from "@ant-design/icons";
import React from "react";

type LoadingModal = {
	isOpen: boolean;
	message?: string;
	isAllowClose: boolean;
	onCloseModal: () => void;
}

const LoadingModal: React.FC<LoadingModal> = (props) => {
	const onClose = () => {
		props.onCloseModal();
	}
	
	return (
		<ModalContainer isOpen={props.isOpen}>
			<div className='p-[24px] flex-row'>
				{props.isAllowClose && (
					<span className='modal-close-row' onClick={onClose}>
						<CloseOutlined width={20} height={20} className='modal-close-row-button'/>
						<div className='waiting-content-inner'>
							<span>{props.message}</span>
						</div>
					</span>
				)}
			</div>
		</ModalContainer>
	)
};

export default LoadingModal;