import ModalContainer from "@/components/Modal/ModalContainer";
import Image from "next/image";
import Icon, {CloseOutlined} from "@ant-design/icons";

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
			<div className='p-[24px]'>
				{props.isAllowClose && (
					<div className='modal-close-row' onClick={onClose}>
						<CloseOutlined width={20} height={20} className='modal-close-row-button'/>
					</div>
				)}
				<div className='waiting-content-inner'>
					<span>{props.message}</span>
					<div className='result-progress-bar'>
						<div className='result-circle result-border' />
					</div>
				</div>
			</div>
		</ModalContainer>
	)
};

export default LoadingModal;